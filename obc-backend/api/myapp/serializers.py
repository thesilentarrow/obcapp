from rest_framework import serializers
from .models import *
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'first_name', 'last_name', 'email']



class RequestOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    app_hash = serializers.CharField(max_length=100, required=False)

class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)

class ServiceSerializer(serializers.ModelSerializer):
    details_list = serializers.SerializerMethodField()
    real_price = serializers.SerializerMethodField()
    display_price = serializers.SerializerMethodField()
    price_status = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields=[
            'id','header','details','pagedetails','details_list',
            'price','real_price','display_price','price_status','duration','image','is_featured'
        ]

    def get_details_list(self,obj):
        return obj.get_details_list()
    
    def get_real_price(self, obj):
        """Get real price from ServicePrice if available"""
        # Check if real_price was annotated in the queryset
        if hasattr(obj, 'real_price') and obj.real_price is not None:
            return str(obj.real_price)
        
        # Fallback: Try to get from context or direct lookup
        context = self.context
        brand = context.get('brand')
        model = context.get('model')
        
        if brand and model:
            try:
                # First try model-specific price
                service_price = ServicePrice.objects.filter(
                    brand__iexact=brand,
                    model__iexact=model,
                    product_name__icontains=obj.header,
                    is_active=True
                ).first()
                
                if service_price:
                    return str(service_price.discounted_price or service_price.after_price)
                
                # Fallback to brand-generic price
                from django.db.models import Q
                service_price = ServicePrice.objects.filter(
                    brand__iexact=brand,
                    product_name__icontains=obj.header,
                    is_active=True
                ).filter(
                    Q(model__isnull=True) | Q(model__exact='') | Q(model__iexact='generic')
                ).first()
                
                if service_price:
                    return str(service_price.discounted_price or service_price.after_price)
                    
            except Exception:
                pass
        
        return None
    
    def get_display_price(self, obj):
        """Get the price to display - real price if available, otherwise service price"""
        real_price = self.get_real_price(obj)
        if real_price:
            return real_price
        elif obj.price:
            return str(obj.price)
        return None
    
    def get_price_status(self, obj):
        """Get status of pricing: 'model_specific', 'brand_generic', 'service_default', or 'na'"""
        context = self.context
        brand = context.get('brand')
        model = context.get('model')
        
        if not brand or not model:
            # No car selected, return service default price status
            if obj.price:
                return 'service_default'
            return 'na'
        
        # Check if real_price was annotated and has model-specific price
        if hasattr(obj, 'model_specific_price') and obj.model_specific_price is not None:
            return 'model_specific'
        
        # Check if real_price was annotated and has brand-generic price
        if hasattr(obj, 'brand_generic_price') and obj.brand_generic_price is not None:
            return 'brand_generic'
            
        # Fallback check for direct lookup
        if brand and model:
            try:
                # Check for model-specific price
                service_price = ServicePrice.objects.filter(
                    brand__iexact=brand,
                    model__iexact=model,
                    product_name__icontains=obj.header,
                    is_active=True
                ).first()
                
                if service_price:
                    return 'model_specific'
                
                # Check for brand-generic price
                from django.db.models import Q
                service_price = ServicePrice.objects.filter(
                    brand__iexact=brand,
                    product_name__icontains=obj.header,
                    is_active=True
                ).filter(
                    Q(model__isnull=True) | Q(model__exact='') | Q(model__iexact='generic')
                ).first()
                
                if service_price:
                    return 'brand_generic'
                    
            except Exception:
                pass
        
        # No real pricing available, check service default
        if obj.price:
            return 'service_default'
        
        return 'na'
    
class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'description', 'icon', 'services']


class ServicePriceSerializer(serializers.ModelSerializer):
    """
    Serializer for ServicePrice model with additional computed fields.
    """
    savings = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = ServicePrice
        fields = [
            'id', 'brand', 'model', 'type', 'product_name',
            'before_price', 'after_price', 'discounted_price', 'link',
            'savings', 'discount_percentage', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'savings', 'discount_percentage']


class ServicePriceImportSerializer(serializers.Serializer):
    """
    Serializer for handling file upload in the import API.
    """
    file = serializers.FileField(
        help_text="Excel file (.xlsx or .xls) containing service price data"
    )
    dry_run = serializers.BooleanField(
        default=True,
        help_text="If True, validates data without saving. If False, performs actual import."
    )
    use_mapping = serializers.BooleanField(
        default=True,
        help_text="If True, uses flexible column name mapping for different Excel formats."
    )