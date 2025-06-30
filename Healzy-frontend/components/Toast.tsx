import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

interface ToastContextType {
  show: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error'>('success');
  const [fadeAnim] = useState(new Animated.Value(0));

  const show = useCallback((msg: string, t: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setType(t);
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 2000);
    });
  }, [fadeAnim]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {visible && (
        <Animated.View style={[styles.toast, type === 'success' ? styles.success : styles.error, { opacity: fadeAnim }]}> 
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 60,
    left: width * 0.1,
    width: width * 0.8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  success: {
    backgroundColor: '#4f8cff',
  },
  error: {
    backgroundColor: '#ff4d4d',
  },
  toastText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 