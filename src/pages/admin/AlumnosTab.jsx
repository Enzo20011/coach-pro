import a from '../../styles/admin.module.css';

export default function AlumnosTab({ alumnos, coach, onOpenNewStudent, onEditRoutine, onExportPdf, onSendWhatsApp }) {
  return (
    <section className={a['tab-panel']}>
      <div className={a['content-box']}>
        <div className={a['box-header']}>
          <h3>
            <i className="fa-solid fa-users" style={{ color: 'var(--primary)' }} /> Directorio de Alumnos
          </h3>
          <button type="button" className={`${a.btn} ${a['btn-primary']} ${a['btn-sm']}`} onClick={onOpenNewStudent}>
            <i className="fa-solid fa-plus" /> Nuevo Alumno
          </button>
        </div>

        <div className={a['data-table-wrap']}>
          <table className={a['data-table']}>
            <thead>
              <tr>
                <th>Alumno & Objetivo</th>
                <th>Plan Contratado</th>
                <th>WhatsApp</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
                    <i
                      className="fa-solid fa-user-clock"
                      style={{ fontSize: '1.8rem', marginBottom: 8, display: 'block', color: 'var(--primary)' }}
                    />
                    Aún no tienes alumnos registrados en tu cuenta de {coach.displayName}.
                    <br />
                    <button
                      type="button"
                      className={`${a.btn} ${a['btn-primary']} ${a['btn-sm']}`}
                      style={{ marginTop: 12 }}
                      onClick={onOpenNewStudent}
                    >
                      <i className="fa-solid fa-plus" /> Registrar mi Primer Alumno
                    </button>
                  </td>
                </tr>
              ) : (
                alumnos.map((al) => (
                  <tr key={al.id}>
                    <td>
                      <div className={a['student-meta']}>
                        <img
                          src={al.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop'}
                          alt={al.name}
                          className={a['student-avatar']}
                        />
                        <div>
                          <span className={a['student-name']}>{al.name}</span>
                          <span className={a['student-goal']}>{al.goal}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-white)' }}>{al.plan}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary)' }}>
                        Personalizado ${coach.pricePersonalizado}/mes
                      </div>
                    </td>
                    <td>{al.phone}</td>
                    <td>
                      <span className={`${a['status-badge']} ${a.active}`}>{al.status}</span>
                    </td>
                    <td>
                      <div className={a['table-actions']}>
                        <button
                          className={`${a.btn} ${a['btn-primary']} ${a['btn-sm']}`}
                          title="Editar o Crear Rutina"
                          onClick={() => onEditRoutine(al.id)}
                        >
                          <i className="fa-solid fa-dumbbell" /> Rutina
                        </button>
                        <button
                          className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`}
                          title="Descargar Ficha PDF / Imprimir"
                          onClick={() => onExportPdf(al.id)}
                        >
                          <i className="fa-solid fa-file-pdf" style={{ color: '#ff5e57' }} /> PDF
                        </button>
                        <button
                          className={`${a.btn} ${a['btn-whatsapp']} ${a['btn-sm']}`}
                          title="Enviar por WhatsApp"
                          onClick={() => onSendWhatsApp(al.id)}
                        >
                          <i className="fa-brands fa-whatsapp" /> Enviar
                        </button>
                        <a
                          href={`/alumno?id=${al.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`}
                          title="Ver como Alumno"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
