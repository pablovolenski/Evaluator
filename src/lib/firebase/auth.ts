import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';

export async function registerWithEmail(email: string, password: string, displayName: string): Promise<User> {
  const auth = getFirebaseAuth();
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName });
  return user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  return user;
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const { user } = await signInWithPopup(getFirebaseAuth(), provider);
  return user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebaseAuth());
}
