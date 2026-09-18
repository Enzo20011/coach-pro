import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase.js';
import { DEMO_ALUMNOS, DEMO_BOOKINGS, DEMO_COACHES, DEMO_ROUTINES } from '../data/seedData.js';

/**
 * Siembra datos demo solo la primera vez, detectado por "ya existe una cuenta de
 * Firebase Auth con este email" (auth/email-already-in-use) en vez de una lectura
 * previa a `coaches` — Firestore Security Rules no dejan listar esa colección sin
 * estar autenticado, y este chequeo corre antes de loguearse a ningún lado. Nunca
 * corre en producción — ver el chequeo `import.meta.env.DEV` en AuthContext.jsx;
 * correrlo siempre, incluso en prod, es lo que permitía crear cuentas reales con
 * contraseña "123" en la base viva la primera vez que alguien entraba al sitio.
 *
 * Firestore Security Rules exigen que cada doc de alumno/rutina/turno solo lo
 * escriba el propio coach dueño (coachId == auth.uid). Por eso cada coach demo
 * se crea y siembra sus propios datos ANTES de pasar al siguiente — escribir
 * todo al final con "quien haya quedado logueado último" rompería las reglas
 * para los datos de cualquier coach que no sea el último creado.
 */
export async function seedDemoDataIfEmpty() {
  // Solo cerramos sesión al final (éxito o error) si esta corrida realmente
  // llegó a loguearse como algún coach demo — si el primer intento ya tira
  // "email-already-in-use" nunca nos logueamos a nada, y no hay que tocar la
  // sesión que hubiera (aunque en la práctica AuthContext ya evita llamar a
  // esta función si hay alguien logueado).
  let signedInAsDemo = false;
  try {
    for (let i = 0; i < DEMO_COACHES.length; i += 1) {
      const { password, ...profile } = DEMO_COACHES[i];
      const cred = await createUserWithEmailAndPassword(auth, DEMO_COACHES[i].email, password);
      signedInAsDemo = true;
      const uid = cred.user.uid;

      await setDoc(doc(db, 'coaches', uid), { ...profile, isActive: true });

      await Promise.all(
        DEMO_ALUMNOS.filter((al) => al.coachIndex === i).map((al) => {
          const { coachIndex: _coachIndex, ...rest } = al;
          return setDoc(doc(db, 'alumnos', al.id), { ...rest, coachId: uid });
        })
      );

      await Promise.all(
        Object.entries(DEMO_ROUTINES)
          .filter(([, routine]) => routine.coachIndex === i)
          .map(([id, routine]) => {
            const { coachIndex: _coachIndex, ...rest } = routine;
            return setDoc(doc(db, 'routines', id), { ...rest, coachId: uid });
          })
      );

      await Promise.all(
        DEMO_BOOKINGS.filter((b) => b.coachIndex === i).map((b) => {
          const { coachIndex: _coachIndex, ...rest } = b;
          return setDoc(doc(db, 'bookings', b.id), { ...rest, coachId: uid });
        })
      );
    }

    await signOut(auth);
  } catch (err) {
    // "email-already-in-use" significa que ya se sembró en un intento previo: no es un error real.
    if (err?.code !== 'auth/email-already-in-use') {
      console.error('No se pudo inicializar la base de datos de demo:', err);
    }
    if (signedInAsDemo) {
      try {
        await signOut(auth);
      } catch {
        /* no había sesión que cerrar */
      }
    }
  }
}
