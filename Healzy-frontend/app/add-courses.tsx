import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

const POPULAR_SCHOOLS = [
  { name: 'Harvard Medical School', location: 'Boston, MA' },
  { name: 'Johns Hopkins School of Medicine', location: 'Baltimore, MD' },
  { name: 'Kwame Nkrumah University of Science and Technology ', location: 'Kumasi, GH' },
  { name: 'University of Cape Town', location: 'Cape Town, GH' },
  { name: 'Stanford School of Medicine', location: 'Stanford, CA' },
  { name: 'Mayo Clinic School of Medicine', location: 'Rochester, MN' },
  { name: 'UCLA David Geffen School of Medicine', location: 'Los Angeles, CA' },
  { name: 'University of Pennsylvania Perelman School of Medicine', location: 'Philadelphia, PA' },
  { name: 'Columbia University Vagelos College of Physicians and Surgeons', location: 'New York, NY' },
];

const COMMON_MEDICAL_COURSES = [
  'Anatomy',
  'Physiology',
  'Biochemistry',
  'Pharmacology',
  'Pathology',
  'Microbiology',
  'Immunology',
  'Neurology',
  'Cardiology',
  'Respiratory Medicine',
  'Gastroenterology',
  'Endocrinology',
  'Clinical Skills',
  'Medical Ethics',
  'Evidence-Based Medicine',
];

export default function AddCoursesScreen() {
  const [schoolSearch, setSchoolSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<{ name: string; location: string } | null>(null);
  const [courses, setCourses] = useState<string[]>(['']);
  const [courseSearch, setCourseSearch] = useState('');
  const [connectionType, setConnectionType] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const state = await NetInfo.fetch();
        setConnectionType(state.type);
        console.log('Connection type:', state.type);
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setConnectionType(state.type);
      console.log('Connection type changed:', state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredSchools = POPULAR_SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const filteredCourses = COMMON_MEDICAL_COURSES.filter(c =>
    c.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const handleSelectSchool = (school: { name: string; location: string }) => {
    setSelectedSchool(school);
  };

  const handleAddCourse = () => {
    setCourses([...courses, '']);
  };

  const handleCourseChange = (text: string, idx: number) => {
    const newCourses = [...courses];
    newCourses[idx] = text;
    setCourses(newCourses);
  };

  const handleRemoveCourse = (idx: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== idx));
    }
  };

  const handleSelectCourse = (course: string) => {
    const newCourses = [...courses];
    newCourses[newCourses.length - 1] = course;
    setCourses(newCourses);
    setCourseSearch('');
  };

  const handleSave = async () => {
    if (!selectedSchool) {
      Alert.alert('Error', 'Please select a medical school');
      return;
    }
    const validCourses = courses.filter(c => c.trim());
    if (validCourses.length === 0) {
      Alert.alert('Error', 'Please enter at least one medical course');
      return;
    }
    try {
      await AsyncStorage.setItem('userSchool', JSON.stringify(selectedSchool));
      await AsyncStorage.setItem('userCourses', JSON.stringify(validCourses));
      Alert.alert('Success', 'Medical school and courses saved!');
      router.replace('/(tabs)/home');
    } catch (e: any) {
      Alert.alert('Error', `Failed to save: ${e.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Medical Courses</Text>
        <Text style={styles.subtitle}>Select your medical school and add your courses</Text>
        <Text style={styles.connectionType}>Connection: {connectionType}</Text>
      </View>
      <Text style={styles.label}>Medical School</Text>
      <TextInput
        style={styles.input}
        placeholder="Search medical schools..."
        value={schoolSearch}
        onChangeText={setSchoolSearch}
        placeholderTextColor="#888"
      />
      {!selectedSchool && (
        <FlatList
          data={filteredSchools}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.schoolItem} onPress={() => handleSelectSchool(item)}>
              <Text style={styles.schoolName}>{item.name}</Text>
              <Text style={styles.schoolLocation}>{item.location}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      {selectedSchool && (
        <View style={styles.selectedSchoolBox}>
          <Text style={styles.selectedSchoolName}>{selectedSchool.name}</Text>
          <Text style={styles.selectedSchoolLocation}>{selectedSchool.location}</Text>
          <TouchableOpacity onPress={() => setSelectedSchool(null)}>
            <Text style={styles.changeSchool}>Change</Text>
          </TouchableOpacity>
        </View>
      )}
      {selectedSchool && (
        <View style={{ marginTop: 24 }}>
          <Text style={styles.label}>Medical Courses</Text>
          {courses.map((course, idx) => (
            <View key={idx} style={styles.courseRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder={`Medical course ${idx + 1}`}
                value={course}
                onChangeText={text => handleCourseChange(text, idx)}
                placeholderTextColor="#888"
              />
              {courses.length > 1 && (
                <TouchableOpacity onPress={() => handleRemoveCourse(idx)}>
                  <Text style={styles.removeBtn}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Search common medical courses..."
            value={courseSearch}
            onChangeText={setCourseSearch}
            placeholderTextColor="#888"
          />
          {courseSearch && (
            <FlatList
              data={filteredCourses}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.courseItem} onPress={() => handleSelectCourse(item)}>
                  <Text style={styles.courseItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}
          <TouchableOpacity style={styles.addBtn} onPress={handleAddCourse}>
            <Text style={styles.addBtnText}>+ Add another course</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181848' },
  header: { padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#A3A3C2' },
  connectionType: { fontSize: 12, color: '#A3A3C2', marginTop: 4 },
  label: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 8, marginLeft: 20 },
  input: { backgroundColor: '#23235b', borderRadius: 12, padding: 16, color: '#fff', fontSize: 16, marginBottom: 20, marginHorizontal: 20 },
  schoolItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#23235b', marginHorizontal: 20 },
  schoolName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  schoolLocation: { color: '#A3A3C2', fontSize: 14 },
  selectedSchoolBox: { backgroundColor: '#23235b', borderRadius: 12, padding: 16, marginHorizontal: 20, marginBottom: 20 },
  selectedSchoolName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  selectedSchoolLocation: { color: '#A3A3C2', fontSize: 14 },
  changeSchool: { color: '#4f8cff', marginTop: 8, fontWeight: '600' },
  courseRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginHorizontal: 20 },
  removeBtn: { color: '#ff4d4d', fontSize: 24, marginLeft: 8 },
  courseItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#23235b', marginHorizontal: 20 },
  courseItemText: { color: '#fff', fontSize: 16 },
  addBtn: { backgroundColor: '#23235b', borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 20, marginBottom: 20 },
  addBtnText: { color: '#4f8cff', fontSize: 16, fontWeight: '600' },
  saveBtn: { backgroundColor: '#4f8cff', borderRadius: 12, padding: 16, alignItems: 'center', marginHorizontal: 20, marginBottom: 40 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});