import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ClinicalSkill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  lastPracticed: string;
  notes: string;
}

const CATEGORIES = [
  'History Taking',
  'Physical Examination',
  'Procedures',
  'Communication',
  'Clinical Reasoning',
];

export default function ClinicalSkillsScreen() {
  const [skills, setSkills] = useState<ClinicalSkill[]>([]);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: CATEGORIES[0],
    proficiency: 0,
    notes: '',
  });
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const savedSkills = await AsyncStorage.getItem('clinicalSkills');
      if (savedSkills) {
        setSkills(JSON.parse(savedSkills));
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const saveSkills = async (updatedSkills: ClinicalSkill[]) => {
    try {
      await AsyncStorage.setItem('clinicalSkills', JSON.stringify(updatedSkills));
      setSkills(updatedSkills);
    } catch (error) {
      console.error('Error saving skills:', error);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) {
      Alert.alert('Error', 'Please enter a skill name');
      return;
    }

    const skill: ClinicalSkill = {
      id: Date.now().toString(),
      ...newSkill,
      lastPracticed: new Date().toISOString(),
    };

    const updatedSkills = [...skills, skill];
    saveSkills(updatedSkills);
    setNewSkill({
      name: '',
      category: CATEGORIES[0],
      proficiency: 0,
      notes: '',
    });
    setIsAddingSkill(false);
  };

  const handleUpdateProficiency = (id: string, newProficiency: number) => {
    const updatedSkills = skills.map(skill =>
      skill.id === id
        ? { ...skill, proficiency: newProficiency, lastPracticed: new Date().toISOString() }
        : skill
    );
    saveSkills(updatedSkills);
  };

  const handleDeleteSkill = (id: string) => {
    Alert.alert(
      'Delete Skill',
      'Are you sure you want to delete this skill?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedSkills = skills.filter(skill => skill.id !== id);
            saveSkills(updatedSkills);
          },
        },
      ]
    );
  };

  const renderProficiencyStars = (proficiency: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => handleUpdateProficiency(skill.id, star)}
          >
            <FontAwesome
              name={star <= proficiency ? 'star' : 'star-o'}
              size={20}
              color={star <= proficiency ? '#FFD700' : '#A3A3C2'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clinical Skills</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddingSkill(true)}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {isAddingSkill && (
        <View style={styles.addSkillForm}>
          <TextInput
            style={styles.input}
            placeholder="Skill Name"
            placeholderTextColor="#A3A3C2"
            value={newSkill.name}
            onChangeText={text => setNewSkill({ ...newSkill, name: text })}
          />
          <View style={styles.categoryContainer}>
            {CATEGORIES.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  newSkill.category === category && styles.selectedCategory,
                ]}
                onPress={() => setNewSkill({ ...newSkill, category })}
              >
                <Text
                  style={[
                    styles.categoryText,
                    newSkill.category === category && styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes"
            placeholderTextColor="#A3A3C2"
            multiline
            value={newSkill.notes}
            onChangeText={text => setNewSkill({ ...newSkill, notes: text })}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setIsAddingSkill(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleAddSkill}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {skills.map(skill => (
        <View key={skill.id} style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillName}>{skill.name}</Text>
            <TouchableOpacity
              onPress={() => handleDeleteSkill(skill.id)}
              style={styles.deleteButton}
            >
              <FontAwesome name="trash" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
          <Text style={styles.category}>{skill.category}</Text>
          {renderProficiencyStars(skill.proficiency)}
          {skill.notes && <Text style={styles.notes}>{skill.notes}</Text>}
          <Text style={styles.lastPracticed}>
            Last practiced: {new Date(skill.lastPracticed).toLocaleDateString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181848',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#4f8cff',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSkillForm: {
    backgroundColor: '#23235b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#181848',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#181848',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#4f8cff',
  },
  categoryText: {
    color: '#A3A3C2',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#23235b',
  },
  saveButton: {
    backgroundColor: '#4f8cff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  skillCard: {
    backgroundColor: '#23235b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  skillName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteButton: {
    padding: 5,
  },
  category: {
    color: '#4f8cff',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  notes: {
    color: '#A3A3C2',
    marginBottom: 10,
  },
  lastPracticed: {
    color: '#A3A3C2',
    fontSize: 12,
  },
}); 