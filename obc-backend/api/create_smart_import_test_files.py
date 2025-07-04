#!/usr/bin/env python
"""
Quick test to create sample files showing how the Smart Import handles duplicates.

This will create two Excel files:
1. initial_data.xlsx - Fresh data to import first
2. update_data.xlsx - Mix of duplicates, updates, and new records

Use these files to test the Smart Import functionality.
"""

import pandas as pd
import os

def create_test_files():
    """Create test Excel files for demonstration"""
    
    # File 1: Initial data (all new)
    initial_data = [
        {
            'Brand': 'Toyota',
            'Model': 'Camry',
            'Type': 'Oil Change',
            'Product Name': 'Full Synthetic Oil Change',
            'Before Price': 89.99,
            'After Price': 69.99,
            'Discount Price': 59.99,
            'Link': 'https://example.com/toyota-camry-oil'
        },
        {
            'Brand': 'Honda',
            'Model': 'Civic',
            'Type': 'Brake Service',
            'Product Name': 'Front Brake Pad Replacement',
            'Before Price': 199.99,
            'After Price': 179.99,
            'Discount Price': '',
            'Link': 'https://example.com/honda-civic-brake'
        },
        {
            'Brand': 'Ford',
            'Model': 'F-150',
            'Type': 'Tire Service',
            'Product Name': 'All-Season Tire Installation',
            'Before Price': 299.99,
            'After Price': 249.99,
            'Discount Price': 229.99,
            'Link': 'https://example.com/ford-f150-tire'
        }
    ]
    
    # File 2: Update data (mix of scenarios)
    update_data = [
        # Exact duplicate - should be SKIPPED
        {
            'Brand': 'Toyota',
            'Model': 'Camry',
            'Type': 'Oil Change',
            'Product Name': 'Full Synthetic Oil Change',
            'Before Price': 89.99,
            'After Price': 69.99,
            'Discount Price': 59.99,
            'Link': 'https://example.com/toyota-camry-oil'
        },
        # Updated prices - should be UPDATED
        {
            'Brand': 'Honda',
            'Model': 'Civic',
            'Type': 'Brake Service',
            'Product Name': 'Front Brake Pad Replacement',
            'Before Price': 219.99,  # Was 199.99
            'After Price': 189.99,   # Was 179.99
            'Discount Price': 169.99,  # Was empty
            'Link': 'https://example.com/honda-civic-brake-updated'
        },
        # Different type, same brand/model/product - should be UPDATED
        {
            'Brand': 'Ford',
            'Model': 'F-150',
            'Type': 'Premium Tire Service',  # Changed type
            'Product Name': 'All-Season Tire Installation',
            'Before Price': 329.99,  # Changed price
            'After Price': 279.99,   # Changed price
            'Discount Price': 259.99,  # Changed price
            'Link': 'https://example.com/ford-f150-tire-premium'
        },
        # Completely new record - should be CREATED
        {
            'Brand': 'BMW',
            'Model': '3 Series',
            'Type': 'Engine Service',
            'Product Name': 'Engine Diagnostic & Tune-up',
            'Before Price': 399.99,
            'After Price': 349.99,
            'Discount Price': 319.99,
            'Link': 'https://example.com/bmw-3series-engine'
        },
        # Another new record - should be CREATED
        {
            'Brand': 'Mercedes',
            'Model': 'C-Class',
            'Type': 'Transmission',
            'Product Name': 'Transmission Fluid Change',
            'Before Price': 159.99,
            'After Price': 139.99,
            'Discount Price': '',
            'Link': 'https://example.com/mercedes-c-transmission'
        }
    ]
    
    # Create Excel files
    df1 = pd.DataFrame(initial_data)
    df2 = pd.DataFrame(update_data)
    
    initial_file = 'smart_import_initial.xlsx'
    update_file = 'smart_import_update.xlsx'
    
    df1.to_excel(initial_file, index=False)
    df2.to_excel(update_file, index=False)
    
    print("📁 Created test files for Smart Import demonstration:")
    print(f"   1. {initial_file} - Initial data (3 records)")
    print(f"   2. {update_file} - Update data (5 records)")
    print()
    print("🧪 Test Instructions:")
    print("   1. Import the initial file first - should create 3 new records")
    print("   2. Import the update file second - should:")
    print("      ⏭️ Skip 1 record (Toyota - no changes)")
    print("      🔄 Update 2 records (Honda, Ford - price changes)")
    print("      ✨ Create 2 new records (BMW, Mercedes)")
    print()
    print("📋 Expected Results for Update File:")
    print("   - Total processed: 5 rows")
    print("   - New records: 2 (BMW, Mercedes)")
    print("   - Updated records: 2 (Honda, Ford)")
    print("   - Skipped records: 1 (Toyota)")
    print("   - Final database count: 5 records")
    
    return initial_file, update_file

if __name__ == "__main__":
    print("🚀 Creating Smart Import Test Files")
    print("=" * 60)
    create_test_files()
    print("\n✅ Files created successfully!")
    print("\n💡 You can now use these files to test the Smart Import functionality")
    print("   in either the Django Admin or via the API endpoints.")
