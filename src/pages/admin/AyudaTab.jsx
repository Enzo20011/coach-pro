import a from '../../styles/admin.module.css';

function Section({ icon, title, children }) {
  return (
    <div className={a['help-section']}>
      <div className={a['box-header']}>
        <h3>
          <i className={icon} style={{ color: 'var(--primary)' }} /> {title}
        </h3>
      </div>
      <div className={a['help-body']}>{children}</div>
    </div>
  );
}

export default function AyudaTab() {
  return (
    <section className={a['tab-panel']}>
      <div className={a['help-intro']}>
        <i className="fa-solid fa-circle-info" aria-hidden="true" />
        <div>
          <strong>Manual rápido de COACH PRO</strong>
          <p>Guía de cada pantalla del panel — volvé acá cuando tengas dudas de cómo funciona algo.</p>
        </div>
      </div>

      <Section icon="fa-solid fa-chart-pie" title="Dashboard">
        <p>
          Es la pantalla de inicio. Muestra 4 números clave: cuántos alumnos activos tenés, cuántas rutinas
          asignaste, cuántos turnos están pendientes de confirmar, y cuántos entrenamientos completaron tus alumnos
          en los últimos 7 días. Desde acá también podés registrar un alumno nuevo o ir directo al constructor de
          rutinas.
        </p>
      </Section>

      <Section icon="fa-solid fa-users" title="Alumnos">
        <p>Acá está el listado completo de tus alumnos. Por cada uno podés:</p>
        <ul>
          <li>
            <strong>Rutina</strong> — abre el constructor con la rutina de ese alumno para editarla.
          </li>
          <li>
            <strong>PDF</strong> — genera la ficha imprimible con membrete para ese alumno.
          </li>
          <li>
            <strong>Enviar</strong> — te da el link directo a su portal (para copiarlo o mandarlo por WhatsApp con un
            mensaje ya armado).
          </li>
          <li>
            <strong>Ver como Alumno</strong> (ícono de flecha) — abre el portal tal cual lo ve tu alumno, en una
            pestaña nueva.
          </li>
        </ul>
        <p>
          La columna <strong>"Última Actividad"</strong> te dice hace cuánto ese alumno marcó un entrenamiento como
          completado — sirve para detectar quién dejó de entrenar.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
          El botón <strong>"Nuevo Alumno"</strong> te va a pedir nombre, WhatsApp, email, plan y objetivo. Al crearlo,
          se genera automáticamente una rutina inicial de 3 días que después podés editar libremente.
        </p>
      </Section>

      <Section icon="fa-solid fa-dumbbell" title="Crear Rutinas">
        <p>
          Elegí el alumno arriba a la izquierda, después el día (Día 1 a Día 6) y cargá los ejercicios de ese día.
        </p>
        <p style={{ fontWeight: 700, color: 'var(--text-white)', marginTop: 10 }}>Qué significa cada campo:</p>
        <ul>
          <li>
            <strong>Series / Reps</strong> — cuántas veces se repite el ejercicio y cuántas repeticiones por serie.
          </li>
          <li>
            <strong>RIR</strong> (Repeticiones en Reserva) — cuántas repeticiones más podría hacer el alumno antes de
            fallar. RIR 0 = al fallo muscular, RIR 2 = le quedan 2 repeticiones "en el tanque".
          </li>
          <li>
            <strong>Descanso</strong> — pausa sugerida entre series. El alumno puede elegir otro tiempo desde su
            portal si quiere.
          </li>
          <li>
            <strong>Nota técnica</strong> — una indicación biomecánica breve que el alumno va a ver junto al
            ejercicio.
          </li>
        </ul>
        <p>
          Al escribir el nombre de un ejercicio te van a aparecer <strong>sugerencias</strong> de un catálogo
          organizado por grupo muscular (podés buscar por nombre o por parte del cuerpo, ej. "hombro"). Elegir una
          sugerencia completa todos los campos automáticamente — después solo ajustás lo que cambie para ese alumno.
          Todo ejercicio que uses queda guardado para la próxima vez.
        </p>
        <p>
          El botón <strong>"Historial"</strong> guarda automáticamente la versión anterior de la rutina cada vez que
          guardás cambios sobre una ya existente, y te deja restaurar cualquier versión previa.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
          No te olvides de tocar <strong>"Guardar Rutina"</strong> — los cambios no se guardan solos.
        </p>
      </Section>

      <Section icon="fa-regular fa-calendar-check" title="Turnos Online">
        <p>
          Tenés un link propio de reservas (<code>/reservar?coach=...</code>) que podés compartir con quien quiera
          agendar una sesión con vos. Cada solicitud aparece acá con estado <strong>Pendiente</strong>.
        </p>
        <p>
          Podés <strong>Confirmar</strong> o <strong>Cancelar</strong> cada turno. Si cancelás uno, ese mismo horario
          queda libre de nuevo para que otra persona lo pueda reservar.
        </p>
      </Section>

      <Section icon="fa-solid fa-mobile-screen" title="Lo que ve tu alumno">
        <p>Tu alumno entra desde el link que le compartiste (sin necesidad de crear cuenta ni contraseña) y puede:</p>
        <ul>
          <li>Ver la rutina del día y tildar cada serie a medida que la hace.</li>
          <li>Usar el temporizador de descanso con el tiempo que vos sugeriste para cada ejercicio (y sumarle +30s si necesita más).</li>
          <li>Ver su racha de días seguidos entrenando y cuántos días entrenó esta semana.</li>
          <li>Descargar/imprimir su ficha y avisarte por WhatsApp cuando termina.</li>
        </ul>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
          El progreso que marca tu alumno se guarda solo — si recarga la página o vuelve otro día, no se pierde.
        </p>
      </Section>

      <Section icon="fa-solid fa-circle-question" title="Preguntas frecuentes">
        <p>
          <strong>¿Mi alumno necesita contraseña?</strong> No. Accede con un link único que vos le compartís.
        </p>
        <p>
          <strong>¿Puedo tener varias rutinas guardadas por alumno?</strong> Hay una rutina activa por alumno, pero
          cada vez que la reemplazás la anterior queda archivada en "Historial" dentro del constructor.
        </p>
        <p>
          <strong>¿Cómo cambio mi tarifa de personalizado?</strong> Tocá el lápiz al lado de "Personalizado: AR$
          50.000/mes" arriba de todo, en la barra superior.
        </p>
      </Section>
    </section>
  );
}
