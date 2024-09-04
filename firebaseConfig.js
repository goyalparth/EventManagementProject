// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyCzVzYLtntM_2W8VITvc62G5FQiTmOnsAw",
  authDomain: "capstone-877a4.firebaseapp.com",
  databaseURL: "https://capstone-877a4-default-rtdb.firebaseio.com",
  projectId: "capstone-877a4",
  storageBucket: "capstone-877a4.appspot.com",
  messagingSenderId: "46038617382",
  appId: "1:46038617382:web:85dcf826d65e3c197d05e7",
  measurementId: "G-XMEL6N4GL0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
