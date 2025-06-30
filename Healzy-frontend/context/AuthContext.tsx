import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Development mode flag
const DEV_MODE = true;

// Test credentials for development
const TEST_USER = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User'
};

const TEST_TOKEN = 'test-token-123';

const API_URL = 'http://localhost:5000/api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithToken: (token: string, user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        let storedToken;
        let storedUser;

        if (Platform.OS === 'web') {
          storedToken = localStorage.getItem('token');
          const userStr = localStorage.getItem('user');
          storedUser = userStr ? JSON.parse(userStr) : null;
        } else {
          storedToken = await SecureStore.getItemAsync('token');
          const userStr = await SecureStore.getItemAsync('user');
          storedUser = userStr ? JSON.parse(userStr) : null;
        }

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const storeAuthData = async (newToken: string, newUser: User) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        await SecureStore.setItemAsync('token', newToken);
        await SecureStore.setItemAsync('user', JSON.stringify(newUser));
      }
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  };

  const clearAuthData = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('user');
      }
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      if (DEV_MODE) {
        // In dev mode, accept any credentials
        await storeAuthData(TEST_TOKEN, TEST_USER);
        return;
      }

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      await storeAuthData(data.token, data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      if (DEV_MODE) {
        // In dev mode, create a test account
        const testUser = {
          ...TEST_USER,
          name: name || TEST_USER.name,
          email: email || TEST_USER.email
        };
        await storeAuthData(TEST_TOKEN, testUser);
        return;
      }

      console.log('Attempting signup with:', { email, name });
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      await storeAuthData(data.token, data.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const loginWithToken = async (newToken: string, newUser: User) => {
    try {
      await storeAuthData(newToken, newUser);
    } catch (error) {
      console.error('Login with token error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        loginWithToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function getAuthHeaders(token: string | null) {
  return { Authorization: token ? `Bearer ${token}` : '' };
} 