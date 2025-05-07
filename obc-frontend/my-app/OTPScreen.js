import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import OTPVerify from 'react-native-otp-verify';


// Replace with your actual backend URL
const API_URL = 'http://192.168.89.14:8000'; // e.g., http://10.0.2.2:8000 for Android emulator accessing localhost

export default function OTPScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  // Start listening for OTP when screen loads
  useEffect(() => {
    // Get the hash for SMS listener
    OTPVerify.getHash()
      .then(hash => {
        console.log('SMS Retriever hash: ', hash);
        // You can send this hash to your backend for including in the SMS
      })
      .catch(error => console.log(error));

    // Start listening for OTP
    OTPVerify.startListener();
    
    // Handle OTP detection
    const otpHandler = (message) => {
      try {
        console.log('SMS received:', message);
        // Extract OTP code from message using regex
        // This regex pattern looks for 6 consecutive digits in the message
        const otpPattern = /(\d{6})/;
        const match = message.match(otpPattern);
        
        if (match && match[1]) {
          const receivedOtp = match[1];
          console.log('OTP detected:', receivedOtp);
          setOtp(receivedOtp);
          // Optionally auto-submit OTP
          // handleVerifyOtp();
        }
      } catch (error) {
        console.log('Error parsing OTP:', error);
      }
    };

    // Add and remove listeners
    OTPVerify.addListener(otpHandler);
    
    return () => {
      OTPVerify.removeListener();
    };
  }, []);


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
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      await axios.post(`${API_URL}/api/otp/request/`, {
        phone_number: formattedPhoneNumber,
      });
      
      Alert.alert('Success', 'OTP sent to your phone number.');
      setShowOtpInput(true);
      startResendTimer();
    } catch (error) {
      console.error('Request OTP Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP.');
      return;
    }
    
    setIsLoading(true);
    try {
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const response = await axios.post(`${API_URL}/api/otp/verify/`, {
        phone_number: formattedPhoneNumber,
        otp_code: otp,
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
              // navigation.navigate(response.data.is_new_user ? 'ProfileSetup' : 'Home');
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Phone Login</Text>
      
      {!showOtpInput ? (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter your phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 9876543210"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Text style={styles.hint}>We'll send a verification code to this number</Text>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.disabledButton]} 
            onPress={handleRequestOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Get OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Enter verification code</Text>
          <Text style={styles.subtitle}>We've sent an OTP to {phoneNumber}</Text>
          
          <TextInput
            style={styles.otpInput}
            placeholder="6-digit code"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
          />
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.disabledButton]} 
            onPress={handleVerifyOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </TouchableOpacity>
          
          {countdown > 0 ? (
            <Text style={styles.resendText}>Resend OTP in {countdown}s</Text>
          ) : (
            <TouchableOpacity 
              style={styles.resendButton} 
              onPress={handleRequestOtp}
              disabled={resendDisabled || isLoading}
            >
              <Text style={styles.resendButtonText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity onPress={() => setShowOtpInput(false)}>
            <Text style={styles.changeNumber}>Change phone number</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {userId && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            Login successful! User ID: {userId}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  otpInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  hint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  resendText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  resendButton: {
    marginTop: 20,
    padding: 10,
    alignSelf: 'center',
  },
  resendButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  changeNumber: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  successContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 8,
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
  successText: {
    color: '#155724',
    textAlign: 'center',
    fontSize: 16,
  }
});