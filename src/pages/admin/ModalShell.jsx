import clsx from 'clsx';
import a from '../../styles/admin.module.css';

/** Envoltorio genérico de modal del panel admin (overlay + card + header + close). */
export default function ModalShell({ isOpen, onClose, title, titleIcon, headerExtra, wide, maxWidth, children }) {
  return (
    <div
      className={clsx(a['modal-overlay'], isOpen && a.open)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={clsx(a['modal-card'], wide && a['modal-card-xl'])} style={maxWidth ? { maxWidth } : undefined}>
        <div className={a['modal-header']}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {titleIcon && <i className={titleIcon} style={{ color: 'var(--primary)' }} />}
            {typeof title === 'string' ? (
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-white)' }}>{title}</h3>
            ) : (
              title
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {headerExtra}
            <button className={a['modal-close']} onClick={onClose} type="button">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>
        <div style={{ padding: wide ? 0 : undefined }}>{children}</div>
      </div>
    </div>
  );
}
