import { Link } from 'react-router-dom';
import { platformWhatsAppLink } from '../../lib/whatsapp.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link className="logo" to="/">
              <span className="logo-badge">
                <i className="fa-solid fa-bolt" />
              </span>
              <span>COACH</span> PRO
            </Link>
            <p>
              La plataforma todo-en-uno para entrenadores personales: gestioná alumnos y rutinas con un panel
              profesional a tu marca.
            </p>
            <div className="footer-socials">
              <a
                href={platformWhatsAppLink('Hola! Quiero conocer más sobre COACH PRO para mi negocio de entrenador.')}
                className="social-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribinos por WhatsApp"
              >
                <i className="fa-brands fa-whatsapp" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navegación</h4>
            <div className="footer-links">
              <Link to="/">Inicio</Link>
              <Link to="/planes">Sumate a COACH PRO</Link>
              <Link to="/rutina-demo">App del Alumno</Link>
              <Link to="/transformaciones">Casos de Éxito</Link>
              <Link to="/admin" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                <i className="fa-solid fa-lock" /> Acceso Panel Coach
              </Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Para tu Negocio</h4>
            <div className="footer-links">
              <Link to="/admin">Gestión de Alumnos</Link>
              <Link to="/rutina-demo">Constructor de Rutinas</Link>
              <Link to="/planes">Fichas PDF Profesionales</Link>
              <Link to="/transformaciones">Casos de Éxito</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Contacto Directo</h4>
            <div className="footer-links">
              <a href="tel:+5491100000000">
                <i className="fa-solid fa-phone" /> +54 9 11 0000-0000
              </a>
              <a href="mailto:hola@coachpro.com">
                <i className="fa-solid fa-envelope" /> hola@coachpro.com
              </a>
              <span className="footer-info-row">
                <i className="fa-solid fa-headset" /> Soporte 100% Online
              </span>
              <span className="footer-info-row">
                <i className="fa-solid fa-clock" /> Lun a Vie: 09:00 a 19:00 hs
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 COACH PRO. Todos los derechos reservados.</div>
          <div className="footer-legal">
            <Link to="/privacidad">Privacidad</Link>
            <Link to="/terminos">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
