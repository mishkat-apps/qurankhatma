import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getPrivateKey() {
  const value = process.env.FIREBASE_PRIVATE_KEY;
  return value ? value.replace(/\\n/g, '\n') : undefined;
}

function ensureAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getPrivateKey();
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!clientEmail || !privateKey || !projectId) {
    throw new Error('Missing Firebase Admin environment variables.');
  }

  return initializeApp({
    credential: cert({ clientEmail, privateKey, projectId }),
  });
}

export function getAdminAuth() {
  return getAuth(ensureAdminApp());
}

export function getAdminDb() {
  return getFirestore(ensureAdminApp());
}
