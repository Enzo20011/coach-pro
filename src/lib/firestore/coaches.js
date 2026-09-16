import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';

const COL = 'coaches';

export async function getCoach(uid) {
  const snap = await getDoc(doc(db, COL, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createCoachProfile(uid, data) {
  await setDoc(doc(db, COL, uid), data);
}

export async function updateCoach(uid, partial) {
  await updateDoc(doc(db, COL, uid), partial);
}
