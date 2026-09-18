import a from '../../styles/admin.module.css';

export default function DashboardTab({ countAlumnos, countRoutines, countBookings, sessionsThisWeek, onOpenNewStudent, onGoToBuilder }) {
  return (
    <section className={a['tab-panel']}>
      <div className={a['metrics-grid']}>
        <div className={a['metric-card']}>
          <div className={a['metric-icon-wrap']}>
            <i className="fa-solid fa-users" />
          </div>
          <div className={a['metric-info']}>
            <h4>{countAlumnos}</h4>
            <p>Alumnos Activos</p>
          </div>
        </div>
        <div className={a['metric-card']}>
          <div className={a['metric-icon-wrap']}>
            <i className="fa-solid fa-dumbbell" />
          </div>
          <div className={a['metric-info']}>
            <h4>{countRoutines}</h4>
            <p>Rutinas Asignadas</p>
          </div>
        </div>
        <div className={a['metric-card']}>
          <div className={a['metric-icon-wrap']}>
            <i className="fa-regular fa-calendar-check" />
          </div>
          <div className={a['metric-info']}>
            <h4>{countBookings}</h4>
            <p>Turnos Pendientes</p>
          </div>
        </div>
        <div className={a['metric-card']}>
          <div className={a['metric-icon-wrap']}>
            <i className="fa-solid fa-circle-check" />
          </div>
          <div className={a['metric-info']}>
            <h4>{sessionsThisWeek}</h4>
            <p>Entrenamientos Completados (7 días)</p>
          </div>
        </div>
      </div>

      <div className={a['content-box']}>
        <div className={a['box-header']}>
          <h3>
            <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--primary)' }} /> Acciones Rápidas
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button type="button" className={`${a.btn} ${a['btn-primary']}`} onClick={onOpenNewStudent}>
            <i className="fa-solid fa-user-plus" /> Registrar Nuevo Alumno
          </button>
          <button type="button" className={`${a.btn} ${a['btn-secondary']}`} onClick={onGoToBuilder}>
            <i className="fa-solid fa-dumbbell" /> Diseñar Nueva Rutina
          </button>
        </div>
      </div>
    </section>
  );
}
