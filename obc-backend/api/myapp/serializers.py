from rest_framework import serializers
from .models import UserProfile
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