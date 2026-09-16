import { Link } from 'react-router-dom';
import { useCheckoutModal } from '../../context/CheckoutModalContext.jsx';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';

export default function Planes() {
  useDocumentMeta({
    title: 'Sumate a COACH PRO | Plataforma para Entrenadores',
    description: 'Sumate a COACH PRO: gestión de alumnos, constructor de rutinas y agenda online en un solo panel profesional para entrenadores personales.',
  });

  const { open } = useCheckoutModal();

  return (
    <section className="section pricing-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <i className="fa-solid fa-rocket" /> Para Entrenadores Personales
          </div>
          <h2 className="section-title">
            Hacé crecer tu negocio con <span>COACH PRO</span>
          </h2>
          <p className="section-desc">
            Dejá las planillas sueltas y el WhatsApp desordenado. Gestioná tu marca de entrenador con un panel
            profesional hecho a tu medida.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3 className="plan-name">
                <i className="fa-solid fa-users" style={{ color: 'var(--primary)', marginRight: 8 }} />
                Gestión de Alumnos
              </h3>
              <p className="plan-desc">
                Todo tu directorio de alumnos organizado, con planes, contacto y estado de cada uno en un solo lugar.
              </p>
            </div>
            <ul className="pricing-features">
              <li>
                <i className="fa-solid fa-check" /> Alta de alumnos ilimitada
              </li>
              <li>
                <i className="fa-solid fa-check" /> Ficha de contacto y objetivo por alumno
              </li>
              <li>
                <i className="fa-solid fa-check" /> Estado de plan y seguimiento
              </li>
              <li>
                <i className="fa-solid fa-check" /> Portal exclusivo para cada alumno
              </li>
            </ul>
          </div>

          <div className="pricing-card featured">
            <div className="featured-ribbon">⭐ Lo Más Usado</div>
            <div className="pricing-header">
              <h3 className="plan-name">
                <i className="fa-solid fa-dumbbell" style={{ color: 'var(--primary)', marginRight: 8 }} />
                Constructor de Rutinas
              </h3>
              <p className="plan-desc">
                Diseñá rutinas de hasta 6 días por semana y entregalas al instante, sin usar planillas de Excel.
              </p>
            </div>
            <ul className="pricing-features">
              <li>
                <i className="fa-solid fa-check" /> Rutinas ilimitadas, hasta 6 días
              </li>
              <li>
                <i className="fa-solid fa-check" /> Series, repeticiones, RIR y notas técnicas
              </li>
              <li>
                <i className="fa-solid fa-check" /> Envío directo por WhatsApp al alumno
              </li>
              <li>
                <i className="fa-solid fa-check" /> Ficha PDF profesional con tu marca
              </li>
            </ul>
          </div>

          <div className="pricing-card">
            <div className="pricing-header">
              <h3 className="plan-name">
                <i className="fa-regular fa-calendar-check" style={{ color: 'var(--primary)', marginRight: 8 }} />
                Agenda Online
              </h3>
              <p className="plan-desc">Tus alumnos reservan turnos solos, vos solo confirmás. Sin ida y vuelta de mensajes.</p>
            </div>
            <ul className="pricing-features">
              <li>
                <i className="fa-solid fa-check" /> Calendario de turnos integrado
              </li>
              <li>
                <i className="fa-solid fa-check" /> Confirmación automática por WhatsApp
              </li>
              <li>
                <i className="fa-solid fa-check" /> Panel de solicitudes pendientes
              </li>
              <li>
                <i className="fa-solid fa-check" /> Tu propia tarifa de servicio personalizado
              </li>
            </ul>
          </div>
        </div>

        <div className="cta-box" style={{ marginTop: 50 }}>
          <h2>¿Listo para profesionalizar tu marca de entrenador?</h2>
          <p>Creá tu cuenta gratis y empezá a usar tu panel hoy mismo, o hablá con nuestro equipo si preferís una demo guiada.</p>
          <div className="cta-buttons">
            <Link className="btn btn-primary" to="/login?tab=register">
              <i className="fa-solid fa-bolt" /> Crear mi Cuenta Gratis
            </Link>
            <button className="btn btn-secondary" type="button" onClick={() => open('Demo de COACH PRO', '')}>
              <i className="fa-solid fa-comments" /> Solicitar una Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
