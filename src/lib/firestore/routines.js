import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.js';
import * as demo from '../demo/localStore.js';

const COL = 'routines';
const HISTORY_COL = 'routineHistory';

/** El id del doc de rutina es el mismo que el studentId (1 rutina activa por alumno). */
export async function getRoutineForStudent(studentId) {
  if (demo.isDemo()) return demo.getDoc(COL, studentId);
  const snap = await getDoc(doc(db, COL, studentId));
  return snap.exists() ? snap.data() : null;
}

/**
 * Antes de pisar la rutina activa, archiva la versión anterior (si tenía algún
 * ejercicio cargado) en `routineHistory` — cada guardado ya no borra para siempre
 * la fase previa del alumno.
 */
export async function saveRoutine(studentId, routineData) {
  if (demo.isDemo()) {
    const existing = demo.getDoc(COL, studentId);
    const hasContent = Object.values(existing?.days || {}).some((d) => (d?.exercises || []).length > 0);
    if (hasContent) {
      demo.addDoc(HISTORY_COL, {
        studentId,
        coachId: existing.coachId,
        title: existing.title || 'Rutina sin título',
        notes: existing.notes || '',
        days: existing.days || {},
        archivedAt: Date.now(),
      });
    }
    return demo.setDoc(COL, studentId, routineData);
  }
  const existingSnap = await getDoc(doc(db, COL, studentId));
  if (existingSnap.exists()) {
    const existing = existingSnap.data();
    const hasContent = Object.values(existing.days || {}).some((d) => (d?.exercises || []).length > 0);
    if (hasContent) {
      await addDoc(collection(db, HISTORY_COL), {
        studentId,
        coachId: existing.coachId,
        title: existing.title || 'Rutina sin título',
        notes: existing.notes || '',
        days: existing.days || {},
        archivedAt: serverTimestamp(),
      });
    }
  }
  await setDoc(doc(db, COL, studentId), routineData);
}

/**
 * Autoguardado silencioso mientras el coach edita — a diferencia de
 * `saveRoutine`, NO archiva versión anterior en el historial. Si archivara en
 * cada tick de autoguardado, el "Historial" se llenaría de una versión nueva
 * cada vez que el coach hace una pausa de 1-2 segundos al tipear, en vez de
 * reflejar puntos de guardado reales. El historial sigue existiendo solo para
 * cuando el coach aprieta "Guardar Rutina" explícitamente.
 */
export async function autosaveRoutine(studentId, routineData) {
  if (demo.isDemo()) return demo.setDoc(COL, studentId, routineData);
  await setDoc(doc(db, COL, studentId), routineData);
}

export async function getRoutineHistory(studentId, max = 10) {
  if (demo.isDemo()) {
    return demo
      .listWhere(HISTORY_COL, 'studentId', studentId)
      .sort((a, b) => b.archivedAt - a.archivedAt)
      .slice(0, max);
  }
  const snap = await getDocs(
    query(collection(db, HISTORY_COL), where('studentId', '==', studentId), orderBy('archivedAt', 'desc'), limit(max))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function countRoutinesForCoach(coachId) {
  if (demo.isDemo()) return demo.listWhere(COL, 'coachId', coachId).length;
  const snap = await getDocs(query(collection(db, COL), where('coachId', '==', coachId)));
  return snap.size;
}
