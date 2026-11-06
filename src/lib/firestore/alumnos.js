import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.js';
import * as demo from '../demo/localStore.js';

const COL = 'alumnos';

export async function getAlumnosForCoach(coachId) {
  if (demo.isDemo()) return demo.listWhere(COL, 'coachId', coachId);
  const snap = await getDocs(query(collection(db, COL), where('coachId', '==', coachId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getAlumno(id) {
  if (demo.isDemo()) return demo.getDoc(COL, id);
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createAlumno(id, data) {
  if (demo.isDemo()) return demo.setDoc(COL, id, data);
  await setDoc(doc(db, COL, id), data);
}
