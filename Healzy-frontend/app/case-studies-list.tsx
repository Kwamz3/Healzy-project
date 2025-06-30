import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CaseStudiesListScreen() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
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
    } catch (err) {
      Alert.alert('Error', 'Failed to load case studies');
    }
  };

  const handleDeleteCase = async (caseId) => {
    Alert.alert(
      'Delete Case',
      'Are you sure you want to delete this case study?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedCases = cases.filter(c => c.id !== caseId);
              await AsyncStorage.setItem('medicalCases', JSON.stringify(updatedCases));
              setCases(updatedCases);
              setSelectedCase(null);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete case study');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Case Studies</Text>
        <Text style={styles.subtitle}>Review and manage your clinical cases</Text>
      </View>

      <ScrollView style={styles.casesContainer}>
        {cases.length === 0 ? (
          <View style={styles.emptyState}>
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
          cases.map((caseStudy) => (
            <TouchableOpacity
              key={caseStudy.id}
              style={styles.caseCard}
              onPress={() => setSelectedCase(caseStudy)}
            >
              <View style={styles.caseHeader}>
                <Text style={styles.caseTitle}>{caseStudy.chiefComplaint}</Text>
                <Text style={styles.caseDate}>{formatDate(caseStudy.createdAt)}</Text>
              </View>
              <Text style={styles.casePreview} numberOfLines={2}>
                {caseStudy.historyOfPresentIllness}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal
        visible={selectedCase !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedCase(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Case Details</Text>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Chief Complaint</Text>
                <Text style={styles.modalText}>{selectedCase?.chiefComplaint}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>History of Present Illness</Text>
                <Text style={styles.modalText}>{selectedCase?.historyOfPresentIllness}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Past Medical History</Text>
                <Text style={styles.modalText}>{selectedCase?.pastMedicalHistory}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Medications</Text>
                <Text style={styles.modalText}>{selectedCase?.medications}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Physical Exam</Text>
                <Text style={styles.modalText}>{selectedCase?.physicalExam}</Text>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Differential Diagnosis</Text>
                {selectedCase?.differentialDiagnosis.map((dx, index) => (
                  <Text key={index} style={styles.modalText}>• {dx}</Text>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Workup</Text>
                {selectedCase?.workup.map((item, index) => (
                  <Text key={index} style={styles.modalText}>• {item}</Text>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Treatment</Text>
                {selectedCase?.treatment.map((item, index) => (
                  <Text key={index} style={styles.modalText}>• {item}</Text>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => handleDeleteCase(selectedCase.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.closeButton]}
                onPress={() => setSelectedCase(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {cases.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/case-studies')}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
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
  casesContainer: {
    padding: 20,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#A3A3C2',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4f4f',
    marginRight: 8,
  },
  closeButton: {
    backgroundColor: '#4f8cff',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  fabText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
}); 