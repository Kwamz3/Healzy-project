import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function Onboarding3() {
  const router = useRouter();

  const handleSkip = () => {
    router.replace('/auth');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <Image
        source={require('../../assets/onboarding/onboarding3.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.title}>Track Progress</Text>
        <Text style={styles.subtitle}>
          Monitor your learning journey and improve your skills
        </Text>
      </View>
    </View>
  );
} 