import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

// Define your stack params
// export type RootStackParamList = {
//   Home: undefined;
//   CitySelection: undefined;
//   BrandSelection: { selectedCity: string };
//   Detail: { title: string };
// };

// Updated RootStackParamList with all screens
export type RootStackParamList = {
  Home: undefined;
  HomePage: undefined;
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
  CarDetails: {
    selectedCity: string;
    selectedBrand: string;
    brandLogo: string;
    selectedModel: string;
    modelImage: string;
    selectedFuel: string;
    fuelImage: string;
  };
  Detail: { 
    title: string; 
    selectedCity: string; 
    selectedBrand: string; 
    brandLogo: string 
  };
};
type HomeNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeNavProp;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <View style={styles.userIconContainer}> 
          <FontAwesome name="user-circle-o" size={24} color="#333" />
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.addressRow}>
          <Text style={styles.deliveryTimeText}>Header</Text>
            {/* <Text style={styles.addressText}>Home - Badram Enclave, Sector 9...</Text> */}
            {/* <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" /> */}
          </View>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          
          <View style={styles.topRow}>
            
            <TouchableOpacity 
              style={[styles.card, styles.zeptoCard]} 
              activeOpacity={0.9}
              onPress={async() => {
                const accessToken = await AsyncStorage.getItem('accessToken');
                if (!accessToken){
                  navigation.navigate('HomePage');
                }else{
                  navigation.navigate('CitySelection');
                }
              }}
            >
              <Text style={styles.zeptoLogo}>Car Servicing</Text>
              <Text style={styles.cardSubtext}>Best Luxury Car Servicing in all over India</Text>
              <Image 
                source={{uri: "/api/placeholder/80/80"}} 
                style={styles.groceryImage} 
                resizeMode="contain"
              />
            </TouchableOpacity>
           
            <TouchableOpacity 
              style={[styles.card, styles.zeptoCafeCard]} 
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Detail', { title: 'Buy or Sell cars', selectedCity: '', selectedBrand: '', brandLogo: '' })}
            >
              <View style={styles.cafeTopContent}>
                <View>
                  <Text style={styles.cafeText}>Buy or Sell</Text>
                  <Text style={styles.cafeLogo}>Cars</Text>
                </View>
                {/* <View style={styles.priceBubble}>
                  <Text style={styles.priceBubbleText}>FOOD AT</Text>
                  <Text style={styles.priceBubblePrice}>₹99</Text>
                </View> */}
              </View>
              <View style={styles.rowSpaceBetween}>
                <Text style={styles.hotFreshText}>Best Prices on Used Cars</Text>
                {/* <View style={styles.arrowCircle}>
                  <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                </View> */}
              </View>
              <Image 
                source={{uri: "/api/placeholder/120/80"}} 
                style={styles.foodImage} 
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Super Saver Card */}
          <TouchableOpacity 
            style={[styles.fullCard, styles.superSaverCard]} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Detail', { title: 'Buy Spare Parts', selectedCity: '', selectedBrand: '', brandLogo: '' })}
          >
            <View style={styles.rowSpaceBetween}>
              <View>
                <Text style={styles.lowestPriceText}>Buy Car Spare Parts</Text>
                <Text style={styles.noFeeText}>No delivery fee • Lowest Rates</Text>
              </View>
              <View style={styles.superSaverBadge}>
                <Text style={styles.superText}>SUPER</Text>
                <Text style={styles.saverText}>SPARES</Text>
              </View>
            </View>
            
            <View style={styles.rowSpaceBetween}>
              <Text style={styles.minOrderText}>Prices Starting at ₹999 Only!</Text>
              <View style={styles.darkArrowCircle}>
                <MaterialIcons name="arrow-forward" size={16} color="#fff" />
              </View>
            </View>
            
            <Image 
              source={{uri: "/api/placeholder/180/60"}} 
              style={styles.groceryBagImage} 
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Fresh Card */}
          {/* <TouchableOpacity 
            style={[styles.fullCard, styles.freshCard]} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Detail', { title: 'Zepto Fresh' })}
          >
            <View style={styles.rowSpaceBetween}>
              <View>
                <Text style={styles.sastaFreshText}>Sabse Sasta & Fresh</Text>
                <View style={styles.dailyRow}>
                  <Text style={styles.onlyWithText}>Only with</Text>
                  <View style={styles.dailyBadge}>
                    <Text style={styles.dailyText}>daily</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.zeptoFreshLogo}>zepto<Text style={styles.freshText}>.Fresh</Text></Text>
            </View>
            
            <View style={styles.fruitRow}>
              <View style={styles.fruitItem}>
                <View style={styles.discountBubble}>
                  <Text style={styles.discountText}>.12</Text>
                </View>
                <Image 
                  source={{uri: "/api/placeholder/70/70"}} 
                  style={styles.fruitImage} 
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.fruitItem}>
                <View style={styles.discountBubble}>
                  <Text style={styles.discountText}>.35</Text>
                </View>
                <Image 
                  source={{uri: "/api/placeholder/70/70"}} 
                  style={styles.fruitImage} 
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.fruitItem}>
                <View style={styles.discountBubble}>
                  <Text style={styles.discountText}>.25</Text>
                </View>
                <Image 
                  source={{uri: "/api/placeholder/70/70"}} 
                  style={styles.fruitImage} 
                  resizeMode="contain"
                />
              </View>
              
              <View style={styles.arrowContainer}>
                <View style={styles.blueArrowCircle}>
                  <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                </View>
              </View>
            </View>
            
            <Text style={styles.lowestPricesText}>Lowest prices on fresh Fruits, Veggies & more</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  userIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    marginRight: 12,
  },
  locationContainer: {
    flex: 1,
  },
  deliveryTimeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  highlightedText: {
    color: '#9932CC',
    fontWeight: '700',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  cardsContainer: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    height: 180,
  },
  fullCard: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  zeptoCard: {
    backgroundColor: '#9932CC',
  },
  zeptoCafeCard: {
    backgroundColor: '#FF6347',
  },
  superSaverCard: {
    backgroundColor: '#2E8B57',
    height: 180,
  },
  freshCard: {
    backgroundColor: '#1E90FF',
    height: 220,
  },
  zeptoLogo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  cardSubtext: {
    color: '#fff',
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  groceryImage: {
    width: 80,
    height: 80,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  cafeTopContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cafeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  cafeLogo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: -8,
  },
  priceBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
  },
  priceBubbleText: {
    color: '#333',
    fontSize: 10,
    fontWeight: '600',
  },
  priceBubblePrice: {
    color: '#333',
    fontSize: 16,
    fontWeight: '700',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  hotFreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  arrowCircle: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkArrowCircle: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueArrowCircle: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodImage: {
    width: 120,
    height: 80,
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  lowestPriceText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  noFeeText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  superSaverBadge: {
    alignItems: 'center',
  },
  superText: {
    color: '#FFFF00',
    fontSize: 18,
    fontWeight: '800',
  },
  saverText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  minOrderText: {
    color: '#FFFF00',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
  },
  groceryBagImage: {
    width: 180,
    height: 60,
    alignSelf: 'center',
    marginTop: 12,
  },
  sastaFreshText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  zeptoFreshLogo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  freshText: {
    fontWeight: '600',
  },
  dailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  onlyWithText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 4,
  },
  dailyBadge: {
    backgroundColor: '#FFFF00',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dailyText: {
    color: '#1E90FF',
    fontSize: 12,
    fontWeight: '700',
  },
  fruitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  fruitItem: {
    position: 'relative',
  },
  discountBubble: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#fff',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  discountText: {
    color: '#1E90FF',
    fontSize: 12,
    fontWeight: '700',
  },
  fruitImage: {
    width: 70,
    height: 70,
  },
  arrowContainer: {
    justifyContent: 'center',
  },
  lowestPricesText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
});