import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

interface CaseStudy {
  id: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  createdAt: string;
  differentialDiagnosis?: string[];
  treatment?: string[];
}

export default function CasesScreen() {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const savedCases = await AsyncStorage.getItem('medicalCases');
      if (savedCases) {
        setCases(JSON.parse(savedCases));
      }
    } catch (err: any) {
      Alert.alert('Error', `Failed to load case studies: ${err.message}`);
    }
  };

  const getRecentCases = () => {
    return cases
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Case Studies</Text>
        <Text style={styles.subtitle}>Practice clinical scenarios</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{cases.length}</Text>
            <Text style={styles.statLabel}>Total Cases</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {cases.filter(c => (c.differentialDiagnosis || []).length > 0).length}
            </Text>
            <Text style={styles.statLabel}>With Diagnosis</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {cases.filter(c => (c.treatment || []).length > 0).length}
            </Text>
            <Text style={styles.statLabel}>With Treatment</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Cases</Text>
          {cases.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome name="stethoscope" size={48} color="#A3A3C2" />
              <Text style={styles.emptyStateText}>No case studies yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Create your first case study to start practicing clinical scenarios
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push('/case-studies')}
              >
                <Text style={styles.createButtonText}>Create Case Study</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {getRecentCases().map((caseStudy) => (
                <TouchableOpacity
                  key={caseStudy.id}
                  style={styles.caseCard}
                  onPress={() => router.push('/case-studies-list')}
                >
                  <View style={styles.caseHeader}>
                    <Text style={styles.caseTitle}>{caseStudy.chiefComplaint}</Text>
                    <Text style={styles.caseDate}>{formatDate(caseStudy.createdAt)}</Text>
                  </View>
                  <Text style={styles.casePreview} numberOfLines={2}>
                    {caseStudy.historyOfPresentIllness}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push('/case-studies-list')}
              >
                <Text style={styles.viewAllText}>View All Cases</Text>
                <FontAwesome name="chevron-right" size={16} color="#4f8cff" />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/case-studies')}
            >
              <FontAwesome name="plus-circle" size={24} color="#4f8cff" />
              <Text style={styles.quickActionText}>New Case</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/case-studies-list')}
            >
              <FontAwesome name="list" size={24} color="#4f8cff" />
              <Text style={styles.quickActionText}>All Cases</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/medical-dictionary')}
            >
              <FontAwesome name="book" size={24} color="#4f8cff" />
              <Text style={styles.quickActionText}>Dictionary</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/case-studies')}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A3A3C2',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A3A3C2',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#A3A3C2',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#4f8cff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  caseCard: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  caseTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  caseDate: {
    color: '#A3A3C2',
    fontSize: 14,
  },
  casePreview: {
    color: '#A3A3C2',
    fontSize: 14,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  viewAllText: {
    color: '#4f8cff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4f8cff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
}); 