// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdIDIwW_0ui9U-soIxAis5ySM8WlmTFNQ",
  authDomain: "book-scan-ai.firebaseapp.com",
  projectId: "book-scan-ai",
  storageBucket: "book-scan-ai.firebasestorage.app",
  messagingSenderId: "1068868076861",
  appId: "1:1068868076861:web:38db90d0910bbaf4883154",
  measurementId: "G-C5T5P2BYLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);