import { sortDayKeys } from '../../lib/routineUtils.js';
import a from '../../styles/admin.module.css';

const TRACKER_SLOTS = ['S1', 'S2', 'S3', 'S4'];

export default function PrintableRoutineSheet({ student, routine, coach }) {
  const todayStr = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
  const dayKeys = sortDayKeys(Object.keys(routine.days || {}));

  return (
    <div className={a['printable-sheet']} id="printableRoutineCard">
      <div className={a['sheet-header']}>
        <div className={a['sheet-brand']}>
          <div className={a['sheet-brand-icon']}>
            <i className="fa-solid fa-bolt" />
          </div>
          <div>
            <div className={a['sheet-brand-title']}>COACH PRO</div>
            <div className={a['sheet-brand-sub']}>
              {coach.displayName} • {coach.specialty}
            </div>
          </div>
        </div>
        <div className={a['sheet-doc-meta']}>
          <div className={a['sheet-doc-title']}>Ficha Oficial de Rutina</div>
          <div className={a['sheet-doc-date']}>
            Emitido: {todayStr} • {coach.displayName}
          </div>
        </div>
      </div>

      <div className={a['sheet-athlete-card']}>
        <div className={a['sheet-athlete-grid']}>
          <div className={a['sheet-athlete-item']}>
            <span className={a['sheet-athlete-label']}>Alumno / Atleta</span>
            <span className={a['sheet-athlete-val']}>{student.name}</span>
          </div>
          <div className={a['sheet-athlete-item']}>
            <span className={a['sheet-athlete-label']}>Modalidad / Plan</span>
            <span className={a['sheet-athlete-val']}>
              {student.plan} (${coach.pricePersonalizado}/mes)
            </span>
          </div>
          <div className={a['sheet-athlete-item']}>
            <span className={a['sheet-athlete-label']}>Fase Actual</span>
            <span className={a['sheet-athlete-val']} style={{ color: '#008744' }}>
              {routine.title || 'Fase 1: Fuerza & Hipertrofia'}
            </span>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <span className={a['sheet-athlete-label']}>Objetivo de Rendimiento:</span>
          <strong style={{ color: '#1e293b', fontSize: '0.85rem', marginLeft: 6 }}>{student.goal}</strong>
        </div>
        {routine.notes && (
          <div className={a['sheet-coach-note']}>
            <i className="fa-solid fa-quote-left" />
            <div>
              <strong>Directriz de {coach.displayName}:</strong> {routine.notes}
            </div>
          </div>
        )}
      </div>

      <div className={a['sheet-days-container']}>
        {dayKeys.length === 0 ? (
          <p style={{ padding: 20, textAlign: 'center', color: '#64748b' }}>
            No hay ejercicios registrados en esta rutina todavía.
          </p>
        ) : (
          dayKeys.map((key) => {
            const day = routine.days[key];
            const exercises = day.exercises || [];
            return (
              <div className={a['sheet-day-block']} key={key}>
                <div className={a['sheet-day-header']}>
                  <span className={a['sheet-day-title']}>{day.name || key}</span>
                  <span className={a['sheet-day-badge']}>{exercises.length} Ejercicios</span>
                </div>
                <table className={a['sheet-table']}>
                  <thead>
                    <tr>
                      <th>Ejercicio & Clave Biomecánica</th>
                      <th className={a['text-center']}>Series x Reps</th>
                      <th className={a['text-center']}>Esfuerzo</th>
                      <th className={a['text-center']}>Descanso</th>
                      <th>Registro en Gym (Cargas / Reps)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 12 }}>
                          Día sin ejercicios programados.
                        </td>
                      </tr>
                    ) : (
                      exercises.map((ex, idx) => (
                        <tr key={idx}>
                          <td style={{ width: '38%', fontWeight: 600 }}>
                            <span style={{ display: 'inline-block', width: 18, color: '#008744', fontWeight: 800 }}>
                              {idx + 1}.
                            </span>
                            <span className={a['sheet-ex-name']}>{ex.name}</span>
                            {ex.cue && (
                              <div className={a['sheet-ex-cue']}>
                                <i className="fa-solid fa-circle-info" style={{ fontSize: '0.68rem', marginRight: 3 }} />
                                {ex.cue}
                              </div>
                            )}
                          </td>
                          <td className={a['text-center']} style={{ width: '14%' }}>
                            <span className={a['sheet-pill-tag']}>
                              {ex.sets || '3'} x {ex.reps || '10-12'}
                            </span>
                          </td>
                          <td className={a['text-center']} style={{ width: '12%' }}>
                            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.78rem' }}>{ex.rir || 'RIR 2'}</span>
                          </td>
                          <td className={a['text-center']} style={{ width: '12%' }}>
                            <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{ex.rest || '90s'}</span>
                          </td>
                          <td style={{ width: '24%' }}>
                            <div className={a['sheet-tracking-grid']}>
                              {TRACKER_SLOTS.map((s) => (
                                <div className={a['sheet-tracker-box']} title={`Serie ${s.slice(1)}`} key={s}>
                                  {s}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </div>

      <div className={a['sheet-footer']}>
        <div>
          <div className={a['sheet-footer-brand']}>COACH PRO • Preparación Física & Coaching 1 a 1</div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
            Sobrecarga Progresiva: Registrá tus pesos serie por serie para asegurar tu progresión técnica y muscular.
          </div>
        </div>
        <div className={a['sheet-seal']}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{coach.displayName}</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
              {coach.specialty} • WhatsApp: {coach.phone}
            </div>
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#0f172a',
              color: '#00ff87',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
            }}
          >
            <i className="fa-solid fa-award" />
          </div>
        </div>
      </div>
    </div>
  );
}
