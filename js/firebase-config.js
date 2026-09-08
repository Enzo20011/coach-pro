/**
 * COACH PRO – FIREBASE INITIALIZATION
 * Conecta el sitio a la base de datos en la nube (Firestore) del proyecto "gimnasio-786cd".
 * Debe cargarse ANTES que auth.js, admin.js, alumno.js y reservar.js en cada página.
 */

const firebaseConfig = {
  apiKey: "AIzaSyA7raoIXYGnE39jE-I7BvHcz2IVdh5JOt4",
  authDomain: "gimnasio-786cd.firebaseapp.com",
  projectId: "gimnasio-786cd",
  storageBucket: "gimnasio-786cd.firebasestorage.app",
  messagingSenderId: "1064171259436",
  appId: "1:1064171259436:web:4dc806d40124bdf812f389"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
