import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from './HomeScreen'; // Using centralized type below
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useCarContext } from '../contexts/CarContext';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'CitySelection'>; // Corrected Prop type
};

const cities = [
  { name: "Gurugram", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/building-1.png" },
  { name: "Delhi", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-16-e1733222735926.jpeg" },
  { name: "Faridabad", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/the-taj-mahal-in-india-free-vector.jpg" },
  { name: "Ghaziabad", image: "https://onlybigcars.com/latest/wp-content/uploads/2025/04/urban-scaled.jpg" },
  { name: "Rohtak", image: "https://onlybigcars.com/latest/wp-content/uploads/2025/04/city-scaled.jpg" },
  { name: "Noida", image: "https://onlybigcars.com/latest/wp-content/uploads/2025/04/noida_city-e1743486704534.jpg" },
  { name: "Kanpur", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/kanpur.jpg" },
  { name: "Dehradun", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/istockphoto-1413469691-612x612-1.jpg" },
  { name: "Chandigarh", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/chandigarh.jpg" },
  { name: "Bangalore", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-8-e1733222318753.jpeg" },
  { name: "Jaipur", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-9-e1733222396551.jpeg" },
  { name: "Lucknow", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-5-e1733221488547.jpeg" },
  { name: "Chennai", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-12-e1733222549440.jpeg" },
  { name: "Kolkata", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-10-e1733222620526.jpeg" },
  { name: "Mumbai", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-11-e1733222583292.jpeg" },
  { name: "Hyderabad", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-13-e1733222489379.jpeg" },
  { name: "Pune", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-7-e1733222111878.jpeg" },
  { name: "Ahmedabad", image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/10-City-Monument-Icons-Sketch-Freebie-4-e1733221309770.jpeg" }
];

export default function CitySelectionScreen({ navigation }: Props) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const { dispatch } = useCarContext();

  const handleContinue = async () => {
    if (!selectedCity) {
      Alert.alert('Please select a city');
      return;
    }
    try {
      await AsyncStorage.setItem('userSelectedCity', selectedCity);
      console.log('City saved to AsyncStorage:', selectedCity);
      
      // Update CarContext with selected city
      dispatch({ type: 'SET_CITY', payload: selectedCity });
      
      // Navigate to BrandSelection after selecting and saving city
      // Replace current screen in stack so user doesn't go back to city selection
      navigation.navigate('BrandSelection', { selectedCity }); 
    } catch (error) {
      console.error('Failed to save city to AsyncStorage', error);
      Alert.alert('Error', 'Could not save city selection. Please try again.');
    }
  };

  
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Please select your city</Text> */}
      <ScrollView contentContainerStyle={styles.grid}>
        {cities.map(city => (
          <TouchableOpacity
            key={city.name}
            style={[
              styles.cityBox,
              selectedCity === city.name && styles.selectedCityBox
            ]}
            onPress={() => setSelectedCity(city.name)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: city.image }}
              style={styles.cityImage}
            />
            <Text style={styles.cityName}>{city.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, alignSelf: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  cityBox: {
    width: '28%',
    margin: '2%',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    backgroundColor: '#fafafa'
  },
  selectedCityBox: {
    borderColor: '#1E90FF',
    backgroundColor: '#e6f0ff'
  },
  cityImage: { width: 80, height: 60, borderRadius: 8 },
  cityName: { marginTop: 8, fontSize: 14, color: '#333' },
  continueButton: {
    backgroundColor: '#e53935',
    margin: 16,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center'
  },
  continueText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});