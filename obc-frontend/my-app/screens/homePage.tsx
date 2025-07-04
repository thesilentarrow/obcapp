import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

// If needed, add this import
import { RootStackParamList } from '../types/navigation';
import type {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; //for checkig login status
import { useCarContext } from '../contexts/CarContext';
import MembershipDetailsScreen from './MembershipDetailsScreen'; // Import the MembershipCard component
// Define the app's navigation param types
// type RootStackParamList = {
//   Home: undefined;
//   Account: undefined;
//   Store: undefined;
//   SOS: undefined;
//   Contact: undefined;
//   ServiceDetails: { serviceId: string };
// };

const Stack = createStackNavigator<RootStackParamList>();

import { NavigationProp, useIsFocused } from '@react-navigation/native';

type MembershipCardProps = {
  navigation: NavigationProp<RootStackParamList>;
}

export const handleLogout = async(navigation:NavigationProp<RootStackParamList>)=>{
  try{
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userPhoneNumber');
    console.log('User logged out successfully');

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  }catch(e){
    console.error('Logout Error:', e);
  }
}

const MembershipCard = ({navigation}:MembershipCardProps) => {
  const handleJoinNow =()=>{
    navigation.navigate('MembershipDetails');
  }
  return (
    <View style={membershipStyles.membershipContainer}>
      <View style={membershipStyles.membershipCard}>
        {/* Background gradient effect using overlays */}
        <View style={membershipStyles.membershipBackground} />
        <View style={membershipStyles.membershipGradientOverlay} />
        
        {/* Decorative elements */}
        <View style={membershipStyles.decorativeCircle1} />
        <View style={membershipStyles.decorativeCircle2} />
        <View style={membershipStyles.decorativeCircle3} />
        
        <View style={membershipStyles.membershipContent}>
          {/* Header Section */}
          <View style={membershipStyles.membershipHeader}>
            <View style={membershipStyles.crownIconContainer}>
              <Svg height="24" width="24" viewBox="0 0 24 24">
                <Path
                  fill="#FFD700"
                  d="M5 16L3 12.5L5.5 11L7.5 13L12 8L16.5 13L18.5 11L21 12.5L19 16H5ZM7 18H17V20H7V18Z"
                />
              </Svg>
            </View>
            <Text style={membershipStyles.membershipTitle}>Premium Membership</Text>
            <Text style={membershipStyles.membershipSubtitle}>Unlock Exclusive Benefits</Text>
          </View>
          
          {/* Benefits Section */}
          <View style={membershipStyles.benefitsContainer}>
            <View style={membershipStyles.benefitItem}>
              <View style={membershipStyles.benefitIcon}>
                <Svg height="16" width="16" viewBox="0 0 24 24">
                  <Path
                    fill="#FFFFFF"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </Svg>
              </View>
              <Text style={membershipStyles.benefitText}>Priority Service Booking</Text>
            </View>
            
            <View style={membershipStyles.benefitItem}>
              <View style={membershipStyles.benefitIcon}>
                <Svg height="16" width="16" viewBox="0 0 24 24">
                  <Path
                    fill="#FFFFFF"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </Svg>
              </View>
              <Text style={membershipStyles.benefitText}>Up to 25% Discount</Text>
            </View>
            
            <View style={membershipStyles.benefitItem}>
              <View style={membershipStyles.benefitIcon}>
                <Svg height="16" width="16" viewBox="0 0 24 24">
                  <Path
                    fill="#FFFFFF"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </Svg>
              </View>
              <Text style={membershipStyles.benefitText}>Free Home Pickup & Drop</Text>
            </View>
          </View>
          
          {/* CTA Section */}
          <View style={membershipStyles.ctaContainer}>
            <TouchableOpacity style={membershipStyles.membershipButton} onPress={handleJoinNow}>
              <Text style={membershipStyles.membershipButtonText}>Join Now</Text>
              <Svg height="16" width="16" viewBox="0 0 24 24" style={membershipStyles.arrowIcon}>
                <Path
                  fill="#B71C1C"
                  d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
                />
              </Svg>
            </TouchableOpacity>
            
            <View style={membershipStyles.priceContainer}>
              <Text style={membershipStyles.priceText}>Starting from</Text>
              <Text style={membershipStyles.priceAmount}>₹999<Text style={membershipStyles.priceUnit}>/year</Text></Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const membershipStyles = StyleSheet.create({
  membershipContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  membershipCard: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 200,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  membershipBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E53935',
  },
  membershipGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(183, 28, 28, 0.8)',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: '50%',
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  membershipContent: {
    position: 'relative',
    zIndex: 1,
    padding: 20,
  },
  membershipHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  crownIconContainer: {
    marginBottom: 8,
  },
  membershipTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  membershipSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  benefitsContainer: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membershipButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  membershipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B71C1C',
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  priceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: 'normal',
  },
});


// SVG Components for icons
const LocationIcon = () => (
  <Svg height="20" width="20" viewBox="0 0 24 24">
    <Path
      fill="#E53935"
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
    />
  </Svg>
);

const SearchIcon = () => (
  <Svg height="20" width="20" viewBox="0 0 24 24">
    <Path
      fill="#9E9E9E"
      d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
    />
  </Svg>
);

const HomeIcon = () => (
  <Svg height="22" width="22" viewBox="0 0 24 24">
    <Path
      fill="#E53935"
      d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
    />
  </Svg>
);

const AccountIcon = () => (
  <Svg height="22" width="22" viewBox="0 0 24 24">
    <Path
      fill="#757575"
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    />
  </Svg>
);

const StoreIcon = () => (
  <Svg height="22" width="22" viewBox="0 0 24 24">
    <Path
      fill="#757575"
      d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"
    />
  </Svg>
);

const SOSIcon = () => (
  <Svg height="22" width="22" viewBox="0 0 24 24">
    <Path
      fill="#757575"
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H15v-1.5h-2.5V16H11v-1.5H8.5V13H11v-1.5h1.5V13H15v1.5h1.5V16z"
    />
  </Svg>
);

const ContactIcon = () => (
  <Svg height="22" width="22" viewBox="0 0 24 24">
    <Path
      fill="#757575"
      d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
    />
  </Svg>
);

// Import required components from react-native-svg
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';


// Service Icon Components
const PeriodicServiceIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 30 30">
    <Circle cx="15" cy="15" r="12" fill="#FFE0E0" />
    <Path
      fill="#E53935"
      d="M6,9.3L3.9,5.8l1.4-1.4l3.5,2.1v1.4l3.6,3.6c0,0.1,0,0.2,0,0.3L11.1,13L7.4,9.3H6z M21,17.8c-0.3,0-0.5,0-0.8,0 c0,0,0,0,0,0c-0.7,0-1.3-0.1-1.9-0.2l-2.1,2.4l4.7,5.3c1.1,1.2,3,1.3,4.1,0.1c1.2-1.2,1.1-3-0.1-4.1L21,17.8z M24.4,14 c1.6-1.6,2.1-4,1.5-6.1c-0.1-0.4-0.6-0.5-0.8-0.2l-3.5,3.5l-2.8-2.8l3.5-3.5c0.3-0.3,0.2-0.7-0.2-0.8C20,3.4,17.6,3.9,16,5.6 c-1.8,1.8-2.2,4.6-1.2,6.8l-10,8.9c-1.2,1.1-1.3,3-0.1,4.1l0,0c1.2,1.2,3,1.1,4.1-0.1l8.9-10C19.9,16.3,22.6,15.9,24.4,14z"
    />
  </Svg>
);

const ACServiceIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#FFE0E0" />
    <Path
      fill="#E53935"
      d="M22,11h-4.17l3.24-3.24l-1.41-1.41L15,11h-2V9l4.66-4.66l-1.42-1.41L13,6.17V2h-2v4.17L7.76,2.93L6.34,4.34L11,9v2H9L4.34,6.34 L2.93,7.76L6.17,11H2v2h4.17l-3.24,3.24l1.41,1.41L9,13h2v2l-4.66,4.66l1.42,1.41L11,17.83V22h2v-4.17l3.24,3.24l1.42-1.41L13,15v-2h2 l4.66,4.66l1.41-1.42L17.83,13H22V11z"
    />
  </Svg>
);

const TyreWheelIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    
    <Circle cx="12" cy="12" r="10" fill="#F0F0F0" />
    <Circle cx="12" cy="12" r="8" fill="#444444" />
    <Circle cx="12" cy="12" r="3" fill="#F0F0F0" />
    <Path
      fill="#E53935"
      d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.42,0-8-3.58-8-8s3.58-8,8-8s8,3.58,8,8 S16.42,20,12,20z"
    />
  </Svg>
);

const BatteryIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Rect x="4" y="8" width="16" height="12" rx="1" fill="#F0F0F0" />
    <Rect x="9" y="6" width="6" height="2" fill="#E53935" />
    <Path
      fill="#E53935"
      d="M15.67,4H14V2h-4v2H8.33C7.6,4,7,4.6,7,5.33v15.33C7,21.4,7.6,22,8.33,22h7.33c0.74,0,1.34-0.6,1.34-1.33V5.33 C17,4.6,16.4,4,15.67,4z M13,18h-2v-2h2V18z M13,14h-2V8h2V14z"
    />
  </Svg>
);

const DentingPaintingIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#FFE0E0" />
    <Path
      fill="#E53935"
      d="M7,14c-1.66,0-3,1.34-3,3c0,1.31-1.16,2-2,2c0.92,1.22,2.49,2,4,2c2.21,0,4-1.79,4-4C10,15.34,8.66,14,7,14z M20.71,4.63 l-1.34-1.34c-0.39-0.39-1.02-0.39-1.41,0L9,12.25L11.75,15l8.96-8.96C21.1,5.65,21.1,5.02,20.71,4.63z"
    />
  </Svg>
);

const CarSpaIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#FFE0E0" />
    <Path
      fill="#E53935"
      d="M18.39,14.56C16.71,13.7,14.53,13,12,13c-2.53,0-4.71,0.7-6.39,1.56C4.61,15.07,4,16.1,4,17.22V20h16v-2.78 C20,16.1,19.39,15.07,18.39,14.56z M9.78,12h4.44c1.21,0,2.14-1.06,1.98-2.26l-0.32-2.45C15.57,5.39,13.92,4,12,4S8.43,5.39,8.12,7.29 L7.8,9.74C7.64,10.94,8.57,12,9.78,12z"
    />
  </Svg>
);

const DetailingIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#FFE0E0" />
    <Path
      fill="#E53935"
      d="M18.92,6.01C18.72,5.42,18.16,5,17.5,5h-11C5.84,5,5.29,5.42,5.08,6.01L3,12v8c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-1 h12v1c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-8L18.92,6.01z M6.5,16C5.67,16,5,15.33,5,14.5S5.67,13,6.5,13S8,13.67,8,14.5 S7.33,16,6.5,16z M17.5,16c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S18.33,16,17.5,16z M5,11l1.5-4.5h11L19,11 H5z"
    />
  </Svg>
);

const CarServicesIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#F0F0F0" />
    <Path
      fill="#E53935"
      d="M19,3h-4.18C14.4,1.84,13.3,1,12,1S9.6,1.84,9.18,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5 C21,3.9,20.1,3,19,3z M12,2.75c0.41,0,0.75,0.34,0.75,0.75S12.41,4.25,12,4.25s-0.75-0.34-0.75-0.75S11.59,2.75,12,2.75z M9.1,17.1 l-2.83-2.83l1.41-1.41l1.41,1.41L14.8,8.6l1.41,1.41L9.1,17.1z"
    />
  </Svg>
);

const ClutchIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#FFE0E0" />
    <Path
      fill="#E53935"
      d="M15.5,14h-0.79l-0.28-0.27C15.41,12.59,16,11.11,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.61,0,3.09-0.59,4.23-1.57l0.27,0.28v0.79l5,4.99L20.49,19L15.5,14z M9.5,14C7.01,14,5,11.99,5,9.5S7.01,5,9.5,5S14,7.01,14,9.5 S11.99,14,9.5,14z"
    />
    <Path
      fill="#E53935"
      d="M7.5,9.5h4v1h-4V9.5z"
    />
  </Svg>
);

const WindshieldIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#F0F0F0" />
    <Path
      fill="#E53935"
      d="M18.25,3.5H5.75C4.78,3.5,4,4.28,4,5.25v12.5c0,0.97,0.78,1.75,1.75,1.75h12.5c0.97,0,1.75-0.78,1.75-1.75V5.25 C20,4.28,19.22,3.5,18.25,3.5z M18,17.75H6c-0.41,0-0.75-0.34-0.75-0.75V6c0-0.41,0.34-0.75,0.75-0.75h12c0.41,0,0.75,0.34,0.75,0.75 v11C18.75,17.41,18.41,17.75,18,17.75z"
    />
    <Path
      fill="#E53935"
      d="M17,7l-7,7l-3-3l-1.5,1.5L9,16l8.5-8.5L17,7z"
    />
  </Svg>
);

const SuspensionIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#F0F0F0" />
    <Circle cx="9" cy="8" r="2" fill="#E53935" />
    <Circle cx="15" cy="8" r="2" fill="#E53935" />
    <Path
      fill="#E53935"
      d="M9,14h6v1.5H9z"
    />
    <Path
      fill="#E53935"
      d="M19.21,12.94L17.29,11l-1.42,1.42L18.8,15.34L19.21,12.94z M6.71,11L4.79,12.94l0.41,2.39l2.93-2.92L6.71,11z"
    />
  </Svg>
);

const InsuranceIcon = () => (
  <Svg height="40" width="40" viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" fill="#FFE0E0" />
    <Path
      fill="#E53935"
      d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M10,17l-4-4l1.41-1.41L10,14.17l6.59-6.59 L18,9L10,17z"
    />
  </Svg>
);

const App = () => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Home" component={HomePageScreen} />
      {/* Other screens would be defined here */}
    </Stack.Navigator>
  );
};

type HomePageNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomePageProps={
  navigation: HomePageNavigationProp;
}

// Home Screen Component
const HomePageScreen = ({navigation}:HomePageProps) => {
  // Add state to track current carousel index
  const [activeCarouselIndex, setActiveCarouselIndex] = React.useState(0);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isLoadingCity, setIsLoadingCity] = useState(true);
  const isFocused = useIsFocused(); // Hook to check if the screen is focused
  const flatListRef = useRef<ScrollView>(null);
  
  // Use CarContext for global car state
  const { state: carState, hasSelectedCar, getCarDisplayText } = useCarContext();

  
  // Services data
  const services = [
    { 
      id: 'periodic', 
      title: 'Periodic\nServices', 
      icon: <PeriodicServiceIcon />,
      categorySlug: 'periodic-service',
      categoryName: 'Periodic Services'
    //   badge: '2Years Warranty*'
    },
    { 
      id: 'ac', 
      title: 'AC Service\n&Repair', 
      icon: <ACServiceIcon />,
      categorySlug: 'ac-service',
      categoryName: 'AC Service & Repair'
    //   badge: 'Season Sale'
    },
    { 
      id: 'tyre', 
      title: 'Tyres&\nWheel Care', 
      icon: <TyreWheelIcon />,
      categorySlug: 'tyre-wheel-care',
      categoryName: 'Tyres & Wheel Care'
    //   badge: ''
    },
    { 
      id: 'battery', 
      title: 'Batteries', 
      icon: <BatteryIcon />,
      categorySlug: 'battery-services',
      categoryName: 'Battery Services'
    },
    { 
      id: 'denting', 
      title: 'Denting&\nPainting', 
      icon: <DentingPaintingIcon />,
      badge: ''
    },
    { 
      id: 'spa', 
      title: 'Car Spa &\nPainting', 
      icon: <CarSpaIcon />,
    //   badge: 'Trending Now'
    },
    { 
      id: 'detailing', 
      title: 'Detailing\nServices', 
      icon: <DetailingIcon />,
      badge: ''
    },
    { 
      id: 'carservices', 
      title: 'Car\nServices', 
      icon: <CarServicesIcon />,
      badge: ''
    },
    { 
      id: 'clutch', 
      title: 'Clutch&\nBody Parts', 
      icon: <ClutchIcon />,
      badge: ''
    },
    { 
      id: 'windshield', 
      title: 'Windshield\n& Lights', 
      icon: <WindshieldIcon />,
      badge: ''
    },
    { 
      id: 'suspension', 
      title: 'Suspension\n& Fitments', 
      icon: <SuspensionIcon />,
    //   badge: 'Free Inspection'
    },
    { 
      id: 'insurance', 
      title: 'Insurance\nClaims', 
      icon: <InsuranceIcon />,
    //   badge: 'Cashless Claims'
    },
  ];
  // const isFocused = useIsFocused();
  // // >>>>>>>> ENSURE BANNERS IS DEFINED HERE <<<<<<<<<<
  const banners = [
    { title: "Summer Sale", offer: { percentage: "50" }, image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/banner-1-e1733223305758.jpg" },
    { title: "Monsoon Offer", offer: { percentage: "30" }, image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/banner-2-e1733223340819.jpg" },
    { title: "Festive Deals", offer: { percentage: "40" }, image: "https://onlybigcars.com/latest/wp-content/uploads/2024/12/banner-3-e1733223371989.jpg" },
    // ... any other banner objects
  ];

  useEffect(() => {
    const loadSelectedCity = async () => {
      setIsLoadingCity(true);
      try {
        const city = await AsyncStorage.getItem('userSelectedCity');
        if (city !== null) {
          setSelectedCity(city);
        } else {
          setSelectedCity(null);
          // Optionally, if a city is absolutely required, navigate to selection:
          // Alert.alert("City Required", "Please select your city to continue.", [
          //   { text: "Select City", onPress: () => navigation.replace('CitySelection') }
          // ]);
        }
      } catch (error) {
        console.error('Failed to load city from AsyncStorage', error);
        setSelectedCity(null); // Fallback to no city
      } finally {
        setIsLoadingCity(false);
      }
    };

    loadSelectedCity();
    

    if (isFocused) { // Load city when the screen comes into focus
      loadSelectedCity();
    }

    // Auto-scroll banner logic
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        if (flatListRef.current) {
          flatListRef.current.scrollTo({
            x: nextIndex * (Dimensions.get('window').width - 20), // Adjust width based on your banner styling
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(timer); // Cleanup timer on unmount

  }, [isFocused, banners.length]);

  // Carousel data - updated to include content for each slide
  const carouselItems = [
    { 
      id: '1', 
      type: 'image',
      source: require('../assets/carbanner.png'),
      
    },
    { 
      id: '2', 
      type: 'svg',
      title: 'SERVICE\nSPECIALS',
      offerPercentage: '50',
      offerText: 'OFF'
    },
    { id: '3', type: 'empty' },
    { id: '4', type: 'empty' },
    { id: '5', type: 'empty' },
  ];

  const handleServicePress = (service: typeof services[0]) => {
    console.log(`Service pressed: ${service.title}`);
    if (service.categorySlug && service.categoryName) {
      navigation.navigate('ProductScreen', {
        categorySlug: service.categorySlug,
        categoryName: service.categoryName
      });
    } else {
      // Handle the case where categorySlug or categoryName is undefined
      console.log('Service lacks required navigation properties');
      // You could show an alert or navigate to a default screen instead
    }
  }

  // Function to go to next carousel item
  const nextCarouselItem = () => {
    setActiveCarouselIndex((prevIndex) => 
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to previous carousel item
  const prevCarouselItem = () => {
    setActiveCarouselIndex((prevIndex) => 
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  // Function to directly navigate to a specific carousel item
  const goToCarouselItem = (index: number) => {
    setActiveCarouselIndex(index);
  };

  const checkIsUserLoggedIn = async(): Promise<boolean>=>{
    try{
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log('Access Token:', accessToken);
      return !!accessToken;
    }catch(e){
      console.error("Failed to read login status from AsyncStorage", e);
      return false;
    }
  };

  const getUserPhoneNumber = async():Promise<string | null>=>{
    try{
      const phoneNumber = await AsyncStorage.getItem('userPhoneNumber');
      return phoneNumber;
    }catch(e){
      console.error("Failed to read phone number from AsyncStorage", e);
      return null;
    }
  }

  const handleCarImagePress = async()=>{
    const isLoggedIn = await checkIsUserLoggedIn();
    console.log('User is logged in:', isLoggedIn);
    if(!isLoggedIn){
      navigation.navigate('Login');
    }else{
      const phoneNumber = await getUserPhoneNumber();
      console.log('User is logged in, Phone number:', phoneNumber);
      // Navigate to car selection flow - start with city selection
      navigation.navigate('CitySelection');
    }
  }; 

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <SafeAreaView style={styles.container}>
        {/* Location Header - Updated to match the image */}
        <View style={styles.locationHeader}>
          
            <View style={styles.locationContainer}>
          <LocationIcon />
          <TouchableOpacity
            style={styles.locationTextContainer}
            onPress={() => navigation.navigate('CitySelection')} // Navigate to change/select city
          >
            <Text style={styles.locationTitle}>
              {isLoadingCity ? 'Loading City...' : selectedCity || 'Select City'}
            </Text>
            <Text style={styles.locationSubtitle}>
              {isLoadingCity ? ' ' : selectedCity ? 'Tap to change' : 'Tap to select your city'}
            </Text>
          </TouchableOpacity>
        </View>
          
           
          {/* Updated car section to show selected car or selection prompt */}
          <TouchableOpacity onPress={handleCarImagePress} style={styles.carSection}>
            <Image 
              source={require('../assets/car-thumb.png')} 
              style={styles.carImage}
            />
            {hasSelectedCar() ? (
              <View style={styles.carInfoContainer}>
                <Text style={styles.carInfoText}>{getCarDisplayText()}</Text>
                <Text style={styles.carInfoSubtext}>Tap to change</Text>
              </View>
            ) : (
              <View style={styles.carInfoContainer}>
                <Text style={styles.carSelectText}>Select Your Car</Text>
                <Text style={styles.carSelectSubtext}>For dynamic pricing</Text>
              </View>
            )}
          </TouchableOpacity>

        </View>
        
        {/* Search Bar - Updated to match the image */}
        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder='Search "Warranty"'
            placeholderTextColor="#9E9E9E"
          />
        </View>
        
        {/* Main Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Banner Carousel */}
          <View style={styles.bannerContainer}>
            <View style={styles.banner}>
              {carouselItems[activeCarouselIndex].type === 'image' && (
                <Image 
                  source={carouselItems[activeCarouselIndex].source} 
                  style={styles.bannerBackground}
                />
              )}
              
              {carouselItems[activeCarouselIndex].type === 'svg' && (
                <View style={[styles.bannerBackground, { backgroundColor: '#FFE0E0' }]}>
                  {/* Add your SVG elements here */}
                  <Svg height="100%" width="100%" viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="40" fill="#E53935" opacity="0.3" />
                    <Circle cx="70" cy="30" r="20" fill="#E53935" opacity="0.5" />
                  </Svg>
                </View>
              )}
              
              {(carouselItems[activeCarouselIndex].type === 'image' || 
                carouselItems[activeCarouselIndex].type === 'svg') && (
                <>
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>
                      {carouselItems[activeCarouselIndex].title}
                    </Text>
                    <View style={styles.offerContainer}>
                      <Text style={styles.offerPercentage}>
                        {carouselItems[activeCarouselIndex].offerPercentage}
                        <Text style={styles.offerPercent}></Text>
                      </Text>
                      <Text style={styles.offerOff}>
                        {carouselItems[activeCarouselIndex].offerText}
                      </Text>
                    </View>
                  </View>
                  
                </>
              )}
              
              {/* Arrow navigation for carousel */}
              <TouchableOpacity 
                style={[styles.carouselArrow, styles.carouselArrowLeft]} 
                onPress={prevCarouselItem}
              >
                <Text style={styles.carouselArrowText}>‹</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.carouselArrow, styles.carouselArrowRight]} 
                onPress={nextCarouselItem}
              >
                <Text style={styles.carouselArrowText}>›</Text>
              </TouchableOpacity>
            </View>
            
            {/* Carousel Indicators */}
            <View style={styles.indicators}>
              {carouselItems.map((item, index) => (
                <TouchableOpacity 
                  key={item.id} 
                  onPress={() => goToCarouselItem(index)}
                >
                  <View 
                    style={[
                      styles.indicator, 
                      activeCarouselIndex === index && styles.activeIndicator
                    ]} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
         
          {/* Services Grid */}
          <View style={styles.servicesContainer}>
            {services.map((service, index) => (
              <TouchableOpacity 
                key={service.id}
                style={[
                  styles.serviceItem,
                  index % 4 === 3 && styles.lastInRow,
                ]}
                onPress={() => handleServicePress(service)}
                
              >
                {service.badge && (
                  <View style={[
                    styles.badgeContainer,
                    service.badge === 'Heavy Discount' && styles.redBadge,
                    service.badge === 'Season Sale' && styles.greenBadge,
                    service.badge === '2Years Warranty*' && styles.greenBadge,
                    service.badge === 'Trending Now' && styles.greenBadge,
                    service.badge === 'Free Inspection' && styles.greenBadge,
                    service.badge === 'Cashless Claims' && styles.greenBadge,
                  ]}>
                    <Text style={styles.badgeText}>{service.badge}</Text>
                  </View>
                )}
                {service.icon}
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        <MembershipCard navigation={navigation} />
          
          {/* Bottom padding */}
          <View style={{ height: 20 }} />
        </ScrollView>
        
        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <HomeIcon />
            <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
            <AccountIcon />
            <Text style={styles.navText}>Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <StoreIcon />
            <Text style={styles.navText}>Store</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <SOSIcon />
            <Text style={styles.navText}>SOS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navItem}>
            <ContactIcon />
            <Text style={styles.navText}>Contact</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // Make sure we're not overlapping the status bar on Android
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  locationTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#757575',
    lineHeight: 16,
  },
  carImage: {
    width: 90,
    height: 45,
    resizeMode: 'contain',
  },
  carSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  carInfoContainer: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  carInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'right',
  },
  carInfoSubtext: {
    fontSize: 11,
    color: '#757575',
    textAlign: 'right',
  },
  carSelectText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E53935',
    textAlign: 'right',
  },
  carSelectSubtext: {
    fontSize: 11,
    color: '#757575',
    textAlign: 'right',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // Enhanced shadow properties
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#212121',
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    paddingBottom: 10,
  },
  banner: {
    height: 180,
    margin: 10,
    marginBottom: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  bannerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerContent: {
    flex: 1,
    zIndex: 1,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  offerPercentage: {
    color: '#3A3A3A',
    fontSize: 42,
    fontWeight: 'bold',
  },
  offerPercent: {
    fontSize: 24,
  },
  offerOff: {
    color: '#3A3A3A',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 4,
    marginBottom: 6,
  },
  
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDDDDD',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#E53935',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  serviceItem: {
    width: '25%',
    alignItems: 'center',
    padding: 8,
    marginBottom: 16,
    position: 'relative',
  },
  lastInRow: {
    marginRight: 0,
  },
  serviceTitle: {
    fontSize: 12,
    color: '#212121',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redBadge: {
    backgroundColor: '#E53935',
  },
  greenBadge: {
    backgroundColor: '#8BC34A',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10,
    color: '#757575',
    marginTop: 4,
  },
  activeNavText: {
    color: '#E53935',
  },
  carouselArrow: {
    position: 'absolute',
    top: '50%',
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -15, // Half of height to center vertically
  },
  carouselArrowLeft: {
    left: 10,
  },
  carouselArrowRight: {
    right: 10,
  },
  carouselArrowText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
});

// Export HomeScreen directly for more flexibility
export { HomePageScreen };

// Export the navigator without NavigationContainer
export default App;