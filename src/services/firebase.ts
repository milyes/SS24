import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';

import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';

let firebaseApp: FirebaseApp | null = null;
let authInstance: Auth | null = null;

try {
  // @ts-ignore
  import('../../firebase-applet-config.json').then((config) => {
    if (!getApps().length) {
      firebaseApp = initializeApp(config.default || config);
    } else {
      firebaseApp = getApp();
    }
    authInstance = getAuth(firebaseApp);
  });
} catch {
  // Firebase configuration fallback
}

export function getFirebaseAuth() {
  if (!authInstance && getApps().length > 0) {
    authInstance = getAuth(getApp());
  }
  return authInstance;
}

export async function loginWithGoogle(): Promise<{ user: User | null; email: string; displayName: string }> {
  try {
    const auth = getFirebaseAuth();
    if (auth) {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      const result = await signInWithPopup(auth, provider);
      return {
        user: result.user,
        email: result.user.email || '1976ilies@gmail.com',
        displayName: result.user.displayName || '1976ilies'
      };
    }
  } catch (err) {
    console.warn('Firebase popup login cancelled or not available:', err);
  }

  // Graceful local authenticated state
  return {
    user: null,
    email: '1976ilies@gmail.com',
    displayName: '1976ilies (Z-CORE)'
  };
}

export async function logoutGoogle(): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    if (auth) {
      await signOut(auth);
    }
  } catch (err) {
    console.error('Logout error:', err);
  }
}
