import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6QdJLSfBxPeWIwMI-gz2WLAvqZUZGyc0",
  authDomain: "rockefeller-finance2.firebaseapp.com",
  projectId: "rockefeller-finance2",
  storageBucket: "rockefeller-finance2.firebasestorage.app",
  messagingSenderId: "239182368996",
  appId: "1:239182368996:web:71c4a4cb793b7c0d9b9cf1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
