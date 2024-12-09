// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaIu9LBg2LhGdw8rhDdSTAmGGCmg94r1c",
  authDomain: "project-keys-78c19.firebaseapp.com",
  databaseURL: "https://project-keys-78c19-default-rtdb.firebaseio.com",
  projectId: "project-keys-78c19",
  storageBucket: "project-keys-78c19.firebasestorage.app",
  messagingSenderId: "853864735160",
  appId: "1:853864735160:web:c933206d0257ba77392f4d",
  measurementId: "G-NVKTSPTWDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
