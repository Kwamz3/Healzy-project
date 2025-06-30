import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const MEDICAL_TERMS = [
  {
    term: 'Acute',
    definition: 'Having a sudden onset, sharp rise, and short course',
    category: 'General',
  },
  {
    term: 'Benign',
    definition: 'Not cancerous; does not invade nearby tissue or spread to other parts of the body',
    category: 'Oncology',
  },
  {
    term: 'Chronic',
    definition: 'Persisting for a long time or constantly recurring',
    category: 'General',
  },
  {
    term: 'Dyspnea',
    definition: 'Shortness of breath; difficult or labored breathing',
    category: 'Respiratory',
  },
  {
    term: 'Edema',
    definition: 'Swelling caused by excess fluid trapped in body tissues',
    category: 'General',
  },
  {
    term: 'Febrile',
    definition: 'Relating to or marked by fever',
    category: 'General',
  },
  {
    term: 'Hematuria',
    definition: 'The presence of blood in urine',
    category: 'Urology',
  },
  {
    term: 'Idiopathic',
    definition: 'Of unknown cause',
    category: 'General',
  },
  {
    term: 'Jaundice',
    definition: 'Yellowing of the skin and eyes due to high bilirubin levels',
    category: 'Hepatology',
  },
  {
    term: 'Kernicterus',
    definition: 'A form of brain damage caused by excessive jaundice',
    category: 'Neurology',
  },
  {
    term: 'Lesion',
    definition: 'An area of abnormal tissue',
    category: 'General',
  },
  {
    term: 'Malignant',
    definition: 'Cancerous; tending to become progressively worse',
    category: 'Oncology',
  },
  {
    term: 'Necrosis',
    definition: 'Death of body tissue',
    category: 'Pathology',
  },
  {
    term: 'Osteoporosis',
    definition: 'A condition in which bones become weak and brittle',
    category: 'Orthopedics',
  },
  {
    term: 'Pathology',
    definition: 'The study of disease',
    category: 'General',
  },
];

const CATEGORIES = ['All', 'General', 'Oncology', 'Respiratory', 'Urology', 'Hepatology', 'Neurology', 'Pathology', 'Orthopedics'];

export default function MedicalDictionaryScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  const filteredTerms = MEDICAL_TERMS.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(search.toLowerCase()) ||
                         term.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medical Dictionary</Text>
        <Text style={styles.subtitle}>Search medical terms and definitions</Text>
      </View>
      
      <TextInput
        style={styles.searchBar}
        placeholder="Search medical terms..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#888"
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryChip, selectedCategory === category && styles.selectedCategoryChip]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryChipText, selectedCategory === category && styles.selectedCategoryChipText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredTerms}
        keyExtractor={(item) => item.term}
        renderItem={({ item }) => (
          <View style={styles.termCard}>
            <View style={styles.termHeader}>
              <Text style={styles.term}>{item.term}</Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            </View>
            <Text style={styles.definition}>{item.definition}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
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
  searchBar: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    color: '#fff',
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#23235b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4f8cff',
  },
  selectedCategoryChip: {
    backgroundColor: '#4f8cff',
  },
  categoryChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  termCard: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  term: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  categoryTag: {
    backgroundColor: '#4f8cff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  definition: {
    color: '#A3A3C2',
    fontSize: 16,
    lineHeight: 24,
  },
}); 