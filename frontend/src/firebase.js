// summary-project/frontend/src/firebase.js
// Module for initializing Firebase and configuring Google authentication.

// Import necessary functions from the Firebase SDK.
import { initializeApp } from 'firebase/app'; // Function to initialize a Firebase app.
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup } from 'firebase/auth'; // Functions for authentication services.

// Firebase configuration object.
// These environment variables are loaded from the .env file in the frontend root.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // Your Firebase API key.
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, // The domain for your Firebase project.
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, // Your Firebase project ID.
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, // Storage bucket URL for your Firebase project.
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, // Sender ID for Firebase Cloud Messaging.
  appId: process.env.REACT_APP_FIREBASE_APP_ID, // Your Firebase app ID.
};

// Initialize the Firebase application with the provided configuration.
const app = initializeApp(firebaseConfig);
// Get the authentication instance for the initialized Firebase app.
const auth = getAuth(app);
// Create a new Google Auth Provider instance for Google Sign-In.
const provider = new GoogleAuthProvider();

// Export the authentication instance, Google Auth Provider, and sign-in methods for use in other modules.
export { auth, provider, signInWithRedirect, signInWithPopup };