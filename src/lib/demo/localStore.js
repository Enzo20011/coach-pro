import { DEMO_ALUMNOS, DEMO_BOOKINGS, DEMO_COACHES, DEMO_ROUTINES } from '../../data/seedData.js';

/**
 * Modo invitado: una base chica guardada en localStorage, propia de cada
 * visitante. No toca Firebase, así las pruebas no ensucian la base real.
 */
const DATA_KEY = 'coachpro-invitado-datos';
const FLAG_KEY = 'coachpro-invitado-activo';

export const DEMO_UID = 'demo-coach';

export function isDemo() {
  try {
    return localStorage.getItem(FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

function buildSeed() {
  const { password: _password, ...coachProfile } = DEMO_COACHES[0];
  const withCoach = ({ coachIndex: _i, ...rest }) => ({ ...rest, coachId: DEMO_UID });
  return {
    coaches: { [DEMO_UID]: { ...coachProfile, isActive: true } },
    alumnos: Object.fromEntries(DEMO_ALUMNOS.filter((a) => a.coachIndex === 0).map((a) => [a.id, withCoach(a)])),
    routines: Object.fromEntries(Object.entries(DEMO_ROUTINES).map(([id, r]) => [id, withCoach(r)])),
    bookings: Object.fromEntries(DEMO_BOOKINGS.filter((b) => b.coachIndex === 0).map((b) => [b.id, withCoach(b)])),
    routineHistory: {},
    progress: {},
    exerciseLibrary: {},
  };
}

let memory = null;

function persist() {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(memory));
  } catch {
    /* sin almacenamiento: el invitado sigue trabajando en memoria */
  }
}

function db() {
  if (memory) return memory;
  try {
    memory = JSON.parse(localStorage.getItem(DATA_KEY));
  } catch {
    memory = null;
  }
  if (!memory) {
    memory = buildSeed();
    persist();
  }
  return memory;
}

export function enterDemo() {
  try {
    localStorage.setItem(FLAG_KEY, '1');
  } catch {
    /* ver persist() */
  }
  db();
}

export function exitDemo() {
  try {
    localStorage.removeItem(FLAG_KEY);
  } catch {
    /* ver persist() */
  }
}

export function resetDemo() {
  memory = buildSeed();
  persist();
}

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function setPath(target, path, value) {
  const keys = path.split('.');
  let node = target;
  keys.slice(0, -1).forEach((k) => {
    if (typeof node[k] !== 'object' || node[k] === null) node[k] = {};
    node = node[k];
  });
  node[keys[keys.length - 1]] = value;
}

export function getDoc(col, id) {
  const found = db()[col]?.[id];
  return found === undefined ? null : { id, ...clone(found) };
}

export function setDoc(col, id, data, { merge = false } = {}) {
  const store = db();
  store[col] = store[col] || {};
  if (!(merge && store[col][id])) store[col][id] = {};
  Object.entries(clone(data)).forEach(([k, v]) => setPath(store[col][id], k, v));
  persist();
}

export function updateDoc(col, id, partial) {
  setDoc(col, id, partial, { merge: true });
}

export function addDoc(col, data) {
  const id = `h${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
  setDoc(col, id, data);
  return id;
}

export function listWhere(col, field, value) {
  return Object.entries(db()[col] || {})
    .filter(([, d]) => d[field] === value)
    .map(([id, d]) => ({ id, ...clone(d) }));
}
