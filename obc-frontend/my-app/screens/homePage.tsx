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
  FlatList,
} from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
// import LinearGradient from 'react-native-linear-gradient';

// If needed, add this import
import { RootStackParamList } from '../types/navigation';
import type {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; //for checkig login status
import { useCarContext } from '../contexts/CarContext';

// Import the MembershipCard component
import MembershipDetailsScreen from './MembershipDetailsScreen'; 
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
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/periodic_service.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const ACServiceIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/ac_service.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const TyreWheelIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/wheel_care.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const BatteryIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/battery_icon.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const DentingPaintingIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/car_paint.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const CarSpaIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/car_spa.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const DetailingIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/car_detail.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const CarServicesIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/car_service.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const ClutchIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/car_parts.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const WindshieldIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/wind_shield.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
);

const SuspensionIcon = () => (
  <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/car_sus.png')} // Replace with your actual PNG file path
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
    />
  </View>
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
  const isFocused = useIsFocused();
  const flatListRef = useRef<FlatList>(null); // Use FlatList ref
  
  // Add new state for progress tracking
  const [progress, setProgress] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  
  // Add refs for timer management
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Add screen width
  const screenWidth = Dimensions.get('window').width;

  // Use CarContext for global car state
  const { state: carState, hasSelectedCar, getCarDisplayText } = useCarContext();

  // Configuration constants
  const CAROUSEL_DURATION = 3000; // 3 seconds per slide
  const PROGRESS_INTERVAL = 30; // Update progress every 30ms for smooth animation

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
      id: 'denting', 
      title: 'Denting&\nPainting', 
      icon: <DentingPaintingIcon />,
      badge: ''
    },
    { 
      id: 'suspension', 
      title: 'Suspension\n& Fitments', 
      icon: <SuspensionIcon />,
    //   badge: 'Free Inspection'
    },
    { 
      id: 'clutch', 
      title: 'Clutch&\nBody Parts', 
      icon: <ClutchIcon />,
      badge: ''
    },
    { 
      id: 'detailing', 
      title: 'Detailing\nServices', 
      icon: <DetailingIcon />,
      badge: ''
    },
    { 
      id: 'spa', 
      title: 'Car \nGrooming', 
      icon: <CarSpaIcon />,
    //   badge: 'Trending Now'
    },
    { 
      id: 'battery', 
      title: 'Batteries', 
      icon: <BatteryIcon />,
      categorySlug: 'battery-services',
      categoryName: 'Battery Services'
    },
    { 
      id: 'tyre', 
      title: 'Tyre Services', 
      icon: <TyreWheelIcon />,
      categorySlug: 'tyre-wheel-care',
      categoryName: 'Tyres & Wheel Care'
    //   badge: ''
    },
    { 
      id: 'windshield', 
      title: 'Windshield\n& Lights', 
      icon: <WindshieldIcon />,
      badge: ''
    },
    { 
      id: 'insurance', 
      title: 'Insurance\nClaims', 
      icon: <InsuranceIcon />,
    //   badge: 'Cashless Claims'
    },
     { 
      id: 'carService', 
      title: 'Car\nServices', 
      icon: <CarServicesIcon />,
      badge: ''
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
      const nextIndex = (prevIndex + 1) % carouselItems.length; // Use carouselItems instead of banners
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
      return nextIndex;
    });
  }, 4000);

  return () => clearInterval(timer);
// Cleanup timer on unmount

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

  // Handle scroll for FlatList
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (screenWidth));
    setActiveCarouselIndex(index);
  };

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

  // Carousel auto-scroll and progress management
  useEffect(() => {
    if (!isAutoScrolling) return;

    const startProgress = () => {
      setProgress(0);
      
      // Clear any existing timers
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      
      // Start progress animation
      progressTimerRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + (PROGRESS_INTERVAL / CAROUSEL_DURATION) * 100;
          
          if (newProgress >= 100) {
            // Progress complete, move to next slide
            const nextIndex = activeCarouselIndex === carouselItems.length - 1 ? 0 : activeCarouselIndex + 1;
            setActiveCarouselIndex(nextIndex);
            
            // Auto-scroll FlatList
            flatListRef.current?.scrollToIndex({
              index: nextIndex,
              animated: true,
            });
            
            return 0; // Reset progress for next slide
          }
          
          return newProgress;
        });
      }, PROGRESS_INTERVAL);
    };

    startProgress();

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [activeCarouselIndex, isAutoScrolling, carouselItems.length]);

  // Pause auto-scroll when user manually navigates
  const handleManualNavigation = (newIndex: number) => {
    setIsAutoScrolling(false);
    setActiveCarouselIndex(newIndex);
    setProgress(0);
    
    // Clear existing timers
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    if (autoScrollTimerRef.current) {
      clearTimeout(autoScrollTimerRef.current);
    }
    
    // Scroll to the selected index
    flatListRef.current?.scrollToIndex({
      index: newIndex,
      animated: true,
    });
    
    // Resume auto-scrolling after 3 seconds of inactivity
    autoScrollTimerRef.current = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

  // Function to directly navigate to a specific carousel item
  const goToCarouselItem = (index: number) => {
    handleManualNavigation(index);
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
        backgroundColor="rgba(229, 57, 53, 0.1)" // Make status bar slightly tinted
        translucent={true}
      />
      <SafeAreaView style={styles.container}>
        {/* Location Header - Updated to match the image */}
        
          
          {/* Location Header */}
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
            <FlatList
              ref={flatListRef}
              data={carouselItems}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleScroll}
              snapToInterval={screenWidth}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 0 }}
              renderItem={({ item }) => (
                <View style={[styles.banner, { width: screenWidth - 20 }]}>
                  {item.type === 'image' && (
                    <Image 
                      source={item.source} 
                      style={styles.bannerBackground}
                    />
                  )}
                  
                  {item.type === 'svg' && (
                    <View style={[styles.bannerBackground, { backgroundColor: '#FFE0E0' }]}>
                      <Svg height="100%" width="100%" viewBox="0 0 100 100">
                        <Circle cx="50" cy="50" r="40" fill="#E53935" opacity="0.3" />
                        <Circle cx="70" cy="30" r="20" fill="#E53935" opacity="0.5" />
                      </Svg>
                    </View>
                  )}
                  
                  {(item.type === 'image' || item.type === 'svg') && (
                    <View style={styles.bannerContent}>
                      <Text style={styles.bannerTitle}>
                        {item.title}
                      </Text>
                      <View style={styles.offerContainer}>
                        <Text style={styles.offerPercentage}>
                          {item.offerPercentage}
                        </Text>
                        <Text style={styles.offerOff}>
                          {item.offerText}
                        </Text>
                      </View>
                    </View>
                  )}
                  
                  {item.type === 'empty' && (
                    <View style={[styles.bannerBackground, { backgroundColor: '#F5F5F5' }]}>
                      <View style={styles.emptyBannerContent}>
                        <Text style={styles.emptyBannerText}>Coming Soon</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            />
            
            {/* Progress Indicators */}
            <View style={styles.progressIndicators}>
              {carouselItems.map((item, index) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.progressIndicatorContainer,
                    index !== activeCarouselIndex && styles.inactiveProgressIndicator
                  ]}
                  onPress={() => goToCarouselItem(index)}
                >
                  <View style={[
                    styles.progressIndicatorBackground,
                    index !== activeCarouselIndex && { height: 2 }
                  ]}>
                    <View 
                      style={[
                        styles.progressIndicatorFill,
                        {
                          width: index === activeCarouselIndex 
                            ? `${progress}%` 
                            : index < activeCarouselIndex 
                              ? '100%' 
                              : '0%'
                        }
                      ]} 
                    />
                  </View>
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

  headerWithGradient: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140, // Adjust height to control where gradient ends
    zIndex: 0,
  },

   locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent', // Changed from white to transparent
    paddingTop:24,
    position: 'relative',
    zIndex: 1,
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
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  banner: {
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    padding: 10,
    justifyContent: 'flex-end',
    marginHorizontal: 10,
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
  // New styles for progress indicators
 progressIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 100,
  },
  progressIndicatorContainer: {
    flex: 1,
    marginHorizontal: 1,
    transform: [{ scaleY: 1 }],
  },
  progressIndicatorBackground: {
    height: 3,
    backgroundColor: 'rgba(229, 57, 53, 0.2)',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressIndicatorFill: {
    height: '100%',
    backgroundColor: '#E53935',
    borderRadius: 1.5,
  },
   inactiveProgressIndicator: {
    flex:0.4,
    transform: [{ scaleX: 0.5 }], // Make inactive bars 50% smaller
    opacity: 0.6, // Make them slightly transparent
    backgroundColor: '#757575',
    borderRadius: 3,
  },
  emptyBannerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBannerText: {
    fontSize: 18,
    color: '#757575',
    fontWeight: '500',
  },
});

// Export HomeScreen directly for more flexibility
export { HomePageScreen };

// Export the navigator without NavigationContainer
export default App;