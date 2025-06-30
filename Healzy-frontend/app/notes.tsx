import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform, KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'http://localhost:3000/api/notes'; // Updated to match our backend endpoint

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Anatomy: '#FF6B6B',
  Physiology: '#4ECDC4',
  Pharmacology: '#FFD93D',
  Pathology: '#A29BFE',
};

export default function NoteScreen() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Anatomy');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    }
  };

  const handleSaveNote = async () => {
    if (!title.trim() || !note.trim()) return;

    const newNote = {
      title,
      content: note,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      });

      if (res.ok) {
        setTitle('');
        setNote('');
        setTags('');
        setCategory('Anatomy');
        fetchNotes();
      } else {
        console.error('Failed to save note');
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const renderNote = ({ item }: { item: Note }) => (
    <View style={[styles.noteCard, { backgroundColor: CATEGORY_COLORS[item.category] || '#333' }]}>
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent}>{item.content}</Text>
      <Text style={styles.noteMeta}>Category: {item.category}</Text>
      {item.tags?.length > 0 && (
        <Text style={styles.noteMeta}>Tags: {item.tags.join(', ')}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding' })}>
      <Text style={styles.header}>📝 Medical Notes</Text>

      <TextInput
        placeholder="Note Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="#999"
      />
      <TextInput
        placeholder="Note Content"
        style={[styles.input, { height: 100 }]}
        value={note}
        onChangeText={setNote}
        multiline
        placeholderTextColor="#999"
      />

      <Picker
        selectedValue={category}
        onValueChange={(val: string) => setCategory(val)}
        style={styles.picker}
      >
        <Picker.Item label="Anatomy" value="Anatomy" />
        <Picker.Item label="Physiology" value="Physiology" />
        <Picker.Item label="Pharmacology" value="Pharmacology" />
        <Picker.Item label="Pathology" value="Pathology" />
      </Picker>

      <TextInput
        placeholder="Tags (comma separated)"
        style={styles.input}
        value={tags}
        onChangeText={setTags}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNote}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181848',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#26266A',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  picker: {
    backgroundColor: '#26266A',
    color: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#4f8cff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noteCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  noteContent: {
    fontSize: 14,
    color: '#eee',
    marginVertical: 5,
  },
  noteMeta: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 5,
  },
});
