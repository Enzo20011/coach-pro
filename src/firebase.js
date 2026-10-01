/**
 * COACH PRO – Inicialización de Firebase (SDK modular v9+)
 * Conecta la app al proyecto "gimnasio-786cd" (Firestore + Authentication).
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: 'AIzaSyA7raoIXYGnE39jE-I7BvHcz2IVdh5JOt4',
  authDomain: 'gimnasio-786cd.firebaseapp.com',
  projectId: 'gimnasio-786cd',
  storageBucket: 'gimnasio-786cd.firebasestorage.app',
  messagingSenderId: '1064171259436',
  appId: '1:1064171259436:web:4dc806d40124bdf812f389',
};

export const app = initializeApp(firebaseConfig);

// App Check (reCAPTCHA v3): frena bots/scripts que pegan directo a Firestore y Auth.
// Se activa al definir VITE_RECAPTCHA_SITE_KEY; luego "Enforce" en la consola de Firebase.
const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
if (siteKey) {
  if (import.meta.env.DEV) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  initializeAppCheck(app, { provider: new ReCaptchaV3Provider(siteKey), isTokenAutoRefreshEnabled: true });
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'us-central1');
