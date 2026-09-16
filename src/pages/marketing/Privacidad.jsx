import useDocumentMeta from '../../hooks/useDocumentMeta.js';

export default function Privacidad() {
  useDocumentMeta({
    title: 'Política de Privacidad | COACH PRO',
    description: 'Política de Privacidad de COACH PRO: qué datos recolectamos de entrenadores y alumnos, cómo los usamos y cómo podés ejercer tus derechos.',
  });

  return (
    <section className="section" style={{ paddingTop: 110 }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: 30 }}>
          <div className="section-tag">
            <i className="fa-solid fa-shield-halved" /> Legal
          </div>
          <h1 className="section-title">
            Política de <span>Privacidad</span>
          </h1>
        </div>

        <div className="legal-content">
          <p className="legal-updated">Última actualización: 16 de septiembre de 2026.</p>

          <p>
            En <strong>COACH PRO</strong> operamos una plataforma que le permite a entrenadores personales gestionar
            sus propios alumnos, rutinas y turnos. Esta política explica qué datos recolectamos, para qué los usamos
            y qué derechos tenés sobre ellos, tanto si sos <strong>entrenador/a</strong> (usás el panel de gestión)
            como si sos <strong>alumno/a</strong> de un entrenador que usa COACH PRO.
          </p>

          <h2>1. Qué datos recolectamos</h2>
          <ul>
            <li>
              <strong>Datos de entrenadores:</strong> nombre, email, teléfono de WhatsApp, especialidad y tarifa de
              servicio, cargados al registrarte.
            </li>
            <li>
              <strong>Datos de alumnos:</strong> nombre, teléfono, email, objetivo de entrenamiento y plan contratado,
              cargados por tu entrenador en su panel para poder asignarte rutinas y turnos.
            </li>
            <li>
              <strong>Datos de contacto y consultas:</strong> nombre, teléfono y email que completás en los
              formularios de "Solicitar una Demo" o reserva de turnos, usados únicamente para redirigirte a una
              conversación de WhatsApp con nuestro equipo o con tu entrenador.
            </li>
            <li>
              <strong>Datos técnicos mínimos:</strong> tu sesión se mantiene activa mediante Firebase Authentication;
              no usamos cookies de rastreo publicitario ni analíticas de terceros.
            </li>
          </ul>

          <h2>2. Cómo almacenamos los datos</h2>
          <p>
            Los datos de cuentas, alumnos, rutinas y turnos se guardan en <strong>Firebase</strong> (Google Cloud):
            Firestore para los datos y Firebase Authentication para el acceso de cada entrenador. Cada entrenador
            accede únicamente a los alumnos y rutinas que él mismo cargó en su cuenta.
          </p>

          <h2>3. Para qué usamos tus datos</h2>
          <ul>
            <li>Crear y mantener tu cuenta de entrenador o tu ficha de alumno dentro de la plataforma.</li>
            <li>Generar tus rutinas, turnos y fichas en PDF con tu marca o la de tu entrenador.</li>
            <li>Contactarte por WhatsApp cuando iniciás una consulta, reserva o registro desde el sitio.</li>
            <li>Brindar soporte técnico cuando lo solicitás.</li>
          </ul>
          <p>No vendemos ni compartimos tus datos con terceros con fines publicitarios.</p>

          <h2>4. Con quién compartimos datos</h2>
          <p>
            Tus datos de alumno son visibles únicamente para el entrenador/a que te dio de alta en su panel. Como
            entrenador/a, tus datos de contacto y tarifa son visibles para tus propios alumnos, a quienes vos mismo
            invitás. El equipo de COACH PRO puede acceder a datos técnicos para brindar soporte cuando lo solicitás
            explícitamente.
          </p>

          <h2>5. Tus derechos</h2>
          <p>
            Podés solicitar acceso, corrección o eliminación de tus datos en cualquier momento escribiéndonos a{' '}
            <a href="mailto:hola@coachpro.com">hola@coachpro.com</a> o por WhatsApp. Si sos alumno/a, también podés
            pedirle directamente a tu entrenador/a que corrija o elimine tu ficha desde su panel.
          </p>

          <h2>6. Retención de datos</h2>
          <p>
            Conservamos los datos mientras la cuenta de entrenador/a permanezca activa. Si una cuenta se da de baja,
            los datos asociados a esa cuenta (alumnos, rutinas, turnos) se eliminan dentro de un plazo razonable a
            pedido del titular.
          </p>

          <h2>7. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política a medida que la plataforma evoluciona. Vamos a reflejar cualquier
            cambio importante actualizando la fecha al inicio de esta página.
          </p>

          <h2>8. Contacto</h2>
          <p>
            Ante cualquier duda sobre esta política, escribinos a <a href="mailto:hola@coachpro.com">hola@coachpro.com</a>{' '}
            o por{' '}
            <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
