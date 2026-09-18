import { useId, useRef } from 'react';
import clsx from 'clsx';
import a from '../../styles/admin.module.css';
import useModalA11y from '../../hooks/useModalA11y.js';

/** Envoltorio genérico de modal del panel admin (overlay + card + header + close). */
export default function ModalShell({ isOpen, onClose, title, titleIcon, headerExtra, wide, maxWidth, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  useModalA11y(isOpen, onClose, dialogRef);

  return (
    <div
      className={clsx(a['modal-overlay'], isOpen && a.open)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={clsx(a['modal-card'], wide && a['modal-card-xl'])}
        style={maxWidth ? { maxWidth } : undefined}
        role="dialog"
        aria-modal="true"
        aria-labelledby={typeof title === 'string' ? titleId : undefined}
        aria-label={typeof title === 'string' ? undefined : 'Cuadro de diálogo'}
        tabIndex={-1}
      >
        <div className={a['modal-header']}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {titleIcon && <i className={titleIcon} style={{ color: 'var(--primary)' }} aria-hidden="true" />}
            {typeof title === 'string' ? (
              <h3 id={titleId} style={{ fontSize: '1.15rem', color: 'var(--text-white)' }}>{title}</h3>
            ) : (
              title
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {headerExtra}
            <button className={a['modal-close']} onClick={onClose} type="button" aria-label="Cerrar">
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div style={{ padding: wide ? 0 : undefined }}>{children}</div>
      </div>
    </div>
  );
}
