// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfHqI1owKgW9cOnVB3Od7oSRTCu7YoRRU",
  authDomain: "prepwise-2531a.firebaseapp.com",
  projectId: "prepwise-2531a",
  storageBucket: "prepwise-2531a.firebasestorage.app",
  messagingSenderId: "417500569663",
  appId: "1:417500569663:web:9feead0df9be740016d88a",
  measurementId: "G-65R6J5BDGL"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);