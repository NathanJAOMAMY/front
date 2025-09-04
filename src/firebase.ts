// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics"; // Uncomment if you need analytics
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACrXHKD4rB15U9MyDKNPhfW0srxIjmj_E",
  authDomain: "chatprojet-a1483.firebaseapp.com",
  projectId: "chatprojet-a1483",
  storageBucket: "chatprojet-a1483.firebasestorage.app",
  messagingSenderId: "724824852993",
  appId: "1:724824852993:web:d2752c517dcb4468938e00",
  measurementId: "G-D13K5WLHGN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Uncomment if you need analytics
export const storage = getStorage(app);
