import { collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase.js';

const COL = 'bookings';

function slug(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * ID determinístico por (coach, fecha, horario) en vez de uno random. Esto es lo
 * que evita turnos duplicados: si el slot ya está Pendiente/Confirmado, Firestore
 * Security Rules tratan un segundo intento de reserva como "update" de un doc
 * ajeno (no "create") y lo rechazan — el conflicto se resuelve del lado servidor,
 * sin necesidad de una consulta previa con condición de carrera.
 */
export function buildSlotId(coachId, dateLabel, time) {
  return `${slug(coachId)}__${slug(dateLabel)}__${slug(time)}`;
}

export async function getBookingsForCoach(coachId) {
  const snap = await getDocs(query(collection(db, COL), where('coachId', '==', coachId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createBooking(id, data) {
  await setDoc(doc(db, COL, id), data);
}

export async function updateBooking(id, partial) {
  await updateDoc(doc(db, COL, id), partial);
}
