import { collection, doc, getDocs, limit, query, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase.js';
import { DEMO_ALUMNOS, DEMO_BOOKINGS, DEMO_COACHES, DEMO_ROUTINES } from '../data/seedData.js';

/**
 * Siembra datos demo solo si la colección "coaches" está vacía (primer arranque
 * contra un proyecto Firebase nuevo). A diferencia del auth.js original, acá los
 * coaches se crean con Firebase Authentication real (createUserWithEmailAndPassword),
 * lo que temporalmente inicia sesión como cada coach demo mientras se siembra — por
 * eso se cierra sesión al final, para no dejar logueado a quien cargó la página.
 */
export async function seedDemoDataIfEmpty() {
  try {
    const snap = await getDocs(query(collection(db, 'coaches'), limit(1)));
    if (!snap.empty) return;

    const coachUids = [];
    for (const demoCoach of DEMO_COACHES) {
      const { password, ...profile } = demoCoach;
      const cred = await createUserWithEmailAndPassword(auth, demoCoach.email, password);
      const uid = cred.user.uid;
      coachUids.push(uid);
      await setDoc(doc(db, 'coaches', uid), { ...profile, isActive: true });
    }

    await Promise.all(
      DEMO_ALUMNOS.map((a) => {
        const { coachIndex, ...rest } = a;
        return setDoc(doc(db, 'alumnos', a.id), { ...rest, coachId: coachUids[coachIndex] });
      })
    );

    await Promise.all(
      Object.entries(DEMO_ROUTINES).map(([id, routine]) => {
        const { coachIndex, ...rest } = routine;
        return setDoc(doc(db, 'routines', id), { ...rest, coachId: coachUids[coachIndex] });
      })
    );

    await Promise.all(
      DEMO_BOOKINGS.map((b) => {
        const { coachIndex, ...rest } = b;
        return setDoc(doc(db, 'bookings', b.id), { ...rest, coachId: coachUids[coachIndex] });
      })
    );

    await signOut(auth);
  } catch (err) {
    // "email-already-in-use" significa que ya se sembró en un intento previo: no es un error real.
    if (err?.code !== 'auth/email-already-in-use') {
      console.error('No se pudo inicializar la base de datos de demo:', err);
    }
    try {
      await signOut(auth);
    } catch {
      /* no había sesión que cerrar */
    }
  }
}
