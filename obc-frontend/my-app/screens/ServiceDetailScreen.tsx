import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation'; // Ensure this path is correct
import { Ionicons } from '@expo/vector-icons';
import { ServiceData } from './ProductScreen'; // Import ServiceData type from ProductScreen
// Re-using ServiceData type, ensure it matches the one in ProductScreen or import from a shared types file

type ServiceDetailScreenRouteProp = RouteProp<RootStackParamList, 'ServiceDetailScreen'>;
type ServiceDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ServiceDetailScreen'>;

type Props = {
  route: ServiceDetailScreenRouteProp;
  navigation: ServiceDetailScreenNavigationProp;
};

const { width } = Dimensions.get('window');

const ServiceDetailScreen = ({ route, navigation }: Props) => {
  const { service } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{service.header}</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Included Items Section */}
        <View style={[styles.sectionContainer, styles.includesSection]}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          {service.details_list.map((detail: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
            <View key={index} style={styles.detailItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.tickIcon} />
              <Text style={styles.detailText}>{detail}</Text>
            </View>
          ))}
        </View>

        {/* Page Details Section */}
        {service.pagedetails && (
          <View style={[styles.sectionContainer, styles.pageDetailsSection]}>
            <Text style={styles.sectionTitle}>Further Details</Text>
            <Text style={styles.pageDetailsText}>{service.pagedetails}</Text>
          </View>
        )}

        {/* Pricing and Duration (Optional, can be styled like ProductScreen) */}
        {(service.price || service.duration) && (
            <View style={[styles.sectionContainer, styles.pricingSection]}>
                {service.price && <Text style={styles.priceText}>Price: ₹{service.price}</Text>}
                {service.duration && <Text style={styles.durationText}>Duration: {service.duration}</Text>}
            </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookNowButton} onPress={() => console.log('Book now for:', service.header)}>
          <Text style={styles.bookNowButtonText}>Add to cart</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light background for the whole screen
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Space for content before the footer
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  includesSection: {
    borderColor: '#4CAF50', // Green accent for includes
    borderLeftWidth: 4,
  },
  pageDetailsSection: {
    borderColor: '#2196F3', // Blue accent for details
    borderLeftWidth: 4,
  },
  pricingSection: {
    borderColor: '#FF9800', // Orange accent for pricing
    borderLeftWidth: 4,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the start for multi-line text
    marginBottom: 12,
  },
  tickIcon: {
    marginRight: 10,
    marginTop: 1, // Slight adjustment for alignment with text
  },
  detailText: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
    flex: 1, // Allow text to wrap
  },
  pageDetailsText: {
    fontSize: 15,
    color: '#444444',
    lineHeight: 24, // Good line height for readability
    textAlign: 'justify', // Justify text for a more formal look
  },
  priceText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 8,
  },
  durationText: {
    fontSize: 15,
    color: '#757575',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bookNowButton: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookNowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ServiceDetailScreen;