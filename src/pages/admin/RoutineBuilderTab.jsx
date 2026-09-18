import a from '../../styles/admin.module.css';
import ExerciseAutocomplete from './ExerciseAutocomplete.jsx';

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
  onOpenExercisePicker,
  onDeleteExercise,
  onApplyExerciseTemplate,
  exerciseSuggestions,
  onSave,
  onPreview,
  onExportPdf,
  onSend,
  onShowHistory,
  saving,
  autosaveStatus,
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
            <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={onShowHistory}>
              <i className="fa-solid fa-clock-rotate-left" /> Historial
            </button>
            <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={onPreview}>
              <i className="fa-solid fa-eye" /> Previsualizar Alumno
            </button>
            <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={onExportPdf}>
              <i className={`fa-solid fa-file-pdf ${a['text-danger']}`} /> Ficha PDF / Imprimir
            </button>
            <button type="button" className={`${a.btn} ${a['btn-whatsapp']} ${a['btn-sm']}`} onClick={onSend}>
              <i className="fa-brands fa-whatsapp" /> Enviar Rutina
            </button>
          </div>
        </div>

        <div className={a['builder-topbar']}>
          <div className={a['form-group']} style={{ flex: '0 1 240px' }}>
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

          <div className={a['form-group']} style={{ flex: '1 1 260px' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
            <button type="button" className={`${a.btn} ${a['btn-primary']}`} onClick={onSave} disabled={saving}>
              <i className="fa-solid fa-floppy-disk" /> Guardar Rutina
            </button>
            {autosaveStatus === 'saving' && (
              <span className={a['autosave-status']}>
                <i className="fa-solid fa-circle-notch fa-spin" aria-hidden="true" /> Guardando...
              </span>
            )}
            {autosaveStatus === 'saved' && (
              <span className={`${a['autosave-status']} ${a.saved}`}>
                <i className="fa-solid fa-check" aria-hidden="true" /> Guardado automáticamente
              </span>
            )}
          </div>
        </div>

        <div className={a['form-group']} style={{ marginBottom: 20 }}>
          <label htmlFor="routineNotesInput">Recomendación General del Coach</label>
          <textarea
            id="routineNotesInput"
            className={a['form-input']}
            rows={2}
            placeholder="Ej: Controlar la cadencia en la fase excéntrica y registrar cargas."
            value={draft?.notes ?? ''}
            onChange={(e) => onNotesChange(e.target.value)}
          />
        </div>

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10, flexWrap: 'wrap' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-white)' }}>Ejercicios del Día</h4>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className={`${a.btn} ${a['btn-primary']} ${a['btn-sm']}`} onClick={onOpenExercisePicker}>
              <i className="fa-solid fa-list-check" /> Elegir de Biblioteca
            </button>
            <button type="button" className={`${a.btn} ${a['btn-secondary']} ${a['btn-sm']}`} onClick={onAddExercise}>
              <i className="fa-solid fa-plus" /> Ejercicio en Blanco
            </button>
          </div>
        </div>

        <div className={a['exercise-legend']}>
          <strong>¿Qué significa cada campo?</strong>
          <div className={a['legend-row']}>
            <strong>Series / Reps</strong> — cuántas veces se repite el ejercicio y cuántas repeticiones por serie.
          </div>
          <div className={a['legend-row']}>
            <strong>RIR</strong> — Repeticiones en Reserva: cuántas repeticiones más podría hacer el alumno antes de
            fallar. RIR 0 = al fallo muscular, RIR 2 = le quedan 2 repeticiones "en el tanque".
          </div>
          <div className={a['legend-row']}>
            <strong>Descanso</strong> — pausa sugerida entre series (el alumno también puede elegir otro tiempo desde
            su portal).
          </div>
          <div className={a['legend-row']}>
            <strong>Nota técnica</strong> — indicación biomecánica breve para ejecutar bien el ejercicio.
          </div>
        </div>

        {exercises.length > 0 && (
          <div className={`${a['exercise-edit-row']} ${a['exercise-edit-row-header']}`} aria-hidden="true">
            <span>Ejercicio</span>
            <span>Series</span>
            <span>Reps</span>
            <span>RIR</span>
            <span>Descanso</span>
            <span>Nota Técnica</span>
            <span />
          </div>
        )}

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
                Usá "Elegir de Biblioteca" para sumar varios de una y ajustar, o "Ejercicio en Blanco" para uno nuevo.
              </p>
            </div>
          ) : (
            exercises.map((ex, index) => (
              <div className={a['exercise-edit-row']} key={index}>
                <ExerciseAutocomplete
                  value={ex.name || ''}
                  suggestions={exerciseSuggestions}
                  ariaLabel={`Nombre del ejercicio ${index + 1}`}
                  onChangeName={(value) => onExerciseChange(index, 'name', value)}
                  onSelectSuggestion={({ category: _category, ...template }) => onApplyExerciseTemplate(index, template)}
                />
                <input
                  type="text"
                  className={a['form-input']}
                  value={ex.sets || ''}
                  placeholder="Ej: 4"
                  aria-label={`Series del ejercicio ${index + 1}`}
                  onChange={(e) => onExerciseChange(index, 'sets', e.target.value)}
                />
                <input
                  type="text"
                  className={a['form-input']}
                  value={ex.reps || ''}
                  placeholder="Ej: 8-10"
                  aria-label={`Repeticiones del ejercicio ${index + 1}`}
                  onChange={(e) => onExerciseChange(index, 'reps', e.target.value)}
                />
                <input
                  type="text"
                  className={a['form-input']}
                  value={ex.rir || ''}
                  placeholder="Ej: RIR 2"
                  aria-label={`RIR del ejercicio ${index + 1}`}
                  onChange={(e) => onExerciseChange(index, 'rir', e.target.value)}
                />
                <input
                  type="text"
                  className={a['form-input']}
                  value={ex.rest || ''}
                  placeholder="Ej: 90s"
                  aria-label={`Descanso del ejercicio ${index + 1}`}
                  onChange={(e) => onExerciseChange(index, 'rest', e.target.value)}
                />
                <input
                  type="text"
                  className={a['form-input']}
                  value={ex.cue || ''}
                  placeholder="Ej: Retracción escapular"
                  aria-label={`Nota técnica del ejercicio ${index + 1}`}
                  onChange={(e) => onExerciseChange(index, 'cue', e.target.value)}
                />
                <button
                  type="button"
                  className={a['delete-row-btn']}
                  title="Eliminar Ejercicio"
                  aria-label={`Eliminar ejercicio ${index + 1}`}
                  onClick={() => onDeleteExercise(index)}
                >
                  <i className="fa-solid fa-trash-can" aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
