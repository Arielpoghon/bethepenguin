import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Video } from 'expo-av';
import { router } from 'expo-router';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const penguinVideo = require('./grok-video-5ed0a94c-11fd-4596-aa1f-5abc44f7be14.mp4');

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🔐 AUTH LISTENER + ROUTING
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          Alert.alert('Error', 'User profile not found');
          setLoading(false);
          return;
        }

        const data = snap.data();

        // ✅ ROUTES THAT ACTUALLY EXIST
        if (data.onboardingStep === 'welcome') {
          router.replace('/goals');
        } else if (data.onboardingStep === 'goals') {
          router.replace('/goals');
        } else {
          router.replace('/home');
        }

        setUser(currentUser);
      } catch (err) {
        Alert.alert('Error', 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    });

    return unsub;
  }, []);

  const startJourney = () => {
    setShowAuth(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, 'users', result.user.uid), {
        email,
        username,
        onboardingStep: 'welcome',
        createdAt: serverTimestamp(),
      });

    } catch (error: any) {
      Alert.alert('Sign Up Error', error.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      Alert.alert('Login Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" translucent />
      <View style={styles.container}>
        <Video
          source={penguinVideo}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          isLooping
          shouldPlay
          isMuted
        />
        <View style={styles.overlay} />

        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View style={styles.content}>
              {!showAuth ? (
                <View style={styles.center}>
                  <Text style={styles.title}>Be The Penguin</Text>
                  <Text style={styles.subtitle}>
                    Build better habits. Track your growth.
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, styles.startButton]}
                    onPress={startJourney}
                  >
                    <Text style={styles.startText}>Start Journey 🚀</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Animated.View style={{ opacity: fadeAnim }}>
                  <Text style={styles.title}>Welcome</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#ccc"
                    value={username}
                    onChangeText={setUsername}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#ccc"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#ccc"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  <TouchableOpacity
                    style={[styles.button, styles.signupButton]}
                    onPress={handleSignUp}
                  >
                    <Text style={styles.buttonText}>Create Account</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.loginButton]}
                    onPress={handleLogin}
                  >
                    <Text style={styles.buttonText}>Log In</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  center: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    padding: 16,
    color: '#fff',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 8,
  },
  startButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
  },
  startText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  signupButton: { backgroundColor: '#21c2f3' },
  loginButton: { backgroundColor: '#4CAF50' },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
