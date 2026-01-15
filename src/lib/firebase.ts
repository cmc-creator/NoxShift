import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCTS2ux52QuPpb9aAzMZGYL46mJAjHbn2c",
  authDomain: "noxshift-2617b.firebaseapp.com",
  projectId: "noxshift-2617b",
  storageBucket: "noxshift-2617b.firebasestorage.app",
  messagingSenderId: "265911446290",
  appId: "1:265911446290:web:7332885b184cd1bc4021cb"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth, firebaseConfig };
export const appId = import.meta.env.VITE_APP_ID || 'noxshift-default';
export const initialAuthToken = import.meta.env.VITE_INITIAL_AUTH_TOKEN || '';
