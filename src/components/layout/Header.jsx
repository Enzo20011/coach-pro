import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useScrollHeader from '../../hooks/useScrollHeader.js';

const NAV_LINKS = [
  { to: '/', label: 'Inicio', icon: 'fa-solid fa-house' },
  { to: '/planes', label: 'Sumate', icon: 'fa-solid fa-rocket' },
  { to: '/rutina-demo', label: 'App del Alumno', icon: 'fa-solid fa-mobile-screen-button' },
  { to: '/faq', label: 'FAQ', icon: 'fa-solid fa-circle-question' },
];

export default function Header() {
  const { scrolled } = useScrollHeader();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="container nav-container">
          <NavLink to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <span className="logo-badge">
              <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden="true"><rect x="3" y="10" width="4" height="12" rx="1" /><rect x="7" y="7" width="4" height="18" rx="1" /><rect x="11" y="14.5" width="10" height="3" /><rect x="21" y="7" width="4" height="18" rx="1" /><rect x="25" y="10" width="4" height="12" rx="1" /></svg>
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
