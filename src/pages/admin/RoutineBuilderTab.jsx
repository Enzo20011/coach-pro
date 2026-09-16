import a from '../../styles/admin.module.css';

const DAY_KEYS = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6'];

export default function RoutineBuilderTab({
  studentId,
  students,
  draft,
  activeDay,
  onStudentChange,
  onDayChange,
  onTitleChange,
  onNotesChange,
  onDayNameChange,
  onExerciseChange,
  onAddExercise,
  onDeleteExercise,
  onSave,
  onPreview,
  onExportPdf,
  onSend,
  saving,
}) {
  const dayData = draft?.days?.[activeDay];
  const exercises = dayData?.exercises ?? [];

  return (
    <section className={a['tab-panel']}>
      <div className={a['content-box']}>
        <div className={a['box-header']}>
          <h3>
            <i className="fa-solid fa-dumbbell" style={{ color: 'var(--primary)' }} /> Constructor & Asignador de Rutinas
          </h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={onPreview}>
              <i className="fa-solid fa-eye" /> Previsualizar Alumno
            </button>
            <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={onExportPdf}>
              <i className="fa-solid fa-file-pdf" style={{ color: '#ff5e57' }} /> Ficha PDF / Imprimir
            </button>
            <button type="button" className={`${a.btn} ${a['btn-whatsapp']} ${a['btn-sm']}`} onClick={onSend}>
              <i className="fa-brands fa-whatsapp" /> Enviar Rutina
            </button>
          </div>
        </div>

        <div className={a['builder-grid']}>
          <div className={a['builder-sidebar']}>
            <div className={a['form-group']}>
              <label htmlFor="routineStudentSelect">Alumno Asignado</label>
              <select
                id="routineStudentSelect"
                className={a['form-select']}
                value={studentId ?? ''}
                onChange={(e) => onStudentChange(e.target.value)}
              >
                {students.length === 0 ? (
                  <option value="">Sin alumnos registrados</option>
                ) : (
                  students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.plan})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className={a['form-group']}>
              <label htmlFor="routineTitleInput">Nombre de la Fase / Rutina</label>
              <input
                type="text"
                id="routineTitleInput"
                className={a['form-input']}
                placeholder="Ej: Fase 1: Hipertrofia & Fuerza"
                value={draft?.title ?? ''}
                onChange={(e) => onTitleChange(e.target.value)}
              />
            </div>

            <div className={a['form-group']}>
              <label htmlFor="routineNotesInput">Recomendación General del Coach</label>
              <textarea
                id="routineNotesInput"
                className={a['form-input']}
                rows={4}
                placeholder="Ej: Controlar la cadencia en la fase excéntrica y registrar cargas."
                value={draft?.notes ?? ''}
                onChange={(e) => onNotesChange(e.target.value)}
              />
            </div>

            <button type="button" className={`${a.btn} ${a['btn-primary']}`} style={{ marginTop: 10 }} onClick={onSave} disabled={saving}>
              <i className="fa-solid fa-floppy-disk" /> Guardar Rutina
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 10 }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: 0 }}>
                Días de Rutina (Máximo 6 Días por Semana)
              </label>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--primary)',
                  background: 'rgba(0, 255, 135, 0.1)',
                  border: '1px solid var(--border-accent)',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontWeight: 700,
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                1 a 6 Días
              </span>
            </div>

            <div className={a['day-selector-pills']} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {DAY_KEYS.map((key, i) => (
                <button
                  type="button"
                  key={key}
                  className={`${a['day-pill-btn']} ${activeDay === key ? a.active : ''}`}
                  onClick={() => onDayChange(key)}
                >
                  Día {i + 1}
                </button>
              ))}
            </div>

            <div className={a['form-group']} style={{ marginBottom: 14 }}>
              <label htmlFor="currentDayNameInput" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Enfoque / Nombre del Día Seleccionado:
              </label>
              <input
                type="text"
                id="currentDayNameInput"
                className={a['form-input']}
                placeholder="Ej: Día 1: Empujes de Pecho, Hombro & Tríceps"
                value={dayData?.name ?? ''}
                onChange={(e) => onDayNameChange(activeDay, e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-white)' }}>Ejercicios del Día</h4>
              <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={onAddExercise}>
                <i className="fa-solid fa-plus" /> Añadir Ejercicio
              </button>
            </div>

            <div className={a['exercises-editor-list']}>
              {exercises.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 24,
                    color: 'var(--text-muted)',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 12,
                  }}
                >
                  <p style={{ fontSize: '0.88rem' }}>No hay ejercicios agregados a este día todavía.</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
                    Presiona el botón "+ Añadir Ejercicio" para diagramar la sesión.
                  </p>
                </div>
              ) : (
                exercises.map((ex, index) => (
                  <div className={a['exercise-edit-row']} key={index}>
                    <input
                      type="text"
                      className={a['form-input']}
                      value={ex.name || ''}
                      placeholder="Nombre del Ejercicio"
                      onChange={(e) => onExerciseChange(index, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      className={a['form-input']}
                      value={ex.sets || ''}
                      placeholder="Series (ej: 4)"
                      onChange={(e) => onExerciseChange(index, 'sets', e.target.value)}
                    />
                    <input
                      type="text"
                      className={a['form-input']}
                      value={ex.reps || ''}
                      placeholder="Reps (ej: 8-10)"
                      onChange={(e) => onExerciseChange(index, 'reps', e.target.value)}
                    />
                    <input
                      type="text"
                      className={a['form-input']}
                      value={ex.rir || ''}
                      placeholder="RIR (ej: RIR 2)"
                      onChange={(e) => onExerciseChange(index, 'rir', e.target.value)}
                    />
                    <input
                      type="text"
                      className={a['form-input']}
                      value={ex.cue || ''}
                      placeholder="Nota técnica (ej: Retracción escapular)"
                      onChange={(e) => onExerciseChange(index, 'cue', e.target.value)}
                    />
                    <button
                      type="button"
                      className={a['delete-row-btn']}
                      title="Eliminar Ejercicio"
                      onClick={() => onDeleteExercise(index)}
                    >
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
