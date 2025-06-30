import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CASE_TEMPLATES = [
  {
    id: 'cardiac',
    title: 'Cardiac Case',
    template: {
      chiefComplaint: 'Chest pain',
      historyOfPresentIllness: 'Patient presents with...',
      pastMedicalHistory: 'Previous conditions...',
      medications: 'Current medications...',
      physicalExam: 'Vital signs and findings...',
      differentialDiagnosis: ['1. ', '2. ', '3. '],
      workup: ['1. ', '2. ', '3. '],
      treatment: ['1. ', '2. ', '3. '],
    },
  },
  {
    id: 'respiratory',
    title: 'Respiratory Case',
    template: {
      chiefComplaint: 'Shortness of breath',
      historyOfPresentIllness: 'Patient presents with...',
      pastMedicalHistory: 'Previous conditions...',
      medications: 'Current medications...',
      physicalExam: 'Vital signs and findings...',
      differentialDiagnosis: ['1. ', '2. ', '3. '],
      workup: ['1. ', '2. ', '3. '],
      treatment: ['1. ', '2. ', '3. '],
    },
  },
  {
    id: 'neurological',
    title: 'Neurological Case',
    template: {
      chiefComplaint: 'Headache',
      historyOfPresentIllness: 'Patient presents with...',
      pastMedicalHistory: 'Previous conditions...',
      medications: 'Current medications...',
      physicalExam: 'Vital signs and findings...',
      differentialDiagnosis: ['1. ', '2. ', '3. '],
      workup: ['1. ', '2. ', '3. '],
      treatment: ['1. ', '2. ', '3. '],
    },
  },
];

export default function CaseStudiesScreen() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const router = useRouter();

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCaseData({ ...template.template });
  };

  const handleSaveCase = async () => {
    if (!caseData) return;
    
    try {
      const existing = await AsyncStorage.getItem('medicalCases');
      let cases = existing ? JSON.parse(existing) : [];
      cases.push({
        id: Date.now().toString(),
        ...caseData,
        createdAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem('medicalCases', JSON.stringify(cases));
      Alert.alert('Success', 'Case study saved!');
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to save case study');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medical Case Studies</Text>
        <Text style={styles.subtitle}>Create and manage clinical cases</Text>
      </View>

      {!selectedTemplate ? (
        <ScrollView style={styles.templatesContainer}>
          <Text style={styles.sectionTitle}>Choose a Template</Text>
          {CASE_TEMPLATES.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleSelectTemplate(template)}
            >
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateDesc}>Click to use this template</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.caseContainer}>
          <Text style={styles.sectionTitle}>Case Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chief Complaint</Text>
            <TextInput
              style={styles.input}
              value={caseData.chiefComplaint}
              onChangeText={(text) => setCaseData({ ...caseData, chiefComplaint: text })}
              placeholder="Enter chief complaint"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>History of Present Illness</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={caseData.historyOfPresentIllness}
              onChangeText={(text) => setCaseData({ ...caseData, historyOfPresentIllness: text })}
              placeholder="Enter HPI"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Past Medical History</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={caseData.pastMedicalHistory}
              onChangeText={(text) => setCaseData({ ...caseData, pastMedicalHistory: text })}
              placeholder="Enter PMH"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medications</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={caseData.medications}
              onChangeText={(text) => setCaseData({ ...caseData, medications: text })}
              placeholder="Enter medications"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Physical Exam</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={caseData.physicalExam}
              onChangeText={(text) => setCaseData({ ...caseData, physicalExam: text })}
              placeholder="Enter physical exam findings"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Differential Diagnosis</Text>
            {caseData.differentialDiagnosis.map((dx, index) => (
              <TextInput
                key={index}
                style={styles.input}
                value={dx}
                onChangeText={(text) => {
                  const newDx = [...caseData.differentialDiagnosis];
                  newDx[index] = text;
                  setCaseData({ ...caseData, differentialDiagnosis: newDx });
                }}
                placeholder={`Differential ${index + 1}`}
                placeholderTextColor="#888"
              />
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Workup</Text>
            {caseData.workup.map((item, index) => (
              <TextInput
                key={index}
                style={styles.input}
                value={item}
                onChangeText={(text) => {
                  const newWorkup = [...caseData.workup];
                  newWorkup[index] = text;
                  setCaseData({ ...caseData, workup: newWorkup });
                }}
                placeholder={`Workup item ${index + 1}`}
                placeholderTextColor="#888"
              />
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Treatment</Text>
            {caseData.treatment.map((item, index) => (
              <TextInput
                key={index}
                style={styles.input}
                value={item}
                onChangeText={(text) => {
                  const newTreatment = [...caseData.treatment];
                  newTreatment[index] = text;
                  setCaseData({ ...caseData, treatment: newTreatment });
                }}
                placeholder={`Treatment step ${index + 1}`}
                placeholderTextColor="#888"
              />
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setSelectedTemplate(null)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveCase}>
              <Text style={styles.saveBtnText}>Save Case</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  templatesContainer: {
    padding: 20,
  },
  caseContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  templateCard: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  templateTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  templateDesc: {
    color: '#A3A3C2',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  cancelBtn: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#4f8cff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 