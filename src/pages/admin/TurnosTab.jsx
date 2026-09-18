import { useToast } from '../../context/ToastContext.jsx';
import { buildWhatsAppLink } from '../../lib/whatsapp.js';
import { updateBooking } from '../../lib/firestore/bookings.js';
import a from '../../styles/admin.module.css';

export default function TurnosTab({ bookings, coach, onBookingUpdated }) {
  const showToast = useToast();
  const myBookingUrl = `${window.location.origin}/reservar?coach=${coach.id}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(myBookingUrl).then(() => showToast('¡Enlace de reservas copiado al portapapeles!'));
  }

  async function handleStatusChange(bookingId, status) {
    try {
      await updateBooking(bookingId, { status });
      onBookingUpdated();
      showToast(status === 'Confirmado' ? '¡Turno confirmado!' : 'Turno cancelado. El horario vuelve a quedar libre.');
    } catch (err) {
      console.error(err);
      showToast('No se pudo actualizar el turno. Probá de nuevo.');
    }
  }

  function statusModifier(status) {
    if (status === 'Confirmado') return a.active;
    if (status === 'Cancelado') return a.cancelled;
    return a.pending;
  }

  return (
    <section className={a['tab-panel']}>
      <div className={a['content-box']}>
        <div className={a['box-header']}>
          <h3>
            <i className="fa-regular fa-calendar-check" style={{ color: 'var(--primary)' }} /> Solicitudes de Turnos
          </h3>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 10 }}>
          Compartí este link con tus alumnos para que reserven un turno directo con vos. Cada solicitud va a aparecer
          acá.
        </p>
        <div className={a['share-link-box']} style={{ margin: '0 0 20px 0' }}>
          <div className={a['share-link-text']}>{myBookingUrl}</div>
          <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={handleCopyLink} title="Copiar enlace">
            <i className="fa-regular fa-copy" /> Copiar
          </button>
        </div>

        <div className={a['data-table-wrap']}>
          <table className={a['data-table']}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Servicio Solicitado</th>
                <th>Fecha & Horario</th>
                <th>WhatsApp</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                    No tienes solicitudes de turnos pendientes para tu perfil.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td data-label="Cliente">
                      <strong>{b.clientName}</strong>
                    </td>
                    <td data-label="Servicio Solicitado">{b.service}</td>
                    <td data-label="Fecha & Horario">
                      {b.date} • {b.time}
                    </td>
                    <td data-label="WhatsApp">{b.phone}</td>
                    <td data-label="Estado">
                      <span className={`${a['status-badge']} ${statusModifier(b.status)}`}>{b.status}</span>
                    </td>
                    <td data-label="Acción">
                      <div className={a['table-actions']}>
                        <a
                          href={buildWhatsAppLink(
                            b.phone,
                            `Hola ${b.clientName}! Te saluda ${coach.displayName}. Te confirmo tu turno en COACH PRO`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${a.btn} ${a['btn-whatsapp']} ${a['btn-sm']}`}
                        >
                          <i className="fa-brands fa-whatsapp" /> Contactar
                        </a>
                        {b.status !== 'Confirmado' && (
                          <button
                            type="button"
                            className={`${a.btn} ${a['btn-primary']} ${a['btn-sm']}`}
                            onClick={() => handleStatusChange(b.id, 'Confirmado')}
                          >
                            <i className="fa-solid fa-check" /> Confirmar
                          </button>
                        )}
                        {b.status !== 'Cancelado' && (
                          <button
                            type="button"
                            className={`${a.btn} ${a['btn-danger-outline']} ${a['btn-sm']}`}
                            onClick={() => handleStatusChange(b.id, 'Cancelado')}
                          >
                            <i className="fa-solid fa-xmark" /> Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
