import { Link } from 'react-router-dom';
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
    desc: 'Ven su rutina, marcan sus series y reservan turnos solos. Vos te enfocás en entrenar, no en gestionar.',
  },
];

export default function Home() {
  useDocumentMeta({
    title: 'COACH PRO | La Plataforma para Entrenadores Personales',
    description:
      'COACH PRO es la plataforma todo-en-uno para entrenadores personales: gestión de alumnos, constructor de rutinas, agenda de turnos online y fichas profesionales, todo en un panel a tu marca.',
  });

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge-container">
                <span className="live-badge">
                  <span className="pulse-dot" /> Plataforma para Entrenadores Personales
                </span>
              </div>

              <h1 className="hero-title">
                Profesionalizá tu negocio de entrenador. <br />
                <span className="highlight">Todo en un solo lugar.</span>
              </h1>

              <p className="hero-subtitle">
                Gestioná alumnos, diseñá rutinas personalizadas, agendá turnos online y entregá una experiencia
                profesional con tu propia marca — todo desde un panel pensado para entrenadores.
              </p>

              <div className="hero-cta-group">
                <Link className="btn btn-primary" to="/login?tab=register">
                  <i className="fa-solid fa-bolt" /> Crear mi Cuenta Gratis
                </Link>
                <Link className="btn btn-secondary" to="/turnos">
                  <i className="fa-regular fa-calendar-check" /> Ver Cómo Funciona
                </Link>
              </div>

              <div className="hero-metrics">
                <div className="metric-item">
                  <div className="metric-value">
                    +150<span>+</span>
                  </div>
                  <div className="metric-label">Entrenadores Activos</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">
                    +5<span>k</span>
                  </div>
                  <div className="metric-label">Rutinas Creadas</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">
                    24<span>/7</span>
                  </div>
                  <div className="metric-label">Panel Online</div>
                </div>
              </div>
            </div>

            <div className="hero-media-wrapper">
              <div className="hero-image-card">
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop"
                  alt="Entrenador personal usando COACH PRO para dar seguimiento a un alumno"
                  loading="eager"
                />
                <div className="hero-image-overlay" />
              </div>

              <div className="floating-stat-card stat-top-right">
                <div className="stat-icon-box">
                  <i className="fa-solid fa-star" />
                </div>
                <div className="stat-text">
                  <h4>4.9 / 5.0</h4>
                  <p>+250 Entrenadores nos Recomiendan</p>
                </div>
              </div>

              <div className="floating-stat-card stat-bottom-left">
                <div className="stat-icon-box">
                  <i className="fa-solid fa-chart-line" />
                </div>
                <div className="stat-text">
                  <h4>+35% más Alumnos</h4>
                  <p>Retención promedio en 90 días</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REPUTATION / CREDIBILITY STRIP */}
      <section className="reputation-strip">
        <div className="container">
          <div className="reputation-flex">
            <div className="rep-item">
              <i className="fa-solid fa-lock" />
              <span>Datos de tus Alumnos Protegidos</span>
            </div>
            <div className="rep-item">
              <i className="fa-solid fa-dumbbell" />
              <span>Constructor de Rutinas Ilimitado</span>
            </div>
            <div className="rep-item">
              <i className="fa-regular fa-calendar-check" />
              <span>Agenda Online Integrada</span>
            </div>
            <div className="rep-item">
              <i className="fa-solid fa-headset" />
              <span>Soporte Prioritario</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <i className="fa-solid fa-diagram-project" /> Cómo Funciona
            </div>
            <h2 className="section-title">
              Empezá a usarlo en <span>tres pasos</span>
            </h2>
            <p className="section-desc">
              Sin instalaciones ni curvas de aprendizaje. Tu panel queda listo para trabajar el mismo día.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {STEPS.map((step) => (
              <div className="glass-card" style={{ padding: '28px 24px' }} key={step.n}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: 'rgba(0,255,135,0.12)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    marginBottom: 16,
                  }}
                >
                  {step.n}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOME CTA FOOTER */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-box">
            <h2>¿Listo para profesionalizar tu marca de entrenador?</h2>
            <p>
              Sumate a COACH PRO y empezá a gestionar tus alumnos, rutinas y turnos como un negocio profesional desde
              hoy.
            </p>
            <div className="cta-buttons">
              <Link className="btn btn-primary" to="/login?tab=register">
                <i className="fa-solid fa-bolt" /> Crear mi Cuenta
              </Link>
              <a
                href={platformWhatsAppLink('Hola! Quiero información sobre COACH PRO para entrenadores')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <i className="fa-brands fa-whatsapp" /> Hablar con Ventas
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
