import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// get .env file values
// const firebaseConfig = {
//   apiKey: "AIzaSyDYB2OOLsVOkpyoSK7BqilziyVOOdpSHYM",
//   authDomain: "shots-73521.firebaseapp.com",
//   projectId: "shots-73521",
//   storageBucket: "shots-73521.firebasestorage.app",
//   messagingSenderId: "64374401687",
//   appId: "1:64374401687:web:acb3540dee52991ccc17d2",
//   measurementId: "G-9FMMYY3FEC"
// };
console.log(import.meta.env);
console.log(import.meta.env.apiKey);
console.log("hi");
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);