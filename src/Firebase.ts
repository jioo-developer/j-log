import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCeaFjWqblTTAhAQMiNsWzFux9NQuPA1bI",
  authDomain: "new-jlog.firebaseapp.com",
  projectId: "new-jlog",
  storageBucket: "new-jlog.appspot.com",
  messagingSenderId: "643613260686",
  appId: "1:643613260686:web:01aefa6ea3739198f182df",
  measurementId: "G-T9X015RBRB",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const db = firebase.firestore();
export const storageService = firebase.storage();
