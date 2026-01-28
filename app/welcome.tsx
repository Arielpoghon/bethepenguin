import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Welcome() {
  const handleContinue = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    await updateDoc(doc(db, 'users', uid), {
      onboardingStep: 'goals',
    });

    router.replace('/goals');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You showed up. That matters 🐧</Text>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Let’s set your first goal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#21c2f3',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
