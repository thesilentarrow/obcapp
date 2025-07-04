import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the car selection state
export interface CarState {
  selectedCity?: string;
  selectedBrand?: string;
  brandLogo?: string;
  selectedModel?: string;
  modelImage?: string;
  selectedFuel?: string;
  fuelImage?: string;
  hasCompletedSelection: boolean;
}

// Define actions for the car context
type CarAction =
  | { type: 'SET_CITY'; payload: string }
  | { type: 'SET_BRAND'; payload: { brand: string; logo: string } }
  | { type: 'SET_MODEL'; payload: { model: string; image: string } }
  | { type: 'SET_FUEL'; payload: { fuel: string; image: string } }
  | { type: 'SET_COMPLETE_CAR_DATA'; payload: Partial<CarState> }
  | { type: 'LOAD_FROM_STORAGE'; payload: CarState }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'MARK_COMPLETE' }
  | { type: 'RESET_COMPLETION' };

// Initial state
const initialState: CarState = {
  hasCompletedSelection: false,
};

// Reducer function
const carReducer = (state: CarState, action: CarAction): CarState => {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, selectedCity: action.payload };
    case 'SET_BRAND':
      return { 
        ...state, 
        selectedBrand: action.payload.brand, 
        brandLogo: action.payload.logo 
      };
    case 'SET_MODEL':
      return { 
        ...state, 
        selectedModel: action.payload.model, 
        modelImage: action.payload.image 
      };
    case 'SET_FUEL':
      return { 
        ...state, 
        selectedFuel: action.payload.fuel, 
        fuelImage: action.payload.image,
        hasCompletedSelection: true 
      };
    case 'SET_COMPLETE_CAR_DATA':
      return { 
        ...state, 
        ...action.payload,
        hasCompletedSelection: true 
      };
    case 'LOAD_FROM_STORAGE':
      return { ...action.payload };
    case 'CLEAR_SELECTION':
      return { ...initialState };
    case 'MARK_COMPLETE':
      return { ...state, hasCompletedSelection: true };
    case 'RESET_COMPLETION':
      return { ...state, hasCompletedSelection: false };
    default:
      return state;
  }
};

// Context type
interface CarContextType {
  state: CarState;
  dispatch: React.Dispatch<CarAction>;
  saveCarSelection: () => Promise<void>;
  loadCarSelection: () => Promise<void>;
  clearCarSelection: () => Promise<void>;
  hasSelectedCar: () => boolean;
  getCarDisplayText: () => string;
  setCompleteCarData: (carData: {
    selectedCity: string;
    selectedBrand: string;
    brandLogo: string;
    selectedModel: string;
    modelImage: string;
    selectedFuel: string;
    fuelImage: string;
  }) => void;
}

// Create context
const CarContext = createContext<CarContextType | undefined>(undefined);

// Provider component
export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(carReducer, initialState);

  // Load car selection from AsyncStorage on mount
  useEffect(() => {
    loadCarSelection();
  }, []);

  // Save current state to AsyncStorage whenever it changes
  useEffect(() => {
    if (state.hasCompletedSelection) {
      saveCarSelection();
    }
  }, [state]);

  const saveCarSelection = async () => {
    try {
      // Save individual items for backward compatibility
      if (state.selectedBrand) {
        await AsyncStorage.setItem('selectedBrand', state.selectedBrand);
      }
      if (state.selectedModel) {
        await AsyncStorage.setItem('selectedModel', state.selectedModel);
      }
      if (state.selectedFuel) {
        await AsyncStorage.setItem('selectedFuel', state.selectedFuel);
      }
      if (state.selectedCity) {
        await AsyncStorage.setItem('userSelectedCity', state.selectedCity);
      }

      // Save complete car context as JSON
      await AsyncStorage.setItem('carContext', JSON.stringify(state));
      
      console.log('Car selection saved to AsyncStorage:', state);
    } catch (error) {
      console.error('Failed to save car selection:', error);
    }
  };

  const loadCarSelection = async () => {
    try {
      // Try to load complete context first
      const carContextJson = await AsyncStorage.getItem('carContext');
      if (carContextJson) {
        const carContext = JSON.parse(carContextJson);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: carContext });
        return;
      }

      // Fallback to individual items for backward compatibility
      const brand = await AsyncStorage.getItem('selectedBrand');
      const model = await AsyncStorage.getItem('selectedModel');
      const fuel = await AsyncStorage.getItem('selectedFuel');
      const city = await AsyncStorage.getItem('userSelectedCity');

      if (brand || model || fuel || city) {
        const loadedState: CarState = {
          selectedBrand: brand || undefined,
          selectedModel: model || undefined,
          selectedFuel: fuel || undefined,
          selectedCity: city || undefined,
          hasCompletedSelection: !!(brand && model && fuel),
        };
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: loadedState });
      }
    } catch (error) {
      console.error('Failed to load car selection:', error);
    }
  };

  const clearCarSelection = async () => {
    try {
      await AsyncStorage.multiRemove([
        'selectedBrand',
        'selectedModel',
        'selectedFuel',
        'carContext'
      ]);
      dispatch({ type: 'CLEAR_SELECTION' });
      console.log('Car selection cleared');
    } catch (error) {
      console.error('Failed to clear car selection:', error);
    }
  };

  const hasSelectedCar = () => {
    return !!(state.selectedBrand && state.selectedModel);
  };

  const getCarDisplayText = () => {
    if (state.selectedBrand && state.selectedModel) {
      return `${state.selectedBrand} ${state.selectedModel}`;
    } else if (state.selectedBrand) {
      return state.selectedBrand;
    } else {
      return 'Select Your Car';
    }
  };

  const setCompleteCarData = (carData: {
    selectedCity: string;
    selectedBrand: string;
    brandLogo: string;
    selectedModel: string;
    modelImage: string;
    selectedFuel: string;
    fuelImage: string;
  }) => {
    dispatch({ 
      type: 'SET_COMPLETE_CAR_DATA', 
      payload: carData 
    });
  };

  const contextValue: CarContextType = {
    state,
    dispatch,
    saveCarSelection,
    loadCarSelection,
    clearCarSelection,
    hasSelectedCar,
    getCarDisplayText,
    setCompleteCarData,
  };

  return (
    <CarContext.Provider value={contextValue}>
      {children}
    </CarContext.Provider>
  );
};

// Custom hook to use the car context
export const useCarContext = (): CarContextType => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};

// Helper hook for getting car info for API calls
export const useCarForPricing = () => {
  const { state } = useCarContext();
  
  return {
    brand: state.selectedBrand,
    model: state.selectedModel,
    fuel: state.selectedFuel,
    city: state.selectedCity,
    hasCarDetails: !!(state.selectedBrand && state.selectedModel),
    hasCompleteDetails: !!(state.selectedBrand && state.selectedModel && state.selectedFuel),
    // Helper function to build query params for API calls
    buildQueryParams: () => {
      const params = new URLSearchParams();
      if (state.selectedBrand) params.append('brand', state.selectedBrand);
      if (state.selectedModel) params.append('model', state.selectedModel);
      if (state.selectedFuel) params.append('fuel', state.selectedFuel);
      if (state.selectedCity) params.append('city', state.selectedCity);
      return params.toString();
    },
    // Helper function to get pricing context for display
    getPricingContext: () => {
      if (state.selectedBrand && state.selectedModel) {
        return `${state.selectedBrand} ${state.selectedModel}${state.selectedFuel ? ` (${state.selectedFuel})` : ''}`;
      }
      return null;
    }
  };
};
