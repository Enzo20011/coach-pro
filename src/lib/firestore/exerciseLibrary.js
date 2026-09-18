import { deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.js';

const COL = 'exerciseLibrary';

// Techo razonable para que un solo doc de Firestore (límite duro: 1 MiB) no
// crezca sin control con el uso de los años — muy por encima de lo que un
// coach real llega a usar, así que en la práctica casi nunca se dispara.
const MAX_LIBRARY_SIZE = 300;

/** Un solo doc por coach: { exercises: { [nombreNormalizado]: {name, sets, reps, rir, rest, cue, lastUsedAt} } }. */
export async function getExerciseLibrary(coachId) {
  const snap = await getDoc(doc(db, COL, coachId));
  return snap.exists() ? Object.values(snap.data().exercises || {}) : [];
}

function normalizeKey(name) {
  // Los updates usan notación de punto ("exercises.<key>") para mergear sin pisar
  // el resto de la biblioteca — un nombre con '.', '/', etc. rompería esa ruta al
  // interpretarse como un separador de campo extra, así que se sanitiza.
  return name.trim().toLowerCase().replace(/[.$/[\]#*~]/g, '-');
}

/**
 * Guarda/actualiza uno o más ejercicios en la biblioteca del coach — se llama
 * cada vez que se guarda una rutina, así la lista crece sola con el uso real
 * en vez de tener que cargarse a mano en algún lado aparte.
 */
export async function saveExercisesToLibrary(coachId, exercises) {
  const validExercises = exercises.filter((ex) => ex.name && ex.name.trim());
  if (validExercises.length === 0) return;

  const now = Date.now();
  const updates = {};
  validExercises.forEach((ex) => {
    const key = normalizeKey(ex.name);
    updates[`exercises.${key}`] = {
      name: ex.name.trim(),
      sets: ex.sets || '',
      reps: ex.reps || '',
      rir: ex.rir || '',
      rest: ex.rest || '',
      cue: ex.cue || '',
      lastUsedAt: now,
    };
  });

  await setDoc(doc(db, COL, coachId), updates, { merge: true });
  await pruneLibraryIfNeeded(coachId);
}

/** Si se pasó el techo, borra las entradas usadas hace más tiempo hasta volver al límite. */
async function pruneLibraryIfNeeded(coachId) {
  const snap = await getDoc(doc(db, COL, coachId));
  if (!snap.exists()) return;
  const exercises = snap.data().exercises || {};
  const keys = Object.keys(exercises);
  if (keys.length <= MAX_LIBRARY_SIZE) return;

  const oldestFirst = keys.sort((a, b) => (exercises[a].lastUsedAt || 0) - (exercises[b].lastUsedAt || 0));
  const toRemove = oldestFirst.slice(0, keys.length - MAX_LIBRARY_SIZE);
  const removals = {};
  toRemove.forEach((key) => {
    removals[`exercises.${key}`] = deleteField();
  });
  await updateDoc(doc(db, COL, coachId), removals);
}
