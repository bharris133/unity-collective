import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getFunctions, type Functions } from 'firebase/functions';

// Firebase is only initialized when VITE_USE_MOCK_DATA is not 'true'.
// In mock mode (local dev without credentials) all data comes from
// src/data/mock* files, so no Firebase credentials are required.
//
// Env file load order (Vite):
//   .env → .env.local → .env.development → .env.development.local
// Development: VITE_USE_MOCK_DATA=true  (no Firebase keys needed)
// Production:  VITE_USE_MOCK_DATA=false (keys injected via .env.production.local)

const useMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

let app: FirebaseApp | null = null;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;

if (!useMock) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
} else {
  // In mock mode these are never called, but TypeScript needs them typed.
  // Cast to satisfy module consumers that guard with isMockAuthEnabled().
  auth = null as unknown as Auth;
  db = null as unknown as Firestore;
  storage = null as unknown as FirebaseStorage;
  functions = null as unknown as Functions;
}

export { auth, db, storage, functions };
export default app;
