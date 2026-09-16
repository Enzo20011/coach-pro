import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.js';

const COL = 'routines';

/** El id del doc de rutina es el mismo que el studentId (1 rutina activa por alumno). */
export async function getRoutineForStudent(studentId) {
  const snap = await getDoc(doc(db, COL, studentId));
  return snap.exists() ? snap.data() : null;
}

export async function saveRoutine(studentId, routineData) {
  await setDoc(doc(db, COL, studentId), routineData);
}

export async function countRoutinesForCoach(coachId) {
  const snap = await getDocs(query(collection(db, COL), where('coachId', '==', coachId)));
  return snap.size;
}
