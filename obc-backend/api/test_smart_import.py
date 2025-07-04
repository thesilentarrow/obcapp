#!/usr/bin/env python
"""
Test script to demonstrate the enhanced Smart Import functionality.

This script creates sample Excel files and shows how the different import strategies work:
1. Initial import (all new records)
2. Duplicate import (mix of existing and new records)
3. Update import (modified existing records)

Run this script to see the Smart Import system in action.
"""

import os
import sys
import django
import pandas as pd
from datetime import datetime

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()

from myapp.models import ServicePrice
from myapp.resources import ServicePriceResourceSmart
from tablib import Dataset

def create_initial_data():
    """Create initial test data"""
    data = [
        {
            'Brand': 'Toyota',
            'Model': 'Camry',
            'Type': 'Oil Change',
            'Product Name': 'Full Synthetic Oil Change',
            'Before Price': 89.99,
            'After Price': 69.99,
            'Discount Price': 59.99,
            'Link': 'https://example.com/toyota-camry-oil-change'
        },
        {
            'Brand': 'Honda',
            'Model': 'Civic',
            'Type': 'Brake Service',
            'Product Name': 'Front Brake Pad Replacement',
            'Before Price': 199.99,
            'After Price': 179.99,
            'Discount Price': None,
            'Link': 'https://example.com/honda-civic-brake-service'
        },
        {
            'Brand': 'Ford',
            'Model': 'F-150',
            'Type': 'Tire Service',
            'Product Name': 'All-Season Tire Installation',
            'Before Price': 299.99,
            'After Price': 249.99,
            'Discount Price': 229.99,
            'Link': 'https://example.com/ford-f150-tire-service'
        }
    ]
    
    df = pd.DataFrame(data)
    filename = 'test_initial_import.xlsx'
    df.to_excel(filename, index=False)
    print(f"✅ Created initial data file: {filename}")
    return filename, data

def create_duplicate_data():
    """Create data with some duplicates and some new records"""
    data = [
        # Duplicate (same brand, model, product_name)
        {
            'Brand': 'Toyota',
            'Model': 'Camry',
            'Type': 'Oil Change',
            'Product Name': 'Full Synthetic Oil Change',
            'Before Price': 89.99,
            'After Price': 69.99,
            'Discount Price': 59.99,
            'Link': 'https://example.com/toyota-camry-oil-change'
        },
        # Updated record (different prices)
        {
            'Brand': 'Honda',
            'Model': 'Civic',
            'Type': 'Brake Service',
            'Product Name': 'Front Brake Pad Replacement',
            'Before Price': 219.99,  # Changed from 199.99
            'After Price': 189.99,   # Changed from 179.99
            'Discount Price': 169.99,  # Changed from None
            'Link': 'https://example.com/honda-civic-brake-service-updated'
        },
        # New record
        {
            'Brand': 'BMW',
            'Model': '3 Series',
            'Type': 'Engine Service',
            'Product Name': 'Engine Diagnostic & Tune-up',
            'Before Price': 399.99,
            'After Price': 349.99,
            'Discount Price': 319.99,
            'Link': 'https://example.com/bmw-3series-engine-service'
        },
        # Another new record
        {
            'Brand': 'Mercedes',
            'Model': 'C-Class',
            'Type': 'Transmission',
            'Product Name': 'Transmission Fluid Change',
            'Before Price': 159.99,
            'After Price': 139.99,
            'Discount Price': None,
            'Link': 'https://example.com/mercedes-c-class-transmission'
        }
    ]
    
    df = pd.DataFrame(data)
    filename = 'test_duplicate_import.xlsx'
    df.to_excel(filename, index=False)
    print(f"✅ Created duplicate test file: {filename}")
    return filename, data

def test_import(filename, description):
    """Test import with the Smart Resource"""
    print(f"\n🔍 Testing: {description}")
    print(f"📁 File: {filename}")
    print("-" * 60)
    
    # Read Excel file
    df = pd.read_excel(filename)
    
    # Convert to tablib Dataset
    dataset = Dataset()
    dataset.load(df.to_dict('records'))
    
    # Use Smart Resource
    resource = ServicePriceResourceSmart()
    
    # Perform dry run first
    print("🔍 DRY RUN - Validation:")
    result = resource.import_data(dataset, dry_run=True, raise_errors=False)
    
    print(f"   📊 Totals: New={result.totals.get('new', 0)}, Update={result.totals.get('update', 0)}, Skip={result.totals.get('skip', 0)}")
    
    if result.has_errors():
        print("   ❌ Errors found:")
        for row_num, errors in result.row_errors:
            print(f"      Row {row_num}: {errors}")
        return
    
    # Get detailed summary
    summary = resource.get_import_summary()
    print(f"   📈 Smart Summary:")
    print(f"      🆕 New: {summary['new_count']}")
    print(f"      🔄 Updated: {summary['updated_count']}")
    print(f"      ⏭️ Skipped: {summary['skipped_count']}")
    
    # Perform actual import
    print("\n💾 ACTUAL IMPORT:")
    resource = ServicePriceResourceSmart()  # Fresh instance
    result = resource.import_data(dataset, dry_run=False, raise_errors=False)
    
    final_summary = resource.get_import_summary()
    print(f"   ✅ Import completed:")
    print(f"      🆕 Created: {final_summary['new_count']} records")
    print(f"      🔄 Updated: {final_summary['updated_count']} records")
    print(f"      ⏭️ Skipped: {final_summary['skipped_count']} records")
    
    # Show details
    if final_summary['details']['new_records']:
        print("\n   📝 New Records:")
        for record in final_summary['details']['new_records']:
            print(f"      ✨ {record['brand']} {record['model']} - {record['product_name']}")
    
    if final_summary['details']['updated_records']:
        print("\n   📝 Updated Records:")
        for record in final_summary['details']['updated_records']:
            print(f"      🔄 {record['brand']} {record['model']} - {record['product_name']}")
            for change in record['changes']:
                print(f"         📋 {change['field']}: {change['old']} → {change['new']}")
    
    if final_summary['details']['skipped_records']:
        print("\n   📝 Skipped Records:")
        for record in final_summary['details']['skipped_records']:
            print(f"      ⏭️ {record['brand']} {record['model']} - {record['product_name']} ({record['reason']})")

def main():
    """Main test function"""
    print("🚀 Testing Smart Import System")
    print("=" * 60)
    
    # Clear existing data for clean test
    print("🧹 Clearing existing ServicePrice data...")
    ServicePrice.objects.all().delete()
    print(f"   Current count: {ServicePrice.objects.count()}")
    
    # Test 1: Initial import
    initial_file, initial_data = create_initial_data()
    test_import(initial_file, "Initial Import (All New Records)")
    
    print(f"\n📊 Database state after initial import: {ServicePrice.objects.count()} records")
    
    # Test 2: Import with duplicates and updates
    duplicate_file, duplicate_data = create_duplicate_data()
    test_import(duplicate_file, "Mixed Import (Duplicates + Updates + New)")
    
    print(f"\n📊 Final database state: {ServicePrice.objects.count()} records")
    
    # Show final database contents
    print("\n📋 Final Database Contents:")
    for i, record in enumerate(ServicePrice.objects.all(), 1):
        print(f"   {i}. {record.brand} {record.model} - {record.product_name}")
        print(f"      💰 Prices: {record.before_price} → {record.after_price}")
        if record.discounted_price:
            print(f"      🎯 Discount: {record.discounted_price}")
        print(f"      🕒 Updated: {record.updated_at.strftime('%Y-%m-%d %H:%M:%S')}")
        print()
    
    # Cleanup
    os.remove(initial_file)
    os.remove(duplicate_file)
    print("🧹 Cleaned up test files")
    
    print("\n🎉 Smart Import System Test Completed!")
    
if __name__ == "__main__":
    main()
