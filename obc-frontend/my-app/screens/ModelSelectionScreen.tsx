import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RouteProp } from '@react-navigation/native';
// import { RootStackParamList } from './HomeScreen';
import { ScreenProps } from '../types/navigation';
import { useCarContext } from '../contexts/CarContext';

type Props = ScreenProps<'ModelSelection'>;

// Define types for brand and model
type Brand =
  | "Maruti Suzuki"
  | "Hyundai"
  | "Mahindra"
  | "Tata"
  | "Honda"
  | "Mercedes Benz"
  | "MG"
  | "Toyota"           
  | "Skoda"
  | "Renault"
  | "Volkswagen"
  | "Isuzu";

type Model = { id: number; name: string; image: string };

const modelsByBrand: Record<Brand, Model[]> = {
  "Maruti Suzuki": [
    { id: 1, name: "Swift", image: "/api/placeholder/60/60" },
    { id: 2, name: "Baleno", image: "/api/placeholder/60/60" },
    { id: 3, name: "Dzire", image: "/api/placeholder/60/60" },
    { id: 4, name: "Brezza", image: "/api/placeholder/60/60" },
  ],
  "Hyundai": [
    { id: 1, name: "i20", image: "/api/placeholder/60/60" },
    { id: 2, name: "Creta", image: "/api/placeholder/60/60" },
    { id: 3, name: "Venue", image: "/api/placeholder/60/60" },
    { id: 4, name: "Verna", image: "/api/placeholder/60/60" },
  ],
  "Mahindra": [
    { id: 1, name: "XUV700", image: "/api/placeholder/60/60" },
    { id: 2, name: "Thar", image: "/api/placeholder/60/60" },
    { id: 3, name: "Scorpio", image: "/api/placeholder/60/60" },
    { id: 4, name: "XUV300", image: "/api/placeholder/60/60" },
  ],
  "Tata": [
    { id: 1, name: "Nexon", image: "/api/placeholder/60/60" },
    { id: 2, name: "Harrier", image: "/api/placeholder/60/60" },
    { id: 3, name: "Safari", image: "/api/placeholder/60/60" },
    { id: 4, name: "Tiago", image: "/api/placeholder/60/60" },
  ],
  "Honda": [
    { id: 1, name: "City", image: "/api/placeholder/60/60" },
    { id: 2, name: "Amaze", image: "/api/placeholder/60/60" },
    { id: 3, name: "WR-V", image: "/api/placeholder/60/60" },
    { id: 4, name: "Jazz", image: "/api/placeholder/60/60" },
  ],
  "Mercedes Benz": [
    { id: 1, name: "A-Class", image: "/api/placeholder/60/60" },
    { id: 2, name: "C-Class", image: "/api/placeholder/60/60" },
    { id: 3, name: "E-Class", image: "/api/placeholder/60/60" },
    { id: 4, name: "GLA", image: "/api/placeholder/60/60" },
  ],
  "MG": [
    { id: 1, name: "Hector", image: "/api/placeholder/60/60" },
    { id: 2, name: "Astor", image: "/api/placeholder/60/60" },
    { id: 3, name: "ZS EV", image: "/api/placeholder/60/60" },
    { id: 4, name: "Gloster", image: "/api/placeholder/60/60" },
  ],
  "Toyota": [
    { id: 1, name: "Innova", image: "/api/placeholder/60/60" },
    { id: 2, name: "Fortuner", image: "/api/placeholder/60/60" },
    { id: 3, name: "Glanza", image: "/api/placeholder/60/60" },
    { id: 4, name: "Urban Cruiser", image: "/api/placeholder/60/60" },
  ],
  "Skoda": [
    { id: 1, name: "Kushaq", image: "/api/placeholder/60/60" },
    { id: 2, name: "Slavia", image: "/api/placeholder/60/60" },
    { id: 3, name: "Octavia", image: "/api/placeholder/60/60" },
    { id: 4, name: "Superb", image: "/api/placeholder/60/60" },
  ],
  "Renault": [
    { id: 1, name: "Kwid", image: "/api/placeholder/60/60" },
    { id: 2, name: "Triber", image: "/api/placeholder/60/60" },
    { id: 3, name: "Kiger", image: "/api/placeholder/60/60" },
     { id: 4, name: "Duster", image: "/api/placeholder/60/60" },
  ],
  "Volkswagen": [
    { id: 1, name: "Taigun", image: "/api/placeholder/60/60" },
    { id: 2, name: "Virtus", image: "/api/placeholder/60/60" },
    { id: 3, name: "Polo", image: "/api/placeholder/60/60" },
    { id: 4, name: "Vento", image: "/api/placeholder/60/60" },
  ],
  "Isuzu": [
    { id: 1, name: "D-Max", image: "/api/placeholder/60/60" },
    { id: 2, name: "MU-X", image: "/api/placeholder/60/60" },
    { id: 3, name: "V-Cross", image: "/api/placeholder/60/60" },
    { id: 4, name: "Hi-Lander", image: "/api/placeholder/60/60" },
  ]
};
    
export default function ModelSelectionScreen({ navigation, route }: Props) {
  const { selectedCity, selectedBrand, brandLogo } = route.params;
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const { dispatch } = useCarContext();

  // Get models for the selected brand
const models = modelsByBrand[selectedBrand as Brand] || [];

  const handleModelSelect = (model: any) => {
    setSelectedModelId(model.id);
    
    // Update CarContext with selected model
    dispatch({ type: 'SET_MODEL', payload: { model: model.name, image: model.image } });
    
    navigation.navigate('FuelSelection', {
      selectedCity,
      selectedBrand,
      brandLogo,
      selectedModel: model.name,
      modelImage: model.image
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
        {/* Brand Step (completed) */}
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, { backgroundColor: '#4caf50' }]}>
            <Text style={styles.stepCircleText}>✓</Text>
          </View>
          <Text style={styles.stepLabelCompleted}>Brand</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: '#4caf50' }]} />
        {/* Model Step (active) */}
        <View style={styles.stepItem}>
          <View style={[styles.stepCircle, { backgroundColor: '#e53935' }]}>
            <Text style={styles.stepCircleText}>2</Text>
          </View>
          <Text style={styles.stepLabelActive}>Model</Text>
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

      {/* Selection info */}
      <View style={styles.selectionInfo}>
        {selectedCity && (
          <Text style={styles.infoText}>Selected City: {selectedCity}</Text>
        )}
        <View style={styles.brandInfo}>
          <Image source={{ uri: brandLogo }} style={styles.brandLogoSmall} />
          <Text style={styles.infoText}>Selected Brand: {selectedBrand}</Text>
        </View>
      </View>

      {/* Models Grid */}
      <ScrollView contentContainerStyle={styles.grid}>
        {models.map((model) => (
          <TouchableOpacity
            key={model.id}
            style={[
              styles.modelBox,
              selectedModelId === model.id && styles.selectedModelBox
            ]}
            onPress={() => handleModelSelect(model)}
            activeOpacity={0.8}
          >
            <View style={styles.modelImageWrapper}>
              <Image
                source={{ uri: model.image }}
                style={styles.modelImage}
              />
            </View>
            <Text style={styles.modelName}>{model.name}</Text>
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
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoSmall: {
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
  modelBox: {
    width: '28%',
    margin: '2%',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    backgroundColor: '#fafafa'
  },
  selectedModelBox: {
    borderColor: '#e53935',
    backgroundColor: '#ffeaea'
  },
  modelImageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6
  },
  modelImage: { width: 40, height: 40, borderRadius: 8 },
  modelName: { fontSize: 13, color: '#333', textAlign: 'center' }
});