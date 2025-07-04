"""
Script to generate a sample Excel file for ServicePrice import testing.
Run this script to create sample_service_prices.xlsx for testing the import functionality.
"""

import pandas as pd
import os

def create_sample_excel():
    # Sample data for testing
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
        },
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
    
    # Create DataFrame
    df = pd.DataFrame(sample_data)
    
    # Save to Excel file
    filename = 'sample_service_prices.xlsx'
    df.to_excel(filename, index=False, engine='openpyxl')
    
    print(f"Sample Excel file created: {filename}")
    print(f"File location: {os.path.abspath(filename)}")
    print("\nColumn structure:")
    for col in df.columns:
        print(f"  - {col}")
    
    return filename

if __name__ == "__main__":
    create_sample_excel()
