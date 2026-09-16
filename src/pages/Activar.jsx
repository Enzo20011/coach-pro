import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext.jsx';
import AuthAlert from '../components/ui/AuthAlert.jsx';
import { platformWhatsAppLink } from '../lib/whatsapp.js';
import useDocumentMeta from '../hooks/useDocumentMeta.js';
import a from '../styles/admin.module.css';
import styles from '../styles/auth.module.css';

export default function Activar() {
  useDocumentMeta({ title: 'Activar mi Cuenta | COACH PRO' });

  const navigate = useNavigate();
  const { user, coach, loading, activate, logout } = useAuth();
  const [code, setCode] = useState('');
  const [alert, setAlert] = useState({ status: null, message: '' });
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (coach?.isActive) return <Navigate to="/admin" replace />;

  const whatsappMsg = `¡Hola! Soy ${coach?.name} (${coach?.email}) y quiero coordinar el pago para activar mi cuenta de COACH PRO.`;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await activate(code);
    if (res.success) {
      setAlert({ status: 'success', message: '¡Cuenta activada con éxito! Ingresando a tu panel...' });
      setTimeout(() => navigate('/admin'), 700);
    } else {
      setAlert({ status: 'error', message: res.message });
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginBrandHeader}>
          <a href="/" className={a['brand-badge']}>
            <div className={a['brand-icon']}>
              <i className="fa-solid fa-bolt" />
            </div>
            <span>COACH PRO</span>
          </a>
          <p className={styles.loginSubtitle}>Activación de Cuenta de Entrenador</p>
        </div>

        <div className={styles.loginCard}>
          <div className={styles.pendingBadge}>
            <i className="fa-solid fa-clock" />
            <span>
              Tu cuenta <span className={styles.pendingCoachName}>{coach?.displayName ?? '—'}</span> está pendiente de
              activación
            </span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
            Para acceder a tu panel primero coordinamos el pago con vos. Escribinos por WhatsApp y, una vez
            confirmado, te compartimos el código que activa tu cuenta.
          </p>

          <a
            href={platformWhatsAppLink(whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(a.btn, a['btn-whatsapp'])}
            style={{ width: '100%', padding: 13, marginBottom: 8 }}
          >
            <i className="fa-brands fa-whatsapp" /> Coordinar Pago por WhatsApp
          </a>

          <div className={styles.dividerRow}>¿Ya tenés tu código?</div>

          <AuthAlert status={alert.status} message={alert.message} styles={styles} />

          <form onSubmit={handleSubmit}>
            <div className={a['form-group']} style={{ marginBottom: 16 }}>
              <label htmlFor="activationCode">Código de Activación</label>
              <input
                type="text"
                id="activationCode"
                className={a['form-input']}
                placeholder="Ej: COACHPRO-2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={clsx(a.btn, a['btn-primary'])}
              style={{ width: '100%', padding: 13 }}
              disabled={submitting}
            >
              <i className="fa-solid fa-unlock" /> Activar mi Cuenta
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <a
            href="#"
            style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <i className="fa-solid fa-right-from-bracket" /> Cerrar sesión
          </a>
        </div>
      </div>
    </div>
  );
}
