import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScreenProps } from '../types/navigation';
import { useCarContext } from '../contexts/CarContext';
// import axios from 'axios';

type Props = ScreenProps<'FuelSelection'>;
// import { RootStackParamList } from './HomeScreen';
// import axios from 'axios';

// type Props = {
//   navigation: StackNavigationProp<RootStackParamList, 'FuelSelection'>;
//   route: RouteProp<RootStackParamList, 'FuelSelection'>;
// };

const fuelTypes = [
  { id: 1, name: "Petrol", image: "/api/placeholder/60/60" },
  { id: 2, name: "Diesel", image: "/api/placeholder/60/60" },
  { id: 3, name: "CNG", image: "/api/placeholder/60/60" },
  { id: 4, name: "Electric", image: "/api/placeholder/60/60" },
  { id: 5, name: "Hybrid", image: "/api/placeholder/60/60" },
  { id: 6, name: "LPG", image: "/api/placeholder/60/60" }
];

export default function FuelSelectionScreen({ navigation, route }: Props) {
  const { selectedCity, selectedBrand, brandLogo, selectedModel, modelImage } = route.params;
  const [selectedFuelId, setSelectedFuelId] = useState<number | null>(null);
  const { setCompleteCarData } = useCarContext();

  const handleFuelSelect = (fuel: typeof fuelTypes[0]) => {
    setSelectedFuelId(fuel.id);
  };

  const handleSubmit = async () => {
    if (selectedFuelId == null) {
      Alert.alert('Please select a fuel type');
      return;
    }
    const selectedFuel = fuelTypes.find(f => f.id === selectedFuelId);
    const payload = {
      selectedCity,
      selectedBrand,
      brandLogo,
      selectedModel,
      modelImage,
      selectedFuel: selectedFuel?.name,
      fuelImage: selectedFuel?.image
    };
    try {
      // Update car context with complete selection in a single dispatch
      setCompleteCarData({
        selectedCity,
        selectedBrand,
        brandLogo,
        selectedModel,
        modelImage,
        selectedFuel: selectedFuel?.name || '',
        fuelImage: selectedFuel?.image || ''
      });
      
      // Save individual items for backward compatibility
      await AsyncStorage.setItem('selectedBrand', selectedBrand);
      await AsyncStorage.setItem('selectedModel', selectedModel);
      await AsyncStorage.setItem('selectedFuel', selectedFuel?.name || '');
      console.log('Car details saved to AsyncStorage for pricing:', {
        brand: selectedBrand,
        model: selectedModel,
        fuel: selectedFuel?.name
      });
      
      // await axios.post('http://192.168.9.208:8000/api/', payload); // Change URL if needed
      navigation.navigate('HomePage');
    } catch (e) {
      console.error('Failed to save car details:', e);
      Alert.alert('Failed to submit data');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Add new car</Text>
      </View>

      {/* Stepper */}
      <View style={styles.stepperContainer}>
        {/* Brand Step (completed) */}
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, { backgroundColor: '#4caf50' }]}>
            <Text style={styles.stepCircleText}>✓</Text>
          </View>
          <Text style={styles.stepLabelCompleted}>Brand</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: '#4caf50' }]} />
        {/* Model Step (completed) */}
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, { backgroundColor: '#4caf50' }]}>
            <Text style={styles.stepCircleText}>✓</Text>
          </View>
          <Text style={styles.stepLabelCompleted}>Model</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: '#4caf50' }]} />
        {/* Fuel Step (active) */}
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, { backgroundColor: '#e53935' }]}>
            <Text style={styles.stepCircleText}>3</Text>
          </View>
          <Text style={styles.stepLabelActive}>Fuel</Text>
        </View>
      </View>

      {/* Selection info */}
      <View style={styles.selectionInfo}>
        {selectedCity && (
          <Text style={styles.infoText}>Selected City: {selectedCity}</Text>
        )}
        <View style={styles.selectionRow}>
          <Image source={{ uri: brandLogo }} style={styles.infoIcon} />
          <Text style={styles.infoText}>Brand: {selectedBrand}</Text>
        </View>
        <View style={styles.selectionRow}>
          <Image source={{ uri: modelImage }} style={styles.infoIcon} />
          <Text style={styles.infoText}>Model: {selectedModel}</Text>
        </View>
      </View>

      {/* Fuel Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {fuelTypes.map((fuel) => (
          <TouchableOpacity
            key={fuel.id}
            style={[
              styles.fuelBox,
              selectedFuelId === fuel.id && styles.selectedFuelBox
            ]}
            onPress={() => handleFuelSelect(fuel)}
            activeOpacity={0.8}
          >
            <View style={styles.fuelImageWrapper}>
              <Image
                source={{ uri: fuel.image }}
                style={styles.fuelImage}
              />
            </View>
            <Text style={styles.fuelName}>{fuel.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Submit Button */}
      {selectedFuelId !== null && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      )}
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
  stepLabelActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#e53935'
  },
  stepLabelCompleted: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4caf50'
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#eee',
    marginHorizontal: 2
  },
  selectionInfo: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e53935'
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 12
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingBottom: 24
  },
  fuelBox: {
    width: '28%',
    margin: '2%',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    backgroundColor: '#fafafa'
  },
  selectedFuelBox: {
    borderColor: '#e53935',
    backgroundColor: '#ffeaea'
  },
  fuelImageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
  },
  fuelImage: { width: 40, height: 40, borderRadius: 8 },
  fuelName: { fontSize: 13, color: '#333', textAlign: 'center' },
  submitButton: {
    backgroundColor: '#e53935',
    margin: 16,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});