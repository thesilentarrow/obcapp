import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AccountScreenNavigationProp = StackNavigationProp<RootStackParamList,'Account'>;
type Props={
    navigation: AccountScreenNavigationProp;
}

export const handleLogout = async (navigation: AccountScreenNavigationProp)=>{
    try{
     await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userPhoneNumber');
    console.log('User logged out successfully and AsyncStorage cleared.');

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (e) {
    console.error('Failed to clear AsyncStorage during logout.', e);
  }
};

const AccountScreen=({navigation}:Props)=>{
    return(
        <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      {/* You can add more account-related information here */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleLogout(navigation)}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AccountScreen;

