/**
 * Datos demo sembrados una única vez si la base está vacía (ver src/lib/seed.js).
 * Los coaches se crean con Firebase Authentication (no viven acá, ver DEMO_COACHES
 * en seed.js) — acá solo va lo que referencia a un coach por posición (0 = primer
 * coach demo, "Valentín"), reemplazado por el uid real al sembrar.
 */

export const DEMO_COACHES = [
  {
    email: 'coach@coachpro.app',
    password: '123',
    name: 'Valentín Rossi',
    displayName: 'Coach Valentín',
    phone: '+5491100000000',
    specialty: 'Biomecánica & Fuerza',
    pricePersonalizado: 49,
    currency: '$',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=150&auto=format&fit=crop',
    bio: 'Especialista en sobrecarga progresiva y corrección técnica biomecánica.',
  },
  {
    email: 'sofia@coachpro.app',
    password: '123',
    name: 'Sofía Almada',
    displayName: 'Coach Sofía',
    phone: '+5491122334455',
    specialty: 'Hipertrofia & Glúteos',
    pricePersonalizado: 55,
    currency: '$',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    bio: 'Preparadora física focalizada en hipertrofia de tren inferior y recomposición corporal.',
  },
];

// coachIndex referencia una posición de DEMO_COACHES, reemplazado por el uid real al sembrar.
export const DEMO_ALUMNOS = [
  {
    id: '1', coachIndex: 0, name: 'Lucas Martínez', phone: '+5491123456789', email: 'lucas@gmail.com',
    plan: 'Coaching Integral (Personalizado)', goal: 'Ganar Masa Muscular & Fuerza', status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: '2', coachIndex: 0, name: 'Agustina Morales', phone: '+5491198765432', email: 'agus@gmail.com',
    plan: 'Coaching Integral (Personalizado)', goal: 'Fuerza en Pierna & Glúteos', status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
  },
  {
    id: '3', coachIndex: 0, name: 'Mateo Rossi', phone: '+5491155554433', email: 'mateo@gmail.com',
    plan: 'VIP Presencial', goal: 'Hipertrofia de Torso & Sentadilla', status: 'Activo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
  },
];

export const DEMO_ROUTINES = {
  '1': {
    studentId: '1', coachIndex: 0, title: 'Fase 1: Hipertrofia & Fuerza Básica',
    notes: 'Priorizar control excéntrico de 3s en cada serie.',
    days: {
      day1: { name: 'Día 1: Pecho, Hombro & Tríceps (Empujes)', exercises: [
        { name: 'Press Banca con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Retracción escapular firme' },
        { name: 'Press Inclinado con Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Ángulo de 30°' },
        { name: 'Fondos en Paralelas Lastrados', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Inclinación de torso al bajar' },
        { name: 'Elevaciones Laterales en Polea', sets: '4', reps: '12-15', rir: 'RIR 0 (Fallo)', rest: '60s', cue: 'Tensión constante en deltoides' },
      ] },
      day2: { name: 'Día 2: Piernas & Glúteos (Sentadilla)', exercises: [
        { name: 'Sentadilla Libre con Barra', sets: '4', reps: '5-7', rir: 'RIR 2', rest: '3 min', cue: 'Presión trípode en pies' },
        { name: 'Peso Muerto Rumano con Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Bisagra de cadera pura' },
        { name: 'Prensa Inclinada a 45°', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Sin despegar zona lumbar' },
        { name: 'Curl Femoral Tumbado', sets: '4', reps: '10-12', rir: 'RIR 0', rest: '60s', cue: 'Pausa de 1s en contracción' },
      ] },
      day3: { name: 'Día 3: Espalda, Bíceps & Core (Tracciones)', exercises: [
        { name: 'Dominadas Pronas Lastradas', sets: '4', reps: '6-8', rir: 'RIR 1-2', rest: '2.5 min', cue: 'Pecho a la barra' },
        { name: 'Remo con Barra 45°', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Codos pegados' },
        { name: 'Jalón al Pecho Neutro', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Máximo estiramiento arriba' },
        { name: 'Curl con Barra Z', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '75s', cue: 'Sin balanceo' },
      ] },
    },
  },
  '2': {
    studentId: '2', coachIndex: 0, title: 'Fase 1: Glúteos, Pierna & Estabilidad',
    notes: 'Control en la fase excéntrica y calentamiento de movilidad de cadera.',
    days: {
      day1: { name: 'Día 1: Glúteo & Cadena Posterior', exercises: [
        { name: 'Hip Thrust con Barra', sets: '4', reps: '8-10', rir: 'RIR 1', rest: '2 min', cue: 'Bloqueo pélvico arriba 2s' },
        { name: 'Peso Muerto Rumano', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Sentir isquiotibiales' },
        { name: 'Zancadas Búlgaras', sets: '3', reps: '10/pierna', rir: 'RIR 1', rest: '90s', cue: 'Torso ligeramente inclinado' },
      ] },
      day2: { name: 'Día 2: Tren Superior & Core', exercises: [
        { name: 'Jalón al Pecho', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Depresión escapular' },
        { name: 'Press Militar Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 2', rest: '90s', cue: 'Core compacto' },
        { name: 'Elevaciones Laterales', sets: '4', reps: '15', rir: 'RIR 0', rest: '60s', cue: 'Codos ligeramente flexionados' },
      ] },
    },
  },
};

export const DEMO_BOOKINGS = [
  { id: 'b1', coachIndex: 0, clientName: 'Martín Gómez', phone: '+5491133221100', service: 'Evaluación Inicial de Fuerza', date: 'Hoy', time: '10:00 AM', status: 'Pendiente' },
  { id: 'b2', coachIndex: 0, clientName: 'Florencia V.', phone: '+5491144332211', service: 'Sesión 1 a 1 en Gimnasio', date: 'Mañana', time: '05:00 PM', status: 'Confirmado' },
];
