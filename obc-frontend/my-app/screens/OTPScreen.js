import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import axios from 'axios';

// Replace with your actual backend URL
const API_URL = 'http://192.168.9.38:8000'; // e.g., http://10.0.2.2:8000 for Android emulator accessing localhost

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  
  const inputRefs = useRef([]);
  
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      setResendDisabled(true);
    } else {
      setResendDisabled(false);
    }      
    return () => clearTimeout(timer);
  }, [countdown]);

  const startResendTimer = () => {
    setCountdown(60); // 60 seconds cooldown
  };

  const handleRequestOtp = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Format phone number with country code if needed
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `${countryCode}${phoneNumber}`;
      
      // Send the request to your backend
      await axios.post(`${API_URL}/api/otp/request/`, {
        phone_number: formattedPhoneNumber,
      });
      
      setShowOtpInput(true);
      startResendTimer();
    } catch (error) {
      console.error('Request OTP Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpChange = (index, value) => {
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Move to next input if current one is filled
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyPress = (index, e) => {
    // Move to previous input on backspace press
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP.');
      return;
    }
    
    setIsLoading(true);
    try {
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `${countryCode}${phoneNumber}`;
      const response = await axios.post(`${API_URL}/api/otp/verify/`, {
        phone_number: formattedPhoneNumber,
        otp_code: otpCode,
      });

      // Store tokens securely
      // For production, use AsyncStorage or SecureStore:
      // await SecureStore.setItemAsync('accessToken', response.data.access);
      // await SecureStore.setItemAsync('refreshToken', response.data.refresh);
      
      setUserId(response.data.user_id);
      
      Alert.alert(
        'Success', 
        `OTP Verified! ${response.data.is_new_user ? 'Welcome, new user!' : 'Welcome back!'}`,
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate to home screen or profile setup for new users
              navigation.navigate(response.data.is_new_user ? 'ProfileSetup' : 'Home');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Verify OTP Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (showOtpInput) {
      setShowOtpInput(false);
    } else {
      navigation.goBack();
    }
  };

  const handleSkip = () => {
    // Navigate to the home screen or next screen
    navigation.navigate('Home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            {!showOtpInput && (
              <Text style={styles.skipText} onPress={handleSkip}>
                Skip
              </Text>
            )}
          </View>

          {!showOtpInput ? (
            <View style={styles.content}>
              <Text style={styles.title}>Login with{'\n'}your mobile number.</Text>

              <View style={styles.inputContainer}>
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="99999 99999"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={10}
                />
              </View>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleRequestOtp}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.continueButtonText}>Continue</Text>
                    <Text style={styles.arrowIcon}>→</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>By logging in, you agree to</Text>
                <View style={styles.bulletPoint}>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.termsLink}>
                    OnlyBigCar's Privacy Policy and Terms & Conditions
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.otpContent}>
              <View style={styles.imageContainer}>
                <Svg width="150" height="150" viewBox="0 0 300 300">
                  {/* Background glow */}
                  <Circle cx="150" cy="150" r="120" fill="#FFF1E6" opacity="0.8"/>
                  <Circle cx="150" cy="150" r="100" fill="#FFE4D4" opacity="0.6"/>
                  
                  {/* Phone outline */}
                  <Rect x="110" y="70" width="80" height="160" rx="15" ry="15" fill="#fff" stroke="#FF8A48" strokeWidth="4"/>
                  
                  {/* Phone camera and speaker */}
                  <Circle cx="150" cy="85" r="3" fill="#DDDDDD"/>
                  <Rect x="137" y="95" width="26" height="4" rx="2" ry="2" fill="#DDDDDD"/>
                  
                  {/* Verification checkmark badge */}
                  <Circle cx="150" cy="150" r="30" fill="#A5D6A7"/>
                  <Path d="M140 150 L147 157 L162 142" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
              </View>       
              
              <Text style={styles.otpTitle}>Enter OTP</Text>
              <Text style={styles.otpSubtitle}>
                We have sent you access code via SMS{'\n'}mobile number verification
              </Text>

              <View style={styles.otpInputsContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.otpInputBox}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(index, value)}
                    onKeyPress={(e) => handleKeyPress(index, e)}
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't Receive the OTP?</Text>
                <TouchableOpacity 
                  onPress={handleRequestOtp} 
                  disabled={resendDisabled || isLoading}
                >
                  <Text style={[
                    styles.resendCodeText,
                    resendDisabled && styles.resendDisabled
                  ]}>
                    Resend Code
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  skipText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 36,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    height: 56,
  },
  countryCodeContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
    color: '#333',
  },
  continueButton: {
    backgroundColor: '#E53935',
    borderRadius: 4,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  termsContainer: {
    marginTop: 16,
  },
  termsText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  dot: {
    marginRight: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#757575',
  },
  termsLink: {
    fontSize: 14,
    color: '#757575',
    flexShrink: 1,
  },
  
  // OTP Screen styles
  otpContent: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  verificationImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  otpInputBox: {
    width: 45,
    height: 60,
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 5,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#E53935',
    borderRadius: 4,
    height: 56,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  resendCodeText: {
    fontSize: 14,
    color: '#E53935',
    fontWeight: '500',
  },
  resendDisabled: {
    color: '#BDBDBD',
  },
});

export default LoginScreen;