import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// ⚠️ Replace these values with your own Firebase project config.
// Go to: https://console.firebase.google.com → Your Project → Project Settings → Your Apps
// These keys are SAFE to commit — access is controlled by Firestore Security Rules.
const firebaseConfig = {
  apiKey: "AIzaSyDlAdRBpA54Z2Ksf42Qqpa9coyWez4xoFo",
  authDomain: "portfolio-1209a.firebaseapp.com",
  projectId: "portfolio-1209a",
  storageBucket: "portfolio-1209a.firebasestorage.app",
  messagingSenderId: "368977361814",
  appId: "1:368977361814:web:3474ac7e24926bfb0efbb7",
  measurementId: "G-WQZSMHHD5S",
  databaseURL: "https://portfolio-1209a-default-rtdb.firebaseio.com"
};

// Prevent re-initializing on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
