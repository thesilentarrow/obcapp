from django.db.models import Q, OuterRef, Subquery
from django.shortcuts import render
from django.conf import settings
# Create your views here.
from rest_framework import generics
from .models import UserProfile, OTP, ServiceCategory, Service, ServicePrice
from .serializers import UserProfileSerializer, ServicePriceSerializer 
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

            # Get query parameters for brand/model pricing
            brand = request.query_params.get('brand')
            model = request.query_params.get('model')
            
            services = Service.objects.filter(
                category=category,
                is_active=True
            ).select_related('category')
            
            # If brand and model are provided, annotate with real prices
            if brand and model:
                try:
                    from django.db.models import OuterRef, Subquery, Case, When, Value
                    
                    # First try to get model-specific price
                    model_specific_price = ServicePrice.objects.filter(
                        brand__iexact=brand,
                        model__iexact=model,
                        product_name__icontains=OuterRef('header'),
                        is_active=True
                    ).values('discounted_price')[:1]
                    
                    # Fallback to brand-generic price (where model is empty or null)
                    brand_generic_price = ServicePrice.objects.filter(
                        brand__iexact=brand,
                        product_name__icontains=OuterRef('header'),
                        is_active=True
                    ).filter(
                        Q(model__isnull=True) | Q(model__exact='') | Q(model__iexact='generic')
                    ).values('discounted_price')[:1]
                    
                    services = services.annotate(
                        model_specific_price=Subquery(model_specific_price),
                        brand_generic_price=Subquery(brand_generic_price),
                        # Use model-specific price if available, otherwise brand-generic
                        real_price=Case(
                            When(model_specific_price__isnull=False, then='model_specific_price'),
                            default='brand_generic_price'
                        )
                    )
                except Exception as e:
                    # Log the error but continue with fallback pricing
                    import logging
                    logger = logging.getLogger(__name__)
                    logger.warning(f"Error fetching real-time prices: {str(e)}")
                    brand = None
                    model = None
            
            services = services.order_by('-is_featured','created_at')
            
            # Use context to pass brand/model info to serializer
            serializer_context = {
                'request': request,
                'brand': brand,
                'model': model
            }
            serializer = ServiceSerializer(services, many=True, context=serializer_context)
            
            return Response({
                'category':{
                    'id': category.id,
                    'name': category.name,
                    'description': category.description,
                    'icon': category.icon,
                    'slug': category.slug,
                },
                'services': serializer.data,
                'total_services': services.count(),
                'pricing_context': {
                    'brand': brand,
                    'model': model,
                    'has_real_pricing': bool(brand and model)
                }
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


# Import functionality for ServicePrice
from rest_framework.parsers import MultiPartParser, FileUploadParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import pandas as pd
from tablib import Dataset
from .resources import (
    ServicePriceResource, 
    ServicePriceResourceWithMapping,
    ServicePriceResourceSmart
)
from .models import ServicePrice
import logging
import os
import tempfile

logger = logging.getLogger(__name__)


class ServicePriceImportAPIView(APIView):
    """
    API endpoint for importing ServicePrice data from Excel files.
    
    Supports:
    - Excel (.xlsx, .xls) file upload
    - Dry-run validation before actual import
    - Detailed error reporting by row
    - Bulk operations for performance
    - Column name mapping for flexibility
    """
    parser_classes = [MultiPartParser, FileUploadParser]
    
    def post(self, request, *args, **kwargs):
        """
        Handle Excel file upload and import ServicePrice data.
        
        Expected request format:
        - file: Excel file (.xlsx or .xls)
        - dry_run: boolean (optional, default: True for validation)
        - use_mapping: boolean (optional, use flexible column mapping)
        - import_strategy: string (optional, 'smart', 'standard', 'mapping', 'always_new')
        """
        try:
            # Validate file upload
            file = request.FILES.get('file')
            if not file:
                return Response({
                    'status': 'error',
                    'message': 'No file uploaded. Please provide an Excel file.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate file type
            allowed_extensions = ['.xlsx', '.xls']
            file_extension = os.path.splitext(file.name)[1].lower()
            if file_extension not in allowed_extensions:
                return Response({
                    'status': 'error',
                    'message': f'Invalid file type. Please upload Excel files ({", ".join(allowed_extensions)})'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get request parameters
            dry_run = request.data.get('dry_run', 'true').lower() == 'true'
            use_mapping = request.data.get('use_mapping', 'true').lower() == 'true'
            import_strategy = request.data.get('import_strategy', 'smart').lower()
            
            logger.info(f"Processing file: {file.name}, dry_run: {dry_run}, use_mapping: {use_mapping}, strategy: {import_strategy}")
            
            # Process the Excel file
            return self._process_excel_file(file, dry_run, use_mapping, import_strategy)
            
        except Exception as e:
            logger.error(f"Unexpected error in ServicePriceImportAPIView: {str(e)}")
            return Response({
                'status': 'error',
                'message': f'An unexpected error occurred: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _process_excel_file(self, file, dry_run=True, use_mapping=True, import_strategy='smart'):
        """
        Process the uploaded Excel file and import data with selected strategy.
        """
        try:
            # Read Excel file using pandas for better error handling
            df = pd.read_excel(file, engine='openpyxl')
            
            # Basic data validation
            if df.empty:
                return Response({
                    'status': 'error',
                    'message': 'The uploaded file is empty or contains no data.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            logger.info(f"Excel file contains {len(df)} rows and {len(df.columns)} columns")
            logger.info(f"Column headers: {list(df.columns)}")
            
            # Apply column name mapping if requested
            if use_mapping:
                df = self._apply_column_mapping(df)
            
            # Convert DataFrame to tablib Dataset
            dataset = Dataset()
            dataset.load(df.to_dict('records'))
            
            # Choose appropriate resource class based on strategy
            if import_strategy == 'smart':
                resource_class = ServicePriceResourceSmart
            elif import_strategy == 'mapping':
                resource_class = ServicePriceResourceWithMapping
            elif import_strategy == 'standard':
                resource_class = ServicePriceResource
            else:
                # Default to smart strategy
                resource_class = ServicePriceResourceSmart
                
            logger.info(f"Using resource class: {resource_class.__name__}")
            resource = resource_class()
            
            # Perform import with error handling
            result = resource.import_data(
                dataset, 
                dry_run=dry_run, 
                raise_errors=False,
                use_transactions=True
            )
            
            # Process results and errors
            response_data = self._process_import_result(result, dry_run, resource)
            
            if result.has_errors():
                return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(response_data, status=status.HTTP_200_OK)
                
        except Exception as e:
            logger.error(f"Error processing Excel file: {str(e)}")
            return Response({
                'status': 'error',
                'message': f'Error processing file: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _apply_column_mapping(self, df):
        """
        Apply flexible column name mapping to handle different Excel formats.
        """
        # Standard column mappings
        column_mappings = {
            'Brand': 'brand',
            'brand': 'brand', 
            'BRAND': 'brand',
            'Model': 'model',
            'model': 'model',
            'MODEL': 'model', 
            'Type': 'type',
            'type': 'type',
            'TYPE': 'type',
            'Product Name': 'product_name',
            'product_name': 'product_name',
            'PRODUCT_NAME': 'product_name',
            'ProductName': 'product_name',
            'Before Price': 'before_price',
            'before_price': 'before_price',
            'BEFORE_PRICE': 'before_price',
            'BeforePrice': 'before_price',
            'After Price': 'after_price', 
            'after_price': 'after_price',
            'AFTER_PRICE': 'after_price',
            'AfterPrice': 'after_price',
            'Discount Price': 'discounted_price',
            'discounted_price': 'discounted_price',
            'DISCOUNTED_PRICE': 'discounted_price',
            'DiscountedPrice': 'discounted_price',
            'Link': 'link',
            'link': 'link',
            'LINK': 'link',
            'URL': 'link',
            'url': 'link'
        }
        
        # Apply mappings
        df.rename(columns=column_mappings, inplace=True)
        
        # Clean column names (remove extra spaces)
        df.columns = df.columns.str.strip()
        
        logger.info(f"Mapped column headers: {list(df.columns)}")
        return df
    
    def _process_import_result(self, result, dry_run, resource=None):
        """
        Process import results and format enhanced response data.
        """
        # Extract error information
        errors = []
        for row_number, row_errors in result.row_errors:
            error_messages = []
            for error in row_errors:
                if hasattr(error, 'error'):
                    error_messages.append(str(error.error))
                else:
                    error_messages.append(str(error))
            
            errors.append({
                'row': row_number,
                'errors': error_messages
            })
        
        # Build response data
        response_data = {
            'status': 'error' if result.has_errors() else 'success',
            'dry_run': dry_run,
            'totals': {
                'new': result.totals.get('new', 0),
                'update': result.totals.get('update', 0), 
                'delete': result.totals.get('delete', 0),
                'skip': result.totals.get('skip', 0),
                'error': result.totals.get('error', 0),
                'invalid': result.totals.get('invalid', 0)
            },
            'total_rows': sum(result.totals.values()),
        }
        
        # Add detailed summary if using ServicePriceResourceSmart
        if hasattr(resource, 'get_import_summary'):
            detailed_summary = resource.get_import_summary()
            response_data['detailed_summary'] = detailed_summary
            
            # Enhanced messaging with details
            if not errors:
                if dry_run:
                    message_parts = []
                    if detailed_summary['new_count'] > 0:
                        message_parts.append(f"{detailed_summary['new_count']} new records to be created")
                    if detailed_summary['updated_count'] > 0:
                        message_parts.append(f"{detailed_summary['updated_count']} records to be updated")
                    if detailed_summary['skipped_count'] > 0:
                        message_parts.append(f"{detailed_summary['skipped_count']} records to be skipped (no changes)")
                    
                    response_data['message'] = f"✅ Validation successful! {', '.join(message_parts) if message_parts else 'No changes detected'}. Ready for actual import."
                else:
                    message_parts = []
                    if detailed_summary['new_count'] > 0:
                        message_parts.append(f"✨ Created {detailed_summary['new_count']} new records")
                    if detailed_summary['updated_count'] > 0:
                        message_parts.append(f"🔄 Updated {detailed_summary['updated_count']} existing records")
                    if detailed_summary['skipped_count'] > 0:
                        message_parts.append(f"⏭️ Skipped {detailed_summary['skipped_count']} unchanged records")
                        
                    response_data['message'] = f"🎉 Import completed successfully! {', '.join(message_parts) if message_parts else 'No operations performed'}."
        else:
            # Standard messaging
            if errors:
                response_data['errors'] = errors
                response_data['message'] = f'Import completed with {len(errors)} errors'
            else:
                if dry_run:
                    response_data['message'] = 'Validation successful. No errors found. Ready for actual import.'
                else:
                    response_data['message'] = 'Import completed successfully!'
        
        if errors:
            response_data['errors'] = errors
            response_data['message'] = f'❌ Import completed with {len(errors)} errors'
        
        logger.info(f"Import result: {response_data}")
        return response_data


class ServicePriceListView(generics.ListAPIView):
    """
    API endpoint to list all service prices with filtering and search.
    """
    queryset = ServicePrice.objects.filter(is_active=True)
    serializer_class = ServicePriceSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter parameters
        brand = self.request.query_params.get('brand', None)
        model = self.request.query_params.get('model', None)
        service_type = self.request.query_params.get('type', None)
        search = self.request.query_params.get('search', None)
        
        if brand:
            queryset = queryset.filter(brand__icontains=brand)
        if model:
            queryset = queryset.filter(model__icontains=model)
        if service_type:
            queryset = queryset.filter(type__icontains=service_type)
        if search:
            queryset = queryset.filter(
                models.Q(brand__icontains=search) |
                models.Q(model__icontains=search) |
                models.Q(type__icontains=search) |
                models.Q(product_name__icontains=search)
            )
        
        return queryset.order_by('brand', 'model', 'type', 'product_name')


