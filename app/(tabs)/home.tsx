import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth } from '../../firebase';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(auth.currentUser);
  }, []);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff' }}>Not logged in</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🐧 Penguin Welcome */}
      <View style={styles.penguinBox}>
        <Text style={styles.penguin}>🐧</Text>
        <Text style={styles.welcome}>Good to see you again</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* 🔥 Streak Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Streak</Text>
        <Text style={styles.cardValue}>0 days</Text>
        <Text style={styles.cardMessage}>
          Every journey starts with showing up.
        </Text>
      </View>

      {/* 🎯 CTA */}
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryText}>Add Today’s Goal</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    padding: 24,
  },
  penguinBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  penguin: {
    fontSize: 64,
    marginBottom: 8,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  email: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    color: '#bbb',
    fontSize: 16,
    marginBottom: 6,
  },
  cardValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
  },
  cardMessage: {
    color: '#9ee37d',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#21c2f3',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  primaryText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
  },
});
