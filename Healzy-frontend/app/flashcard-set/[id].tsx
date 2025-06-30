import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Constants from 'expo-constants';

interface Card {
  term: string;
  definition: string;
}

interface FlashcardSet {
  _id: string;
  title: string;
  description?: string;
  cards: Card[];
}

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000';

const fetchSet = async (
  id: string,
  setSet: React.Dispatch<React.SetStateAction<FlashcardSet | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  setLoading(true);
  setError('');
  try {
    const res = await fetch(`${API_URL}/flashcard-sets/${id}`);
    if (!res.ok) throw new Error('Failed to fetch flashcard set');
    const data = await res.json();
    setSet(data);
  } catch (err: any) {
    setError(err.message || 'Error fetching set');
  } finally {
    setLoading(false);
  }
};

export default function FlashcardSetDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [set, setSet] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCards, setEditCards] = useState<Card[]>([]);
  const [saving, setSaving] = useState(false);

  const stringId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    fetchSet(stringId, setSet, setLoading, setError);
  }, [stringId]);
    


  const handleDelete = async () => {
    Alert.alert('Delete Set', 'Are you sure you want to delete this set?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          setDeleting(true);
          try {
            const res = await fetch(`${API_URL}/flashcard-sets/${stringId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete set');
            router.replace('/(tabs)/library' as any);
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete set');
          } finally {
            setDeleting(false);
          }
        }
      }
    ]);
  };

  const startEdit = () => {
    if (!set) return;
    setEditTitle(set.title);
    setEditDescription(set.description || '');
    setEditCards(set.cards.map(card => ({ ...card })));
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const handleCardChange = (index: number, field: 'term' | 'definition', value: string) => {
    const updated = [...editCards];
    updated[index][field] = value;
    setEditCards(updated);
  };

  const addCard = () => {
    setEditCards([...editCards, { term: '', definition: '' }]);
  };

  const removeCard = (index: number) => {
    if (editCards.length > 1) {
      setEditCards(editCards.filter((_, i) => i !== index));
    }
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || editCards.some(card => !card.term.trim() || !card.definition.trim())) {
      Alert.alert('Please fill in the title and all card terms/definitions.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/flashcard-sets/${stringId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription, cards: editCards }),
      });
      if (!res.ok) throw new Error('Failed to update set');
      setEditing(false);
      fetchSet(stringId, setSet, setLoading, setError);
      Alert.alert('Success', 'Flashcard set updated!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update set');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#4f8cff" /></View>;
  }
  if (error || !set) {
    return <View style={styles.center}><Text style={styles.error}>{error || 'Set not found'}</Text></View>;
  }

  if (editing && set) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.titleInput}
          value={editTitle}
          onChangeText={setEditTitle}
          placeholder="Title"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.descInput}
          value={editDescription}
          onChangeText={setEditDescription}
          placeholder="Description (optional)"
          placeholderTextColor="#888"
        />
        <Text style={styles.sectionTitle}>Cards</Text>
        {editCards.map((card, idx) => (
          <View key={idx} style={styles.cardRow}>
            <TextInput
              style={styles.termInput}
              value={card.term}
              onChangeText={text => handleCardChange(idx, 'term', text)}
              placeholder="Term"
              placeholderTextColor="#888"
            />
            <TextInput
              style={styles.definitionInput}
              value={card.definition}
              onChangeText={text => handleCardChange(idx, 'definition', text)}
              placeholder="Definition"
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
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={saveEdit} disabled={saving}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelEdit} disabled={saving}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{set.title}</Text>
      {set.description ? <Text style={styles.desc}>{set.description}</Text> : null}
      <Text style={styles.count}>{set.cards.length} cards</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editBtn} onPress={startEdit}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} disabled={deleting}>
          <Text style={styles.deleteBtnText}>{deleting ? 'Deleting...' : 'Delete'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Cards</Text>
      {set.cards.map((card, idx) => (
        <View key={idx} style={styles.cardRow}>
          <Text style={styles.term}>{card.term}</Text>
          <Text style={styles.definition}>{card.definition}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181848',
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181848',
  },
  error: {
    color: '#ff4d4d',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  desc: {
    color: '#b0b0ff',
    fontSize: 16,
    marginBottom: 8,
  },
  count: {
    color: '#4f8cff',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 18,
  },
  editBtn: {
    backgroundColor: '#4f8cff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  editBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  cardRow: {
    backgroundColor: '#23235b',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  term: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  definition: {
    color: '#b0b0ff',
    fontSize: 15,
  },
  titleInput: {
    backgroundColor: '#23235b',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  descInput: {
    backgroundColor: '#23235b',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  termInput: {
    backgroundColor: '#23235b',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  definitionInput: {
    backgroundColor: '#23235b',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  removeBtn: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 10,
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addBtn: {
    backgroundColor: '#4f8cff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#4f8cff',
    borderRadius: 8,
    padding: 10,
    flex: 1,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    padding: 10,
    flex: 1,
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
