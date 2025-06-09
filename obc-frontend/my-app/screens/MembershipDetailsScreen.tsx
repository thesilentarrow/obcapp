import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ScreenNavigationProp } from '../types/navigation'; // Ensure this path is correct
// RootStackParamList might not be directly needed here if ScreenNavigationProp is well-defined
// import { RootStackParamList } from '../types/navigation'; 

// Type definitions
interface MembershipPlan {
  id: string;
  title: string;
  price: string;
  duration: string;
  color: [string,string];
  icon: keyof typeof Ionicons.glyphMap; // Assuming these are Ionicons names
  popular?: boolean;
  benefits: string[];
}

interface Feature {
  icon: keyof typeof Ionicons.glyphMap; // Assuming these are Ionicons names
  title: string;
  description: string;
}

interface MembershipDetailsScreenProps {
  navigation: ScreenNavigationProp<'MembershipDetails'>; // Use the specific navigation type
}

interface PlanCardProps {
  plan: MembershipPlan;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

interface FeatureCardProps {
  feature: Feature;
}

const { width } = Dimensions.get('window'); // height was unused

const MembershipDetailsScreen = ({ navigation }: MembershipDetailsScreenProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  const membershipPlans: MembershipPlan[] = [
    {
      id: 'basic',
      title: 'Basic',
      price: '₹599',
      duration: '/year',
      color: ['#757575', '#424242'],
      icon: 'shield-outline',
      benefits: [
        'Priority booking',
        '10% discount on services',
        'Free inspection',
        'Basic support'
      ]
    },
    {
      id: 'premium',
      title: 'Premium',
      price: '₹999',
      duration: '/year',
      color: ['#E53935', '#B71C1C'],
      icon: 'diamond-outline', // Corrected from shield-outline if it was a copy-paste error, ensure icon names are correct
      popular: true,
      benefits: [
        'Priority service booking',
        'Up to 25% discount',
        'Free home pickup & drop',
        'Dedicated support',
        'Special seasonal offers',
        'Extended warranty'
      ]
    },
    {
      id: 'elite',
      title: 'Elite',
      price: '₹1499',
      duration: '/year',
      color: ['#FFD700', '#FFA000'],
      icon: 'trophy-outline',
      benefits: [
        'VIP priority booking',
        'Up to 35% discount',
        'Free pickup & drop',
        '24/7 dedicated support',
        'Exclusive offers',
        'Extended warranty',
        'Free car wash monthly'
      ]
    }
  ];

  const features: Feature[] = [
    {
      icon: 'time-outline',
      title: 'Save Time',
      description: 'Skip the queue with priority booking'
    },
    {
      icon: 'wallet-outline',
      title: 'Save Money',
      description: 'Get exclusive discounts on all services'
    },
    {
      icon: 'car-outline',
      title: 'Convenience',
      description: 'Free pickup and drop at your location'
    },
    {
      icon: 'headset-outline',
      title: 'Support',
      description: 'Dedicated customer support team'
    }
  ];

  const PlanCard = ({ plan, isSelected, onSelect }: PlanCardProps) => (
    <TouchableOpacity
      style={[styles.planCard, isSelected && styles.selectedPlanCard]}
      onPress={() => onSelect(plan.id)}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <LinearGradient
        colors={plan.color}
        style={styles.planGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.planHeader}>
          <Ionicons name={plan.icon} size={32} color="#FFFFFF" />
          <Text style={styles.planTitle}>{plan.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <Text style={styles.planDuration}>{plan.duration}</Text>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          {plan.benefits.map((benefit: string, index: number) => (
            <View key={index} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const FeatureCard = ({ feature }: FeatureCardProps) => (
    <View style={styles.featureCard}>
      <View style={styles.featureIconContainer}>
        <Ionicons name={feature.icon} size={24} color="#E53935" />
      </View>
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#E53935" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#E53935', '#B71C1C']}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()} // Optional chaining for safety, though navigation should exist
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            {/* The "crown" icon issue might be specific to your environment's type resolution for FontAwesome.
                Ensure "crown" is a valid name for the FontAwesome set you're using. */}
            
            <Text style={styles.headerTitle}>Premium Membership</Text>
            <Text style={styles.headerSubtitle}>Unlock Exclusive Benefits</Text>
          </View>

          <View style={styles.decorativeElements}>
            <View style={[styles.decorativeCircle, { top: -20, right: -20 }]} />
            <View style={[styles.decorativeCircle, { bottom: -30, right: 50, opacity: 0.3 }]} />
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose Membership?</Text>
            <View style={styles.featuresGrid}>
              {features.map((featureItem: Feature, index: number) => ( // Renamed 'feature' to 'featureItem' to avoid conflict if any, and typed
                <FeatureCard key={index} feature={featureItem} />
              ))}
            </View>
          </View>

          {/* Plans Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.plansContainer}
            >
              {membershipPlans.map((planItem: MembershipPlan) => ( // Renamed 'plan' to 'planItem' and typed
                <PlanCard
                  key={planItem.id}
                  plan={planItem}
                  isSelected={selectedPlan === planItem.id}
                  onSelect={setSelectedPlan}
                />
              ))}
            </ScrollView>
          </View>

          {/* Benefits Highlight */}
          <View style={styles.section}>
            <View style={styles.highlightCard}>
              <LinearGradient
                colors={['#FFE0E0', '#FFFFFF']}
                style={styles.highlightGradient}
              >
                <View style={styles.highlightHeader}>
                  <MaterialIcons name="verified" size={24} color="#E53935" />
                  <Text style={styles.highlightTitle}>Member Benefits</Text>
                </View>

                <View style={styles.highlightContent}>
                  <View style={styles.highlightRow}>
                    <Ionicons name="flash" size={20} color="#E53935" />
                    <Text style={styles.highlightText}>Instant booking confirmation</Text>
                  </View>
                  <View style={styles.highlightRow}>
                    <Ionicons name="gift" size={20} color="#E53935" />
                    <Text style={styles.highlightText}>Birthday special discounts</Text>
                  </View>
                  <View style={styles.highlightRow}>
                    <Ionicons name="calendar" size={20} color="#E53935" />
                    <Text style={styles.highlightText}>Service reminders</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Testimonial */}
          <View style={styles.section}>
            <View style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
                  style={styles.testimonialAvatar}
                />
                <View>
                  <Text style={styles.testimonialName}>Rahul Kumar</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star: number) => ( // Typed star
                      <FontAwesome key={star} name="star" size={12} color="#FFD700" />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "Premium membership saved me so much time and money! The priority booking and home pickup service is amazing."
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomCTA}>
          <TouchableOpacity style={styles.ctaButton}>
            <LinearGradient
              colors={['#E53935', '#B71C1C']}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Join Premium Now</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.learnMoreButton}>
            <Text style={styles.learnMoreText}>Learn More</Text>
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
  },
  header: {
    paddingTop: 20, // Consider using StatusBar.currentHeight for Android if needed
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start', // Ensure it's positioned correctly
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: -1, // Ensure it's behind content
  },
  decorativeCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%', // Ensure this works well with spacing
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12, // Or use gap in featuresGrid if using a newer React Native version
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFE0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
  plansContainer: {
    paddingRight: 20, // Or paddingHorizontal on the ScrollView if preferred
  },
  planCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlanCard: {
    borderColor: '#E53935', // Make sure this color contrasts well
  },
  popularBadge: {
    position: 'absolute',
    top: 0, // Adjust if overlapping with border
    right: 0, // Adjust if overlapping with border
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#212121',
  },
  planGradient: {
    padding: 20,
    minHeight: 280, // Consider dynamic height based on content
    justifyContent: 'space-between', // To better distribute content
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  planDuration: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  benefitsContainer: {
    // flex: 1, // Can be removed if minHeight on planGradient handles space
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1, // Allow text to wrap
  },
  highlightCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#FFFFFF', // Add a base background color
  },
  highlightGradient: {
    padding: 20,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 8,
  },
  highlightContent: {
    gap: 12,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightText: {
    fontSize: 15,
    color: '#424242',
    marginLeft: 12,
  },
  testimonialCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  testimonialText: {
    fontSize: 15,
    color: '#424242',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  bottomCTA: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  ctaButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  learnMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  learnMoreText: {
    fontSize: 16,
    color: '#E53935',
    fontWeight: '600',
  },
});

export default MembershipDetailsScreen;