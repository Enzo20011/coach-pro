import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '../firebase.js';
import { createCoachProfile, getCoach, updateCoach } from '../lib/firestore/coaches.js';
import { seedDemoDataIfEmpty } from '../lib/seed.js';

// El código de activación se valida en la Cloud Function `activateAccount`
// (functions/index.js); nunca vive en el cliente.
const activateAccountFn = httpsCallable(functions, 'activateAccount');

export const MIN_PASSWORD_LENGTH = 8;

const AuthContext = createContext(null);

function mapAuthError(err) {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos.';
    case 'auth/email-already-in-use':
      return 'Ya existe un entrenador registrado con este correo.';
    case 'auth/weak-password':
      return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Esperá unos minutos antes de volver a probar.';
    case 'auth/invalid-email':
      return 'El correo ingresado no es válido.';
    default:
      return 'No pudimos conectar con el servidor. Probá de nuevo en un momento.';
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Nunca en producción: sembraba cuentas demo reales (contraseña "123" hardcodeada
    // en el repo) contra la base de datos viva apenas alguien entraba a la web.
    // Tampoco si ya hay alguien logueado: el seed crea/entra a cuentas demo, y la
    // sesión de Firebase Auth es compartida entre pestañas del mismo origen — abrir
    // /alumno en una pestaña nueva mientras el coach real está logueado en otra
    // terminaba cerrándole la sesión ahí también.
    if (import.meta.env.DEV && !auth.currentUser) seedDemoDataIfEmpty();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setCoach(firebaseUser ? await getCoach(firebaseUser.uid) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refetchCoach = useCallback(async () => {
    if (!user) return null;
    const profile = await getCoach(user.uid);
    setCoach(profile);
    return profile;
  }, [user]);

  const login = useCallback(async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const profile = await getCoach(cred.user.uid);
      return { success: true, coach: profile };
    } catch (err) {
      return { success: false, message: mapAuthError(err) };
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const cleanEmail = data.email.trim().toLowerCase();
      if (data.password.length < MIN_PASSWORD_LENGTH || !/[a-zA-Z]/.test(data.password) || !/\d/.test(data.password)) {
        return { success: false, message: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres, con letras y números.` };
      }
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
      const profile = {
        name: data.name.trim(),
        displayName: `Coach ${data.name.trim().split(' ')[0]}`,
        email: cleanEmail,
        phone: data.phone.trim() || '+5491100000000',
        specialty: data.specialty.trim() || 'Preparador Físico',
        pricePersonalizado: parseInt(data.pricePersonalizado, 10) || 50000,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        bio: 'Entrenador personal certificado.',
        isActive: false,
      };
      await createCoachProfile(cred.user.uid, profile);
      sendEmailVerification(cred.user).catch(() => {});
      const coachWithId = { id: cred.user.uid, ...profile };
      setCoach(coachWithId);
      return { success: true, coach: coachWithId };
    } catch (err) {
      return { success: false, message: mapAuthError(err) };
    }
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  // Respuesta siempre genérica: no revela si el correo está registrado o no.
  const resetPassword = useCallback(async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
    } catch {
      // se ignora a propósito (anti-enumeración de cuentas)
    }
    return { success: true };
  }, []);

  const activate = useCallback(
    async (code) => {
      if (!user) return { success: false, message: 'No hay sesión activa.' };
      if (!code || !code.trim()) return { success: false, message: 'Ingresá el código de activación.' };
      try {
        await activateAccountFn({ code });
        setCoach((c) => (c ? { ...c, isActive: true } : c));
        return { success: true };
      } catch (err) {
        const message =
          err?.code === 'functions/permission-denied'
            ? 'Código de activación incorrecto.'
            : err?.code === 'functions/resource-exhausted'
              ? 'Demasiados intentos. Probá de nuevo en unos minutos.'
              : 'No pudimos validar el código. Probá de nuevo en un momento.';
        return { success: false, message };
      }
    },
    [user]
  );

  const updateCoachPrice = useCallback(
    async (newPrice) => {
      const parsed = parseInt(newPrice, 10);
      if (!user || Number.isNaN(parsed) || parsed <= 0) return false;
      await updateCoach(user.uid, { pricePersonalizado: parsed });
      setCoach((c) => (c ? { ...c, pricePersonalizado: parsed } : c));
      return true;
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, coach, loading, login, register, logout, resetPassword, activate, refetchCoach, updateCoachPrice }),
    [user, coach, loading, login, register, logout, resetPassword, activate, refetchCoach, updateCoachPrice]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
