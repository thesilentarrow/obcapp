import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Image, // <-- Added Image component
  Platform,
  StatusBar
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../types/navigation'; // Ensure this path is correct
import { Ionicons } from '@expo/vector-icons';
// import { ServiceData } from './ProductScreen'; // This is no longer needed with the new data structure

// --- Mock types for navigation to make the component self-contained ---
// In your actual app, you would use your defined RootStackParamList
type RootStackParamList = {
  ServiceDetailScreen: { service: any }; // Using 'any' for the dummy data
  // ... other screens
};
// --- End Mock types ---

type ServiceDetailScreenRouteProp = RouteProp<RootStackParamList, 'ServiceDetailScreen'>;
type ServiceDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ServiceDetailScreen'>;

type Props = {
  route: ServiceDetailScreenRouteProp;
  navigation: ServiceDetailScreenNavigationProp;
};

const { width } = Dimensions.get('window');

const ThumbsUpIcon = () => (
  <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/thumbs_up_2496278.png')} // Replace with your actual PNG file path
      style={{ width: 20, height: 20 }}
      resizeMode="contain"
    />
  </View>
);
const ShieldIcon = () => (
  <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/shield_service.png')} // Replace with your actual PNG file path
      style={{ width: 20, height: 20 }}
      resizeMode="contain"
    />
  </View>
);
const ClockIcon = () => (
  <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/clock_service.png')} // Replace with your actual PNG file path
      style={{ width: 20, height: 20 }}
      resizeMode="contain"
    />
  </View>
);
const PickUpIcon = () => (
  <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/pickup_service.png')} // Replace with your actual PNG file path
      style={{ width: 20, height: 20 }}
      resizeMode="contain"
    />
  </View>
);
const ServiceDetailScreen = ({ route, navigation }: Props) => {
  // const { service } = route.params; // We are using dummy data below for demonstration

  // New dummy data structure to match the target UI
  const service = {
    header: 'Basic Service',
    price: '12,719',
    metaInfo: [
      { icon: <ClockIcon />, text: '4 Hrs Taken' },
      { icon: <ShieldIcon />, text: '1000 Kms or 3 Months Warranty' },
      { icon: <ThumbsUpIcon />, text: 'Every 5000 Kms or 6 Months (Recommended)' },
      { icon: <PickUpIcon />, text: 'Free Pick-up & Drop' },
    ],
    includedServices: [
      {
        category: 'Essential Services',
        items: [
          { name: 'Engine Oil Replacement', image: { uri: 'https://placehold.co/150x100/ffc107/000000?text=Oil' } },
          { name: 'Oil Filter Replacement', image: { uri: 'https://placehold.co/150x100/03a9f4/ffffff?text=Filter' } },
          { name: 'Air Filter Cleaning', image: { uri: 'https://placehold.co/150x100/4caf50/ffffff?text=Air' } },
        ],
      },
      {
        category: 'Performance Services',
        items: [
          { name: 'Coolant Top Up (200 ml)', image: { uri: 'https://placehold.co/150x100/f44336/ffffff?text=Coolant' } },
          { name: 'Heater/Spark Plugs Checking', image: { uri: 'https://placehold.co/150x100/9c27b0/ffffff?text=Plugs' } },
        ],
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* --- Header --- */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{service.header}</Text>
        <TouchableOpacity style={styles.backButton}>
            <Ionicons name="share-social-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* --- Scrollable Content --- */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Meta Info Section */}
        <View style={styles.metaSection}>
          {service.metaInfo.map((item, index) => (
            <View key={index} style={styles.metaItem}>
              {typeof item.icon === 'string' ? (
                <Ionicons name={item.icon as any} size={22} color="#555" />
              ) : (
                item.icon
              )}
              <Text style={styles.metaText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* "What's Included" Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          {service.includedServices.map((serviceGroup, index) => (
            <View key={index} style={styles.serviceCategory}>
              <Text style={styles.serviceCategoryTitle}>{serviceGroup.category}</Text>
              <View style={styles.servicesGrid}>
                {serviceGroup.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.serviceItem}>
                    <Image source={item.image} style={styles.serviceImage} />
                    <Text style={styles.serviceName}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* --- Footer with Price and Button --- */}
      <View style={styles.footer}>
        <Text style={styles.footerPrice}>₹ {service.price}</Text>
        <TouchableOpacity style={styles.addToCartButton} onPress={() => console.log('Added to cart!')}>
          <Text style={styles.addToCartButtonText}>ADD TO CART</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Updated Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Main background color
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding at the bottom to not be hidden by the footer
  },
  // Meta Info Section Styles
  metaSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 8,
    borderBottomColor: '#F4F4F4',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  metaText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 15,
  },
  // "What's Included" Section Styles
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#000',
    alignSelf: 'flex-start',
    paddingBottom: 2,
  },
  serviceCategory: {
    marginBottom: 20,
  },
  serviceCategoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
    marginBottom: 15,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 15,
  },
  serviceItem: {
    width: (width / 3) - 25, // 3 items per row with padding
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  serviceImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 14,
    color: '#333',
  },
  // Footer Styles
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 20, // Extra padding for devices with home indicator
  },
  footerPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  addToCartButton: {
    backgroundColor: '#E53935',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServiceDetailScreen;
