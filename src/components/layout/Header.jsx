import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useScrollHeader from '../../hooks/useScrollHeader.js';
import ScrollProgressBar from './ScrollProgressBar.jsx';

const NAV_LINKS = [
  { to: '/', label: 'Inicio', icon: 'fa-solid fa-house' },
  { to: '/planes', label: 'Sumate', icon: 'fa-solid fa-rocket' },
  { to: '/rutina-demo', label: 'App del Alumno', icon: 'fa-solid fa-mobile-screen-button' },
  { to: '/turnos', label: 'Agenda Online', icon: 'fa-regular fa-calendar-days' },
  { to: '/transformaciones', label: 'Casos de Éxito', icon: 'fa-solid fa-trophy' },
  { to: '/faq', label: 'FAQ', icon: 'fa-solid fa-circle-question' },
];

export default function Header() {
  const { scrolled, progress } = useScrollHeader();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <ScrollProgressBar progress={progress} />
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-container">
          <NavLink to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-badge">
              <i className="fa-solid fa-bolt" />
            </span>
            <span>COACH</span> PRO
          </NavLink>

          <nav>
            <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  >
                    <i className={link.icon} /> {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-actions">
            <NavLink
              to="/admin"
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'rgba(0, 255, 135, 0.4)', color: 'var(--primary)' }}
              title="Panel Coach"
            >
              <i className="fa-solid fa-lock" /> Ingresar
            </NavLink>
            <NavLink className="btn btn-primary btn-sm" to="/login?tab=register">
              <i className="fa-solid fa-fire" /> Empezar
            </NavLink>
            <button
              className="menu-toggle"
              aria-label="Abrir menú"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <i className={menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
