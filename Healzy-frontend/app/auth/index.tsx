import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../context/AuthContext'; // adjust path as needed
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://100.66.30.11:5000';

export default function AuthLandingScreen() {
  const router = useRouter();
  const { loginWithToken } = useAuth();

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '914529443484-buh97c6il8hporqps34j6k9p689193cb.apps.googleusercontent.com',
    iosClientId: '914529443484-qkkq06g9aoitrob43l502063lkhtuc89.apps.googleusercontent.com',
    androidClientId: '914529443484-qkkq06g9aoitrob43l502063lkhtuc89.apps.googleusercontent.com',
    webClientId: '914529443484-buh97c6il8hporqps34j6k9p689193cb.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication, params } = response;
      const idToken = params?.id_token;
      if (idToken) {
        // Send idToken to your backend
        fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
          .then(res => res.json())
          .then(async data => {
            if (data.token && data.user) {
              await loginWithToken(data.token, data.user);
              router.replace('/(tabs)/home');
            } else {
              Alert.alert('Backend Auth Error', data.error || 'Unknown error');
            }
          })
          .catch(() => {
            Alert.alert('Backend Auth Error', 'Failed to authenticate with backend');
          });
      }
    } else if (response?.type === 'error') {
      Alert.alert('Google Sign-In Error', 'Something went wrong');
    }
  }, [response]);

  // Real Apple Sign-In
  const handleApple = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Apple Sign-In is not available on web');
      return;
    }
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      Alert.alert(
        'Apple Sign-In Success',
        `Welcome${credential.fullName?.givenName ? ', ' + credential.fullName.givenName : ''}!\nEmail: ${credential.email || 'N/A'}\nToken: ${credential.identityToken?.slice(0, 12) + '...'}`
      );
    } catch (e: any) {
      if (e.code === 'ERR_CANCELED') {
        return;
      }
      Alert.alert('Apple Sign-In Error', e.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      {/* Illustration or logo */}
      <View style={styles.illustrationWrap}>
        <Image
          source={require('../../assets/auth-illustration.png')}
          style={styles.illustration}
        />
      </View>
      <Text style={styles.headline}>The best way to study.{"\n"}Sign up for free.</Text>
      <Text style={styles.subtext}>
        By signing up, you accept Healzy&apos;s Terms of {"\n"} Service and Privacy Policy
      </Text>
      <TouchableOpacity
        style={[styles.socialBtn, styles.googleBtn]}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.socialBtnText}>Continue with Google</Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={10}
          style={styles.appleBtn}
          onPress={handleApple}
        />
      )}
      <TouchableOpacity
        style={styles.emailBtn}
        onPress={() => router.replace('/auth/signup' as any)}
      >
        <Text style={styles.emailBtnText}>Sign up with email</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/auth/login' as any)}>
        <Text style={styles.loginLink}>Have an account? <Text style={{textDecorationLine: 'underline'}}>Log in</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181848',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  headline: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    color: '#A3A3C2',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  socialBtn: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  googleBtn: {
    backgroundColor: '#fff',
  },
  appleBtn: {
    width: '100%',
    height: 44,
    marginBottom: 12,
  },
  socialBtnText: {
    color: '#181848',
    fontSize: 16,
    fontWeight: '600',
  },
  emailBtn: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 18,
  },
  emailBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
}); 