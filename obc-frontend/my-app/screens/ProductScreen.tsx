import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert,
  Dimensions,
  StatusBar,
  Platform,
  Image
} from 'react-native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCarContext, useCarForPricing } from '../contexts/CarContext';

const { width } = Dimensions.get('window');

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
  pagedetails: string;
  price: string | null;
  real_price: string | null;
  display_price: string | null;
  duration: string;
  image: string;
  is_featured: boolean;
  is_recommended?: boolean;
  original_price?: string | null;
  discount_percentage?: string;
  promo_price?: string | null;
  promo_text?: string;
  membership_savings?: string;
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
  pricing_context?: {
    brand?: string;
    model?: string;
    has_real_pricing: boolean;
  };
};

const API_URL = 'https://0pcdlz8k-8000.inc1.devtunnels.ms/';

const ProductScreen = ({ navigation, route }: Props) => {
  const { categorySlug, categoryName } = route.params;
  const [services, setServices] = useState<ServiceData[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null);
  
  // Use CarContext for global car state management
  const { state: carState } = useCarContext();
  const carForPricing = useCarForPricing();

  // Use useCallback to memoize fetchServices and prevent unnecessary re-renders
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      
      // Build URL with car context parameters using the enhanced helper
      let url = `${API_URL}/api/services/categories/${categorySlug}/`;
      const queryString = carForPricing.buildQueryParams();
      
      if (queryString) {
        url += `?${queryString}`;
      }
      
      console.log('Fetching services with URL:', url);
      console.log('Car context for pricing:', carForPricing.getPricingContext());
      
      const response = await axios.get<APIResponse>(url);

      const getServiceRank = (serviceHeader: string): number => {
        const lowerCaseHeader = serviceHeader.toLowerCase();
        if (lowerCaseHeader.includes('comprehensive')) return 1;
        if (lowerCaseHeader.includes('standard')) return 2;
        if (lowerCaseHeader.includes('basic')) return 3;
        return 4;
      };

      const sortedServices = response.data.services.sort((a, b) => {
        return getServiceRank(a.header) - getServiceRank(b.header);
      });
      
      // Add mock data for demonstration (replace with actual API data)
      const servicesWithMockData = response.data.services.map((service, index) => ({
        ...service,
        is_recommended: index === 0,
        original_price: service.display_price ? (parseInt(service.display_price) * 1.3).toString() : null,
        discount_percentage: index === 0 ? '30' : '20',
        promo_price: service.display_price ? (parseInt(service.display_price) - 1500).toString() : null,
        promo_text: 'Extra ₹1500 OFF',
        membership_savings: '15'
      }));
      
      setServices(servicesWithMockData);
      setCategory(response.data.category);
      
      if (response.data.pricing_context) {
        console.log('Pricing context from API:', response.data.pricing_context);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      Alert.alert('Error', 'Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [categorySlug, carState.selectedBrand, carState.selectedModel, carState.selectedFuel, carState.selectedCity]);

  const carDetailsHash = useMemo(() => {
    if (carState.hasCompletedSelection) {
      return `${carState.selectedBrand || ''}-${carState.selectedModel || ''}-${carState.selectedFuel || ''}-${carState.selectedCity || ''}`;
    }
    return 'no-car-selected';
  }, [carState.hasCompletedSelection, carState.selectedBrand, carState.selectedModel, carState.selectedFuel, carState.selectedCity]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServices();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [fetchServices]);

  const handleToggleDetails = (serviceId: number) => {
    setExpandedServiceId(prevId => (prevId === serviceId ? null : serviceId));
  };

  const handleServiceSelect = (service: ServiceData) => {
    navigation.navigate('ServiceDetailScreen', { service });
  };

  const renderServiceCard = (service: ServiceData, index: number) => {
    const isExpanded = expandedServiceId === service.id;
    
    // Split the details if they come as a single string with newlines
    const detailsArray = service.details_list.length === 1 && service.details_list[0].includes('\n') 
      ? service.details_list[0].split('\n').filter(item => item.trim() !== '')
      : service.details_list;
      
    const detailsToShow = isExpanded ? detailsArray : detailsArray.slice(0, 2);
    
    return (
      <View key={service.id} style={[styles.serviceCard, { marginTop: index === 0 ? 0 : 16 }]}>
        {/* Recommended Tag */}
        {service.is_recommended && (
          <View style={styles.recommendedTag}>
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          {/* Left Content */}
          <View style={styles.leftContent}>
            {/* Service Title */}
            <Text style={styles.serviceTitle}>{service.header}</Text>
            
            <View style={styles.serviceDetails}>
              {detailsToShow.map((detail, detailIndex) => (
                <View key={detailIndex} style={styles.detailItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.detailText}>
                    {detail.trim()}
                  </Text>
                </View>
              ))}
              {detailsArray.length > 4 && (
                <TouchableOpacity 
                  onPress={() => handleToggleDetails(service.id)}
                  style={styles.toggleDetailsButton}
                >
                  <Text style={styles.moreItemsText}>
                    {isExpanded ? 'Show less' : `show more items...`}
                  </Text>
                  <Ionicons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={14} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Price Section */}
            <View style={styles.priceSection}>
              <View style={styles.priceRow}>
                {service.original_price && (
                  <Text style={styles.originalPrice}>₹{service.original_price}</Text>
                )}
                {service.display_price && (
                  <Text style={styles.currentPrice}>₹{service.display_price}</Text>
                )}
                {service.discount_percentage && (
                  <Text style={styles.discountPercentage}>{service.discount_percentage}% OFF</Text>
                )}
              </View>
              
              {/* Promo Section
              {service.promo_price && service.promo_text && (
                <View style={styles.promoSection}>
                  <View style={styles.promoIcon}>
                    <Text style={styles.promoEmoji}>🎉</Text>
                  </View>
                  <Text style={styles.promoText}>Get at ₹{service.promo_price}</Text>
                  <View style={styles.promoTag}>
                    <Text style={styles.promoTagText}>{service.promo_text}</Text>
                  </View>
                </View>
              )} */}
            </View>

             <TouchableOpacity 
              style={styles.viewDetailsButton} 
              onPress={() => handleServiceSelect(service)}
            >
              <Text style={styles.viewDetailsButtonText}>View Details</Text>
              <Ionicons name="arrow-forward" size={14} color="#007AFF" />
            </TouchableOpacity>

            {/* Membership Savings */}
            {/* {service.membership_savings && (
              <View style={styles.membershipSection}>
                <Text style={styles.membershipText}>
                  Save Extra {service.membership_savings}% with Miles Membership
                </Text>
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            )} */}
          </View>

          {/* Right Content - Image and Added Button */}
          <View style={styles.rightContent}>
            <View style={styles.imageContainer}>
              <Image 
      source={require('../assets/service.png')}
      style={styles.serviceImage}
      resizeMode="cover"
    />
              <TouchableOpacity style={styles.addedButton}>
                <Text style={styles.addedButtonText}>ADD</Text>
              </TouchableOpacity>
            </View>
            
            
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={styles.loadingText}>Finding the best services for you...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {category?.name || categoryName}
        </Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Scheduled Packages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Brake Maintenance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Urgent</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Services List */}
        <View style={styles.servicesContainer}>
          {services.length > 0 ? (
            services.map((service, index) => renderServiceCard(service, index))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#E0E0E0" />
              <Text style={styles.emptyStateTitle}>No services available</Text>
              <Text style={styles.emptyStateDescription}>
                We're working on adding more services to this category
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  searchButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#E8F2FF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  servicesContainer: {
    padding: 20,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  recommendedTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 0,
    zIndex: 1,
  },
  recommendedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 40,
  },
  leftContent: {
    flex: 1,
    paddingRight: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  serviceDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
    marginTop: 2,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    lineHeight: 20,
  },
  toggleDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  moreItemsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginRight: 6,
  },
  priceSection: {
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginRight: 8,
  },
  discountPercentage: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E8F2FF',
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 16,
  },
  viewDetailsButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginRight: 6,
  },
  promoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  promoIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  promoEmoji: {
    fontSize: 12,
  },
  promoText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginRight: 8,
  },
  promoTag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  promoTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  membershipSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  membershipText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    flex: 1,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  rightContent: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  serviceImage: {
    
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  addedButton: {
  position: 'absolute',
  bottom: -8,
  alignSelf: 'center',
  backgroundColor: '#FF3B30',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 12,
},
  addedButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  editButton: {
    paddingVertical: 4,
  },
  editButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProductScreen;