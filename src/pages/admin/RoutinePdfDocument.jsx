import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { sortDayKeys } from '../../lib/routineUtils.js';
import { formatARS } from '../../lib/formatCurrency.js';

/**
 * Ficha de rutina generada como PDF real (no vía window.print()). Evita por
 * completo los problemas de paginación/recorte del motor de impresión del
 * navegador — acá el layout de página y los saltos de página los controla
 * esta librería, no el CSS de impresión del sitio.
 */
const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 9, fontFamily: 'Helvetica', color: '#1e293b' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 2, borderBottomColor: '#0f172a', paddingBottom: 12, marginBottom: 16 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIcon: { width: 26, height: 26, backgroundColor: '#0f172a', color: '#00e676', borderRadius: 4, textAlign: 'center', paddingTop: 6, fontFamily: 'Helvetica-Bold', fontSize: 11 },
  brandTitle: { fontFamily: 'Helvetica-Bold', fontSize: 15, color: '#0f172a' },
  brandSub: { fontSize: 8, color: '#64748b', marginTop: 2, textTransform: 'uppercase' },
  docMeta: { alignItems: 'flex-end' },
  docTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: '#0f172a', textTransform: 'uppercase' },
  docDate: { fontSize: 8, color: '#64748b', marginTop: 2 },

  athleteCard: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 12, marginBottom: 18 },
  athleteGrid: { flexDirection: 'row', gap: 14 },
  athleteItem: { flex: 1 },
  athleteLabel: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#64748b', textTransform: 'uppercase', marginBottom: 2 },
  athleteVal: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0f172a' },
  athleteSub: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#16a34a', marginTop: 2 },
  coachNote: { flexDirection: 'row', gap: 6, backgroundColor: '#f0fdf4', borderLeftWidth: 3, borderLeftColor: '#16a34a', padding: 8, marginTop: 10, borderRadius: 3 },
  coachNoteText: { fontSize: 8, color: '#166534', flex: 1 },

  dayBlock: { marginBottom: 16 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', color: '#ffffff', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4, marginBottom: 6 },
  dayTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  dayBadge: { fontSize: 7, fontFamily: 'Helvetica-Bold', backgroundColor: 'rgba(255,255,255,0.15)', color: '#00e676', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },

  table: { borderWidth: 1, borderColor: '#e2e8f0' },
  tableHeadRow: { flexDirection: 'row', backgroundColor: '#e2e8f0' },
  tableRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  tableRowAlt: { backgroundColor: '#f8fafc' },
  cellHead: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: '#334155', textTransform: 'uppercase', padding: 6 },
  cell: { fontSize: 8, padding: 6, justifyContent: 'center' },
  colName: { width: '36%' },
  colSets: { width: '14%', alignItems: 'center' },
  colRir: { width: '13%', alignItems: 'center' },
  colRest: { width: '13%', alignItems: 'center' },
  colTracker: { width: '24%' },

  exName: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: '#0f172a' },
  exCue: { fontSize: 7.5, color: '#64748b', marginTop: 2, fontStyle: 'italic' },
  pillTag: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#1e293b', backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2, alignSelf: 'center' },
  rirText: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: '#0f172a' },
  restText: { fontSize: 7.5, color: '#64748b' },
  trackerRow: { flexDirection: 'row', gap: 3 },
  trackerBox: { width: 20, height: 14, borderWidth: 1, borderColor: '#94a3b8', borderStyle: 'dashed', borderRadius: 2, fontSize: 6, color: '#94a3b8', textAlign: 'center', paddingTop: 3 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 2, borderTopColor: '#0f172a', paddingTop: 10, marginTop: 10 },
  footerBrand: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#0f172a' },
  footerNote: { fontSize: 7, color: '#94a3b8', marginTop: 2, maxWidth: 320 },
  footerCoach: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#0f172a', textAlign: 'right' },
  footerCoachSub: { fontSize: 7, color: '#64748b', textAlign: 'right', marginTop: 2 },
});

const TRACKER_SLOTS = ['S1', 'S2', 'S3', 'S4'];

export default function RoutinePdfDocument({ student, routine, coach }) {
  const todayStr = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  const dayKeys = sortDayKeys(Object.keys(routine.days || {}));

  return (
    <Document title={`Rutina - ${student.name}`}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Text style={styles.brandIcon}>CP</Text>
            <View>
              <Text style={styles.brandTitle}>COACH PRO</Text>
              <Text style={styles.brandSub}>
                {coach.displayName} • {coach.specialty}
              </Text>
            </View>
          </View>
          <View style={styles.docMeta}>
            <Text style={styles.docTitle}>Ficha Oficial de Rutina</Text>
            <Text style={styles.docDate}>Emitido: {todayStr}</Text>
          </View>
        </View>

        <View style={styles.athleteCard} wrap={false}>
          <View style={styles.athleteGrid}>
            <View style={styles.athleteItem}>
              <Text style={styles.athleteLabel}>Alumno / Atleta</Text>
              <Text style={styles.athleteVal}>{student.name}</Text>
            </View>
            <View style={styles.athleteItem}>
              <Text style={styles.athleteLabel}>Modalidad / Plan</Text>
              <Text style={styles.athleteVal}>{student.plan}</Text>
              <Text style={styles.athleteSub}>{formatARS(coach.pricePersonalizado)}/mes</Text>
            </View>
            <View style={styles.athleteItem}>
              <Text style={styles.athleteLabel}>Fase Actual</Text>
              <Text style={[styles.athleteVal, { color: '#16a34a' }]}>{routine.title || 'Fase 1: Fuerza & Hipertrofia'}</Text>
            </View>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text style={styles.athleteLabel}>Objetivo de Rendimiento</Text>
            <Text style={[styles.athleteVal, { fontSize: 9 }]}>{student.goal}</Text>
          </View>
          {routine.notes && (
            <View style={styles.coachNote}>
              <Text style={styles.coachNoteText}>Directriz de {coach.displayName}: {routine.notes}</Text>
            </View>
          )}
        </View>

        {dayKeys.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#64748b', padding: 20 }}>
            No hay ejercicios registrados en esta rutina todavía.
          </Text>
        ) : (
          dayKeys.map((key) => {
            const day = routine.days[key];
            const exercises = day.exercises || [];
            return (
              <View key={key} style={styles.dayBlock} wrap={false}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>{day.name || key}</Text>
                  <Text style={styles.dayBadge}>{exercises.length} Ejercicios</Text>
                </View>

                <View style={styles.table}>
                  <View style={styles.tableHeadRow}>
                    <Text style={[styles.cellHead, styles.colName]}>Ejercicio & Clave Biomecánica</Text>
                    <Text style={[styles.cellHead, styles.colSets]}>Series x Reps</Text>
                    <Text style={[styles.cellHead, styles.colRir]}>Esfuerzo</Text>
                    <Text style={[styles.cellHead, styles.colRest]}>Descanso</Text>
                    <Text style={[styles.cellHead, styles.colTracker]}>Registro en Gym</Text>
                  </View>

                  {exercises.length === 0 ? (
                    <View style={styles.tableRow}>
                      <Text style={{ padding: 8, color: '#94a3b8', fontSize: 8 }}>Día sin ejercicios programados.</Text>
                    </View>
                  ) : (
                    exercises.map((ex, idx) => (
                      <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]} wrap={false}>
                        <View style={[styles.cell, styles.colName]}>
                          <Text style={styles.exName}>
                            {idx + 1}. {ex.name}
                          </Text>
                          {ex.cue && <Text style={styles.exCue}>{ex.cue}</Text>}
                        </View>
                        <View style={[styles.cell, styles.colSets]}>
                          <Text style={styles.pillTag}>
                            {ex.sets || '3'} x {ex.reps || '10-12'}
                          </Text>
                        </View>
                        <View style={[styles.cell, styles.colRir]}>
                          <Text style={styles.rirText}>{ex.rir || 'RIR 2'}</Text>
                        </View>
                        <View style={[styles.cell, styles.colRest]}>
                          <Text style={styles.restText}>{ex.rest || '90s'}</Text>
                        </View>
                        <View style={[styles.cell, styles.colTracker]}>
                          <View style={styles.trackerRow}>
                            {TRACKER_SLOTS.map((s) => (
                              <Text key={s} style={styles.trackerBox}>
                                {s}
                              </Text>
                            ))}
                          </View>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </View>
            );
          })
        )}

        <View style={styles.footer} wrap={false}>
          <View>
            <Text style={styles.footerBrand}>COACH PRO • Preparación Física & Coaching 1 a 1</Text>
            <Text style={styles.footerNote}>
              Sobrecarga Progresiva: Registrá tus pesos serie por serie para asegurar tu progresión técnica y muscular.
            </Text>
          </View>
          <View>
            <Text style={styles.footerCoach}>{coach.displayName}</Text>
            <Text style={styles.footerCoachSub}>
              {coach.specialty} • WhatsApp: {coach.phone}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
