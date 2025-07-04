import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './HomeScreen';
import { useCarContext } from '../contexts/CarContext';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'BrandSelection'>;
  route: RouteProp<RootStackParamList, 'BrandSelection'>;
};


const brands = [
  { id: 1, name: "Aston Martin", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-17.jpeg" },
  { id: 2, name: "Audi", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/audi-logo.jpg" },
  { id: 3, name: "Bentley", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-19.jpeg" },
  { id: 4, name: "BMW", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-20.jpeg" },
  { id: 5, name: "Citroen", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-43.png" },
  { id: 6, name: "Ferrari", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-21.jpeg" },
  { id: 7, name: "Hummer", logo: "https://onlybigcars.com/wp-content/uploads/2025/05/HUMMER.jpeg" },
  { id: 8, name: "Jaguar", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-22.jpeg" },
  { id: 9, name: "Lamborghini", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-23.jpeg" },
  { id: 10, name: "Land Rover", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-24.jpeg" },
  { id: 11, name: "Lexus", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-42.jpeg" },
  { id: 12, name: "Maserati", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-25.jpeg" },
  { id: 13, name: "Mercedes", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-26.jpeg" },
  { id: 14, name: "Mini", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-27.jpeg" },
  { id: 15, name: "Porsche", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-28.jpeg" },
  { id: 16, name: "Rolls Royce", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/11/brand-29.jpeg" },
  { id: 17, name: "Volvo", logo: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/vol.jpeg" },
  { id: 18, name: "Toyota", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/brand-15.jpeg" },
  { id: 19, name: "Kia", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/brand-38-1.jpeg" },
  { id: 20, name: "Jeep", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/brand-34-1.jpeg" },
  { id: 21, name: "Mahindra", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/brand-8.jpeg" },
  { id: 22, name: "Skoda", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/brand-13.jpeg" },
  { id: 23, name: "Volkswagen", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/brand-16.jpeg" },
  { id: 24, name: "Isuzu", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/brand-32.jpeg" },
  { id: 25, name: "DC", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/DC.jpeg" },
  { id: 26, name: "Honda", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/02/honda-logo.jpeg" },
  { id: 27, name: "Ford", logo: "https://onlybigcars.com/latest/wp-content/uploads/2025/01/brand-5.jpeg" },
  
];



export default function BrandSelectionScreen({ navigation, route }: Props) {
  const selectedCity = route.params?.selectedCity;
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const { dispatch } = useCarContext();

  const handleBrandSelect = (brand: typeof brands[0]) => {
    setSelectedBrandId(brand.id);
    
    // Update CarContext with selected brand
    dispatch({ type: 'SET_BRAND', payload: { brand: brand.name, logo: brand.logo } });
    
    // Changed to navigate to ModelSelection instead of Detail
    navigation.navigate('ModelSelection', {
      selectedCity,
      selectedBrand: brand.name,
      brandLogo: brand.logo
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Add new car</Text>
      </View>

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        {/* Brand Step (active) */}
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, { backgroundColor: '#e53935' }]}>
            <Text style={styles.stepCircleText}>1</Text>
          </View>
          <Text style={styles.stepLabelActive}>Brand</Text>
        </View>
        <View style={styles.stepLine} />
        {/* Model Step (inactive) */}
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, { backgroundColor: '#f0f0f0' }]}>
            <Text style={styles.stepCircleTextInactive}>2</Text>
          </View>
          <Text style={styles.stepLabelInactive}>Model</Text>
        </View>
        <View style={styles.stepLine} />
        {/* Fuel Step (inactive) */}
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, { backgroundColor: '#f0f0f0' }]}>
            <Text style={styles.stepCircleTextInactive}>3</Text>
          </View>
          <Text style={styles.stepLabelInactive}>Fuel</Text>
        </View>
      </View>

      {/* City info */}
      {selectedCity && (
        <Text style={styles.cityText}>Selected City: {selectedCity}</Text>
      )}

      {/* Brands Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.id}
            style={[
              styles.brandBox,
              selectedBrandId === brand.id && styles.selectedBrandBox
            ]}
            onPress={() => handleBrandSelect(brand)}
            activeOpacity={0.8}
          >
            <View style={styles.brandImageWrapper}>
              <Image
                source={{ uri: brand.logo }}
                style={styles.brandImage}
              />
            </View>
            <Text style={styles.brandName}>{brand.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 0 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginLeft: 0
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
    marginHorizontal: 16
  },
  stepItem: {
    alignItems: 'center',
    width: 60
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4
  },
  stepCircleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  stepCircleTextInactive: {
    color: '#bbb',
    fontWeight: 'bold',
    fontSize: 16
  },
  stepLabelActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#e53935'
  },
  stepLabelInactive: {
    fontSize: 12,
    color: '#bbb'
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#eee',
    marginHorizontal: 2
  },
  cityText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    alignSelf: 'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingBottom: 24
  },
  brandBox: {
    width: '28%',
    margin: '2%',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    backgroundColor: '#fafafa'
  },
  selectedBrandBox: {
    borderColor: '#e53935',
    backgroundColor: '#ffeaea'
  },
  brandImageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
  },
  brandImage: { width: 40, height: 40, borderRadius: 8 },
  brandName: { fontSize: 13, color: '#333', textAlign: 'center' }
});