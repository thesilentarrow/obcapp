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
  Platform
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

const API_URL = 'https://0eaa-143-244-61-134.ngrok-free.app';

const ProductScreen = ({ navigation, route }: Props) => {
  const { categorySlug, categoryName } = route.params;
  const [services, setServices] = useState<ServiceData[]>([]);
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  
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
      setServices(response.data.services);
      setCategory(response.data.category);
      
      // Log pricing context for debugging
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

  // Use useMemo to create a stable hash of car details to prevent duplicate calls
  const carDetailsHash = useMemo(() => {
    // Only create hash when car selection is completed to avoid intermediate states
    if (carState.hasCompletedSelection) {
      return `${carState.selectedBrand || ''}-${carState.selectedModel || ''}-${carState.selectedFuel || ''}-${carState.selectedCity || ''}`;
    }
    // Return a stable value when car selection is not complete
    return 'no-car-selected';
  }, [carState.hasCompletedSelection, carState.selectedBrand, carState.selectedModel, carState.selectedFuel, carState.selectedCity]);

  // Use useEffect with proper debouncing
  useEffect(() => {
    // Add a small delay to batch multiple rapid state changes
    const timeoutId = setTimeout(() => {
      fetchServices();
    }, 100); // 100ms debounce

    return () => clearTimeout(timeoutId);
  }, [fetchServices]);

  const handleServiceSelect = (service: ServiceData) => {
    navigation.navigate('ServiceDetailScreen', { service });
  };

  const renderServiceCard = (service: ServiceData, index: number) => (
    <TouchableOpacity
      key={service.id}
      style={[
        styles.serviceCard,
        service.is_featured && styles.featuredServiceCard,
        { marginTop: index === 0 ? 0 : 12 }
      ]}
      onPress={() => handleServiceSelect(service)}
      activeOpacity={0.95}
    >
      {/* Service Header */}
      <View style={styles.serviceHeader}>
        <View style={styles.serviceTitleContainer}>
          <Text style={styles.serviceTitle} numberOfLines={2}>
            {service.header}
          </Text>
          {service.is_featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color="#FFFFFF" />
              <Text style={styles.featuredText}>Popular</Text>
            </View>
          )}
        </View>
        
        {/* Price Display */}
        <View style={styles.priceContainer}>
          {service.display_price ? (
            <View style={styles.priceWrapper}>
              <Text style={styles.priceText}>₹{service.display_price}</Text>
              {service.real_price && service.real_price !== service.price && (
                <View style={styles.priceTypeIndicator}>
                  <Text style={styles.priceTypeText}>Real-time</Text>
                </View>
              )}
            </View>
          ) : carForPricing.hasCarDetails ? (
            // Show NA when car is selected but no specific price available
            <View style={styles.priceWrapper}>
              <Text style={styles.naPriceText}>NA</Text>
              <View style={styles.priceTypeIndicator}>
                <Text style={styles.priceTypeText}>Car-specific</Text>
              </View>
            </View>
          ) : (
            // Show generic message when no car selected
            <View style={styles.priceWrapper}>
              <Text style={styles.selectCarPriceText}>Select car for pricing</Text>
            </View>
          )}
        </View>
      </View>

      {/* Service Details */}
      <View style={styles.serviceContent}>
        <Text style={styles.includesLabel}>What's included:</Text>
        <View style={styles.detailsList}>
          {service.details_list.slice(0, 3).map((detail, detailIndex) => (
            <View key={detailIndex} style={styles.detailItem}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark" size={14} color="#27AE60" />
              </View>
              <Text style={styles.detailText} numberOfLines={1}>
                {detail}
              </Text>
            </View>
          ))}
          {service.details_list.length > 3 && (
            <Text style={styles.moreItemsText}>
              +{service.details_list.length - 3} more services included
            </Text>
          )}
        </View>
      </View>

      {/* Service Footer */}
      <View style={styles.serviceFooter}>
        <View style={styles.durationContainer}>
          {service.duration && (
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={14} color="#757575" />
              <Text style={styles.durationText}>{service.duration}</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.selectButton,
            service.is_featured && styles.featuredSelectButton
          ]}
          onPress={() => handleServiceSelect(service)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.selectButtonText,
            service.is_featured && styles.featuredSelectButtonText
          ]}>
            Select
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={16} 
            color={service.is_featured ? "#FFFFFF" : "#000000"} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
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
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>

        {/* Loading State */}
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
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Category Introduction */}
        {category && (
          <View style={styles.categoryIntro}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            {category.description && (
              <Text style={styles.categoryDescription}>
                {category.description}
              </Text>
            )}
            <View style={styles.servicesCount}>
              <Text style={styles.servicesCountText}>
                {services.length} service{services.length !== 1 ? 's' : ''} available
              </Text>
            </View>
            
            {/* Car Selection Status */}
            <View style={styles.carSelectionContainer}>
              {carForPricing.hasCarDetails ? (
                <View style={styles.carContextInfo}>
                  <Text style={styles.carContextLabel}>Pricing for:</Text>
                  <Text style={styles.carContextText}>
                    {carForPricing.getPricingContext()}
                  </Text>
                  <TouchableOpacity 
                    style={styles.changeCarButton}
                    onPress={() => navigation.navigate('CitySelection')}
                  >
                    <Text style={styles.changeCarText}>Change Car</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.selectCarButton}
                  onPress={() => navigation.navigate('CitySelection')}
                >
                  <Ionicons name="car-outline" size={20} color="#000000" />
                  <Text style={styles.selectCarText}>Select Your Car for Real-time Pricing</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Services List */}
        <View style={styles.servicesContainer}>
          {services.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Choose a service</Text>
              {services.map((service, index) => renderServiceCard(service, index))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={64} color="#E0E0E0" />
              <Text style={styles.emptyStateTitle}>No services available</Text>
              <Text style={styles.emptyStateDescription}>
                We're working on adding more services to this category
              </Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchServices}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F8F9FA',
  },
  categoryIntro: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 16,
    color: '#757575',
    lineHeight: 24,
    marginBottom: 16,
  },
  servicesCount: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  servicesCountText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  carSelectionContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  carContextInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  carContextLabel: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '500',
  },
  carContextText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
    flex: 1,
  },
  changeCarButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  changeCarText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '500',
  },
  selectCarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 8,
  },
  selectCarText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    flex: 1,
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  featuredServiceCard: {
    borderColor: '#000000',
    borderWidth: 1.5,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceTitleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 8,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceWrapper: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  naPriceText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9E9E9E',
  },
  selectCarPriceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#757575',
    fontStyle: 'italic',
  },
  priceTypeIndicator: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  priceTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  serviceContent: {
    marginBottom: 20,
  },
  includesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  detailsList: {
    marginBottom: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#333333',
    flex: 1,
    lineHeight: 20,
  },
  moreItemsText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 32,
    fontWeight: '500',
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flex: 1,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  durationText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
    fontWeight: '500',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  featuredSelectButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  featuredSelectButtonText: {
    color: '#FFFFFF',
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
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ProductScreen;