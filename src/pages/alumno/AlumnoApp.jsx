import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAlumno } from '../../lib/firestore/alumnos.js';
import { getRoutineForStudent } from '../../lib/firestore/routines.js';
import { getCoach } from '../../lib/firestore/coaches.js';
import { getProgress, logCompletedSession, saveDayProgress } from '../../lib/firestore/progress.js';
import {
  computeTrainingStreak,
  countRecentTrainingDays,
  parseRestSeconds,
  recommendNextDayKey,
  sortDayKeys,
} from '../../lib/routineUtils.js';
import { buildWhatsAppLink } from '../../lib/whatsapp.js';
import useRestTimer from '../../hooks/useRestTimer.js';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';
import { useToast } from '../../context/ToastContext.jsx';
import a from '../../styles/alumno.module.css';

const FALLBACK_STUDENT = { name: 'Alumno', coachId: 'coach_1', plan: 'Coaching Integral (Personalizado)', goal: 'Fuerza & Hipertrofia' };
const FALLBACK_ROUTINE = {
  title: 'Plan de Fuerza & Hipertrofia',
  notes: 'Priorizar la técnica en cada levantamiento.',
  days: {
    day1: {
      name: 'Día 1: Empujes',
      exercises: [
        { name: 'Press Banca con Barra', sets: '4', reps: '6-8', rir: 'RIR 2', rest: '2.5 min', cue: 'Retracción escapular firme' },
        { name: 'Press Inclinado con Mancuernas', sets: '3', reps: '8-10', rir: 'RIR 1-2', rest: '2 min', cue: 'Ángulo de 30°' },
      ],
    },
  },
};
const FALLBACK_COACH = {
  displayName: 'Tu entrenador',
  phone: '+5491100000000',
  avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=150&auto=format&fit=crop',
  specialty: 'Biomecánica & Fuerza',
};

async function fetchPortalData(studentId) {
  const [student, routine, progress] = await Promise.all([
    getAlumno(studentId),
    getRoutineForStudent(studentId),
    getProgress(studentId),
  ]);
  const resolvedStudent = student || FALLBACK_STUDENT;
  const resolvedRoutine = routine || FALLBACK_ROUTINE;
  const coach = (await getCoach(resolvedStudent.coachId || 'coach_1')) || FALLBACK_COACH;
  return { student: resolvedStudent, routine: resolvedRoutine, coach, progress };
}

export default function AlumnoApp() {
  useDocumentMeta({ title: 'Mi Rutina de Entrenamiento | COACH PRO App' });

  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('id');

  const { data, isLoading } = useQuery({
    queryKey: ['alumnoPortal', studentId],
    queryFn: () => fetchPortalData(studentId),
    enabled: Boolean(studentId),
  });
  const showToast = useToast();

  const [activeDayKey, setActiveDayKey] = useState(null);
  const [completedSets, setCompletedSets] = useState(new Set());
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const timer = useRestTimer();

  const dayKeys = useMemo(() => (data ? sortDayKeys(Object.keys(data.routine.days || {})) : []), [data]);
  const sessions = data?.progress?.sessions;
  const recommendedDayKey = useMemo(() => recommendNextDayKey(dayKeys, sessions), [dayKeys, sessions]);
  const streak = useMemo(() => computeTrainingStreak(sessions), [sessions]);
  const recentDaysCount = useMemo(() => countRecentTrainingDays(sessions, 7), [sessions]);

  useEffect(() => {
    if (dayKeys.length > 0 && !activeDayKey) setActiveDayKey(recommendedDayKey ?? dayKeys[0]);
  }, [dayKeys, activeDayKey, recommendedDayKey]);

  // Carga las series ya marcadas para el día activo (persistidas en Firestore),
  // en vez de arrancar siempre en cero al cambiar de día o recargar la página.
  useEffect(() => {
    if (!activeDayKey) return;
    const saved = data?.progress?.days?.[activeDayKey] || [];
    setCompletedSets(new Set(saved));
  }, [activeDayKey, data]);

  function switchDay(key) {
    setActiveDayKey(key);
    setSessionCompleted(false);
  }

  if (!studentId) {
    return (
      <div className={a['alumno-root']}>
        <div style={{ textAlign: 'center', padding: '90px 20px', color: 'var(--text-muted)' }}>
          <i
            className="fa-solid fa-link-slash"
            style={{ fontSize: '2rem', marginBottom: 12, display: 'block', color: 'var(--primary)' }}
            aria-hidden="true"
          />
          <p>Este link no tiene un alumno asignado.</p>
          <p style={{ fontSize: '0.85rem', marginTop: 6 }}>Pedile a tu coach el link directo a tu rutina.</p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className={a['alumno-root']}>
        <div style={{ textAlign: 'center', padding: '90px 20px', color: 'var(--text-muted)' }}>
          <i
            className="fa-solid fa-circle-notch fa-spin"
            style={{ fontSize: '1.8rem', marginBottom: 12, display: 'block', color: 'var(--primary)' }}
            aria-hidden="true"
          />
          Cargando tu rutina...
        </div>
      </div>
    );
  }

  const { student, routine, coach } = data;
  const dayData = activeDayKey ? routine.days[activeDayKey] : null;
  const exercises = dayData?.exercises ?? [];

  const totalSets = exercises.reduce((sum, ex) => sum + (parseInt(ex.sets, 10) || 3), 0);
  const completedCount = completedSets.size;
  const progressPct = totalSets > 0 ? Math.round((completedCount / totalSets) * 100) : 0;

  function toggleSet(exIndex, setNum) {
    const key = `${exIndex}-${setNum}`;
    setCompletedSets((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        timer.start(parseRestSeconds(exercises[exIndex]?.rest));
      }
      saveDayProgress(studentId, student.coachId, activeDayKey, Array.from(next)).catch((err) =>
        console.error('No se pudo guardar el progreso de la serie:', err)
      );
      return next;
    });
  }

  const coachWhatsAppHref = buildWhatsAppLink(coach.phone, `¡Hola ${coach.displayName}! Te consulto sobre mi rutina *${routine.title}*:`);

  function handleComplete() {
    const message =
      `¡Hola ${coach.displayName}! 🏋️‍♂️ Acabo de completar el entrenamiento de hoy:\n` +
      `✅ *Rutina:* ${routine.title}\n` +
      `📊 *Progreso:* Completé ${completedCount} de ${totalSets} series programadas.\n\n` +
      `¡Gran sesión de entrenamiento!`;
    showToast(`¡Felicitaciones ${student.name.split(' ')[0]}! Registraste ${completedCount} de ${totalSets} series.`);
    // Evita registrar la misma sesión varias veces si el alumno toca el botón
    // más de una vez — cada click sin este guard sumaba una entrada más a
    // "sessions" e inflaba la métrica de entrenamientos completados del coach.
    if (!sessionCompleted) {
      setSessionCompleted(true);
      logCompletedSession(studentId, student.coachId, {
        dayKey: activeDayKey,
        completedCount,
        totalSets,
        completedAt: Date.now(),
      }).catch((err) => console.error('No se pudo registrar la sesión completada:', err));
    }
    setTimeout(() => window.open(buildWhatsAppLink(coach.phone, message), '_blank'), 900);
  }

  return (
    <div className={a['alumno-root']}>
      <a className={a['skip-link']} href="#exercisesContainer">
        Saltar al contenido
      </a>

      <header className={a['app-header']}>
        <div className={a['coach-brand']}>
          <img src={coach.avatar} alt="Coach Avatar" className={a['coach-avatar']} />
          <div className={a['coach-info']}>
            <h4>COACH PRO</h4>
            <span>{coach.displayName}</span>
          </div>
        </div>
      </header>

      <section className={a['student-greeting-box']}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div>
            <h2>Hola, {student.name.split(' ')[0]} 👋</h2>
            <div className={a['routine-title-pill']} style={{ marginTop: 6 }}>
              <i className="fa-solid fa-dumbbell" /> {routine.title || 'Plan de Entrenamiento'}
            </div>
          </div>
          <button type="button" className={a['btn-pdf-pill']} title="Descargar Ficha PDF / Imprimir Rutina" onClick={() => window.print()}>
            <i className={`fa-solid fa-file-pdf ${a['icon-danger']}`} /> Ficha PDF
          </button>
        </div>
      </section>

      <div className={a['mini-stats-row']}>
        <div className={a['mini-stat-pill']}>
          <i className="fa-solid fa-fire" aria-hidden="true" />
          <div>
            <div className={a['mini-stat-value']}>{streak}</div>
            <div className={a['mini-stat-label']}>Días Seguidos</div>
          </div>
        </div>
        <div className={a['mini-stat-pill']}>
          <i className="fa-solid fa-calendar-week" aria-hidden="true" />
          <div>
            <div className={a['mini-stat-value']}>{recentDaysCount}</div>
            <div className={a['mini-stat-label']}>Esta Semana</div>
          </div>
        </div>
      </div>

      <section className={a['progress-summary']}>
        <div className={a['progress-summary-top']}>
          <span>Progreso de Hoy</span>
          <span>{progressPct}%</span>
        </div>
        <div className={a['progress-bar-track']}>
          <div className={a['progress-bar-fill']} style={{ width: `${progressPct}%` }} />
        </div>
        <div className={a['progress-summary-sub']}>
          {completedCount} de {totalSets} series completadas
        </div>
      </section>

      <div className={a['coach-note-alert']}>
        <i className="fa-solid fa-lightbulb" />
        <div>
          <strong style={{ display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
            Indicación del Coach:
          </strong>
          <span>{routine.notes || 'Mantener técnica estricta y sobrecarga progresiva.'}</span>
        </div>
      </div>

      <nav className={a['days-nav-scroll']}>
        {dayKeys.map((key, index) => {
          const day = routine.days[key];
          return (
            <button
              type="button"
              key={key}
              className={`${a['day-tab-pill']} ${activeDayKey === key ? a.active : ''}`}
              onClick={() => switchDay(key)}
            >
              {day.name || `Día ${index + 1}`}
              {key === recommendedDayKey && <span className={a['today-badge']}>HOY</span>}
            </button>
          );
        })}
      </nav>

      <main className={a['exercises-container']} id="exercisesContainer">
        {exercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-dumbbell" style={{ fontSize: '2rem', marginBottom: 12, color: 'var(--primary)' }} />
            <p>No hay ejercicios programados para este día.</p>
          </div>
        ) : (
          exercises.map((ex, exIndex) => {
            const numSets = parseInt(ex.sets, 10) || 3;
            return (
              <div className={a['exercise-client-card']} key={exIndex}>
                <div className={a['exercise-client-header']}>
                  <div className={a['ex-title-wrap']}>
                    <h3>
                      {exIndex + 1}. {ex.name}
                    </h3>
                  </div>
                  <span className={a['ex-meta-badge']}>
                    {ex.sets} x {ex.reps}
                  </span>
                </div>

                {ex.cue && (
                  <div className={a['cue-box']}>
                    <i className="fa-solid fa-circle-info" /> {ex.cue}
                  </div>
                )}

                <div className={a['sets-grid-list']}>
                  {Array.from({ length: numSets }).map((_, i) => {
                    const setNum = i + 1;
                    const isCompleted = completedSets.has(`${exIndex}-${setNum}`);
                    return (
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isCompleted}
                        className={`${a['set-row']} ${isCompleted ? a.completed : ''}`}
                        key={setNum}
                        onClick={() => toggleSet(exIndex, setNum)}
                      >
                        <div className={a['set-left-group']}>
                          <div className={a['set-checkbox']} aria-hidden="true">
                            <i className="fa-solid fa-check" />
                          </div>
                          <span className={a['set-label']}>Serie {setNum}</span>
                        </div>
                        <div className={a['set-target']}>
                          <strong>{ex.reps}</strong> {ex.rir}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className={a['btn-trigger-rest']}
                  onClick={() => timer.start(parseRestSeconds(ex.rest))}
                >
                  <i className="fa-solid fa-stopwatch" /> Iniciar Descanso ({ex.rest || '90s'})
                </button>
              </div>
            );
          })
        )}
      </main>

      <div className={`${a['floating-timer-bar']} ${timer.active ? a.active : ''}`}>
        <div className={a['timer-label']}>
          <i className="fa-solid fa-stopwatch" /> Descanso:
        </div>
        <div className={a['timer-digits']}>{timer.label}</div>
        <div className={a['timer-controls']}>
          <button type="button" className={a['timer-btn']} onClick={() => timer.addSeconds(30)}>
            +30s
          </button>
          <button type="button" className={a['timer-btn']} onClick={timer.close} aria-label="Cerrar temporizador de descanso">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={a['app-bottom-bar']}>
        <button type="button" className={`${a['app-action-btn']} ${a.finish}`} onClick={handleComplete}>
          <i className="fa-solid fa-circle-check" /> Terminar Entrenamiento
        </button>
        <a href={coachWhatsAppHref} className={`${a['app-action-btn']} ${a.whatsapp}`} target="_blank" rel="noopener noreferrer" title="Consultar al Coach por WhatsApp">
          <i className="fa-brands fa-whatsapp" />
        </a>
      </div>
    </div>
  );
}
