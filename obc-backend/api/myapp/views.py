from django.shortcuts import render
from django.conf import settings
# Create your views here.
from rest_framework import generics
from .models import UserProfile, OTP, ServiceCategory, Service
from .serializers import UserProfileSerializer 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import OTP
from .serializers import *# Create these serializers
from django.conf import settings
from twilio.rest import Client
from django.utils import timezone
from django.contrib.auth.models import User # Or your custom user model
# Potentially import your UserSerializer and token generation (e.g., SimpleJWT)
from rest_framework_simplejwt.tokens import RefreshToken



class UserProfileList(generics.ListCreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class UserProfileRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer    


class MessaHandler:
    phone_number = None
    otp = None
    app_hash = None
    
    def __init__(self, phone_number, otp, app_hash=None)-> None:
        self.phone_number = phone_number
        self.otp = otp
        self.app_hash = app_hash
    
    def send_otp_on_phone(self):
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        try:
            # Format message for SMS Retriever API if app_hash is provided
            if self.app_hash:
                # The <#> prefix is required by SMS Retriever API
                message_body = f"<#> Your OTP code is: {self.otp} {self.app_hash}"
            else:
                message_body = f"Your OTP code is: {self.otp}"
                
            message = client.messages.create(
                body=message_body,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=self.phone_number
            )
            print(f"OTP sent to {self.phone_number}. Message SID: {message.sid}")
            return True
        except Exception as e:
            print(f"Error sending OTP: {e}")
            raise e

class RequestOTPView(APIView):
    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            otp_code = OTP.generate_otp()
            
            # Get app hash from request if provided
            app_hash = serializer.validated_data.get('app_hash')
            
            # Invalidate previous OTPs for this number
            OTP.objects.filter(phone_number=phone_number, is_verified=False).update(expires_at=timezone.now())
            
            # Create new OTP
            otp_instance = OTP.objects.create(
                phone_number=phone_number,
                otp_code=otp_code
            )
            
            # Send OTP via Twilio
            try:
                message_handler = MessaHandler(phone_number=phone_number, otp=otp_code, app_hash=app_hash)
                message_handler.send_otp_on_phone()
                return Response({'message': 'OTP sent successfully.'}, status=status.HTTP_200_OK)
            except Exception as e:
                # If sending fails, delete the OTP to allow retry
                otp_instance.delete()
                print(f"Error sending OTP: {e}")
                return Response({'error': 'Failed to send OTP. Please try again.'}, 
                               status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone_number = serializer.validated_data['phone_number']
            otp_entered = serializer.validated_data['otp_code']

            try:
                otp_instance = OTP.objects.get(
                    phone_number=phone_number,
                    otp_code=otp_entered,
                    is_verified=False,
                    expires_at__gte=timezone.now()
                )
                otp_instance.is_verified = True
                otp_instance.save()

                # OTP Verified! Now, either create a new user or log in an existing one.
                # Example: Get or create user
                user, created = User.objects.get_or_create(username=phone_number) # Using phone as username for simplicity
                if created:
                    user.set_unusable_password() # Or prompt for password setup later
                    user.save()
                    # You might want to collect more user details here or in a subsequent step.

                # Generate JWT tokens for the user
                refresh = RefreshToken.for_user(user)
                return Response({
                    'message': 'OTP verified successfully.',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_id': user.id, # or other user details
                    'is_new_user': created
                }, status=status.HTTP_200_OK)

            except OTP.DoesNotExist:
                return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(f"Error verifying OTP: {e}")
                return Response({'error': 'An error occurred during verification.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Generic views for ServiceCategory and Service 
class ServiceCategoryListView(generics.ListAPIView):
    queryset = ServiceCategory.objects.filter(is_active=True)
    serializer_class = ServiceCategorySerializer

class ServicesByCategoryView(APIView):
    def get(self,request,category_identifier):
        try:
            try:
                category = ServiceCategory.objects.get(
                    slug=category_identifier,
                    is_active=True
                )
            except ServiceCategory.DoesNotExist:
                #if slug not found, try by name
                category = ServiceCategory.objects.get(
                    name__iexact=category_identifier.replace('-', ' '),
                    is_active=True
                )

            services = Service.objects.filter(
                category=category,
                is_active=True
            ).order_by('-is_featured','created_at')
            serializer = ServiceSerializer(services, many=True)
            
            return Response({
                'category':{
                    'id': category.id,
                    'name': category.name,
                    'description': category.description,
                    'icon': category.icon,
                    'slug': category.slug,
                },
                'services': serializer.data,
                'total_services': services.count()
            }, status=status.HTTP_200_OK)
        
        except ServiceCategory.DoesNotExist:
            return Response({
                'error': f'Service category "{category_identifier}" not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#returns all active services
class AllServicesView(generics.ListAPIView):
    queryset= Service.objects.filter(is_active=True).select_related('category')
    serializer_class = ServiceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        category_id = self.request.query_params.get('category_id', None)
        is_featured = self.request.query_params.get('featured', None)
        search = self.request.query_params.get('search', None)

        if category_id:
            queryset= queryset.filter(category_id=category_id)
        if is_featured == 'true':
            queryset = queryset.filter(is_featured=True)
        if search:
            queryset = queryset.filter(
                models.Q(header__icontains=search) |
                models.Q(details__icontains=search)
            )
        return queryset.order_by('-is_featured','created_at')


    