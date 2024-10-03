// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import Realtime Database

const firebaseConfig = {

  apiKey: "AIzaSyAWL-NQoBS-9XuPIFmKu1nS7ikK2m-p3lw",

  authDomain: "capstone2024uc-e385c.firebaseapp.com",

  databaseURL: "https://capstone2024uc-e385c-default-rtdb.firebaseio.com",

  projectId: "capstone2024uc-e385c",

  storageBucket: "capstone2024uc-e385c.appspot.com",

  messagingSenderId: "893356202916",

  appId: "1:893356202916:web:d017d22e1ca3079eb17f31"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
