import ModalShell from './ModalShell.jsx';
import a from '../../styles/admin.module.css';

function formatDate(ts) {
  if (!ts) return 'Fecha desconocida';
  const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function RoutineHistoryModal({ isOpen, onClose, versions, isLoading, onRestore }) {
  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleIcon="fa-solid fa-clock-rotate-left" title="Versiones Anteriores de la Rutina">
      <div style={{ padding: '4px 22px 22px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {isLoading && <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Cargando historial...</p>}

        {!isLoading && versions.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Todavía no hay versiones anteriores guardadas para este alumno. Cada vez que guardes cambios sobre una
            rutina existente, la versión anterior queda archivada acá.
          </p>
        )}

        {versions.map((v) => (
          <div
            key={v.id}
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <strong style={{ display: 'block', color: 'var(--text-white)', fontSize: '0.92rem' }}>{v.title}</strong>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Archivada el {formatDate(v.archivedAt)}</span>
            </div>
            <button
              type="button"
              className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`}
              onClick={() => onRestore(v)}
              style={{ flexShrink: 0 }}
            >
              <i className="fa-solid fa-clock-rotate-left" /> Restaurar
            </button>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}
