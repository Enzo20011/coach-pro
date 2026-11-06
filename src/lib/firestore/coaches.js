import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import * as demo from '../demo/localStore.js';

const COL = 'coaches';

export async function getCoach(uid) {
  if (demo.isDemo()) return demo.getDoc(COL, uid);
  const snap = await getDoc(doc(db, COL, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createCoachProfile(uid, data) {
  if (demo.isDemo()) return demo.setDoc(COL, uid, data);
  await setDoc(doc(db, COL, uid), data);
}

export async function updateCoach(uid, partial) {
  if (demo.isDemo()) return demo.updateDoc(COL, uid, partial);
  await updateDoc(doc(db, COL, uid), partial);
}
