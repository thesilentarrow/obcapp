# Django Excel Import System Documentation

## Overview

This system provides comprehensive Excel import functionality for ServicePrice data using `django-import-export`. It supports both API endpoints and Django admin interface for importing pricing data with **Smart Duplicate Handling**.

## 🆕 **New Features - Smart Import System**

✅ **Smart Duplicate Detection** - Automatically detects existing records  
✅ **Intelligent Updates** - Only updates fields that have changed  
✅ **Detailed Reporting** - Shows exactly what was created, updated, or skipped  
✅ **Flexible Matching** - Based on (Brand, Model, Product Name)  
✅ **Multiple Import Strategies** - Choose the best approach for your needs  
✅ **Enhanced Logging** - Track every operation with detailed logs  

## Import Strategies

### 1. **Smart Import** (🌟 Recommended)
- **What it does**: Intelligently handles duplicates with detailed reporting
- **Duplicate Logic**: Matches on (Brand, Model, Product Name)
- **Behavior**: 
  - Creates new records for non-matching entries
  - Updates existing records if any field has changed
  - Skips records with no changes
  - Provides detailed change tracking

### 2. **Standard Import**
- **What it does**: Basic upsert functionality
- **Duplicate Logic**: Matches on (Brand, Model, Type, Product Name)
- **Behavior**: Standard update or create

### 3. **Mapping Import**  
- **What it does**: Standard import + flexible column name mapping
- **Best for**: Excel files with different column naming conventions

### 4. **Always New Import** (⚠️ Use with caution)
- **What it does**: Always creates new records
- **Warning**: Can create duplicates

## Features

✅ **Excel Import/Export** - Support for .xlsx and .xls files  
✅ **Bulk Operations** - High-performance bulk insert/update  
✅ **Data Validation** - Dry-run validation before actual import  
✅ **Error Handling** - Detailed row-level error reporting  
✅ **Column Mapping** - Flexible column name mapping  
✅ **Admin Interface** - Import/export directly from Django admin  
✅ **API Endpoints** - RESTful API for programmatic access  
✅ **Smart Upsert** - Update existing or create new records intelligently  

## Data Model

The `ServicePrice` model includes the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| brand | CharField(50) | Yes | Brand of the service |
| model | CharField(50) | Yes | Model type |
| type | CharField(50) | Yes | Service type category |
| product_name | CharField(100) | Yes | Name of the service product |
| before_price | DecimalField | Yes | Price before discount |
| after_price | DecimalField | Yes | Price after discount |
| discounted_price | DecimalField | No | Special discounted price |
| link | URLField | No | URL link for more details |

**Unique Constraint**: (brand, model, type, product_name)
**Smart Matching**: Smart Import uses (brand, model, product_name) for more flexible duplicate detection

## 🎯 **How Smart Duplicate Detection Works**

The Smart Import system uses the following logic:

### Matching Criteria
```
Existing Record Found IF:
  brand (case-insensitive) == import_brand AND
  model (case-insensitive) == import_model AND  
  product_name (case-insensitive) == import_product_name
```

### Decision Tree
```
For each row in Excel:
  1. Search for existing record using matching criteria
  2. IF found:
     a. Compare all updateable fields (type, prices, link)
     b. IF any field is different:
        ✅ UPDATE the record
        📝 Log: "UPDATED: [details of changes]"
     c. ELSE:
        ⏭️ SKIP the record  
        📝 Log: "SKIPPED: No changes detected"
  3. ELSE:
     ✅ CREATE new record
     📝 Log: "CREATED: [new record details]"
```

### Example Scenarios

**Scenario 1: Exact Duplicate**
```
Excel Row:     Toyota | Camry | Oil Change | Full Synthetic | $89.99 | $69.99
Existing DB:   Toyota | Camry | Oil Change | Full Synthetic | $89.99 | $69.99
Result:        ⏭️ SKIPPED (no changes)
```

**Scenario 2: Price Update**
```
Excel Row:     Toyota | Camry | Oil Change | Full Synthetic | $95.99 | $75.99
Existing DB:   Toyota | Camry | Oil Change | Full Synthetic | $89.99 | $69.99
Result:        🔄 UPDATED (before_price: $89.99 → $95.99, after_price: $69.99 → $75.99)
```

**Scenario 3: New Record**
```
Excel Row:     BMW | X5 | Oil Change | Premium Synthetic | $129.99 | $109.99
Existing DB:   (no matching record)
Result:        ✨ CREATED
```

## Excel File Format

### Required Columns

Your Excel file should contain these columns (case-insensitive):

```
Brand | Model | Type | Product Name | Before Price | After Price | Discount Price | Link
------|-------|------|--------------|--------------|-------------|----------------|------
Toyota| Camry | Oil Change | Full Synthetic Oil Change | 89.99 | 69.99 | 59.99 | https://example.com/...
Honda | Civic | Brake Service | Front Brake Pad Replacement | 199.99 | 179.99 | | https://example.com/...
```

### Supported Column Name Variations

The system automatically maps these column name variations:

- **Brand**: Brand, brand, BRAND
- **Model**: Model, model, MODEL  
- **Type**: Type, type, TYPE
- **Product Name**: Product Name, product_name, PRODUCT_NAME, ProductName
- **Before Price**: Before Price, before_price, BEFORE_PRICE, BeforePrice
- **After Price**: After Price, after_price, AFTER_PRICE, AfterPrice
- **Discount Price**: Discount Price, discounted_price, DISCOUNTED_PRICE, DiscountedPrice
- **Link**: Link, link, LINK, URL, url

## API Usage

### 1. Import Service Prices (Enhanced)

**Endpoint**: `POST /api/service-prices/import/`

**Request Format**:
```http
POST /api/service-prices/import/
Content-Type: multipart/form-data

file: [Excel file]
dry_run: true/false (optional, default: true)
use_mapping: true/false (optional, default: true)
import_strategy: string (optional, default: "smart")
```

**Import Strategy Options**:
- `smart` - 🌟 **Recommended**: Smart duplicate handling with detailed reporting
- `standard` - Basic upsert functionality  
- `mapping` - Standard + column name mapping
- `always_new` - ⚠️ Always creates new records (can cause duplicates)

**Example using curl**:
```bash
# Smart Import with dry run (recommended)
curl -X POST \
  http://localhost:8000/api/service-prices/import/ \
  -F "file=@sample_service_prices.xlsx" \
  -F "dry_run=true" \
  -F "import_strategy=smart"

# Actual Smart Import
curl -X POST \
  http://localhost:8000/api/service-prices/import/ \
  -F "file=@sample_service_prices.xlsx" \
  -F "dry_run=false" \
  -F "import_strategy=smart"
```

**Enhanced Response Format** (Smart Import):
```json
{
  "status": "success",
  "dry_run": true,
  "message": "✅ Validation successful! 2 new records to be created, 1 record to be updated, 1 record to be skipped (no changes). Ready for actual import.",
  "totals": {
    "new": 2,
    "update": 1,
    "delete": 0,
    "skip": 1,
    "error": 0,
    "invalid": 0
  },
  "total_rows": 4,
  "detailed_summary": {
    "total_processed": 4,
    "new_count": 2,
    "updated_count": 1,
    "skipped_count": 1,
    "error_count": 0,
    "details": {
      "new_records": [
        {
          "brand": "BMW",
          "model": "X5", 
          "product_name": "Premium Oil Change"
        }
      ],
      "updated_records": [
        {
          "brand": "Toyota",
          "model": "Camry",
          "product_name": "Standard Oil Change",
          "changes": [
            {
              "field": "before_price",
              "old": 89.99,
              "new": 95.99
            }
          ]
        }
      ],
      "skipped_records": [
        {
          "brand": "Honda",
          "model": "Civic", 
          "product_name": "Brake Service",
          "reason": "No changes detected"
        }
      ]
    }
  }
}
```

**Error Response**:
```json
{
  "status": "error",
  "message": "Import completed with 2 errors",
  "errors": [
    {
      "row": 3,
      "errors": ["before_price: This field is required"]
    },
    {
      "row": 5,
      "errors": ["Invalid URL format"]
    }
  ]
}
```

### 2. List Service Prices

**Endpoint**: `GET /api/service-prices/`

**Query Parameters**:
- `brand`: Filter by brand
- `model`: Filter by model  
- `type`: Filter by service type
- `search`: Search across all fields

**Example**:
```bash
curl "http://localhost:8000/api/service-prices/?brand=Toyota&search=oil"
```

## Django Admin Usage

### 1. Access Admin Interface

1. Go to `http://localhost:8000/admin/`
2. Navigate to **Service Prices** section
3. Click **Import** button

### 2. Choose Import Strategy

You'll see 4 resource options:

1. **🌟 ServicePriceResourceSmart** (Recommended)
   - Smart duplicate handling with detailed reporting
   - Best for: Regular updates to existing price lists

2. **ServicePriceResource** 
   - Standard upsert functionality
   - Best for: Simple imports with basic duplicate handling

3. **ServicePriceResourceWithMapping**
   - Includes flexible column name mapping
   - Best for: Excel files with different column formats

4. **SimpleServicePriceResource** 
   - Always creates new records
   - ⚠️ **Warning**: Can create duplicates - use only for fresh data

### 3. Import Process

#### Step 1: Upload File
- Select your Excel file (.xlsx or .xls)
- Choose **ServicePriceResourceSmart** for best results

#### Step 2: Preview (Dry Run)
- Click **Dry run** to validate without importing
- Review the preview to see what changes will be made
- Check for any errors or warnings

#### Step 3: Confirm Import  
- If preview looks good, uncheck **Dry run**
- Click **Submit** to perform actual import

### 4. Understanding Results

The admin interface will show:

**Success Messages:**
- `✅ Created X new records`
- `🔄 Updated X existing records` 
- `⏭️ Skipped X unchanged records`

**Smart Import Details:**
When using **ServicePriceResourceSmart**, you'll see detailed logs in the server console:

```
📋 Processing row: Toyota Camry - Full Synthetic Oil Change
🔄 FOUND EXISTING: Toyota Camry - Full Synthetic Oil Change (ID: 123)
📝 CHANGES for Toyota Camry - Full Synthetic Oil Change: before_price: 89.99 → 95.99
🔄 UPDATED: Toyota Camry - Full Synthetic Oil Change

📋 Processing row: BMW X5 - Premium Oil Change  
✨ NEW RECORD: BMW X5 - Premium Oil Change
✅ CREATED: BMW X5 - Premium Oil Change

📋 Processing row: Honda Civic - Brake Service
🔄 FOUND EXISTING: Honda Civic - Brake Service (ID: 124)
📄 NO CHANGES for Honda Civic - Brake Service
⏭️ SKIPPED (no changes): Honda Civic - Brake Service
```
3. Click on **Service prices**

### 2. Import Data

1. Click **Import** button at the top
2. Choose your Excel file
3. Select import options:
   - **Resource**: Choose ServicePriceResource or ServicePriceResourceWithMapping
   - **Format**: Excel (.xlsx)
4. Click **Submit** for preview
5. Review the preview and click **Confirm import**

### 3. Export Data

1. Select the records you want to export (or select all)
2. Choose **Export** from the action dropdown
3. Select **Excel** format
4. Click **Go**

## Implementation Details

### 1. Resource Classes

**SimpleServicePriceResource**: Basic import functionality (creates new records, Django assigns IDs)  
**ServicePriceResource**: Advanced import/export with upsert functionality  
**ServicePriceResourceWithMapping**: Includes flexible column name mapping + upsert

### 2. Key Features

- **Upsert Logic**: Uses `import_id_fields` to identify existing records
- **Bulk Operations**: `use_bulk=True` for performance
- **Transaction Safety**: `use_transactions=True` for data integrity
- **Skip Unchanged**: `skip_unchanged=True` to avoid unnecessary updates

### 3. Error Handling

- Pre-import validation
- Row-level error reporting
- Data type validation
- Constraint validation

## Testing

### 1. Using the Sample File

```python
# Generate sample file
python sample_service_prices.py

# Test dry run
curl -X POST \
  http://localhost:8000/api/service-prices/import/ \
  -F "file=@sample_service_prices.xlsx" \
  -F "dry_run=true"
```

### 2. Testing Different Scenarios

1. **Valid Data**: Import the sample file
2. **Invalid Data**: Modify the sample file with invalid prices
3. **Duplicate Data**: Import the same file twice to test updates
4. **Missing Columns**: Remove required columns to test validation

## Performance Considerations

- **Bulk Operations**: Processes records in batches for better performance
- **Transactions**: Uses database transactions for consistency
- **Memory Usage**: Processes files in chunks for large datasets
- **Indexing**: Unique constraint on (brand, model, type, product_name) for fast lookups

## Security Considerations

- **File Validation**: Only accepts Excel files
- **Size Limits**: Configure MAX_UPLOAD_SIZE in Django settings
- **Authentication**: Add authentication/permissions as needed
- **Input Validation**: All data is validated before import

## Troubleshooting

### Common Issues

1. **Migration Errors**: Ensure migrations are applied with `python manage.py migrate`
2. **Import Errors**: Check file format and column names
3. **Permission Errors**: Verify admin permissions
4. **Memory Issues**: Process large files in smaller batches

### Import ID Fields Error

If you get an error like "fields are declared in 'import_id_fields' but are not present in the file headers":

**Solution**: Use the **SimpleServicePriceResource** instead:
1. In Django Admin, when importing, select "SimpleServicePriceResource" 
2. This resource doesn't use import_id_fields and lets Django assign IDs automatically
3. Each import creates new records (no updates)

### Duplicate Data Handling

The **SimpleServicePriceResource** intelligently handles duplicate data:

✅ **Exact Duplicates**: If a row has identical values to an existing record, it will be **skipped**  
✅ **Preview Shows Skip Count**: The import preview will show how many rows will be skipped  
✅ **No Errors**: No integrity constraint errors when importing the same file multiple times  
✅ **Detailed Logging**: Logs which records were created vs skipped  

**Example Preview**:
```
New: 3 records
Skip: 2 records (already exist with identical data)
Total: 5 records processed
```

### UNIQUE Constraint Error

If you get "UNIQUE constraint failed" error:
1. **Use SimpleServicePriceResource** - it handles duplicates automatically
2. **Check Preview First** - it will show which records already exist
3. **Import Safely** - existing records with identical data are skipped, new ones are created

### Column Name Mismatch

If your Excel columns don't match exactly:
1. Use **ServicePriceResourceWithMapping** for flexible column mapping
2. Or rename your Excel columns to match: Brand, Model, Type, Product Name, Before Price, After Price, Discount Price, Link

### Sample File Generation

Generate a test file:
```bash
python create_sample_excel.py
```

This creates `sample_service_prices.xlsx` with sample data for testing.

### Debug Mode

Enable logging to debug import issues:

```python
# In settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'myapp.resources': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}
```

## Future Enhancements

- [ ] Support for CSV files
- [ ] Batch processing for very large files
- [ ] Import history tracking
- [ ] Scheduled imports
- [ ] Email notifications
- [ ] Advanced filtering in admin
- [ ] Export templates

## API Reference

### ServicePrice Model Properties

```python
# Computed properties
service_price.savings  # Returns before_price - after_price
service_price.discount_percentage  # Returns discount percentage
```

### Available Endpoints

- `POST /api/service-prices/import/` - Import Excel data
- `GET /api/service-prices/` - List service prices
- `GET /admin/myapp/serviceprice/` - Admin interface

This completes the comprehensive Django Excel import system implementation! 🚀
