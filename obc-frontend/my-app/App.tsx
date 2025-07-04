import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import OTPScreen from './screens/OTPScreen.js'; 
import HomePageScreen from './screens/homePage'; 
import CitySelectionScreen from './screens/CitySelectionScreen';
import BrandSelectionScreen from './screens/BrandSelectionScreen';
import ModelSelectionScreen from './screens/ModelSelectionScreen';
import FuelSelectionScreen from './screens/FuelSelectionScreen';
import HomeScreen from './screens/HomeScreen'; // Import HomeScreen

// Import the navigation types
import { RootStackParamList } from './types/navigation';
import MembershipDetailsScreen from './screens/MembershipDetailsScreen';
import AccountScreen from './screens/AccountScreen';
import ProductScreen from './screens/ProductScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';

// Import CarProvider for global car state management
import { CarProvider } from './contexts/CarContext';

// Add the type to createStackNavigator
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <CarProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={OTPScreen} />
          <Stack.Screen name="HomePage" component={HomePageScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CitySelection" component={CitySelectionScreen} />
          <Stack.Screen name="BrandSelection" component={BrandSelectionScreen} />
          <Stack.Screen name="ModelSelection" component={ModelSelectionScreen} />
          <Stack.Screen name="FuelSelection" component={FuelSelectionScreen} />
          <Stack.Screen name="MembershipDetails" component={MembershipDetailsScreen} />
          <Stack.Screen name="Account" component={AccountScreen}/>
          <Stack.Screen name='ProductScreen' component ={ProductScreen}/>
          <Stack.Screen name="ServiceDetailScreen" component={ServiceDetailScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </CarProvider>
  );
}