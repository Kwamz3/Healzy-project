import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [trialActive, setTrialActive] = useState(false);

  useEffect(() => {
    (async () => {
      const flag = await AsyncStorage.getItem('freeTrialActive');
      setTrialActive(flag === 'true');
    })();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace('/auth');
  };

  const handleFreeTrial = async () => {
    router.push('/free-trial');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
      {/* Header with back arrow and Free trial badge */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>{'\u2039'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        {!trialActive && (
          <TouchableOpacity style={styles.trialBtn} onPress={handleFreeTrial}>
            <Text style={styles.trialBtnText}>Free trial</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Avatar and username */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          {/* Placeholder avatar icon */}
          <Image source={require('../assets/images/avatar-placeholder.png')} style={styles.avatarImg} />
        </View>
        <Text style={styles.username}>{user?.name || user?.email || 'User'}</Text>
      </View>

      {/* Settings and Activity cards */}
      <View style={styles.cardList}>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIconCircle}>
            <Text style={styles.cardIcon}>⚙️</Text>
          </View>
          <Text style={styles.cardText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <View style={styles.cardIconCircle}>
            <Text style={styles.cardIcon}>🔔</Text>
          </View>
          <Text style={styles.cardText}>Activity</Text>
        </TouchableOpacity>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsRow}>
        <Text style={styles.achievementsTitle}>Achievements</Text>
        <TouchableOpacity>
          <Text style={styles.achievementsViewAll}>View all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.achievementCard}>
        <View style={styles.achievementIconCircle}>
          <Text style={styles.achievementIcon}>🔥</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.achievementCardTitle}>Start a study streak</Text>
          <Text style={styles.achievementCardDesc}>Streaks help you stay motivated and reach your goals.\nStart your first streak today!</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181848',
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  trialBtn: {
    backgroundColor: '#FFD600',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  trialBtnText: {
    color: '#181848',
    fontWeight: '700',
    fontSize: 15,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#23235b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarImg: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardList: {
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#23235b',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  cardIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#292966',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardIcon: {
    fontSize: 18,
    color: '#FFD600',
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  achievementsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  achievementsTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  achievementsViewAll: {
    color: '#A3A3C2',
    fontSize: 14,
    fontWeight: '500',
  },
  achievementCard: {
    backgroundColor: '#23235b',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  achievementIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#292966',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementIcon: {
    fontSize: 22,
    color: '#FFD600',
  },
  achievementCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  achievementCardDesc: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  logoutBtn: {
    backgroundColor: '#ff4d4d',
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
