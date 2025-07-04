from django.contrib import admin
from import_export.admin import ImportExportModelAdmin, ExportActionMixin

# Register your models here.
from .models import *
from .resources import (
    ServicePriceResource, 
    ServicePriceResourceWithMapping, 
    SimpleServicePriceResource,
    ServicePriceResourceSmart
)

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


@admin.register(ServicePrice)
class ServicePriceAdmin(ImportExportModelAdmin):
    """
    Admin interface for ServicePrice with import/export functionality.
    
    Features:
    - Excel import/export capabilities
    - Bulk operations
    - Data validation and preview
    - Error handling and reporting
    """
    resource_classes = [
        ServicePriceResourceSmart,  # Recommended: Smart duplicate handling
        ServicePriceResource,       # Standard: Basic upsert
        ServicePriceResourceWithMapping,  # With column mapping
        SimpleServicePriceResource  # Always create new (not recommended)
    ]
    
    list_display = [
        'brand', 'model', 'type', 'product_name', 
        'before_price', 'after_price', 'discounted_price', 
        'discount_percentage', 'is_active', 'updated_at'
    ]
    
    list_filter = [
        'brand', 'model', 'type', 'is_active', 
        'created_at', 'updated_at'
    ]
    
    search_fields = [
        'brand', 'model', 'type', 'product_name'
    ]
    
    list_editable = ['is_active']
    
    readonly_fields = ['created_at', 'updated_at', 'discount_percentage', 'savings']
    
    fieldsets = (
        ('Product Information', {
            'fields': ('brand', 'model', 'type', 'product_name')
        }),
        ('Pricing', {
            'fields': ('before_price', 'after_price', 'discounted_price')
        }),
        ('Additional Information', {
            'fields': ('link', 'is_active')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Customize the import/export options
    def get_import_resource_classes(self, request):
        """
        Return available resource classes for import with descriptions.
        """
        return [
            ServicePriceResourceSmart,      # Smart duplicate handling with detailed reporting
            ServicePriceResource,           # Standard upsert functionality  
            ServicePriceResourceWithMapping, # With flexible column name mapping
            SimpleServicePriceResource      # Always create new records (use with caution)
        ]
    
    def get_export_resource_class(self):
        """
        Return the default resource class for export.
        """
        return ServicePriceResource
    
    # Add custom actions
    actions = ['activate_selected', 'deactivate_selected']
    
    def activate_selected(self, request, queryset):
        """Activate selected service prices."""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} service prices were activated.')
    activate_selected.short_description = "Activate selected service prices"
    
    def deactivate_selected(self, request, queryset):
        """Deactivate selected service prices."""
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} service prices were deactivated.')
    deactivate_selected.short_description = "Deactivate selected service prices"


admin.site.register(ServiceCategory, ServiceCategoryAdmin)
admin.site.register(Service, ServiceAdmin)

