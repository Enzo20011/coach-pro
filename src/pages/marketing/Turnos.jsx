import BookingWizard from '../../components/marketing/BookingWizard.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { platformWhatsAppLink } from '../../lib/whatsapp.js';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';

const DEMO_SERVICES = [
  {
    id: 'eval',
    name: 'Evaluación Inicial de Fuerza & Movilidad',
    description: 'Diagnóstico de movilidad articular, historial lesional y objetivos (30 min)',
    priceLabel: 'GRATIS',
  },
  {
    id: 'personal',
    name: 'Sesión de Entrenamiento 1 a 1',
    description: 'Entrenamiento presencial o virtual enfocado en fuerza e hipertrofia (60 min)',
    priceLabel: '$20',
  },
  {
    id: 'biomechanics',
    name: 'Evaluación Postural & Biomecánica',
    description: 'Análisis de técnica en levantamientos básicos y detección de asimetrías (45 min)',
    priceLabel: '$30',
  },
];

export default function Turnos() {
  useDocumentMeta({
    title: 'Agenda Online | COACH PRO',
    description: 'Así reservan turno tus alumnos: cada entrenador define sus propios servicios, precios y horarios disponibles.',
  });

  const showToast = useToast();

  function handleDemoSubmit({ serviceName, dateLabel, time, name, phone, note }) {
    const message =
      `¡Hola equipo de COACH PRO! Probé la demo de Agenda Online y quiero coordinar una charla:\n` +
      `📌 *Interés:* ${serviceName}\n` +
      `📅 *Día preferido:* ${dateLabel}\n⏰ *Horario:* ${time}\n` +
      `👤 *Nombre:* ${name}\n📱 *Contacto:* ${phone}\n` +
      (note ? `🎯 *Nota:* ${note}\n\n` : '\n') +
      `¡Quedo a la espera de confirmación!`;
    showToast('¡Consulta enviada! Abriendo WhatsApp...');
    setTimeout(() => window.open(platformWhatsAppLink(message), '_blank'), 900);
  }

  return (
    <section className="section booking-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <i className="fa-regular fa-calendar-days" /> Funcionalidad: Agenda Online
          </div>
          <h2 className="section-title">
            Así reservan turno <span>tus alumnos</span>
          </h2>
          <p className="section-desc">
            Cada entrenador define sus propios servicios, precios y horarios disponibles. Probá vos mismo esta demo
            interactiva de cómo tus alumnos agendarían una sesión con vos.
          </p>
        </div>

        <BookingWizard
          services={DEMO_SERVICES}
          onSubmit={handleDemoSubmit}
          topBar={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span className="live-badge">
                <span className="pulse-dot" /> Demo Interactiva
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary)' }} /> Ejemplo de agenda de un
                entrenador
              </span>
            </div>
          }
        />
      </div>
    </section>
  );
}
