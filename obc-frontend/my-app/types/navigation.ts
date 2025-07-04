import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ServiceData } from '../screens/ProductScreen'; // Adjust the import path as needed

export type RootStackParamList = {
  // Auth screens
  Login: undefined;
  
  // Main screens
  HomePage: undefined;
  Home: undefined;
  MembershipDetails: undefined;
  
  // Service screens
  Account: undefined;
  Store: undefined;
  SOS: undefined;
  Contact: undefined;
  ServiceDetails: { serviceId: string };
  ProductScreen: { 
    categorySlug: string; 
    categoryName: string; 
  };
  ServiceDetailScreen:{service:ServiceData};
  
  // Selection screens
  CitySelection: undefined;
  BrandSelection: { selectedCity: string };
  ModelSelection: { 
    selectedCity: string; 
    selectedBrand: string;
    brandLogo: string;
  };
  FuelSelection: { 
    selectedCity: string;
    selectedBrand: string;
    brandLogo: string;
    selectedModel: string;
    modelImage: string;
  };
};

// Helper types for components
export type ScreenNavigationProp<T extends keyof RootStackParamList> = 
  StackNavigationProp<RootStackParamList, T>;

export type ScreenRouteProp<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: ScreenNavigationProp<T>;
  route: ScreenRouteProp<T>;
};