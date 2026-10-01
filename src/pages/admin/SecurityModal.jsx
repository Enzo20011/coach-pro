import { useEffect, useState } from 'react';
import { multiFactor } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ModalShell from './ModalShell.jsx';
import a from '../../styles/admin.module.css';

/** Seguridad de la cuenta: verificación de correo y verificación en dos pasos (TOTP). */
export default function SecurityModal({ isOpen, onClose }) {
  const { startTotpEnrollment, finishTotpEnrollment, disableTotp, resendVerification } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [enrollment, setEnrollment] = useState(null); // { secret, uri }
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const verified = Boolean(auth.currentUser?.emailVerified);

  useEffect(() => {
    if (!isOpen) return;
    setEnabled(multiFactor(auth.currentUser).enrolledFactors.length > 0);
    setEnrollment(null);
    setCode('');
    setMessage('');
  }, [isOpen]);

  async function run(fn) {
    setBusy(true);
    setMessage('');
    const res = await fn();
    setBusy(false);
    if (!res.success) setMessage(res.message);
    return res;
  }

  async function handleStart() {
    const res = await run(startTotpEnrollment);
    if (res.success) setEnrollment({ secret: res.secret, uri: res.uri });
  }

  async function handleFinish(e) {
    e.preventDefault();
    const res = await run(() => finishTotpEnrollment(enrollment.secret, code));
    if (res.success) {
      setEnabled(true);
      setEnrollment(null);
      setMessage('¡Verificación en dos pasos activada!');
    }
  }

  async function handleDisable() {
    const res = await run(disableTotp);
    if (res.success) {
      setEnabled(false);
      setMessage('Verificación en dos pasos desactivada.');
    }
  }

  async function handleResend() {
    const res = await run(resendVerification);
    if (res.success) setMessage('Te enviamos el enlace de verificación. Revisá tu correo (y spam).');
  }

  const muted = { fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 14 };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleIcon="fa-solid fa-shield-halved" title="Seguridad de la Cuenta" maxWidth={460}>
      <p style={muted}>
        <strong>Correo:</strong> {verified ? 'verificado ✔' : 'sin verificar'}
      </p>
      {!verified && (
        <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} style={{ marginBottom: 16 }} onClick={handleResend} disabled={busy}>
          Reenviar correo de verificación
        </button>
      )}

      <p style={muted}>
        <strong>Verificación en dos pasos:</strong> {enabled ? 'activada ✔' : 'desactivada'}. Usa una app como Google Authenticator o Authy.
      </p>

      {!enabled && !enrollment && (
        <button type="button" className={`${a.btn} ${a['btn-primary']}`} style={{ width: '100%' }} onClick={handleStart} disabled={busy}>
          Activar verificación en dos pasos
        </button>
      )}

      {enrollment && (
        <form onSubmit={handleFinish}>
          <p style={muted}>
            En tu app de autenticación elegí "Agregar cuenta" → "Ingresar clave" y cargá esta clave (o abrí el enlace desde el celular):
          </p>
          <code style={{ display: 'block', wordBreak: 'break-all', padding: 10, marginBottom: 8, userSelect: 'all' }}>
            {enrollment.secret.secretKey}
          </code>
          <a href={enrollment.uri} style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Abrir en app de autenticación</a>
          <div className={a['form-group']} style={{ margin: '14px 0' }}>
            <label htmlFor="totpCode">Código de 6 dígitos que muestra la app</label>
            <input
              id="totpCode"
              className={a['form-input']}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          <button type="submit" className={`${a.btn} ${a['btn-primary']}`} style={{ width: '100%' }} disabled={busy || code.length !== 6}>
            Confirmar y activar
          </button>
        </form>
      )}

      {enabled && (
        <button type="button" className={`${a.btn} ${a['btn-danger-outline']}`} style={{ width: '100%' }} onClick={handleDisable} disabled={busy}>
          Desactivar verificación en dos pasos
        </button>
      )}

      {message && (
        <p role="status" style={{ ...muted, marginTop: 14, marginBottom: 0 }}>
          {message}
        </p>
      )}
    </ModalShell>
  );
}
