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

    class Meta:
        model = Service
        fields=['id','header','details','pagedetails','details_list','price','duration','image','is_featured']

    def get_details_list(self,obj):
        return obj.get_details_list()
    
class ServiceCategorySerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'description', 'icon', 'services']