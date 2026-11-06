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
          <h2 className="section-title">Qué incluye COACH PRO</h2>
          <p className="section-desc">Alumnos, rutinas y turnos en el mismo panel, en lugar de planillas y chats sueltos.</p>
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

          <div className="pricing-card">
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
                <i className="fa-solid fa-check" /> Ficha de rutina en PDF
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
                <i className="fa-solid fa-check" /> Botón para contactar al alumno por WhatsApp
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
          <h2>Probalo con tu primer alumno</h2>
          <p>Los primeros 7 días son gratis y después se cobra. Creá tu cuenta o pedí una demo si preferís que te lo mostremos.</p>
          <div className="cta-buttons">
            <Link className="btn btn-primary" to="/login?tab=register">
              Probar 7 días gratis
            </Link>
            <button className="btn btn-secondary" type="button" onClick={() => open('Demo de COACH PRO', '')}>
              Pedir una demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
