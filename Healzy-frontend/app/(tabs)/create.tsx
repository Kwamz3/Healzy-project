import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Card from '../../components/Card';
import Button from '../../components/Button';

const OPTIONS = [
  {
    key: 'flashcard',
    icon: require('../../assets/images/flashcards-icon.png'),
    title: 'Flashcard set',
    desc: 'Create a new set of study flashcards',
    navigateTo: '/create-flashcard-set',
  },
  {
    key: 'folder',
    icon: require('../../assets/images/folder-icon.png'),
    title: 'Folder',
    desc: 'Organize your sets into folders',
    navigateTo: null,
  },
  {
    key: 'class',
    icon: require('../../assets/images/class-icon.png'),
    title: 'Class',
    desc: 'Group sets for a class or group',
    navigateTo: null,
  },
];

export default function CreateScreen() {
  const router = useRouter();
  
  // Create refs for each option
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;
  
  const anims = useMemo(() => [anim1, anim2, anim3], [anim1, anim2, anim3]);

  useEffect(() => {
    Animated.stagger(120, anims.map(anim =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    )).start();
  }, [anims]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>What would you like to create?</Text>
      {OPTIONS.map((opt, index) => (
        <Animated.View
          key={opt.key}
          style={{
            opacity: anims[index],
            transform: [{ translateY: anims[index].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
          }}
        >
          <Card style={styles.card} onPress={() => opt.navigateTo ? router.push(opt.navigateTo as any) : undefined}>
            <Image source={opt.icon} style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{opt.title}</Text>
              <Text style={styles.desc}>{opt.desc}</Text>
            </View>
            {!opt.navigateTo && (
              <Button variant="secondary" onPress={() => alert('Coming soon!')} style={styles.soonBtn} textStyle={styles.soonBtnText}>
                Coming soon
              </Button>
            )}
          </Card>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181848',
    padding: 24,
    paddingTop: 60,
  },
  header: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 28,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  icon: {
    width: 44,
    height: 44,
    marginRight: 18,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  desc: {
    color: '#A3A3C2',
    fontSize: 15,
  },
  soonBtn: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    height: 36,
    alignSelf: 'center',
  },
  soonBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
