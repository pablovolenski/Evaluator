import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Lazy singletons — only initialized in browser context
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAuth } = require('firebase/auth');
    _auth = getAuth(getFirebaseApp()) as Auth;
  }
  return _auth!;
}

export function getFirebaseDb(): Firestore {
  if (!_db) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getFirestore } = require('firebase/firestore');
    _db = getFirestore(getFirebaseApp()) as Firestore;
  }
  return _db!;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!_storage) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getStorage } = require('firebase/storage');
    _storage = getStorage(getFirebaseApp()) as FirebaseStorage;
  }
  return _storage!;
}
