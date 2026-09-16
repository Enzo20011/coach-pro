import { Link } from 'react-router-dom';
import { platformWhatsAppLink } from '../../lib/whatsapp.js';

export default function MobileStickyBar() {
  return (
    <div className="mobile-sticky-bar">
      <div className="sticky-bar-grid">
        <Link className="sticky-action-btn primary" to="/planes">
          <i className="fa-solid fa-bolt" /> Sumate
        </Link>
        <Link className="sticky-action-btn secondary" to="/turnos">
          <i className="fa-regular fa-calendar-check" /> Agenda
        </Link>
        <a
          href={platformWhatsAppLink('Hola! Quiero información sobre COACH PRO para entrenadores')}
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-action-btn whatsapp"
        >
          <i className="fa-brands fa-whatsapp" /> Chat
        </a>
      </div>
    </div>
  );
}
