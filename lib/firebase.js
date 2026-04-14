import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3Gw-bOoGURpz2yZAnTXhlBYi1IVil8cw",
  authDomain: "smartmoney-4f59f.firebaseapp.com",
  projectId: "smartmoney-4f59f",
  storageBucket: "smartmoney-4f59f.firebasestorage.app",
  messagingSenderId: "681083743585",
  appId: "1:681083743585:web:a7bd28a90c2a3271f96920"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);