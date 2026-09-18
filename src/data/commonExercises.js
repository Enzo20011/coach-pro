/**
 * Catálogo base de ejercicios, organizado por grupo muscular, disponible para
 * todos los coaches desde el primer día. Se combina en el cliente con la
 * biblioteca propia de cada coach (que crece sola con cada ejercicio que usa
 * — ver lib/firestore/exerciseLibrary.js). La idea es que el coach pueda
 * buscar tanto por nombre ("press banca") como por grupo muscular ("pecho",
 * "hombro") y encontrar opciones sin tener que tipear todo de cero.
 */
export const COMMON_EXERCISES = [
  // ---- PECHO ----
  { category: 'Pecho', name: 'Press Banca con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Retracción escapular firme' },
  { category: 'Pecho', name: 'Press Banca con Mancuernas', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Rango completo, codos a 45°' },
  { category: 'Pecho', name: 'Press Inclinado con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Banco a 30°, barra a la altura de clavícula' },
  { category: 'Pecho', name: 'Press Inclinado con Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Ángulo de 30°' },
  { category: 'Pecho', name: 'Press Declinado con Barra', sets: '3', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Controlar el descenso' },
  { category: 'Pecho', name: 'Aperturas con Mancuernas', sets: '3', reps: '12-15', rir: 'RIR 0-1', rest: '75s', cue: 'Codos ligeramente flexionados' },
  { category: 'Pecho', name: 'Aperturas en Polea (Cruce)', sets: '3', reps: '12-15', rir: 'RIR 0', rest: '60s', cue: 'Apretar en el centro del pecho' },
  { category: 'Pecho', name: 'Press en Máquina (Chest Press)', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Espalda pegada al respaldo' },
  { category: 'Pecho', name: 'Fondos en Paralelas (Pecho)', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Inclinación de torso al bajar' },
  { category: 'Pecho', name: 'Pullover con Mancuerna', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Estiramiento controlado detrás de la cabeza' },
  { category: 'Pecho', name: 'Flexiones de Brazos (Push-ups)', sets: '3', reps: '15-20', rir: 'RIR 0-1', rest: '60s', cue: 'Cuerpo alineado, sin hundir cadera' },
  { category: 'Pecho', name: 'Press en Multipower (Smith Machine)', sets: '4', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Trayectoria guiada, controlar el descenso' },
  { category: 'Pecho', name: 'Cruce de Poleas Bajo a Alto', sets: '3', reps: '12-15', rir: 'RIR 0', rest: '60s', cue: 'Foco en la parte superior del pecho' },

  // ---- ESPALDA ----
  { category: 'Espalda', name: 'Dominadas Pronas', sets: '4', reps: '6-8', rir: 'RIR 1-2', rest: '2.5 min', cue: 'Pecho a la barra' },
  { category: 'Espalda', name: 'Dominadas Supinas (Chin-ups)', sets: '3', reps: '6-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Enfoque en bíceps y dorsal' },
  { category: 'Espalda', name: 'Jalón al Pecho Agarre Ancho', sets: '4', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Depresión escapular antes de tirar' },
  { category: 'Espalda', name: 'Jalón al Pecho Agarre Neutro', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Máximo estiramiento arriba' },
  { category: 'Espalda', name: 'Remo con Barra 45°', sets: '4', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Codos pegados al cuerpo' },
  { category: 'Espalda', name: 'Remo con Mancuerna a Una Mano', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Espalda neutra, tirar con el codo' },
  { category: 'Espalda', name: 'Remo en Polea Baja (Sentado)', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'No balancear el torso' },
  { category: 'Espalda', name: 'Remo en Máquina T-Bar', sets: '3', reps: '8-10', rir: 'RIR 2', rest: '2 min', cue: 'Pecho apoyado, tirar con la espalda' },
  { category: 'Espalda', name: 'Peso Muerto Convencional', sets: '4', reps: '5-6', rir: 'RIR 2', rest: '3 min', cue: 'Espalda neutra, empuje de piso' },
  { category: 'Espalda', name: 'Peso Muerto Rumano', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Bisagra de cadera pura' },
  { category: 'Espalda', name: 'Face Pull en Polea', sets: '3', reps: '15', rir: 'RIR 0', rest: '45s', cue: 'Codos altos, apretar omóplatos' },
  { category: 'Espalda', name: 'Pull-Over en Polea Alta', sets: '3', reps: '12-15', rir: 'RIR 0-1', rest: '60s', cue: 'Foco en dorsal, no en tríceps' },
  { category: 'Espalda', name: 'Hiperextensiones (Lumbar)', sets: '3', reps: '12-15', rir: 'RIR 0-1', rest: '60s', cue: 'No hiperextender en exceso arriba' },
  { category: 'Espalda', name: 'Remo Pendlay', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2 min', cue: 'Barra parte desde el piso en cada rep' },
  { category: 'Espalda', name: 'Remo en Máquina Sentado (Agarre Ancho)', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Apretar omóplatos al final del recorrido' },
  { category: 'Espalda', name: 'Jalón al Pecho Agarre Supino', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Enfoque en dorsal bajo y bíceps' },

  // ---- HOMBROS ----
  { category: 'Hombros', name: 'Press Militar con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Core apretado, sin arquear lumbar' },
  { category: 'Hombros', name: 'Press Militar con Mancuernas', sets: '3', reps: '10-12', rir: 'RIR 1-2', rest: '90s', cue: 'Core compacto y glúteos activos' },
  { category: 'Hombros', name: 'Press Arnold', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Rotación controlada de muñeca' },
  { category: 'Hombros', name: 'Elevaciones Laterales con Mancuernas', sets: '4', reps: '12-15', rir: 'RIR 0 (Fallo)', rest: '60s', cue: 'Codos ligeramente flexionados, sin impulso' },
  { category: 'Hombros', name: 'Elevaciones Laterales en Polea', sets: '4', reps: '12-15', rir: 'RIR 0 (Fallo)', rest: '60s', cue: 'Tensión constante en deltoides' },
  { category: 'Hombros', name: 'Elevaciones Frontales con Mancuernas', sets: '3', reps: '12-15', rir: 'RIR 1', rest: '60s', cue: 'No balancear el torso' },
  { category: 'Hombros', name: 'Pájaros / Elevación Posterior', sets: '3', reps: '15', rir: 'RIR 0', rest: '45s', cue: 'Torso inclinado, apretar omóplatos' },
  { category: 'Hombros', name: 'Press Militar en Máquina', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Espalda apoyada durante todo el recorrido' },
  { category: 'Hombros', name: 'Encogimientos de Hombros (Shrugs)', sets: '4', reps: '12-15', rir: 'RIR 0-1', rest: '60s', cue: 'Subir recto, sin rodar los hombros' },
  { category: 'Hombros', name: 'Elevación Lateral en Máquina', sets: '3', reps: '12-15', rir: 'RIR 0', rest: '60s', cue: 'Movimiento controlado, sin impulso' },
  { category: 'Hombros', name: 'Press de Hombros en Polea', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Tensión constante durante todo el recorrido' },

  // ---- BÍCEPS ----
  { category: 'Bíceps', name: 'Curl con Barra Recta', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '75s', cue: 'Sin balanceo lumbar' },
  { category: 'Bíceps', name: 'Curl con Barra Z', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '75s', cue: 'Codos fijos al costado' },
  { category: 'Bíceps', name: 'Curl con Mancuernas Alterno', sets: '3', reps: '10-12/brazo', rir: 'RIR 1', rest: '60s', cue: 'Supinación completa al subir' },
  { category: 'Bíceps', name: 'Curl Martillo con Mancuernas', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '60s', cue: 'Codos fijos al torso' },
  { category: 'Bíceps', name: 'Curl en Banco Scott (Predicador)', sets: '3', reps: '10-12', rir: 'RIR 0-1', rest: '75s', cue: 'Extensión completa sin bloquear codo' },
  { category: 'Bíceps', name: 'Curl en Polea Baja', sets: '3', reps: '12-15', rir: 'RIR 0', rest: '60s', cue: 'Tensión constante, sin soltar peso' },
  { category: 'Bíceps', name: 'Curl Concentrado', sets: '3', reps: '12', rir: 'RIR 0', rest: '45s', cue: 'Codo apoyado en el muslo, foco total' },
  { category: 'Bíceps', name: 'Curl Araña (Spider Curl)', sets: '3', reps: '10-12', rir: 'RIR 0-1', rest: '60s', cue: 'Pecho apoyado en banco inclinado' },
  { category: 'Bíceps', name: 'Curl con Cable Cruzado', sets: '3', reps: '12-15', rir: 'RIR 0', rest: '45s', cue: 'Codos fijos, tensión constante' },

  // ---- TRÍCEPS ----
  { category: 'Tríceps', name: 'Press Francés con Barra Z', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Codos fijos, solo el antebrazo se mueve' },
  { category: 'Tríceps', name: 'Extensión de Tríceps en Polea (Cuerda)', sets: '3', reps: '12-15', rir: 'RIR 0', rest: '60s', cue: 'Abrir la cuerda al final del recorrido' },
  { category: 'Tríceps', name: 'Extensión de Tríceps en Polea (Barra)', sets: '3', reps: '12-15', rir: 'RIR 0', rest: '60s', cue: 'Codos pegados al torso' },
  { category: 'Tríceps', name: 'Fondos en Banco (Tríceps)', sets: '3', reps: '12-15', rir: 'RIR 1', rest: '75s', cue: 'Codos hacia atrás, no hacia afuera' },
  { category: 'Tríceps', name: 'Fondos en Paralelas (Tríceps)', sets: '3', reps: '8-10', rir: 'RIR 1', rest: '2 min', cue: 'Torso vertical para enfatizar tríceps' },
  { category: 'Tríceps', name: 'Press Banca Agarre Cerrado', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Codos pegados al cuerpo' },
  { category: 'Tríceps', name: 'Patada de Tríceps con Mancuerna', sets: '3', reps: '12-15', rir: 'RIR 0', rest: '45s', cue: 'Brazo paralelo al piso, extender atrás' },
  { category: 'Tríceps', name: 'Press JM con Barra', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '90s', cue: 'Híbrido entre press cerrado y francés' },
  { category: 'Tríceps', name: 'Extensión de Tríceps sobre la Cabeza con Mancuerna', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '75s', cue: 'Codos apuntando al frente, no hacia afuera' },

  // ---- CUÁDRICEPS / PIERNAS ----
  { category: 'Piernas', name: 'Sentadilla Libre con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '3 min', cue: 'Presión trípode en pies' },
  { category: 'Piernas', name: 'Sentadilla Frontal', sets: '3', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Codos altos, torso erguido' },
  { category: 'Piernas', name: 'Sentadilla Búlgara', sets: '3', reps: '10/pierna', rir: 'RIR 1', rest: '90s', cue: 'Torso ligeramente inclinado' },
  { category: 'Piernas', name: 'Prensa Inclinada a 45°', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Descenso profundo y controlado' },
  { category: 'Piernas', name: 'Zancadas Caminando', sets: '3', reps: '12/pierna', rir: 'RIR 1', rest: '90s', cue: 'Rodilla no pasa la punta del pie' },
  { category: 'Piernas', name: 'Extensión de Cuádriceps en Máquina', sets: '4', reps: '12-15', rir: 'RIR 0', rest: '60s', cue: 'Pausa de 1s arriba' },
  { category: 'Piernas', name: 'Sentadilla Hack (Máquina)', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '2 min', cue: 'Espalda pegada al respaldo' },
  { category: 'Piernas', name: 'Zancadas Búlgaras con Mancuernas', sets: '3', reps: '10/pierna', rir: 'RIR 1', rest: '90s', cue: 'Control en la fase excéntrica' },
  { category: 'Piernas', name: 'Sentadilla Goblet', sets: '3', reps: '12-15', rir: 'RIR 1', rest: '75s', cue: 'Codos rozando las rodillas abajo' },
  { category: 'Piernas', name: 'Step Up con Mancuernas', sets: '3', reps: '10/pierna', rir: 'RIR 1', rest: '90s', cue: 'Empujar con el talón del pie de arriba' },
  { category: 'Piernas', name: 'Prensa Horizontal', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '90s', cue: 'Rango completo sin despegar la zona lumbar' },

  // ---- ISQUIOS / FEMORALES ----
  { category: 'Femorales', name: 'Peso Muerto Rumano con Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Bisagra de cadera pura' },
  { category: 'Femorales', name: 'Curl Femoral Tumbado', sets: '4', reps: '10-12', rir: 'RIR 0', rest: '60s', cue: 'Pausa de 1s en contracción' },
  { category: 'Femorales', name: 'Curl Femoral Sentado', sets: '3', reps: '10-12', rir: 'RIR 0-1', rest: '60s', cue: 'Rango completo de movimiento' },
  { category: 'Femorales', name: 'Peso Muerto a Una Pierna', sets: '3', reps: '8/pierna', rir: 'RIR 1', rest: '90s', cue: 'Cadera y hombros alineados' },
  { category: 'Femorales', name: 'Buenos Días (Good Mornings)', sets: '3', reps: '10-12', rir: 'RIR 1-2', rest: '90s', cue: 'Espalda neutra, cadera atrás' },
  { category: 'Femorales', name: 'Nordic Curl (Curl Nórdico)', sets: '3', reps: '6-8', rir: 'RIR 1', rest: '90s', cue: 'Descenso controlado, ayuda con las manos si hace falta' },
  { category: 'Femorales', name: 'Peso Muerto con Piernas Rígidas', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '90s', cue: 'Rodillas casi extendidas, foco en isquios' },

  // ---- GLÚTEOS ----
  { category: 'Glúteos', name: 'Hip Thrust con Barra', sets: '4', reps: '8-10', rir: 'RIR 1', rest: '2 min', cue: 'Bloqueo pélvico arriba 2s' },
  { category: 'Glúteos', name: 'Puente de Glúteo en Piso', sets: '3', reps: '15', rir: 'RIR 0', rest: '45s', cue: 'Apretar glúteo en la contracción' },
  { category: 'Glúteos', name: 'Patada de Glúteo en Polea', sets: '3', reps: '12-15/pierna', rir: 'RIR 0', rest: '45s', cue: 'No usar impulso lumbar' },
  { category: 'Glúteos', name: 'Abducción de Cadera en Máquina', sets: '3', reps: '15-20', rir: 'RIR 0', rest: '45s', cue: 'Movimiento controlado, sin rebote' },
  { category: 'Glúteos', name: 'Peso Muerto Sumo', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Rodillas hacia afuera, pecho arriba' },
  { category: 'Glúteos', name: 'Patada de Burro (Donkey Kick)', sets: '3', reps: '15/pierna', rir: 'RIR 0', rest: '45s', cue: 'Apretar glúteo arriba, sin arquear lumbar' },
  { category: 'Glúteos', name: 'Hip Thrust a Una Pierna', sets: '3', reps: '10/pierna', rir: 'RIR 1', rest: '75s', cue: 'Cadera nivelada durante todo el recorrido' },

  // ---- GEMELOS ----
  { category: 'Gemelos', name: 'Elevación de Talones de Pie', sets: '4', reps: '12-15', rir: 'RIR 0', rest: '45s', cue: 'Pausa arriba y abajo' },
  { category: 'Gemelos', name: 'Elevación de Talones Sentado', sets: '3', reps: '15-20', rir: 'RIR 0', rest: '45s', cue: 'Rango completo, sin rebotar' },
  { category: 'Gemelos', name: 'Elevación de Talones en Prensa', sets: '3', reps: '15', rir: 'RIR 0', rest: '45s', cue: 'Extensión completa de tobillo' },
  { category: 'Gemelos', name: 'Elevación de Talones a Una Pierna', sets: '3', reps: '12/pierna', rir: 'RIR 0', rest: '45s', cue: 'Apoyo firme, rango completo' },

  // ---- CORE / ABDOMINALES ----
  { category: 'Core', name: 'Plancha Abdominal', sets: '3', reps: '30-45s', rir: 'RIR 0', rest: '45s', cue: 'Cadera neutra, sin hundir lumbar' },
  { category: 'Core', name: 'Plancha Lateral', sets: '3', reps: '20-30s/lado', rir: 'RIR 0', rest: '45s', cue: 'Cadera alineada, sin rotar' },
  { category: 'Core', name: 'Crunch Abdominal', sets: '3', reps: '15-20', rir: 'RIR 0', rest: '45s', cue: 'Exhalar en la contracción' },
  { category: 'Core', name: 'Elevación de Piernas Colgado', sets: '3', reps: '12-15', rir: 'RIR 0-1', rest: '60s', cue: 'Sin balanceo, control en la bajada' },
  { category: 'Core', name: 'Rueda Abdominal (Ab Wheel)', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '60s', cue: 'Espalda neutra, no hundir lumbar' },
  { category: 'Core', name: 'Rotación de Torso en Polea (Woodchopper)', sets: '3', reps: '12/lado', rir: 'RIR 0-1', rest: '45s', cue: 'Rotar desde el core, no los brazos' },
  { category: 'Core', name: 'Abdominales en Máquina', sets: '3', reps: '15-20', rir: 'RIR 0', rest: '45s', cue: 'Contracción completa, sin impulso' },
  { category: 'Core', name: 'Dead Bug', sets: '3', reps: '10/lado', rir: 'RIR 0', rest: '45s', cue: 'Lumbar pegada al piso todo el movimiento' },
  { category: 'Core', name: 'Bird Dog', sets: '3', reps: '10/lado', rir: 'RIR 0', rest: '45s', cue: 'Cadera estable, sin rotar el torso' },
  { category: 'Core', name: 'Plancha con Elevación de Pierna', sets: '3', reps: '10/lado', rir: 'RIR 1', rest: '45s', cue: 'Cadera fija, no dejarla caer' },

  // ---- ANTEBRAZO ----
  { category: 'Antebrazo', name: 'Curl de Muñeca con Barra', sets: '3', reps: '15-20', rir: 'RIR 0', rest: '45s', cue: 'Rango completo, movimiento lento' },
  { category: 'Antebrazo', name: 'Curl de Muñeca Invertido', sets: '3', reps: '15-20', rir: 'RIR 0', rest: '45s', cue: 'Controlar la fase excéntrica' },
  { category: 'Antebrazo', name: 'Farmer Walk (Caminata con Peso)', sets: '3', reps: '30-40m', rir: 'RIR 1', rest: '90s', cue: 'Postura erguida, agarre firme' },
  { category: 'Antebrazo', name: 'Dead Hang (Colgado de la Barra)', sets: '3', reps: '30-45s', rir: 'RIR 1', rest: '60s', cue: 'Hombros activos, no colgar pasivo' },
  { category: 'Antebrazo', name: 'Curl de Muñeca con Mancuerna', sets: '3', reps: '15-20', rir: 'RIR 0', rest: '45s', cue: 'Antebrazo apoyado, rango completo' },

  // ---- TRAPECIO ----
  { category: 'Trapecio', name: 'Encogimientos con Mancuernas', sets: '4', reps: '12-15', rir: 'RIR 0-1', rest: '60s', cue: 'Subir recto, pausa arriba' },
  { category: 'Trapecio', name: 'Encogimientos con Barra Trasnuca', sets: '3', reps: '12-15', rir: 'RIR 1', rest: '60s', cue: 'Rango controlado, sin rodar hombros' },
  { category: 'Trapecio', name: 'Remo al Cuello (Upright Row)', sets: '3', reps: '10-12', rir: 'RIR 1', rest: '75s', cue: 'Codos por encima de las muñecas' },
  { category: 'Trapecio', name: 'Face Pull con Énfasis en Trapecio', sets: '3', reps: '15', rir: 'RIR 0', rest: '45s', cue: 'Tirar hacia la frente, codos altos' },

  // ---- ADUCTORES / ABDUCTORES ----
  { category: 'Aductores', name: 'Aducción de Cadera en Máquina', sets: '3', reps: '15-20', rir: 'RIR 0', rest: '45s', cue: 'Movimiento controlado, sin rebote' },
  { category: 'Aductores', name: 'Sentadilla Sumo con Mancuerna', sets: '3', reps: '12-15', rir: 'RIR 1', rest: '75s', cue: 'Rodillas hacia afuera, torso erguido' },
  { category: 'Aductores', name: 'Copenhagen Plank (Aductores)', sets: '3', reps: '20-30s/lado', rir: 'RIR 1', rest: '45s', cue: 'Cadera alineada, core activo' },
  { category: 'Aductores', name: 'Elevación de Pierna Lateral Tumbado', sets: '3', reps: '15/lado', rir: 'RIR 0', rest: '45s', cue: 'Movimiento controlado, sin balanceo' },

  // ---- MOVILIDAD / CALENTAMIENTO ----
  { category: 'Movilidad', name: 'Movilidad de Cadera (90/90)', sets: '2', reps: '8/lado', rir: '—', rest: '30s', cue: 'Movimiento lento y controlado' },
  { category: 'Movilidad', name: 'Círculos de Hombro con Banda', sets: '2', reps: '15', rir: '—', rest: '30s', cue: 'Activación antes de empujes/tracciones' },
  { category: 'Movilidad', name: 'Gato-Camello (Movilidad Lumbar)', sets: '2', reps: '10', rir: '—', rest: '30s', cue: 'Sincronizar con la respiración' },
  { category: 'Movilidad', name: 'Sentadilla Profunda Sostenida (Movilidad)', sets: '2', reps: '30-45s', rir: '—', rest: '30s', cue: 'Talones apoyados, pecho arriba' },
  { category: 'Movilidad', name: 'Estiramiento Dinámico de Isquios', sets: '2', reps: '10/pierna', rir: '—', rest: '30s', cue: 'Sin rebotes, rango progresivo' },
  { category: 'Movilidad', name: 'Movilidad de Tobillo (Rodilla a Pared)', sets: '2', reps: '10/pierna', rir: '—', rest: '30s', cue: 'Talón siempre apoyado' },
  { category: 'Movilidad', name: 'Rotación de Tronco de Pie', sets: '2', reps: '12/lado', rir: '—', rest: '30s', cue: 'Cadera fija, rotar desde el torso' },

  // ---- CARDIO / FUNCIONAL ----
  { category: 'Cardio', name: 'Cinta / Trote Continuo', sets: '1', reps: '20-30 min', rir: 'Zona 2', rest: '—', cue: 'Ritmo conversacional, sin llegar al fallo' },
  { category: 'Cardio', name: 'Bicicleta Fija (Intervalos)', sets: '8', reps: '30s', rir: 'RPE 8', rest: '30s', cue: 'Máxima intensidad en cada intervalo de trabajo' },
  { category: 'Cardio', name: 'Remo (Máquina) Continuo', sets: '1', reps: '15-20 min', rir: 'Zona 2', rest: '—', cue: 'Técnica antes que velocidad' },
  { category: 'Cardio', name: 'Burpees', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '60s', cue: 'Ritmo constante, aterrizaje suave' },
  { category: 'Cardio', name: 'Mountain Climbers', sets: '4', reps: '30s', rir: 'RIR 1', rest: '45s', cue: 'Cadera estable, core activo' },
  { category: 'Cardio', name: 'Jump Rope (Soga)', sets: '5', reps: '1 min', rir: 'RPE 7', rest: '45s', cue: 'Salto bajo, muñecas relajadas' },
  { category: 'Cardio', name: 'Elíptica Continua', sets: '1', reps: '20-30 min', rir: 'Zona 2', rest: '—', cue: 'Postura erguida, brazos activos' },
  { category: 'Cardio', name: 'Sentadillas con Salto (Jump Squats)', sets: '4', reps: '10-12', rir: 'RIR 1', rest: '60s', cue: 'Aterrizaje suave, rodillas alineadas' },
  { category: 'Cardio', name: 'Escaladora (StairMaster)', sets: '1', reps: '15-20 min', rir: 'Zona 2-3', rest: '—', cue: 'Pisada completa, sin apoyarse de más en el pasamanos' },
  { category: 'Cardio', name: 'Sprints en Cinta', sets: '8', reps: '20s', rir: 'RPE 9', rest: '40s', cue: 'Máxima velocidad controlada en cada sprint' },
];
