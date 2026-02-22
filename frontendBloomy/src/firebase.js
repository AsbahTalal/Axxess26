import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace these with your actual Firebase project config from
// https://console.firebase.google.com → Project Settings → Your apps → SDK setup
const firebaseConfig = {
  apiKey:            "AIzaSyDBS9714s4uXvQvHOswT8BdYK_96Q4tzi4",
  authDomain:        "bloomy-d9204.firebaseapp.com",
  projectId:         "bloomy-d9204",
  storageBucket:     "bloomy-d9204.firebasestorage.app",
  messagingSenderId: "931959234441",
  appId:             "1:931959234441:web:21a76ef825b61169decb58",
  measurementId: "G-3Q85ZXX1FS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
