import { useState } from 'react';
import { Link } from 'react-router-dom';
import { workoutDemoDays, workoutDemoDayOrder } from '../../data/workoutDemoData.js';
import ExerciseCard from '../../components/marketing/ExerciseCard.jsx';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';

export default function RutinaDemo() {
  useDocumentMeta({
    title: 'App del Alumno | COACH PRO',
    description: 'Así ven tus alumnos su rutina: ejercicios, series, esfuerzo (RIR), descansos y tus notas técnicas, con tu marca.',
  });

  const [activeDay, setActiveDay] = useState('day1');
  const day = workoutDemoDays[activeDay];

  return (
    <section className="section workout-demo-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <i className="fa-solid fa-mobile-screen-button" /> Funcionalidad: App del Alumno
          </div>
          <h2 className="section-title">
            Así ven tus <span>alumnos su rutina</span>
          </h2>
          <p className="section-desc">
            Este es el portal que recibe cada alumno tuyo: ejercicios, series, esfuerzo (RIR), descansos y tus notas
            técnicas — con tu marca, sin planillas sueltas. Probá la demo interactiva.
          </p>
        </div>

        <div className="workout-tabs">
          {workoutDemoDayOrder.map((key) => (
            <button
              type="button"
              key={key}
              className={`workout-tab-btn${activeDay === key ? ' active' : ''}`}
              onClick={() => setActiveDay(key)}
            >
              <i className={workoutDemoDays[key].tabIcon} /> {workoutDemoDays[key].tabLabel}
            </button>
          ))}
        </div>

        <div className="workout-phone-container">
          <div className="phone-top-bar">
            <div className="phone-app-brand">
              <i className="fa-solid fa-bolt" style={{ color: 'var(--primary)' }} />
              <span>COACH PRO APP</span>
            </div>
            <span className="phone-app-badge">Semana 4 • Hipertrofia & Sobrecarga</span>
          </div>

          <div className="workout-day-title">
            <h3>{day.title}</h3>
            <div className="workout-day-stats">{day.stats}</div>
          </div>

          <div className="exercise-list">
            {day.exercises.map((exercise) => (
              <ExerciseCard exercise={exercise} key={exercise.num} />
            ))}
          </div>

          <div style={{ padding: '0 30px 25px 30px', textAlign: 'center' }}>
            <Link className="btn btn-primary btn-sm btn-full" to="/login?tab=register">
              <i className="fa-solid fa-fire" /> Quiero Esto Para mis Alumnos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
