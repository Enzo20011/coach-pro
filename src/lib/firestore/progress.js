import { arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.js';
import * as demo from '../demo/localStore.js';

const COL = 'progress';

/** Progreso de series marcadas + historial de entrenamientos completados por alumno. */
export async function getProgress(studentId) {
  if (demo.isDemo()) return demo.getDoc(COL, studentId);
  const snap = await getDoc(doc(db, COL, studentId));
  return snap.exists() ? snap.data() : null;
}

export async function saveDayProgress(studentId, coachId, dayKey, completedSetKeys) {
  if (demo.isDemo()) {
    return demo.setDoc(COL, studentId, { coachId, [`days.${dayKey}`]: completedSetKeys }, { merge: true });
  }
  await setDoc(doc(db, COL, studentId), { coachId, [`days.${dayKey}`]: completedSetKeys }, { merge: true });
}

export async function logCompletedSession(studentId, coachId, session) {
  if (demo.isDemo()) {
    const sessions = [...(demo.getDoc(COL, studentId)?.sessions || []), session];
    return demo.setDoc(COL, studentId, { coachId, sessions }, { merge: true });
  }
  await setDoc(doc(db, COL, studentId), { coachId, sessions: arrayUnion(session) }, { merge: true });
}

export async function getProgressForCoach(coachId) {
  if (demo.isDemo()) return demo.listWhere(COL, 'coachId', coachId);
  const snap = await getDocs(query(collection(db, COL), where('coachId', '==', coachId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
