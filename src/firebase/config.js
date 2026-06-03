import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCQLzOMRaj7Tc0UjJwPlnIdgTJy3JGRDvA",
  authDomain: "jobsgalore-c6a35.firebaseapp.com",
  projectId: "jobsgalore-c6a35",
  storageBucket: "jobsgalore-c6a35.firebasestorage.app",
  messagingSenderId: "997107768404",
  appId: "1:997107768404:web:fe4c30919310aaae2c21c1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
