import { Link } from 'react-router-dom';
import a from '../../styles/admin.module.css';

export default function AdminNavbar({ coach, onEditRate, onLogout }) {
  return (
    <header className={a['admin-navbar']}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link to="/" className={a['brand-badge']}>
          <div className={a['brand-icon']}>
            <i className="fa-solid fa-bolt" />
          </div>
          <span>COACH PRO</span>
        </Link>
        <span className={a['brand-tag']}>Panel de Entrenador</span>
      </div>

      <div className={a['nav-user-actions']} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div className={a['coach-rate-badge']} title="Tu tarifa mensual actual para entrenamiento personalizado">
          <i className="fa-solid fa-tag" style={{ color: 'var(--primary)' }} />
          <span>
            Personalizado: <strong>${coach.pricePersonalizado ?? 49}</strong>/mes
          </span>
          <button type="button" className={a['btn-edit-rate']} title="Cambiar precio de tu servicio personalizado" onClick={onEditRate}>
            <i className="fa-solid fa-pen" />
          </button>
        </div>

        <div className={a['user-profile-badge']}>
          <img
            src={coach.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=150&auto=format&fit=crop'}
            alt="Coach Avatar"
            className={a['user-avatar']}
          />
          <div>
            <span>{coach.displayName || `Coach ${coach.name?.split(' ')[0] ?? ''}`}</span>
            <small style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              {coach.specialty || 'Preparador Físico'}
            </small>
          </div>
        </div>

        <Link to="/" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} title="Ir a la web principal">
          <i className="fa-solid fa-globe" /> Ver Web
        </Link>

        <button
          type="button"
          className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`}
          title="Cerrar Sesión de Entrenador"
          style={{ borderColor: 'rgba(255, 94, 87, 0.4)', color: '#ff5e57' }}
          onClick={onLogout}
        >
          <i className="fa-solid fa-right-from-bracket" /> Salir
        </button>
      </div>
    </header>
  );
}
