import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "000000000000", // Not required for basic auth
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Only log this once to avoid exposing sensitive data in logs too many times
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? "API_KEY_EXISTS" : "MISSING",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  appId: firebaseConfig.appId ? "APP_ID_EXISTS" : "MISSING",
});

// Initialize Firebase - reuse existing instance if available
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and Google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider for additional scopes or customization
googleProvider.setCustomParameters({
  prompt: 'select_account', // Always prompt the user to select an account
});

// Export the app for other parts of the application
export default app;