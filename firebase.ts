import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY, // your real key here
  authDomain: 'postle-d3ea6.firebaseapp.com',
  projectId: 'postle-d3ea6',
  storageBucket: 'postle-d3ea6.appspot.com',
  messagingSenderId: '145543571006',
  appId: '1:145543571006:web:28a6f973be2203e755536f',
};

const app = initializeApp(firebaseConfig);

// 🔥 THIS WAS MISSING
export const auth = getAuth(app);
export const db = getFirestore(app);
