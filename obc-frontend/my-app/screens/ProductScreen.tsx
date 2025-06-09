import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert 
} from 'react-native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

type ProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductScreen'>;
type ProductScreenRouteProp = RouteProp<RootStackParamList, 'ProductScreen'>;

type Props = {
  navigation: ProductScreenNavigationProp;
  route: ProductScreenRouteProp;
};

export type ServiceData = {
  id: number;
  header: string;
  details: string;
  details_list: string[];
  pagedetails:string;
  price: string | null;
  duration: string;
  image: string;
  is_featured: boolean;
};

type CategoryData = {
  id: number;
  name: string;
  description: string;
  icon: string;
  slug: string;
};

type APIResponse = {
  category: CategoryData;
  services: ServiceData[];
  total_services: number;
};

const API_URL = 'https://6b2b-143-244-61-132.ngrok-free.app'; // Replace with your backend URL

const ProductScreen = ({ navigation, route }: Props) => {
  const { categorySlug, categoryName } = route.params;
  const [services, setServices] = useState<ServiceData[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [categorySlug]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get<APIResponse>(
        `${API_URL}/api/services/categories/${categorySlug}/`
      );
      setServices(response.data.services);
      setCategory(response.data.category);
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: ServiceData) => {
    navigation.navigate('ServiceDetailScreen', { service });
  };

  const renderServiceCard = (service: ServiceData, index: number) => (
    <TouchableOpacity
      key={service.id}
      style={styles.serviceCard}
      onPress={() => handleServiceSelect(service)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.serviceHeader}>{service.header}</Text>
        {service.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Popular</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.detailsTitle}>Includes:</Text>
        {service.details_list.slice(0, 4).map((detail, detailIndex) => (
          <View key={detailIndex} style={styles.detailItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.detailText}>{detail}</Text>
          </View>
        ))}
        {service.details_list.length > 4 && (
          <Text style={styles.moreItems}>
            +{service.details_list.length - 4} more items
          </Text>
        )}
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.priceContainer}>
          {service.price && (
            <Text style={styles.priceText}>₹{service.price}</Text>
          )}
          {service.duration && (
            <Text style={styles.durationText}>{service.duration}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category?.name || categoryName}</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {category && (
          <View style={styles.introSection}>
            <Text style={styles.introTitle}>{category.name}</Text>
            {category.description && (
              <Text style={styles.introText}>{category.description}</Text>
            )}
          </View>
        )}

        <View style={styles.servicesContainer}>
          {services.length > 0 ? (
            services.map((service, index) => renderServiceCard(service, index))
          ) : (
            <View style={styles.noServicesContainer}>
              <Ionicons name="construct-outline" size={48} color="#BDBDBD" />
              <Text style={styles.noServicesText}>No services available at the moment</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchServices}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  scrollView: {
    flex: 1,
  },
  introSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E53935',
    marginBottom: 8,
  },
  introText: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 24,
  },
  servicesContainer: {
    padding: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  serviceHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  featuredBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardContent: {
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  moreItems: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    marginTop: 4,
    marginLeft: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E53935',
  },
  durationText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  noServicesContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noServicesText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProductScreen;