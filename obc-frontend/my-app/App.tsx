import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import OTPScreen from './OTPScreen.js';
import HomeScreen from './homePage'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={OTPScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Uncomment the following lines to add more screens */}
        {/* <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} /> */}
        {/* Add more screens here as you build your app */}
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        {/* <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} /> */}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}