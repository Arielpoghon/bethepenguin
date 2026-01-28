import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { router } from 'expo-router';

const GOALS = [
  { key: 'Learning', emoji: '📚' },
  { key: 'Fitness', emoji: '💪' },
  { key: 'Quit Addiction', emoji: '🚫' },
  { key: 'Spiritual', emoji: '🧘‍♂️' },
  { key: 'Mental Health', emoji: '🧠' },
];

export default function Goals() {
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleGoal = (goal: string) => {
    if (selected.includes(goal)) {
      setSelected(selected.filter(g => g !== goal));
      return;
    }

    if (selected.length >= 3) {
      Alert.alert('Limit reached', 'Choose up to 3 goals only 🐧');
      return;
    }

    setSelected([...selected, goal]);
  };

  const saveGoals = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || selected.length === 0) return;

    try {
      setSaving(true);

      for (const goal of selected) {
        await addDoc(collection(db, 'goals'), {
          uid,
          type: goal,
          streak: 0,
          lastCompleted: null,
          createdAt: serverTimestamp(),
        });
      }

      // 🚀 Route will be handled later (auto-routing step)
      router.replace('/home');
    } catch (err) {
      Alert.alert('Error', 'Failed to save goals');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your focus</Text>
      <Text style={styles.subtitle}>
        Pick up to 3 goals. Start small. Grow steadily 🐧
      </Text>

      <View style={styles.grid}>
        {GOALS.map(goal => {
          const active = selected.includes(goal.key);

          return (
            <TouchableOpacity
              key={goal.key}
              style={[
                styles.card,
                active && styles.cardActive,
              ]}
              onPress={() => toggleGoal(goal.key)}
            >
              <Text style={styles.emoji}>{goal.emoji}</Text>
              <Text style={styles.cardText}>{goal.key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          selected.length === 0 && styles.buttonDisabled,
        ]}
        disabled={selected.length === 0 || saving}
        onPress={saveGoals}
      >
        <Text style={styles.buttonText}>
          {saving ? 'Saving…' : 'Continue 🐧'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 24,
  },
  subtitle: {
    color: '#ccc',
    fontSize: 16,
    marginVertical: 12,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardActive: {
    backgroundColor: '#21c2f3',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
  },
});
