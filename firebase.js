import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDMoh_PjErBNdJsHPelRHdpIsZ_v2yH8PY",
  authDomain: "flashcard-saas-b5e68.firebaseapp.com",
  projectId: "flashcard-saas-b5e68",
  storageBucket: "Yflashcard-saas-b5e68.appspot.com",
  messagingSenderId: "445823457547",
  appId: "1:445823457547:web:da334e0aa98db285f22a0e",
  measurementId: "G-2C065F5J3G",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
