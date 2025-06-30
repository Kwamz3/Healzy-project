import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl, TouchableOpacity, Image, Animated, Modal, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useToast } from '../../components/Toast';

// Type for a flashcard set
interface FlashcardSet {
  id: string;
  title: string;
  description?: string;
  cards: { term: string; definition: string }[];
  category?: string;
}

export default function LibraryScreen() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const toast = useToast();

  useEffect(() => {
    if (sets.length) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [sets]);

  const fetchSets = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await AsyncStorage.getItem('flashcardSets');
      const sets = data ? JSON.parse(data) : [];
      setSets(sets);
    } catch {
      setError('Error fetching sets');
      toast.show('Error fetching sets', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchSets();
  };

  const handleOpenSet = (set: FlashcardSet) => {
    setSelectedSet(set);
    setModalVisible(true);
  };

  const handleDeleteSet = async (id: string) => {
    Alert.alert('Delete Set', 'Are you sure you want to delete this set?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const newSets = sets.filter(s => s.id !== id);
          await AsyncStorage.setItem('flashcardSets', JSON.stringify(newSets));
          setSets(newSets);
          toast.show('Set deleted', 'success');
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4f8cff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!sets.length) {
    return (
      <View style={styles.center}>
        <Image source={require('../../assets/images/empty-state.png')} style={styles.emptyImage} />
        <Text style={styles.empty}>No medical flashcard sets yet</Text>
        <Text style={styles.emptyDesc}>Create your first set of medical flashcards to start studying!</Text>
        <Button onPress={() => router.push('/create-flashcard-set')}>+ Create Medical Flashcard Set</Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <FlatList
          data={sets}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.card} onPress={() => handleOpenSet(item)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                {item.category && (
                  <View style={styles.categoryContainer}>
                    <Text style={styles.category}>{item.category}</Text>
                  </View>
                )}
                {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
                <Text style={styles.count}>{item.cards.length} cards</Text>
              </View>
              <Button variant="secondary" onPress={() => handleDeleteSet(item.id)} style={styles.deleteBtn} textStyle={styles.deleteBtnText}>
                🗑️
              </Button>
            </Card>
          )}
        />
      </Animated.View>
      <Button style={styles.fab} onPress={() => router.push('/create-flashcard-set')}>
        +
      </Button>
      {/* Modal for set details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedSet?.title}</Text>
            {selectedSet?.category && (
              <View style={styles.modalCategoryContainer}>
                <Text style={styles.modalCategory}>{selectedSet.category}</Text>
              </View>
            )}
            {selectedSet?.description ? <Text style={styles.modalDesc}>{selectedSet.description}</Text> : null}
            <Text style={styles.modalCount}>{selectedSet?.cards.length} cards</Text>
            <View style={styles.modalCards}>
              {selectedSet?.cards.map((card, idx) => (
                <View key={idx} style={styles.modalCard}>
                  <Text style={styles.modalCardTerm}>{card.term}</Text>
                  <Text style={styles.modalCardDef}>{card.definition}</Text>
                </View>
              ))}
            </View>
            <Button onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181848',
    padding: 32,
  },
  error: {
    color: '#ff4d4d',
    fontSize: 16,
  },
  empty: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyDesc: {
    color: '#A3A3C2',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 28,
    resizeMode: 'contain',
  },
  list: {
    backgroundColor: '#181848',
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  desc: {
    color: '#b0b0ff',
    fontSize: 15,
    marginBottom: 6,
  },
  count: {
    color: '#4f8cff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteBtn: {
    marginLeft: 12,
    padding: 6,
  },
  deleteBtnText: {
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalCategoryContainer: {
    backgroundColor: '#4f8cff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  modalCategory: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalDesc: {
    color: '#b0b0ff',
    fontSize: 16,
    marginBottom: 12,
  },
  modalCount: {
    color: '#4f8cff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  modalCards: {
    maxHeight: '60%',
  },
  modalCard: {
    backgroundColor: '#181848',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  modalCardTerm: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalCardDef: {
    color: '#b0b0ff',
    fontSize: 14,
  },
  closeBtn: {
    marginTop: 16,
  },
  categoryContainer: {
    backgroundColor: '#4f8cff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  category: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});