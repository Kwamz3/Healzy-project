import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SettingsDropdown from '../../components/SettingsDropdown';

import { HapticTab } from '../../components/HapticTab';
import { IconSymbol } from '../../components/ui/IconSymbol';
import TabBarBackground from '../../components/ui/TabBarBackground';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#181848',
          borderTopColor: '#23235b',
        },
        tabBarActiveTintColor: '#4f8cff',
        tabBarInactiveTintColor: '#A3A3C2',
        headerStyle: {
          backgroundColor: '#181848',
        },
        headerTintColor: '#fff',
        headerRight: () => <SettingsDropdown />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <FontAwesome name="plus-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          title: 'Cases',
          tabBarIcon: ({ color }) => <FontAwesome name="stethoscope" size={24} color={color} />,
        }}
      />
      {/* <Tabs.Screen
        name="clinical-skills"
        options={{
          title: 'Skills',
          tabBarIcon: ({ color }) => <FontAwesome name="graduation-cap" size={24} color={color} />,
        }}
      /> */}
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <FontAwesome name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
