import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase.js';
import { createCoachProfile, getCoach, updateCoach } from '../lib/firestore/coaches.js';
import { seedDemoDataIfEmpty } from '../lib/seed.js';

// Código de activación manual (gate de venta directa, no es información secreta —
// se compara en el cliente igual que en el sitio anterior). Ver activar.html/Activar.jsx.
const ACTIVATION_CODE = 'COACHPRO-2026';

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
      return 'La contraseña debe tener al menos 6 caracteres.';
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
    seedDemoDataIfEmpty();
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
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, data.password);
      const profile = {
        name: data.name.trim(),
        displayName: `Coach ${data.name.trim().split(' ')[0]}`,
        email: cleanEmail,
        phone: data.phone.trim() || '+5491100000000',
        specialty: data.specialty.trim() || 'Preparador Físico',
        pricePersonalizado: parseInt(data.pricePersonalizado, 10) || 50,
        currency: '$',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
        bio: 'Entrenador personal certificado.',
        isActive: false,
      };
      await createCoachProfile(cred.user.uid, profile);
      const coachWithId = { id: cred.user.uid, ...profile };
      setCoach(coachWithId);
      return { success: true, coach: coachWithId };
    } catch (err) {
      return { success: false, message: mapAuthError(err) };
    }
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  const activate = useCallback(
    async (code) => {
      if (!user) return { success: false, message: 'No hay sesión activa.' };
      if (!code || code.trim().toUpperCase() !== ACTIVATION_CODE) {
        return { success: false, message: 'Código de activación incorrecto.' };
      }
      await updateCoach(user.uid, { isActive: true });
      setCoach((c) => (c ? { ...c, isActive: true } : c));
      return { success: true };
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
    () => ({ user, coach, loading, login, register, logout, activate, refetchCoach, updateCoachPrice }),
    [user, coach, loading, login, register, logout, activate, refetchCoach, updateCoachPrice]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
