import { Link } from 'react-router-dom';
import GuestButton from '../../components/ui/GuestButton.jsx';
import { platformWhatsAppLink } from '../../lib/whatsapp.js';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';

const STEPS = [
  {
    n: 1,
    title: 'Creá tu cuenta gratis',
    desc: 'Te registrás con tu nombre, especialidad y tarifa. Tu panel queda listo al instante, con tu propia marca.',
  },
  {
    n: 2,
    title: 'Cargá tus alumnos y sus rutinas',
    desc: 'Sumá a cada alumno con su plan y objetivo, y armá rutinas de hasta 6 días con el constructor integrado.',
  },
  {
    n: 3,
    title: 'Tus alumnos usan la app',
    desc: 'Ven su rutina, marcan sus series y siguen su progreso solos. Vos te enfocás en entrenar, no en gestionar.',
  },
];

export default function Home() {
  useDocumentMeta({
    title: 'COACH PRO | Panel para entrenadores personales',
    description:
      'Panel para entrenadores personales: alumnos, constructor de rutinas, agenda de turnos y ficha en PDF.',
  });

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">Alumnos, rutinas y turnos en un solo panel.</h1>

              <p className="hero-subtitle">
                Cargás a tus alumnos, armás rutinas de hasta 6 días y exportás la ficha en PDF. Cada alumno ve su
                rutina y marca sus series desde el celular.
              </p>

              <div className="hero-cta-group">
                <Link className="btn btn-primary" to="/login?tab=register">
                  Probar 7 días gratis
                </Link>
                <GuestButton className="btn btn-secondary">Entrar como invitado</GuestButton>
              </div>
              <p className="hero-subtitle" style={{ fontSize: '0.85rem', marginTop: 14, marginBottom: 0 }}>
                Los primeros 7 días son gratis y después se cobra. Como invitado entrás sin cuenta, con datos de prueba.
              </p>
            </div>

            <div className="hero-media-wrapper">
              <div className="hero-image-card">
                <img
                  src="/img/app-alumno.png"
                  alt="Pantalla de la app del alumno con la rutina del día 1: ejercicios, series, esfuerzo y descanso"
                  width="420"
                  height="640"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUE INCLUYE */}
      <section className="reputation-strip">
        <div className="container">
          <div className="reputation-flex">
            <div className="rep-item">
              <span>Constructor de rutinas</span>
            </div>
            <div className="rep-item">
              <span>Agenda de turnos</span>
            </div>
            <div className="rep-item">
              <span>Ficha de rutina en PDF</span>
            </div>
            <div className="rep-item">
              <span>App para el alumno</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Cómo se usa</h2>
            <p className="section-desc">Son tres pasos y no hay nada que instalar.</p>
          </div>

          <div className="steps-grid">
            {STEPS.map((step) => (
              <div className="glass-card step-card" key={step.n}>
                <div className="step-num-badge" aria-hidden="true">
                  {step.n}
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOME CTA FOOTER */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-box">
            <h2>Probalo con tu primer alumno</h2>
            <p>Creás la cuenta, cargás un alumno y armás su primera rutina. Los primeros 7 días son gratis y después se cobra.</p>
            <div className="cta-buttons">
              <Link className="btn btn-primary" to="/login?tab=register">
                Probar 7 días gratis
              </Link>
              <a
                href={platformWhatsAppLink('Hola! Quiero información sobre COACH PRO para entrenadores')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                Escribinos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
