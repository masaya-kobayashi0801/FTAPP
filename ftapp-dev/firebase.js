// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxEOWPDpG6i0UXevuUn5oUMUfNTNySUzU",
  authDomain: "ft-app-f74ce.firebaseapp.com",
  projectId: "ft-app-f74ce",
  storageBucket: "ft-app-f74ce.appspot.com",
  messagingSenderId: "207485871206",
  appId: "1:207485871206:web:efae510af0925e0e52b9a7",
  databaseURL: "https://ft-app-f74ce-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const database = getDatabase(app);
export const functions = getFunctions(app);
export const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
