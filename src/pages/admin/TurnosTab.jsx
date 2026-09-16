import { useToast } from '../../context/ToastContext.jsx';
import { buildWhatsAppLink } from '../../lib/whatsapp.js';
import a from '../../styles/admin.module.css';

export default function TurnosTab({ bookings, coach }) {
  const showToast = useToast();
  const myBookingUrl = `${window.location.origin}/reservar?coach=${coach.id}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(myBookingUrl).then(() => showToast('¡Enlace de reservas copiado al portapapeles!'));
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
                    <td>
                      <strong>{b.clientName}</strong>
                    </td>
                    <td>{b.service}</td>
                    <td>
                      {b.date} • {b.time}
                    </td>
                    <td>{b.phone}</td>
                    <td>
                      <span className={`${a['status-badge']} ${a.active}`}>{b.status}</span>
                    </td>
                    <td>
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
