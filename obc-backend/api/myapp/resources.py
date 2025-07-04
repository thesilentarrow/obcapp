"""
Django Import-Export Resources for handling Excel data import/export.
This module defines resource classes that handle the import/update of ServicePrice data.
"""

from import_export import resources, fields, widgets
from import_export.widgets import ForeignKeyWidget, DecimalWidget
from .models import ServicePrice
import logging

logger = logging.getLogger(__name__)


class ServicePriceResource(resources.ModelResource):
    """
    Enhanced Resource class for importing/exporting ServicePrice data from Excel files.
    
    Features:
    - Smart upsert functionality (insert or update based on unique fields)
    - Detailed reporting of skipped, updated, and new records
    - Field validation and error handling
    - Support for Excel column name mapping
    - Flexible duplicate detection strategy
    """
    
    # Define custom fields with specific widgets for better data handling
    brand = fields.Field(
        column_name='Brand',
        attribute='brand',
        widget=widgets.CharWidget()
    )
    
    model = fields.Field(
        column_name='Model', 
        attribute='model',
        widget=widgets.CharWidget()
    )
    
    type = fields.Field(
        column_name='Type',
        attribute='type', 
        widget=widgets.CharWidget()
    )
    
    product_name = fields.Field(
        column_name='Product Name',
        attribute='product_name',
        widget=widgets.CharWidget()
    )
    
    before_price = fields.Field(
        column_name='Before Price',
        attribute='before_price',
        widget=DecimalWidget()
    )
    
    after_price = fields.Field(
        column_name='After Price', 
        attribute='after_price',
        widget=DecimalWidget()
    )
    
    discounted_price = fields.Field(
        column_name='Discount Price',
        attribute='discounted_price',
        widget=DecimalWidget()
    )
    
    link = fields.Field(
        column_name='Link',
        attribute='link',
        widget=widgets.CharWidget()
    )

    class Meta:
        model = ServicePrice
        # Use these fields to identify existing records for updates
        # Based on brand, model, and product_name (excluding type for more flexible matching)
        import_id_fields = ('brand', 'model', 'product_name')
        # Don't skip unchanged records - we want to update them
        skip_unchanged = False
        # Use bulk operations for better performance
        use_bulk = False  # Disable bulk for better error tracking
        # Report skipped records for transparency
        report_skipped = True
        # Define which fields to include in import/export
        fields = (
            'brand', 'model', 'type', 'product_name', 
            'before_price', 'after_price', 'discounted_price', 'link'
        )
        # Exclude auto-generated fields from import
        exclude = ('id', 'created_at', 'updated_at')
        # Let Django handle ID assignment automatically
        use_natural_foreign_keys = True

    def get_instance(self, instance_loader, row):
        """
        Enhanced instance lookup with detailed logging.
        Look for existing records based on brand, model, and product_name.
        """
        try:
            brand = str(row.get('Brand', '')).strip()
            model = str(row.get('Model', '')).strip()
            product_name = str(row.get('Product Name', '')).strip()
            
            if not brand or not product_name:
                logger.warning(f"Missing essential data - Brand: '{brand}', Product: '{product_name}'")
                return None
            
            # Try to find existing record
            existing = ServicePrice.objects.filter(
                brand__iexact=brand,
                model__iexact=model,
                product_name__iexact=product_name
            ).first()
            
            if existing:
                logger.info(f"🔄 FOUND EXISTING: {brand} {model} - {product_name} (ID: {existing.id})")
                return existing
            else:
                logger.info(f"✨ NEW RECORD: {brand} {model} - {product_name}")
                return None
                
        except Exception as e:
            logger.error(f"Error in get_instance: {str(e)}")
            return None

    def before_import_row(self, row, **kwargs):
        """
        Enhanced pre-processing with detailed validation and logging.
        """
        # Clean whitespace from string fields
        string_fields = ['Brand', 'Model', 'Type', 'Product Name', 'Link']
        for field in string_fields:
            if field in row and row[field]:
                row[field] = str(row[field]).strip()
        
        # Handle empty/null values for decimal fields
        decimal_fields = ['Before Price', 'After Price', 'Discount Price']
        for field in decimal_fields:
            if field in row and (row[field] == '' or row[field] is None or str(row[field]).strip() == ''):
                if field == 'Discount Price':
                    row[field] = None  # Allow null for optional field
                else:
                    row[field] = 0  # Set default for required fields
        
        # Log row processing
        brand = row.get('Brand', '')
        model = row.get('Model', '')
        product_name = row.get('Product Name', '')
        logger.info(f"📋 Processing row: {brand} {model} - {product_name}")
        
        # Track what fields might be changing for existing records
        instance = self.get_instance(None, row)
        if instance:
            changes = []
            field_mappings = {
                'Type': 'type',
                'Before Price': 'before_price',
                'After Price': 'after_price',
                'Discount Price': 'discounted_price',
                'Link': 'link'
            }
            
            for excel_field, model_field in field_mappings.items():
                if excel_field in row:
                    old_value = getattr(instance, model_field, None)
                    new_value = row[excel_field]
                    
                    # Handle decimal comparison
                    if model_field in ['before_price', 'after_price', 'discounted_price']:
                        try:
                            old_value = float(old_value) if old_value else 0
                            new_value = float(new_value) if new_value else 0
                        except (ValueError, TypeError):
                            continue
                    
                    if old_value != new_value:
                        changes.append(f"{model_field}: {old_value} → {new_value}")
            
            if changes:
                logger.info(f"📝 CHANGES for {brand} {model} - {product_name}: {', '.join(changes)}")
            else:
                logger.info(f"📄 NO CHANGES for {brand} {model} - {product_name}")
        
        return row

    def after_import_row(self, row, row_result, **kwargs):
        """
        Enhanced post-processing with detailed reporting.
        """
        brand = row.get('Brand', '')
        model = row.get('Model', '')
        product_name = row.get('Product Name', '')
        
        if row_result.import_type == 'new':
            logger.info(f"✅ CREATED: {brand} {model} - {product_name}")
        elif row_result.import_type == 'update':
            logger.info(f"🔄 UPDATED: {brand} {model} - {product_name}")
        elif row_result.import_type == 'skip':
            logger.info(f"⏭️ SKIPPED: {brand} {model} - {product_name}")
        
        # Log any errors
        if hasattr(row_result, 'errors') and row_result.errors:
            logger.error(f"❌ ERRORS for {brand} {model} - {product_name}: {row_result.errors}")

    def skip_row(self, instance, original, row, import_validation_errors=None):
        """
        Enhanced skip logic with detailed validation.
        """
        brand = str(row.get('Brand', '')).strip()
        model = str(row.get('Model', '')).strip()
        product_name = str(row.get('Product Name', '')).strip()
        
        # Skip rows with missing essential data
        if not brand or not product_name:
            logger.warning(f"⏭️ SKIPPING: Missing essential data - Brand: '{brand}', Product: '{product_name}'")
            return True
        
        # Skip rows with invalid price data
        try:
            before_price = float(row.get('Before Price', 0))
            after_price = float(row.get('After Price', 0))
            if before_price < 0 or after_price < 0:
                logger.warning(f"⏭️ SKIPPING: Invalid price data - Before: {before_price}, After: {after_price}")
                return True
        except (ValueError, TypeError):
            logger.warning(f"⏭️ SKIPPING: Invalid price format - Before: {row.get('Before Price')}, After: {row.get('After Price')}")
            return True
        
        return False

    def get_import_headers(self):
        """
        Define the expected headers for import files.
        This helps with column mapping.
        """
        return [
            'Brand', 'Model', 'Type', 'Product Name',
            'Before Price', 'After Price', 'Discount Price', 'Link'
        ]

    def get_export_headers(self):
        """
        Define headers for export files.
        """
        return [
            'Brand', 'Model', 'Type', 'Product Name',
            'Before Price', 'After Price', 'Discounted Price', 'Link'
        ]


class ServicePriceResourceWithMapping(ServicePriceResource):
    """
    Extended resource class that handles common Excel column name variations.
    Useful when Excel files have different column naming conventions.
    """
    
    # Alternative column name mappings
    COLUMN_MAPPINGS = {
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

    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        """
        Pre-process the dataset to handle column name mapping.
        """
        # Map column headers to standard names
        new_headers = []
        for header in dataset.headers:
            mapped_header = self.COLUMN_MAPPINGS.get(header, header)
            new_headers.append(mapped_header)
        
        dataset.headers = new_headers
        return super().before_import(dataset, using_transactions, dry_run, **kwargs)


class SimpleServicePriceResource(resources.ModelResource):
    """
    Simplified resource class for importing ServicePrice data.
    ALWAYS imports everything as new records - no skipping logic.
    """
    
    # Explicitly define fields to avoid ID field issues
    brand = fields.Field(
        column_name='Brand',
        attribute='brand',
        widget=widgets.CharWidget()
    )
    
    model = fields.Field(
        column_name='Model', 
        attribute='model',
        widget=widgets.CharWidget()
    )
    
    type = fields.Field(
        column_name='Type',
        attribute='type', 
        widget=widgets.CharWidget()
    )
    
    product_name = fields.Field(
        column_name='Product Name',
        attribute='product_name',
        widget=widgets.CharWidget()
    )
    
    before_price = fields.Field(
        column_name='Before Price',
        attribute='before_price',
        widget=DecimalWidget()
    )
    
    after_price = fields.Field(
        column_name='After Price', 
        attribute='after_price',
        widget=DecimalWidget()
    )
    
    discounted_price = fields.Field(
        column_name='Discount Price',
        attribute='discounted_price',
        widget=DecimalWidget()
    )
    
    link = fields.Field(
        column_name='Link',
        attribute='link',
        widget=widgets.CharWidget()
    )
    
    class Meta:
        model = ServicePrice
        skip_unchanged = False
        use_bulk = False
        report_skipped = False  # Don't report skips since we're not skipping
        fields = (
            'brand', 'model', 'type', 'product_name', 
            'before_price', 'after_price', 'discounted_price', 'link'
        )
        exclude = ('id', 'created_at', 'updated_at')
        import_id_fields = ()

    def get_instance(self, instance_loader, row):
        """
        Always return None so every row is treated as new.
        No checking for existing records.
        """
        print(f"✨ ALWAYS CREATE NEW: {row.get('Brand')} {row.get('Model')} {row.get('Type')} {row.get('Product Name')}")
        return None

    def skip_row(self, instance, original, row, import_validation_errors=None):
        """
        Only skip if data is fundamentally invalid (missing required fields).
        Never skip for duplicates.
        """
        # Only basic validation - skip if missing critical data
        brand = str(row.get('Brand', '')).strip()
        product_name = str(row.get('Product Name', '')).strip()
        
        if not brand or not product_name:
            print(f"⏭️ SKIPPING: Missing brand or product name")
            return True
        
        # Check if prices are valid numbers
        try:
            before_price = float(row.get('Before Price', 0))
            if before_price < 0:
                print(f"⏭️ SKIPPING: Negative before_price")
                return True
        except (ValueError, TypeError):
            print(f"⏭️ SKIPPING: Invalid before_price")
            return True
        
        # If we get here, always import
        print(f"✅ IMPORTING: {brand} - {product_name}")
        return False

    def before_import_row(self, row, **kwargs):
        """Clean data before processing."""
        # Clean string fields
        string_fields = ['Brand', 'Model', 'Type', 'Product Name', 'Link']
        for field in string_fields:
            if field in row and row[field]:
                row[field] = str(row[field]).strip()
        
        # Handle decimal fields
        decimal_fields = ['Before Price', 'After Price', 'Discount Price']
        for field in decimal_fields:
            if field in row and (row[field] == '' or row[field] is None or str(row[field]).strip() == ''):
                if field == 'Discount Price':
                    row[field] = None
                else:
                    row[field] = 0
        
        return row


class ServicePriceResourceSmart(ServicePriceResource):
    """
    Smart ServicePrice Resource with advanced duplicate handling and detailed reporting.
    
    This resource provides:
    - Intelligent duplicate detection based on (brand, model, product_name)
    - Detailed logging of all operations (create, update, skip)
    - Smart field updates - only update changed fields
    - Comprehensive error reporting
    - Flexible matching (case-insensitive)
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._init_import_summary()
    
    def _init_import_summary(self):
        """Initialize or reset the import summary."""
        if not hasattr(self, 'import_summary'):
            self.import_summary = {
                'total_processed': 0,
                'new_records': [],
                'updated_records': [],
                'skipped_records': [],
                'error_records': []
            }
    
    class Meta:
        model = ServicePrice
        # Use brand, model, product_name as unique identifier
        import_id_fields = ('brand', 'model', 'product_name')
        skip_unchanged = False  # We want to track all operations
        use_bulk = False  # Better control and logging
        report_skipped = True
        fields = (
            'brand', 'model', 'type', 'product_name', 
            'before_price', 'after_price', 'discounted_price', 'link'
        )
        exclude = ('id', 'created_at', 'updated_at')
    
    def get_instance(self, instance_loader, row):
        """
        Enhanced instance lookup with flexible matching.
        """
        self._init_import_summary()  # Ensure summary is initialized
        
        brand = str(row.get('Brand', '')).strip()
        model = str(row.get('Model', '')).strip() 
        product_name = str(row.get('Product Name', '')).strip()
        
        if not brand or not product_name:
            return None
        
        # Try exact match first
        existing = ServicePrice.objects.filter(
            brand__iexact=brand,
            model__iexact=model,
            product_name__iexact=product_name
        ).first()
        
        if existing:
            # Add to tracking
            self.import_summary['total_processed'] += 1
            return existing
        
        self.import_summary['total_processed'] += 1
        return None
    
    def before_import_row(self, row, **kwargs):
        """
        Enhanced pre-processing with detailed tracking and logging.
        """
        self._init_import_summary()  # Ensure summary is initialized
        
        # Clean data first (call parent method logic)
        super().before_import_row(row, **kwargs)
        
        brand = str(row.get('Brand', '')).strip()
        model = str(row.get('Model', '')).strip()
        product_name = str(row.get('Product Name', '')).strip()
        
        # Get existing instance to track changes
        instance = self.get_instance(None, row)
        
        if instance:
            # Track changes for existing record
            changes = []
            
            field_mappings = {
                'Type': 'type',
                'Before Price': 'before_price', 
                'After Price': 'after_price',
                'Discount Price': 'discounted_price',
                'Link': 'link'
            }
            
            for row_field, model_field in field_mappings.items():
                if row_field in row:
                    old_value = getattr(instance, model_field, None)
                    new_value = row[row_field]
                    
                    # Handle different data types
                    if model_field in ['before_price', 'after_price', 'discounted_price']:
                        try:
                            old_value = float(old_value) if old_value is not None else None
                            new_value = float(new_value) if new_value not in [None, ''] else None
                        except (ValueError, TypeError):
                            continue
                    
                    if old_value != new_value:
                        changes.append({
                            'field': model_field,
                            'old': old_value,
                            'new': new_value
                        })
            
            # Store changes info for after_import_row
            row['_smart_changes'] = changes
            row['_smart_instance_id'] = instance.id
            
            if changes:
                logger.info(f"🔄 WILL UPDATE: {brand} {model} - {product_name}")
                for change in changes:
                    logger.info(f"   📝 {change['field']}: {change['old']} → {change['new']}")
            else:
                logger.info(f"⏭️ NO CHANGES: {brand} {model} - {product_name}")
        else:
            logger.info(f"✨ WILL CREATE: {brand} {model} - {product_name}")
            row['_smart_changes'] = None
            row['_smart_instance_id'] = None
        
        return row
    
    def after_import_row(self, row, row_result, **kwargs):
        """
        Enhanced post-processing with detailed reporting.
        """
        brand = row.get('Brand', '')
        model = row.get('Model', '')
        product_name = row.get('Product Name', '')
        
        changes = row.get('_smart_changes')
        instance_id = row.get('_smart_instance_id')
        
        if row_result.import_type == 'new':
            self.import_summary['new_records'].append({
                'brand': brand,
                'model': model,
                'product_name': product_name,
                'data': dict(row)
            })
            logger.info(f"✅ CREATED: {brand} {model} - {product_name}")
        elif row_result.import_type == 'update':
            if changes:
                self.import_summary['updated_records'].append({
                    'brand': brand,
                    'model': model,
                    'product_name': product_name,
                    'changes': changes,
                    'id': instance_id
                })
                logger.info(f"🔄 UPDATED: {brand} {model} - {product_name}")
        elif row_result.import_type == 'skip':
            self.import_summary['skipped_records'].append({
                'brand': brand,
                'model': model,
                'product_name': product_name,
                'reason': 'No changes detected',
                'id': instance_id
            })
            logger.info(f"⏭️ SKIPPED: {brand} {model} - {product_name}")
        
        # Clean up temporary fields
        if '_smart_changes' in row:
            del row['_smart_changes']
        if '_smart_instance_id' in row:
            del row['_smart_instance_id']
    
    def get_import_summary(self):
        """
        Get detailed summary of the import operation.
        """
        self._init_import_summary()  # Ensure summary is initialized
        return {
            'total_processed': self.import_summary['total_processed'],
            'new_count': len(self.import_summary['new_records']),
            'updated_count': len(self.import_summary['updated_records']),
            'skipped_count': len(self.import_summary['skipped_records']),
            'error_count': len(self.import_summary['error_records']),
            'details': self.import_summary
        }
