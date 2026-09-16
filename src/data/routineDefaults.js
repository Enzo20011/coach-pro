export const DEFAULT_DAY_NAMES = {
  1: 'Día 1: Empujes de Pecho & Hombro',
  2: 'Día 2: Piernas & Glúteos',
  3: 'Día 3: Tracciones & Bíceps',
  4: 'Día 4: Hombros, Brazos & Core',
  5: 'Día 5: Pierna & Isquiosurarios',
  6: 'Día 6: Torso Completo / Full Body',
};

export function blankExercise() {
  return { name: 'Nuevo Ejercicio', sets: '3', reps: '10-12', rir: 'RIR 2', rest: '90s', cue: 'Técnica biomecánica estricta' };
}

/** Rutina por defecto cuando un alumno todavía no tiene ninguna guardada en Firestore. */
export function defaultRoutineFor(studentId, coach) {
  return {
    studentId,
    coachId: coach.id,
    title: 'Plan de Fuerza & Hipertrofia',
    notes: `Directiva técnica de ${coach.displayName}: Mantener sobrecarga progresiva y registrar kilajes en cada serie.`,
    days: {
      day1: { name: 'Día 1: Empujes (Pecho, Hombro, Tríceps)', exercises: [] },
      day2: { name: 'Día 2: Piernas & Glúteos (Sentadilla)', exercises: [] },
      day3: { name: 'Día 3: Tracciones (Espalda, Bíceps, Core)', exercises: [] },
    },
  };
}

/** Rutina plantilla que se asigna automáticamente a cada alumno nuevo. */
export function starterRoutineFor(studentId, coach, goal) {
  return {
    studentId,
    coachId: coach.id,
    title: 'Fase 1: Adaptación & Fuerza',
    notes: `Plan adaptado a objetivo: ${goal}. Tarifa acordada: $${coach.pricePersonalizado}/mes. Priorizar técnica biomecánica estricta.`,
    days: {
      day1: {
        name: 'Día 1: Empujes de Pecho, Hombro & Tríceps',
        exercises: [
          { name: 'Press Banca con Barra', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Retracción escapular firme' },
          { name: 'Press Militar con Mancuernas', sets: '3', reps: '10-12', rir: 'RIR 1-2', rest: '90s', cue: 'Core compacto y glúteos activos' },
          { name: 'Elevaciones Laterales en Polea', sets: '4', reps: '12-15', rir: 'RIR 0', rest: '60s', cue: 'Control excéntrico de 2 segundos' },
        ],
      },
      day2: {
        name: 'Día 2: Piernas & Glúteos (Sentadilla)',
        exercises: [
          { name: 'Sentadilla Libre con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Presión trípode en pies' },
          { name: 'Prensa Inclinada a 45°', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Descenso profundo y controlado' },
          { name: 'Curl Femoral Tumbado', sets: '4', reps: '10-12', rir: 'RIR 0', rest: '60s', cue: 'Pausa de 1s en contracción' },
        ],
      },
      day3: {
        name: 'Día 3: Tracciones & Bíceps (Espalda)',
        exercises: [
          { name: 'Jalón al Pecho Agarre Neutro', sets: '4', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Depresión escapular antes de tirar' },
          { name: 'Remo con Barra 45°', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Codos pegados al cuerpo' },
          { name: 'Curl con Barra Z', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '75s', cue: 'Sin balanceo lumbar' },
        ],
      },
    },
  };
}
