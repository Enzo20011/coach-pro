import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCoach } from '../../lib/firestore/coaches.js';
import { buildSlotId, createBooking } from '../../lib/firestore/bookings.js';
import { buildWhatsAppLink } from '../../lib/whatsapp.js';
import { formatARS } from '../../lib/formatCurrency.js';
import { useToast } from '../../context/ToastContext.jsx';
import BookingWizard from '../../components/marketing/BookingWizard.jsx';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';

export default function Reservar() {
  useDocumentMeta({ title: 'Reservar Turno | COACH PRO' });

  const [searchParams] = useSearchParams();
  const coachId = searchParams.get('coach');
  const showToast = useToast();

  const [status, setStatus] = useState('loading'); // 'loading' | 'found' | 'not-found'
  const [coach, setCoach] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!coachId) {
      setStatus('not-found');
      return;
    }
    getCoach(coachId).then((data) => {
      if (cancelled) return;
      if (data && data.isActive) {
        setCoach(data);
        setStatus('found');
      } else {
        setStatus('not-found');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [coachId]);

  async function handleSubmit({ serviceName, servicePrice, dateLabel, time, name, phone, note }) {
    // ID determinístico por (coach, fecha, horario): si ese slot ya está
    // Pendiente/Confirmado, Firestore Security Rules rechazan la escritura
    // (permission-denied) en vez de dejar crear un turno duplicado.
    const bookingId = buildSlotId(coach.id, dateLabel, time);
    try {
      await createBooking(bookingId, {
        coachId: coach.id,
        clientName: name,
        phone,
        service: `${serviceName} (${servicePrice})`,
        date: dateLabel,
        time,
        status: 'Pendiente',
      });

      const message =
        `¡Hola ${coach.displayName}! Quiero reservar un turno:\n` +
        `📌 *Servicio:* ${serviceName} (${servicePrice})\n` +
        `📅 *Fecha:* ${dateLabel}\n⏰ *Horario:* ${time}\n` +
        `👤 *Nombre:* ${name}\n📱 *Contacto:* ${phone}\n` +
        (note ? `🎯 *Nota:* ${note}\n\n` : '\n') +
        `¡Quedo a la espera de confirmación!`;

      showToast('¡Turno enviado! Abriendo WhatsApp...');
      setTimeout(() => window.open(buildWhatsAppLink(coach.phone, message), '_blank'), 900);
    } catch (err) {
      console.error(err);
      if (err?.code === 'permission-denied') {
        showToast('Ese horario ya fue reservado. Elegí otro día u horario.');
      } else {
        showToast('No se pudo guardar el turno. Probá de nuevo.');
      }
    }
  }

  return (
    <>
      <header className="reservar-header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link to="/" className="logo">
            <span className="logo-badge">
              <i className="fa-solid fa-bolt" />
            </span>
            <span>COACH</span> PRO
          </Link>
        </div>
      </header>

      <main>
        <section className="section booking-section" style={{ paddingTop: 32 }}>
          <div className="container">
            {status === 'loading' && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '1.8rem', marginBottom: 12, display: 'block' }} />
                Cargando datos del entrenador...
              </div>
            )}

            {status === 'not-found' && (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '2.4rem', color: 'var(--accent-orange)', marginBottom: 16, display: 'block' }} />
                <h2 className="section-title">Enlace no válido</h2>
                <p className="section-desc">
                  Este link de reserva no corresponde a ningún entrenador activo. Pedile a tu coach que te comparta su
                  link correcto.
                </p>
              </div>
            )}

            {status === 'found' && coach && (
              <>
                <div className="coach-identity-card">
                  <img src={coach.avatar} alt={`Avatar de ${coach.displayName}`} />
                  <div>
                    <div className="coach-identity-name">{coach.displayName}</div>
                    <div className="coach-identity-specialty">{coach.specialty}</div>
                  </div>
                </div>

                <div className="section-header">
                  <div className="section-tag">
                    <i className="fa-regular fa-calendar-days" /> Agenda en Tiempo Real
                  </div>
                  <h2 className="section-title">
                    Reservá tu <span>Turno de Entrenamiento</span>
                  </h2>
                  <p className="section-desc">
                    Elegí el servicio, seleccioná día y horario libre, y confirmá tu turno directo por WhatsApp.
                  </p>
                </div>

                <BookingWizard
                  services={[
                    { id: 'eval', name: 'Evaluación Inicial', description: 'Charla para conocer tu objetivo, historial y disponibilidad (30 min)', priceLabel: 'GRATIS' },
                    { id: 'personalizado', name: 'Coaching Personalizado', description: 'Arrancá tu plan de seguimiento y rutinas 1 a 1', priceLabel: `${formatARS(coach.pricePersonalizado)}/mes` },
                  ]}
                  onSubmit={handleSubmit}
                />
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
