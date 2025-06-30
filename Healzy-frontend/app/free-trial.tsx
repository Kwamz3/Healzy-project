import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BENEFITS = [
  'Unlimited flashcard sets',
  'Access to premium study tools',
  'No ads',
  'Priority support',
  'Early access to new features',
];

export default function FreeTrialScreen() {
  const router = useRouter();

  const handleStartTrial = async () => {
    await AsyncStorage.setItem('freeTrialActive', 'true');
    Alert.alert('Success', 'Your free trial has started!', [
      { text: 'OK', onPress: () => router.replace('/profile') }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Your Free Trial</Text>
      <Text style={styles.subtitle}>Enjoy all premium features for 7 days, no credit card required!</Text>
      <FlatList
        data={BENEFITS}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.benefitRow}>
            <Text style={styles.benefitIcon}>✔️</Text>
            <Text style={styles.benefitText}>{item}</Text>
          </View>
        )}
        style={{ marginVertical: 24 }}
      />
      <TouchableOpacity style={styles.ctaBtn} onPress={handleStartTrial}>
        <Text style={styles.ctaBtnText}>Start Free Trial</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.dismissBtn} onPress={() => router.back()}>
        <Text style={styles.dismissBtnText}>Maybe later</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181848',
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A3A3C2',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 18,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    marginRight: 10,
    color: '#4f8cff',
  },
  benefitText: {
    color: '#fff',
    fontSize: 16,
  },
  ctaBtn: {
    backgroundColor: '#4f8cff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 18,
    marginBottom: 10,
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  ctaBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  dismissBtn: {
    marginTop: 8,
  },
  dismissBtnText: {
    color: '#A3A3C2',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 