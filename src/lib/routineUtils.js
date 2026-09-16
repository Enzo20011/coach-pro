/** Firestore no preserva el orden de los campos de un map: siempre ordenar por el
 * sufijo numérico ("day3" puede volver antes que "day1") antes de renderizar. */
export function sortDayKeys(keys) {
  return keys
    .slice()
    .sort((a, b) => (parseInt(a.replace(/\D/g, ''), 10) || 0) - (parseInt(b.replace(/\D/g, ''), 10) || 0));
}
