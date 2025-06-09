from django.contrib import admin

# Register your models here.
from .models import *
admin.site.register(UserProfile)



class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name','description']


class ServiceAdmin(admin.ModelAdmin):
    list_display=['header', 'category','price', 'is_featured', 'is_active', 'created_at']
    list_filter=['category', 'is_featured', 'is_active', 'created_at']
    search_fields=['header', 'details']
    list_editable=['is_featured', 'is_active']

admin.site.register(ServiceCategory, ServiceCategoryAdmin)
admin.site.register(Service, ServiceAdmin)

