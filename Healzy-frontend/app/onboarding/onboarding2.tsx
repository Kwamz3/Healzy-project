import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function Onboarding2() {
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
        source={require('../../assets/onboarding/onboarding2.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.title}>Create Case Studies</Text>
        <Text style={styles.subtitle}>
          Generate detailed medical case studies with AI assistance
        </Text>
      </View>
    </View>
  );
} 