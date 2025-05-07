from django.urls import path
from .views import *

urlpatterns = [
    path('userprofiles/', UserProfileList.as_view(), name='user-list-create'),
    path('userprofiles/<int:pk>/', UserProfileRetrieveUpdateDestroyView.as_view(), name='userprofile-detail'),
    path('otp/request/', RequestOTPView.as_view(), name='request_otp'),
    path('otp/verify/', VerifyOTPView.as_view(), name='verify_otp'),
]