from django.db import models
from django.contrib.auth.models import User # Or your custom user model
import random
from django.utils import timezone
from datetime import timedelta

class UserProfile(models.Model):
    
    # Create your models here.
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30) 
    email = models.EmailField() 

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class OTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    phone_number = models.CharField(max_length=20) # Ensure E.164 format compatibility
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.pk:
            self.expires_at = timezone.now() + timedelta(minutes=5) # OTP valid for 5 minutes
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.phone_number} - {self.otp_code}"

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))