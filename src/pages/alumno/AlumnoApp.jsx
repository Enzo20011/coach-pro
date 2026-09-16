import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAlumno } from '../../lib/firestore/alumnos.js';
import { getRoutineForStudent } from '../../lib/firestore/routines.js';
import { getCoach } from '../../lib/firestore/coaches.js';
import { sortDayKeys } from '../../lib/routineUtils.js';
import { buildWhatsAppLink } from '../../lib/whatsapp.js';
import useRestTimer from '../../hooks/useRestTimer.js';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';
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
  const [student, routine] = await Promise.all([getAlumno(studentId), getRoutineForStudent(studentId)]);
  const resolvedStudent = student || FALLBACK_STUDENT;
  const resolvedRoutine = routine || FALLBACK_ROUTINE;
  const coach = (await getCoach(resolvedStudent.coachId || 'coach_1')) || FALLBACK_COACH;
  return { student: resolvedStudent, routine: resolvedRoutine, coach };
}

export default function AlumnoApp() {
  useDocumentMeta({ title: 'Mi Rutina de Entrenamiento | COACH PRO App' });

  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('id') || '1';

  const { data, isLoading } = useQuery({ queryKey: ['alumnoPortal', studentId], queryFn: () => fetchPortalData(studentId) });

  const [activeDayKey, setActiveDayKey] = useState(null);
  const [completedSets, setCompletedSets] = useState(new Set());
  const timer = useRestTimer();

  const dayKeys = useMemo(() => (data ? sortDayKeys(Object.keys(data.routine.days || {})) : []), [data]);

  useEffect(() => {
    if (dayKeys.length > 0 && !activeDayKey) setActiveDayKey(dayKeys[0]);
  }, [dayKeys, activeDayKey]);

  function switchDay(key) {
    setActiveDayKey(key);
    setCompletedSets(new Set());
  }

  if (isLoading || !data) return null;

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
        timer.start(90);
      }
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
    alert(`¡Felicitaciones ${student.name.split(' ')[0]}! Has completado el entrenamiento de hoy. Registraste ${completedCount} series.`);
    window.open(buildWhatsAppLink(coach.phone, message), '_blank');
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
        <span className={a['routine-title-pill']}>{student.plan}</span>
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
            <i className="fa-solid fa-file-pdf" style={{ color: '#ff5e57' }} /> Ficha PDF
          </button>
        </div>
      </section>

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
                      <div
                        className={`${a['set-row']} ${isCompleted ? a.completed : ''}`}
                        key={setNum}
                        onClick={() => toggleSet(exIndex, setNum)}
                      >
                        <div className={a['set-left-group']}>
                          <div className={a['set-checkbox']}>
                            <i className="fa-solid fa-check" />
                          </div>
                          <span className={a['set-label']}>Serie {setNum}</span>
                        </div>
                        <div className={a['set-target']}>
                          <strong>{ex.reps}</strong> {ex.rir}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button type="button" className={a['btn-trigger-rest']} onClick={() => timer.start(90)}>
                  <i className="fa-solid fa-stopwatch" /> Iniciar Descanso (90s)
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
          <button type="button" className={a['timer-btn']} onClick={timer.close}>
            <i className="fa-solid fa-xmark" />
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
