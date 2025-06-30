import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDICAL_CATEGORIES = [
  'Anatomy',
  'Physiology',
  'Biochemistry',
  'Pharmacology',
  'Pathology',
  'Microbiology',
  'Immunology',
  'Neurology',
  'Cardiology',
  'Respiratory',
  'Gastroenterology',
  'Endocrinology',
  'USMLE Step 1',
  'USMLE Step 2',
  'Clinical Skills',
];

export default function CreateFlashcardSetScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [cards, setCards] = useState([
    { term: '', definition: '' },
    { term: '', definition: '' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleCardChange = (index: number, field: 'term' | 'definition', value: string) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards([...cards, { term: '', definition: '' }]);
  };

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !category || cards.some(card => !card.term.trim() || !card.definition.trim())) {
      Alert.alert('Please fill in the title, category, and all card terms/definitions.');
      return;
    }
    setLoading(true);
    try {
      const existing = await AsyncStorage.getItem('flashcardSets');
      let sets = existing ? JSON.parse(existing) : [];
      sets.push({
        id: Date.now().toString(),
        title,
        description,
        category,
        cards,
        createdAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem('flashcardSets', JSON.stringify(sets));
      setTitle('');
      setDescription('');
      setCategory('');
      setCards([
        { term: '', definition: '' },
        { term: '', definition: '' },
      ]);
      Alert.alert('Success', 'Medical flashcard set saved!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save flashcard set');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Medical Flashcard Set</Text>
      <TextInput
        style={styles.input}
        placeholder="Set title (e.g., Cardiovascular System)"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="#888"
      />
      <Text style={styles.sectionTitle}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {MEDICAL_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, category === cat && styles.selectedCategoryChip]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryChipText, category === cat && styles.selectedCategoryChipText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.sectionTitle}>Cards</Text>
      {cards.map((card, idx) => (
        <View key={idx} style={styles.cardRow}>
          <TextInput
            style={styles.cardInput}
            placeholder="Medical term or concept"
            value={card.term}
            onChangeText={text => handleCardChange(idx, 'term', text)}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.cardInput}
            placeholder="Definition or explanation"
            value={card.definition}
            onChangeText={text => handleCardChange(idx, 'definition', text)}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => removeCard(idx)} style={styles.removeBtn}>
            <Text style={styles.removeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addBtn} onPress={addCard}>
        <Text style={styles.addBtnText}>+ Add card</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save set</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181848',
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#23235b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardInput: {
    flex: 1,
    backgroundColor: '#23235b',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    color: '#fff',
    marginRight: 8,
  },
  removeBtn: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 8,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#23235b',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: '#4f8cff',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  categoriesContainer: {
    flexDirection: 'row',
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
});
