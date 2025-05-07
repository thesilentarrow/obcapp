from django.shortcuts import render
from django.conf import settings
# Create your views here.
from rest_framework import generics
from .models import UserProfile
from .serializers import UserProfileSerializer 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import OTP
from .serializers import RequestOTPSerializer, VerifyOTPSerializer # Create these serializers
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
