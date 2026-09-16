import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext.jsx';
import AuthAlert from '../components/ui/AuthAlert.jsx';
import useDocumentMeta from '../hooks/useDocumentMeta.js';
import a from '../styles/admin.module.css';
import styles from '../styles/auth.module.css';

const emptyLogin = { email: '', password: '' };
const emptyRegister = { name: '', specialty: '', price: '50', phone: '', email: '', password: '' };

export default function Login() {
  useDocumentMeta({ title: 'Acceso Entrenadores | COACH PRO' });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [tab, setTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [alert, setAlert] = useState({ status: null, message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('tab') === 'register') setTab('register');
  }, [searchParams]);

  function switchTab(next) {
    setTab(next);
    setAlert({ status: null, message: '' });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await login(loginForm.email, loginForm.password);
    if (res.success) {
      setAlert({ status: 'success', message: `¡Bienvenido/a, ${res.coach?.displayName ?? ''}! Ingresando...` });
      const target = res.coach?.isActive ? '/admin' : '/activar';
      setTimeout(() => navigate(target), 600);
    } else {
      setAlert({ status: 'error', message: res.message });
      setSubmitting(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await register({
      name: registerForm.name,
      specialty: registerForm.specialty,
      pricePersonalizado: registerForm.price,
      phone: registerForm.phone,
      email: registerForm.email,
      password: registerForm.password,
    });
    if (res.success) {
      setAlert({ status: 'success', message: `¡Cuenta de ${res.coach.displayName} creada con éxito! Activando tu acceso...` });
      setTimeout(() => navigate('/activar'), 800);
    } else {
      setAlert({ status: 'error', message: res.message });
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginBrandHeader}>
          <Link to="/" className={a['brand-badge']}>
            <div className={a['brand-icon']}>
              <i className="fa-solid fa-bolt" />
            </div>
            <span>COACH PRO</span>
          </Link>
          <p className={styles.loginSubtitle}>Portal de Gestión para Entrenadores Personales</p>
        </div>

        <div className={styles.loginCard}>
          <div className={styles.authTabSwitch}>
            <button
              type="button"
              className={clsx(styles.authTabBtn, tab === 'login' && styles.active)}
              onClick={() => switchTab('login')}
            >
              <i className="fa-solid fa-right-to-bracket" /> Iniciar Sesión
            </button>
            <button
              type="button"
              className={clsx(styles.authTabBtn, tab === 'register' && styles.active)}
              onClick={() => switchTab('register')}
            >
              <i className="fa-solid fa-user-plus" /> Nuevo Entrenador
            </button>
          </div>

          <AuthAlert status={alert.status} message={alert.message} styles={styles} />

          {tab === 'login' ? (
            <form className={styles.authFormPanel} onSubmit={handleLogin}>
              <div className={a['form-group']} style={{ marginBottom: 14 }}>
                <label htmlFor="loginEmail">Correo Electrónico del Coach</label>
                <input
                  type="email"
                  id="loginEmail"
                  className={a['form-input']}
                  placeholder="coach@coachpro.app"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className={a['form-group']} style={{ marginBottom: 20 }}>
                <label htmlFor="loginPassword">Contraseña de Acceso</label>
                <input
                  type="password"
                  id="loginPassword"
                  className={a['form-input']}
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <button
                type="submit"
                className={clsx(a.btn, a['btn-primary'])}
                style={{ width: '100%', padding: 13 }}
                disabled={submitting}
              >
                <i className="fa-solid fa-lock-open" /> Entrar a mi Panel de Control
              </button>
            </form>
          ) : (
            <form className={styles.authFormPanel} onSubmit={handleRegister}>
              <div className={a['form-group']} style={{ marginBottom: 12 }}>
                <label htmlFor="regName">Nombre y Apellido</label>
                <input
                  type="text"
                  id="regName"
                  className={a['form-input']}
                  placeholder="Ej: Marcos Silva"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className={a['form-group']} style={{ marginBottom: 12 }}>
                <label htmlFor="regSpecialty">Especialidad de Entrenamiento</label>
                <input
                  type="text"
                  id="regSpecialty"
                  className={a['form-input']}
                  placeholder="Ej: Hipertrofia & Biomecánica de Fuerza"
                  value={registerForm.specialty}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, specialty: e.target.value }))}
                  required
                />
              </div>
              <div className={a['form-group']} style={{ marginBottom: 12 }}>
                <label htmlFor="regPrice">Tarifa Mensual de tu Servicio Personalizado ($)</label>
                <input
                  type="number"
                  id="regPrice"
                  className={a['form-input']}
                  placeholder="Ej: 50"
                  min="10"
                  max="1000"
                  value={registerForm.price}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, price: e.target.value }))}
                  required
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 3, display: 'block' }}>
                  Esto figurará en tu panel y en las fichas de presupuesto para tus alumnos.
                </small>
              </div>
              <div className={a['form-group']} style={{ marginBottom: 12 }}>
                <label htmlFor="regPhone">Teléfono de WhatsApp (para recibir alumnos)</label>
                <input
                  type="tel"
                  id="regPhone"
                  className={a['form-input']}
                  placeholder="+54 9 11 1234-5678"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, phone: e.target.value }))}
                  required
                />
              </div>
              <div className={a['form-group']} style={{ marginBottom: 12 }}>
                <label htmlFor="regEmail">Correo Electrónico</label>
                <input
                  type="email"
                  id="regEmail"
                  className={a['form-input']}
                  placeholder="tuemail@ejemplo.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className={a['form-group']} style={{ marginBottom: 20 }}>
                <label htmlFor="regPassword">Crear Contraseña</label>
                <input
                  type="password"
                  id="regPassword"
                  className={a['form-input']}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <button
                type="submit"
                className={clsx(a.btn, a['btn-primary'])}
                style={{ width: '100%', padding: 13 }}
                disabled={submitting}
              >
                <i className="fa-solid fa-check" /> Registrar mi Perfil de Entrenador
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
            <i className="fa-solid fa-arrow-left" /> Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
