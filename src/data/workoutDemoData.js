export const workoutDemoDays = {
  day1: {
    tabLabel: 'Día 1: Pecho, Hombro & Tríceps (Empujes)',
    tabIcon: 'fa-solid fa-dumbbell',
    title: 'Día 1: Tren Superior (Empujes de Fuerza)',
    stats: '5 Ejercicios • 17 Series Totales • ~65 min',
    exercises: [
      { num: '1', name: 'Press Banca con Barra', cues: ['Retracción escapular firme', 'Pausa de 1s en pecho'], highlightCue: 'Básico de Fuerza', setsReps: '4 x 6–8', rir: 'RIR 2', rest: '2.5 min' },
      { num: '2', name: 'Press Inclinado con Mancuernas', cues: ['Ángulo de 30 grados', 'Rango articular completo'], highlightCue: 'Haz Clavicular', setsReps: '3 x 8–10', rir: 'RIR 1–2', rest: '2 min' },
      { num: '3', name: 'Fondos en Paralelas Lastrados', cues: ['Ligera inclinación de torso', 'Control excéntrico 3s'], highlightCue: 'Tríceps & Pectoral', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '90s' },
      { num: '4', name: 'Elevaciones Laterales en Polea', cues: ['Tensión continua', 'Sin balanceo'], highlightCue: 'Aislamiento Deltoides', setsReps: '4 x 12–15', rir: 'RIR 0', rest: '60s' },
      { num: '5', name: 'Press Francés con Mancuernas', cues: ['Codos cerrados y estables'], highlightCue: 'Cabeza Larga Tríceps', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '75s' },
    ],
  },
  day2: {
    tabLabel: 'Día 2: Piernas & Glúteos (Sentadilla)',
    tabIcon: 'fa-solid fa-person-running',
    title: 'Día 2: Pierna Completa & Glúteos (Sentadilla)',
    stats: '5 Ejercicios • 18 Series Totales • ~70 min',
    exercises: [
      { num: '1', name: 'Sentadilla Libre con Barra', cues: ['Presión trípode en pies', 'Romper paralelo con control'], highlightCue: 'Pilar de Fuerza', setsReps: '4 x 5–7', rir: 'RIR 2', rest: '3 min' },
      { num: '2', name: 'Peso Muerto Rumano con Mancuernas', cues: ['Bisagra de cadera pura'], highlightCue: 'Cadena Posterior', setsReps: '3 x 8–10', rir: 'RIR 1–2', rest: '2 min' },
      { num: '3', name: 'Prensa Inclinada a 45°', cues: ['Pies al ancho de hombros', 'Descenso profundo'], highlightCue: 'Volumen Cuádriceps', setsReps: '4 x 10–12', rir: 'RIR 1', rest: '90s' },
      { num: '4', name: 'Curl Femoral Tumbado', cues: ['Contracción isométrica 1s'], highlightCue: 'Hipertrofia Isquios', setsReps: '4 x 10–12', rir: 'RIR 0', rest: '60s' },
      { num: '5', name: 'Elevación de Talones en Máquina', cues: ['Pausa profunda abajo', 'Pico 2s arriba'], highlightCue: 'Rango Máximo Gemelos', setsReps: '3 x 15–20', rir: 'RIR 0', rest: '60s' },
    ],
  },
  day3: {
    tabLabel: 'Día 3: Espalda, Bíceps & Core (Tracciones)',
    tabIcon: 'fa-solid fa-shield-halved',
    title: 'Día 3: Espalda, Bíceps & Core (Tracciones)',
    stats: '5 Ejercicios • 17 Series Totales • ~60 min',
    exercises: [
      { num: '1', name: 'Dominadas Pronas (Lastradas)', cues: ['Depresión escapular', 'Pecho hacia la barra'], highlightCue: 'Dorsal Ancho & Fuerza', setsReps: '4 x 6–8', rir: 'RIR 1–2', rest: '2.5 min' },
      { num: '2', name: 'Remo con Barra en Pronación', cues: ['Traccionar hacia la cadera', 'Codos pegados'], highlightCue: 'Densidad Espalda', setsReps: '4 x 8–10', rir: 'RIR 2', rest: '2 min' },
      { num: '3', name: 'Jalón al Pecho Agarre Neutro', cues: ['Máximo estiramiento arriba'], highlightCue: 'Amplitud Dorsal', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '90s' },
      { num: '4', name: 'Curl con Barra Z de Pie', cues: ['Codos fijos', 'Sin balanceo lumbar'], highlightCue: 'Pico de Bíceps', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '75s' },
      { num: '5', name: 'Rueda Abdominal (Ab Wheel)', cues: ['Retroversión pélvica', 'Control excéntrico total'], highlightCue: 'Anti-Extensión Core', setsReps: '3 x 10–12', rir: 'RIR 1', rest: '60s' },
    ],
  },
};

export const workoutDemoDayOrder = ['day1', 'day2', 'day3'];
