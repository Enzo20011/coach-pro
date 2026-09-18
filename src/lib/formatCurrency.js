/** Formatea un monto como pesos argentinos, ej: 50000 -> "AR$ 50.000". */
export function formatARS(amount) {
  const value = Number(amount) || 0;
  return `AR$ ${value.toLocaleString('es-AR')}`;
}
