/**
 * COACH PRO – COACH AUTHENTICATION & MULTI-TRAINER SESSION MANAGER (Firestore-backed)
 * Gestión de cuentas de entrenadores, sesión activa por dispositivo, tarifas y activación de pago.
 * Los datos de los coaches viven en Firestore (compartidos entre todos los dispositivos);
 * solo el "coach activo en este navegador" se guarda localmente como puntero de sesión.
 */

(function () {
  const ACTIVE_COACH_KEY = 'coachpro_active_coach';
  const COACHES_COL = 'coaches';

  // Manual activation code: shared with a trainer once they've paid (see activar.html).
  // NOTE: this lives in client-side JS, so it is not secret from anyone who inspects the
  // source — it's a lightweight manual gate for direct sales, not real payment security.
  const ACTIVATION_CODE = 'COACHPRO-2026';

  // Default seeded coaches + demo data, used only once when the database is empty
  const defaultCoaches = [
    {
      id: 'coach_1',
      name: 'Valentín Rossi',
      displayName: 'Coach Valentín',
      email: 'coach@coachpro.app',
      password: '123',
      phone: '+5491100000000',
      specialty: 'Biomecánica & Fuerza',
      pricePersonalizado: 49,
      currency: '$',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=150&auto=format&fit=crop',
      bio: 'Especialista en sobrecarga progresiva y corrección técnica biomecánica.',
      isActive: true
    },
    {
      id: 'coach_2',
      name: 'Sofía Almada',
      displayName: 'Coach Sofía',
      email: 'sofia@coachpro.app',
      password: '123',
      phone: '+5491122334455',
      specialty: 'Hipertrofia & Glúteos',
      pricePersonalizado: 55,
      currency: '$',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      bio: 'Preparadora física focalizada en hipertrofia de tren inferior y recomposición corporal.',
      isActive: true
    }
  ];

  const defaultAlumnos = [
    {
      id: '1', coachId: 'coach_1', name: 'Lucas Martínez', phone: '+5491123456789', email: 'lucas@gmail.com',
      plan: 'Coaching Integral (Personalizado)', goal: 'Ganar Masa Muscular & Fuerza', status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: '2', coachId: 'coach_1', name: 'Agustina Morales', phone: '+5491198765432', email: 'agus@gmail.com',
      plan: 'Coaching Integral (Personalizado)', goal: 'Fuerza en Pierna & Glúteos', status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: '3', coachId: 'coach_1', name: 'Mateo Rossi', phone: '+5491155554433', email: 'mateo@gmail.com',
      plan: 'VIP Presencial', goal: 'Hipertrofia de Torso & Sentadilla', status: 'Activo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop'
    }
  ];

  const defaultRoutines = {
    '1': {
      studentId: '1', coachId: 'coach_1', title: 'Fase 1: Hipertrofia & Fuerza Básica',
      notes: 'Priorizar control excéntrico de 3s en cada serie.',
      days: {
        day1: { name: 'Día 1: Pecho, Hombro & Tríceps (Empujes)', exercises: [
          { name: 'Press Banca con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Retracción escapular firme' },
          { name: 'Press Inclinado con Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Ángulo de 30°' },
          { name: 'Fondos en Paralelas Lastrados', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Inclinación de torso al bajar' },
          { name: 'Elevaciones Laterales en Polea', sets: '4', reps: '12-15', rir: 'RIR 0 (Fallo)', rest: '60s', cue: 'Tensión constante en deltoides' }
        ] },
        day2: { name: 'Día 2: Piernas & Glúteos (Sentadilla)', exercises: [
          { name: 'Sentadilla Libre con Barra', sets: '4', reps: '5-7', rir: 'RIR 2', rest: '3 min', cue: 'Presión trípode en pies' },
          { name: 'Peso Muerto Rumano con Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Bisagra de cadera pura' },
          { name: 'Prensa Inclinada a 45°', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Sin despegar zona lumbar' },
          { name: 'Curl Femoral Tumbado', sets: '4', reps: '10-12', rir: 'RIR 0', rest: '60s', cue: 'Pausa de 1s en contracción' }
        ] },
        day3: { name: 'Día 3: Espalda, Bíceps & Core (Tracciones)', exercises: [
          { name: 'Dominadas Pronas Lastradas', sets: '4', reps: '6-8', rir: 'RIR 1-2', rest: '2.5 min', cue: 'Pecho a la barra' },
          { name: 'Remo con Barra 45°', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Codos pegados' },
          { name: 'Jalón al Pecho Neutro', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Máximo estiramiento arriba' },
          { name: 'Curl con Barra Z', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '75s', cue: 'Sin balanceo' }
        ] }
      }
    },
    '2': {
      studentId: '2', coachId: 'coach_1', title: 'Fase 1: Glúteos, Pierna & Estabilidad',
      notes: 'Control en la fase excéntrica y calentamiento de movilidad de cadera.',
      days: {
        day1: { name: 'Día 1: Glúteo & Cadena Posterior', exercises: [
          { name: 'Hip Thrust con Barra', sets: '4', reps: '8-10', rir: 'RIR 1', rest: '2 min', cue: 'Bloqueo pélvico arriba 2s' },
          { name: 'Peso Muerto Rumano', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Sentir isquiotibiales' },
          { name: 'Zancadas Búlgaras', sets: '3', reps: '10/pierna', rir: 'RIR 1', rest: '90s', cue: 'Torso ligeramente inclinado' }
        ] },
        day2: { name: 'Día 2: Tren Superior & Core', exercises: [
          { name: 'Jalón al Pecho', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Depresión escapular' },
          { name: 'Press Militar Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 2', rest: '90s', cue: 'Core compacto' },
          { name: 'Elevaciones Laterales', sets: '4', reps: '15', rir: 'RIR 0', rest: '60s', cue: 'Codos ligeramente flexionados' }
        ] }
      }
    }
  };

  const defaultBookings = [
    { id: 'b1', coachId: 'coach_1', clientName: 'Martín Gómez', phone: '+5491133221100', service: 'Evaluación Inicial de Fuerza', date: 'Hoy', time: '10:00 AM', status: 'Pendiente' },
    { id: 'b2', coachId: 'coach_1', clientName: 'Florencia V.', phone: '+5491144332211', service: 'Sesión 1 a 1 en Gimnasio', date: 'Mañana', time: '05:00 PM', status: 'Confirmado' }
  ];

  // Runs once: if the "coaches" collection is empty, seed demo data so the site isn't blank
  // on a brand new Firebase project. Safe to run from every page (it no-ops after the first time).
  async function seedDemoDataIfEmpty() {
    try {
      const snap = await db.collection(COACHES_COL).limit(1).get();
      if (!snap.empty) return;

      const batch = db.batch();
      defaultCoaches.forEach(c => batch.set(db.collection('coaches').doc(c.id), c));
      defaultAlumnos.forEach(a => batch.set(db.collection('alumnos').doc(a.id), a));
      Object.keys(defaultRoutines).forEach(id => batch.set(db.collection('routines').doc(id), defaultRoutines[id]));
      defaultBookings.forEach(b => batch.set(db.collection('bookings').doc(b.id), b));
      await batch.commit();
    } catch (e) {
      console.error('No se pudo inicializar la base de datos de demo:', e);
    }
  }
  const seedReady = seedDemoDataIfEmpty();

  async function getCoaches() {
    await seedReady;
    const snap = await db.collection(COACHES_COL).get();
    return snap.docs.map(d => d.data());
  }

  // Synchronous, cached read of "who is logged in on THIS device/browser".
  // This is intentionally local (a session pointer), not shared data.
  function getActiveCoach() {
    try {
      const coach = JSON.parse(localStorage.getItem(ACTIVE_COACH_KEY));
      if (coach && coach.id) return coach;
    } catch (e) {}
    return null;
  }

  function setActiveCoach(coach) {
    localStorage.setItem(ACTIVE_COACH_KEY, JSON.stringify(coach));
  }

  // Re-fetches the active coach's current record from Firestore and refreshes the local
  // session cache (in case price/activation changed from another device).
  async function refreshActiveCoach() {
    const cached = getActiveCoach();
    if (!cached) return null;
    const doc = await db.collection(COACHES_COL).doc(cached.id).get();
    if (doc.exists) {
      setActiveCoach(doc.data());
      return doc.data();
    }
    return null;
  }

  async function loginCoach(email, password) {
    await seedReady;
    const cleanEmail = email.trim().toLowerCase();
    const snap = await db.collection(COACHES_COL).where('email', '==', cleanEmail).limit(1).get();
    if (snap.empty) {
      return { success: false, message: 'Correo o contraseña incorrectos.' };
    }
    const found = snap.docs[0].data();
    if (found.password !== password) {
      return { success: false, message: 'Correo o contraseña incorrectos.' };
    }
    setActiveCoach(found);
    return { success: true, coach: found };
  }

  async function registerCoach(coachData) {
    await seedReady;
    const cleanEmail = coachData.email.trim().toLowerCase();
    const existing = await db.collection(COACHES_COL).where('email', '==', cleanEmail).limit(1).get();
    if (!existing.empty) {
      return { success: false, message: 'Ya existe un entrenador registrado con este correo.' };
    }

    const newId = 'coach_' + Date.now();
    const newCoach = {
      id: newId,
      name: coachData.name.trim(),
      displayName: 'Coach ' + coachData.name.trim().split(' ')[0],
      email: cleanEmail,
      password: coachData.password,
      phone: coachData.phone.trim() || '+5491100000000',
      specialty: coachData.specialty.trim() || 'Preparador Físico',
      pricePersonalizado: parseInt(coachData.pricePersonalizado, 10) || 50,
      currency: '$',
      avatar: coachData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      bio: coachData.bio || 'Entrenador personal certificado.',
      isActive: false
    };

    await db.collection(COACHES_COL).doc(newId).set(newCoach);
    setActiveCoach(newCoach);
    return { success: true, coach: newCoach };
  }

  async function updateCoachPrice(coachId, newPrice) {
    const parsedPrice = parseInt(newPrice, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) return false;

    await db.collection(COACHES_COL).doc(coachId).update({ pricePersonalizado: parsedPrice });

    const active = getActiveCoach();
    if (active && active.id === coachId) {
      active.pricePersonalizado = parsedPrice;
      setActiveCoach(active);
    }
    return true;
  }

  function logoutCoach() {
    localStorage.removeItem(ACTIVE_COACH_KEY);
    window.location.href = 'login.html';
  }

  // Unlocks a coach's panel once payment has been coordinated manually (see activar.html)
  async function activateCoach(coachId, code) {
    if (!code || code.trim().toUpperCase() !== ACTIVATION_CODE) {
      return { success: false, message: 'Código de activación incorrecto.' };
    }

    const doc = await db.collection(COACHES_COL).doc(coachId).get();
    if (!doc.exists) {
      return { success: false, message: 'Cuenta no encontrada.' };
    }

    await db.collection(COACHES_COL).doc(coachId).update({ isActive: true });
    const updatedCoach = { ...doc.data(), isActive: true };

    const active = getActiveCoach();
    if (active && active.id === coachId) {
      setActiveCoach(updatedCoach);
    }

    return { success: true, coach: updatedCoach };
  }

  // Export to global window
  window.ValenAuth = {
    getCoaches,
    getActiveCoach,
    setActiveCoach,
    refreshActiveCoach,
    loginCoach,
    registerCoach,
    updateCoachPrice,
    activateCoach,
    logoutCoach
  };
})();
