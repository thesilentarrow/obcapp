import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  RouteProp
} from '@react-navigation/native';
import {
  StackNavigationProp
} from '@react-navigation/stack';
import { RootStackParamList } from './HomeScreen';     

type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailNavProp = StackNavigationProp<RootStackParamList, 'Detail'>;

type Props = {
  route: DetailRouteProp;
  navigation: DetailNavProp;
};

export default function DetailScreen({ route }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This is the <Text style={styles.highlight}>{route.params.title}</Text> page
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  highlight: {
    color: 'crimson',
    fontWeight: '700',
  },
});
