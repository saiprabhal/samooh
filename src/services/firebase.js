import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBNScTuXlGtLMLh7ccuwpVtH7GdzxKkxcg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "samoohindia-351f2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "samoohindia-351f2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "samoohindia-351f2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1064594655737",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1064594655737:web:a9c8ec1ebf95f08b1b9528",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KG6KGESFX1"
};

// Initialize Firebase App safely (singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
