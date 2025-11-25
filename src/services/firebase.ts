import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Configuration from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCUMx4uNypEVFLrNESt_J3YsviYcFfXQAw",
  authDomain: "virtuos-model.firebaseapp.com",
  projectId: "virtuos-model",
  storageBucket: "virtuos-model.firebasestorage.app",
  messagingSenderId: "403625949202",
  appId: "1:403625949202:web:31f2ac2054f1baafae00cb",
  measurementId: "G-XKFKB9QZ34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);