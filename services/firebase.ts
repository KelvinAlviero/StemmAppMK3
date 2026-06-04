import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAlWylIR7ZhSB7g4Yo931g3dxwb9oUvi6k",
  authDomain: "expogostemapp.firebaseapp.com",
  projectId: "expogostemapp",
  storageBucket: "expogostemapp.firebasestorage.app",
  messagingSenderId: "226104540986",
  appId: "1:226104540986:web:8e0a07119c9b2d6ec29a03",
  measurementId: "G-5DRXHFCH4E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
