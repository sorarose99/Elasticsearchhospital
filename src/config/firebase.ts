import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyApeskv8wZQkuI6IW2t6iTbPMvc9fuLxsw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kirogames-9b218.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kirogames-9b218",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kirogames-9b218.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "336305648541",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:336305648541:web:4ec200880d9a6afa347574",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CSNKQYYNE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser and if supported)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics initialized');
    }
  }).catch((error) => {
    console.warn('Firebase Analytics not supported:', error);
  });
}

export { analytics };

// Auto-initialize Firestore collections on first load
let initializationPromise: Promise<any> | null = null;

export const ensureFirestoreInitialized = async () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
      try {
        const { initializeFirestoreCollections } = await import('./initializeFirestore');
        await initializeFirestoreCollections();
      } catch (error) {
        console.warn('Could not auto-initialize Firestore:', error);
      }
    })();
  }
  return initializationPromise;
};

// Start initialization in background
if (typeof window !== 'undefined') {
  ensureFirestoreInitialized();
}

export default app;
