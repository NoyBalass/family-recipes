import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATW8jc2NoIW1Oda-q50r8151cxxIfj_PU",
  authDomain: "family-recipe-book-ea56d.firebaseapp.com",
  projectId: "family-recipe-book-ea56d",
  storageBucket: "family-recipe-book-ea56d.firebasestorage.app",
  messagingSenderId: "734435982431",
  appId: "1:734435982431:web:b1e53512055dc726a62fea"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
