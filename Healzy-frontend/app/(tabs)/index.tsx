import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '../../components/Toast';

type Route = '/(tabs)/cases' | '/medical-dictionary' | '/create-flashcard-set' | '/notes';

interface Feature {
  title: string;
  description: string;
  icon: keyof typeof FontAwesome.glyphMap;
  route: Route;
  color: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      router.replace('/auth' as any);
      toast.show('Logged out successfully', 'success');
    } catch (error: any) {
      toast.show(`Error logging out: ${error.message}`, 'error');
    }
  };

  const features: Feature[] = [
    {
      title: 'Case Studies',
      description: 'Practice clinical scenarios and improve your diagnostic skills',
      icon: 'stethoscope',
      route: '/(tabs)/cases',
      color: '#4f8cff',
    },
    {
      title: 'Medical Dictionary',
      description: 'Look up medical terms and definitions',
      icon: 'book',
      route: '/medical-dictionary',
      color: '#ff6b6b',
    },
    {
      title: 'Flashcards',
      description: 'Create and study medical flashcards',
      icon: 'clone',
      route: '/create-flashcard-set',
      color: '#4cd964',
    },
    {
      title: 'Notes',
      description: 'Take and organize your medical notes',
      icon: 'pencil',
      route: '/notes',
      color: '#ff9500',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to Healzy</Text>
          <Text style={styles.subtitle}>Your Medical Learning Companion</Text>
        </View>
        {/* <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <FontAwesome name="sign-out" size={24} color="#A3A3C2" />
        </TouchableOpacity> */}
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={() => router.push(feature.route as any)}
            >
              <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
                <FontAwesome name={feature.icon} size={24} color="#fff" />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.recentCard}>
            <FontAwesome name="clock-o" size={20} color="#A3A3C2" />
            <Text style={styles.recentText}>No recent activity</Text>
          </View>
        </View>

        <View style={styles.quickStartSection}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <TouchableOpacity
            style={styles.quickStartCard}
            onPress={() => router.push('/cases')}
          >
            <View style={styles.quickStartContent}>
              <Text style={styles.quickStartTitle}>Start a New Case Study</Text>
              <Text style={styles.quickStartDescription}>
                Practice your clinical reasoning with a new case
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={20} color="#A3A3C2" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181848',
    paddingTop: 60,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A3A3C2',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  featureCard: {
    width: '50%',
    padding: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#A3A3C2',
    lineHeight: 16,
  },
  recentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
  },
  recentText: {
    color: '#A3A3C2',
    marginLeft: 12,
    fontSize: 14,
  },
  quickStartSection: {
    padding: 20,
    paddingTop: 0,
  },
  quickStartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
  },
  quickStartContent: {
    flex: 1,
  },
  quickStartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  quickStartDescription: {
    fontSize: 14,
    color: '#A3A3C2',
  },
}); 