import ModalShell from './ModalShell.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { buildWhatsAppLink } from '../../lib/whatsapp.js';
import a from '../../styles/admin.module.css';

export default function SendRoutineModal({ isOpen, onClose, student, routine, coach, onExportPdf }) {
  const showToast = useToast();

  if (!student) return <ModalShell isOpen={isOpen} onClose={onClose} title="Enviar Rutina al Alumno" />;

  const portalUrl = `${window.location.origin}/alumno?id=${student.id}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(portalUrl).then(() => showToast('¡Enlace del portal copiado al portapapeles!'));
  }

  function handleSendWhatsApp() {
    const title = routine?.title || 'Plan de Entrenamiento';
    const message =
      `¡Hola ${student.name}! 👋\n\n` +
      `Te saluda tu entrenador *${coach.displayName}* (${coach.specialty}).\n\n` +
      `Tu rutina personalizada de *${title}* ya está lista en tu portal digital de *COACH PRO*.\n\n` +
      `📲 *Accede a tu rutina aquí:*\n${portalUrl}\n\n` +
      `Vas a encontrar los ejercicios detallados con series, repeticiones, descansos y notas biomecánicas. Podrás marcar cada serie en el gym.\n\n` +
      `Tarifa de tu plan personalizado: *$${coach.pricePersonalizado}/mes*.\n\n` +
      `¡A darlo todo en el gym! Cualquier duda me escribes directamente por acá.`;

    showToast(`Abriendo WhatsApp para enviar a ${student.name}...`);
    setTimeout(() => window.open(buildWhatsAppLink(student.phone, message), '_blank'), 700);
    onClose();
  }

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleIcon="fa-brands fa-whatsapp" title="Enviar Rutina al Alumno">
      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 14 }}>
        Se enviará el acceso directo a la rutina personalizada de{' '}
        <strong style={{ color: 'var(--text-white)' }}>{student.name}</strong> ({student.phone}).
      </p>

      <div className={a['share-link-box']}>
        <div className={a['share-link-text']}>{portalUrl}</div>
        <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={handleCopyLink} title="Copiar enlace">
          <i className="fa-regular fa-copy" /> Copiar
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        <button type="button" className={`${a.btn} ${a['btn-whatsapp']}`} onClick={handleSendWhatsApp}>
          <i className="fa-brands fa-whatsapp" /> Enviar Rutina por WhatsApp (1 Clic)
        </button>
        <button
          type="button"
          className={`${a.btn} ${a['btn-secondary']}`}
          onClick={() => {
            onClose();
            onExportPdf(student.id);
          }}
        >
          <i className="fa-solid fa-file-pdf" style={{ color: '#ff5e57' }} /> Descargar Ficha PDF / Imprimir
        </button>
        <a
          href={`/alumno?id=${student.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${a.btn} ${a['btn-secondary']}`}
        >
          <i className="fa-solid fa-arrow-up-right-from-square" /> Abrir y Probar como Alumno
        </a>
      </div>
    </ModalShell>
  );
}
