import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.js';

const COL = 'bookings';

export async function getBookingsForCoach(coachId) {
  const snap = await getDocs(query(collection(db, COL), where('coachId', '==', coachId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createBooking(id, data) {
  await setDoc(doc(db, COL, id), data);
}
