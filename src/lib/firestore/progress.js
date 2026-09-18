import { arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.js';

const COL = 'progress';

/** Progreso de series marcadas + historial de entrenamientos completados por alumno. */
export async function getProgress(studentId) {
  const snap = await getDoc(doc(db, COL, studentId));
  return snap.exists() ? snap.data() : null;
}

export async function saveDayProgress(studentId, coachId, dayKey, completedSetKeys) {
  await setDoc(doc(db, COL, studentId), { coachId, [`days.${dayKey}`]: completedSetKeys }, { merge: true });
}

export async function logCompletedSession(studentId, coachId, session) {
  await setDoc(doc(db, COL, studentId), { coachId, sessions: arrayUnion(session) }, { merge: true });
}

export async function getProgressForCoach(coachId) {
  const snap = await getDocs(query(collection(db, COL), where('coachId', '==', coachId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
