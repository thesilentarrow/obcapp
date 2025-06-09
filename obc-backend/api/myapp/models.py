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
    
class ServiceCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon=models.CharField(max_length=50, blank=True)
    slug = models.SlugField(unique=True)
    created_at=models.DateTimeField(auto_now_add=True)
    is_active=models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Service Categories"

class Service(models.Model):
    category=models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='services')
    header = models.CharField(max_length=200)
    details = models.TextField()
    pagedetails = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration= models.CharField(max_length=50, blank=True)
    image=models.CharField(max_length=200, blank= True)
    is_featured=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    is_active=models.BooleanField(default=True)

    def __str__(self):
        return f"{self.category.name}-{self.header}"
    
    def get_details_list(self):
        return [detail.strip() for detail in self.details.split(',') if detail.strip()]
    


