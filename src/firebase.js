/**
 * COACH PRO – Inicialización de Firebase (SDK modular v9+)
 * Conecta la app al proyecto "gimnasio-786cd" (Firestore + Authentication).
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA7raoIXYGnE39jE-I7BvHcz2IVdh5JOt4',
  authDomain: 'gimnasio-786cd.firebaseapp.com',
  projectId: 'gimnasio-786cd',
  storageBucket: 'gimnasio-786cd.firebasestorage.app',
  messagingSenderId: '1064171259436',
  appId: '1:1064171259436:web:4dc806d40124bdf812f389',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
