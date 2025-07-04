from django.urls import path
from .views import *

urlpatterns = [
    path('userprofiles/', UserProfileList.as_view(), name='user-list-create'),
    path('userprofiles/<int:pk>/', UserProfileRetrieveUpdateDestroyView.as_view(), name='userprofile-detail'),
    path('otp/request/', RequestOTPView.as_view(), name='request_otp'),
    path('otp/verify/', VerifyOTPView.as_view(), name='verify_otp'),
    path('services/categories/', ServiceCategoryListView.as_view(), name='service-categories'),
    path('services/categories/<str:category_identifier>/', ServicesByCategoryView.as_view(), name='services-by-category'),
    path('services/all/', AllServicesView.as_view(), name='all-services'),
    # ServicePrice API endpoints
    path('service-prices/', ServicePriceListView.as_view(), name='service-prices-list'),
    path('service-prices/import/', ServicePriceImportAPIView.as_view(), name='service-prices-import'),
]