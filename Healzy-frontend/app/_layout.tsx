import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { ToastProvider } from '../components/Toast';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from '../hooks/useColorScheme';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function MainLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        let onboardingComplete;
        if (Platform.OS === 'web') {
          onboardingComplete = localStorage.getItem('onboardingComplete');
        } else {
          onboardingComplete = await SecureStore.getItemAsync('onboardingComplete');
        }
        setShowOnboarding(onboardingComplete !== 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setShowOnboarding(true);
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (showOnboarding === null) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';

    if (showOnboarding && !inOnboardingGroup) {
      router.replace('/onboarding');
    } else if (!showOnboarding && !user && !inAuthGroup) {
      router.replace('/auth');
    } else if (user && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/(tabs)/home');
    }
  }, [user, segments, showOnboarding]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync().catch(() => {
        // Ignore error
      });
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ToastProvider>
  );
}
