import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Animated, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../../components/Card';

type Route = '/add-courses' | '/create-flashcard-set' | '/usmle-prep' | '/clinical-skills';

interface CardItem {
  key: string;
  icon: any;
  title: string;
  description: string;
  navigateTo: Route;
}

const cards: CardItem[] = [
  {
    key: 'courses',
    icon: require('../../assets/images/courses-icon.png'),
    title: 'Add your medical school and courses',
    description: 'Select your medical school and add your current courses',
    navigateTo: '/add-courses',
  },
  {
    key: 'flashcards',
    icon: require('../../assets/images/flashcards-icon.png'),
    title: 'Create medical flashcards',
    description: 'Create flashcards for anatomy, pharmacology, pathology, and more',
    navigateTo: '/create-flashcard-set',
  },
  // {
  //   key: 'usmle',
  //   icon: require('../../assets/images/flashcards-icon.png'),
  //   title: 'USMLE Preparation',
  //   description: 'Access USMLE Step 1 and Step 2 study materials',
  //   navigateTo: '/usmle-prep',
  // },
  {
    key: 'clinical',
    icon: require('../../assets/images/flashcards-icon.png'),
    title: 'Clinical Skills',
    description: 'Practice clinical cases and patient scenarios',
    navigateTo: '/clinical-skills',
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Create refs for each card
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;
  const anim4 = useRef(new Animated.Value(0)).current;
  
  const anims = useMemo(() => [anim1, anim2, anim3, anim4], [anim1, anim2, anim3, anim4]);

  useEffect(() => {
    Animated.stagger(120, anims.map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    )).start();
  }, [anims]);

  if (cards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image source={require('../../assets/images/empty-state.png')} style={styles.emptyImage} />
        <Text style={styles.emptyTitle}>No medical courses or flashcards yet</Text>
        <Text style={styles.emptyDesc}>Start by adding your medical school, courses, or creating your first medical flashcard set!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search medical terms, concepts, or topics..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#888"
      />
      {/* How to get started */}
      <Text style={styles.header}>Medical Education Tools</Text>
      <FlatList
        data={cards}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              opacity: anims[index],
              transform: [{ translateY: anims[index].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            }}
          >
            <Card style={styles.card} onPress={() => router.push(item.navigateTo as any)}>
              <Image source={item.icon} style={styles.cardIcon} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </Card>
          </Animated.View>
        )}
        keyExtractor={item => item.key}
        contentContainerStyle={{ paddingTop: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181848',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  searchBar: {
    backgroundColor: '#23235b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 32,
  },
  header: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 32,
    marginBottom: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    padding: 16,
  },
  cardIcon: {
    width: 36,
    height: 36,
    marginRight: 18,
    resizeMode: 'contain',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#A3A3C2',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181848',
    padding: 32,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 28,
    resizeMode: 'contain',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 22,
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
});
