/** Firestore no preserva el orden de los campos de un map: siempre ordenar por el
 * sufijo numérico ("day3" puede volver antes que "day1") antes de renderizar. */
export function sortDayKeys(keys) {
  return keys
    .slice()
    .sort((a, b) => (parseInt(a.replace(/\D/g, ''), 10) || 0) - (parseInt(b.replace(/\D/g, ''), 10) || 0));
}

/** Convierte el texto libre de descanso ("90s", "2 min", "2.5 min") a segundos,
 * con 90 como default si no se puede interpretar. */
export function parseRestSeconds(rest) {
  if (!rest) return 90;
  const match = String(rest).match(/([\d.]+)\s*(min|m|s|seg)?/i);
  if (!match) return 90;
  const value = parseFloat(match[1]);
  if (Number.isNaN(value)) return 90;
  const unit = (match[2] || 's').toLowerCase();
  return unit.startsWith('m') ? Math.round(value * 60) : Math.round(value);
}

/** Días calendario consecutivos con al menos un entrenamiento registrado,
 * contando desde hoy (o desde ayer si hoy todavía no entrenó, para que la
 * racha no se vea "rota" antes de que termine el día). */
export function computeTrainingStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  const trainedDays = new Set(sessions.map((s) => new Date(s.completedAt).toDateString()));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!trainedDays.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (trainedDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Cantidad de días distintos (calendario) con entrenamiento en los últimos N días. */
export function countRecentTrainingDays(sessions, days = 7) {
  if (!sessions || sessions.length === 0) return 0;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const trainedDays = new Set(
    sessions.filter((s) => s.completedAt >= cutoff).map((s) => new Date(s.completedAt).toDateString())
  );
  return trainedDays.size;
}

/** Próximo día de la rotación después del último entrenado — si nunca entrenó,
 * sugiere el primero. Es una sugerencia de "qué te toca hoy", no una fecha real,
 * ya que los días de la rutina no están atados a días de la semana. */
export function recommendNextDayKey(dayKeys, sessions) {
  if (!dayKeys || dayKeys.length === 0) return null;
  if (!sessions || sessions.length === 0) return dayKeys[0];
  const lastSession = sessions.reduce((latest, s) => (!latest || s.completedAt > latest.completedAt ? s : latest), null);
  const idx = dayKeys.indexOf(lastSession?.dayKey);
  if (idx === -1) return dayKeys[0];
  return dayKeys[(idx + 1) % dayKeys.length];
}

export function getLastSessionAt(sessions) {
  if (!sessions || sessions.length === 0) return null;
  return sessions.reduce((latest, s) => Math.max(latest, s.completedAt || 0), 0) || null;
}

/** Texto relativo para el panel del coach ("Hoy", "Ayer", "Hace 5 días", "Nunca entrenó"). */
export function formatRelativeDay(timestamp) {
  if (!timestamp) return 'Nunca entrenó';
  const diffDays = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return `Hace ${diffDays} días`;
}
