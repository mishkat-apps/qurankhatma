import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp | null = null;

export function getFirebaseApp() {
  if (!hasFirebaseConfig) {
    return null;
  }

  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }

  return app;
}

export function getFirebaseAuthClient() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  const auth = getAuth(firebaseApp);
  setPersistence(auth, browserLocalPersistence).catch(() => undefined);
  return auth;
}

export function getFirebaseDb() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  return getFirestore(firebaseApp);
}
