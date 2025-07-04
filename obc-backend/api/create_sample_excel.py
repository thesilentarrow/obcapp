#!/usr/bin/env python3
"""
Generate a sample Excel file for testing the ServicePrice import functionality.
This script creates a sample Excel file with service pricing data.
"""

import pandas as pd
import os

def create_sample_excel():
    """Create a sample Excel file with ServicePrice data."""
    
    # Sample data
    sample_data = [
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
            'Discount Price': '',  # Empty value to test handling
            'Link': 'https://example.com/honda-civic-brakes'
        },
        {
            'Brand': 'Ford',
            'Model': 'F-150',
            'Type': 'Tire Service',
            'Product Name': 'Tire Rotation and Balance',
            'Before Price': 79.99,
            'After Price': 59.99,
            'Discount Price': 49.99,
            'Link': ''  # Empty link to test handling
        },
        {
            'Brand': 'BMW',
            'Model': '3 Series',
            'Type': 'Maintenance',
            'Product Name': 'Basic Maintenance Package',
            'Before Price': 299.99,
            'After Price': 249.99,
            'Discount Price': 199.99,
            'Link': 'https://example.com/bmw-maintenance'
        },
        {
            'Brand': 'Mercedes',
            'Model': 'C-Class',
            'Type': 'Engine Service',
            'Product Name': 'Engine Diagnostic and Tune-up',
            'Before Price': 349.99,
            'After Price': 299.99,
            'Discount Price': 279.99,
            'Link': 'https://example.com/mercedes-engine-service'
        }
    ]
    
    # Create DataFrame
    df = pd.DataFrame(sample_data)
    
    # Save to Excel file
    filename = 'sample_service_prices.xlsx'
    df.to_excel(filename, index=False, sheet_name='Service Prices')
    
    print(f"✅ Sample Excel file created: {filename}")
    print(f"📍 File location: {os.path.abspath(filename)}")
    print(f"📊 Contains {len(sample_data)} sample records")
    
    # Display the data
    print("\n📋 Sample data preview:")
    print(df.to_string(index=False))
    
    return filename

if __name__ == '__main__':
    create_sample_excel()
