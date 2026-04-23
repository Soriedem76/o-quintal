// src/lib/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBP3XUfrV6uAcrb0jWtbCB7ybgX_YyxxoE",
  authDomain: "oquintal-424cd.firebaseapp.com",
  projectId: "oquintal-424cd",
  storageBucket: "oquintal-424cd.firebasestorage.app",
  messagingSenderId: "556677965605",
  appId: "1:556677965605:web:c8cb74b0be3e1ac4771ccc"
};

const app = initializeApp(firebaseConfig);

// 👇 EXPORTS QUE ESTAVAM FALTANDO
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);