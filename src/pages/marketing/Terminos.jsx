import { Link } from 'react-router-dom';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';

export default function Terminos() {
  useDocumentMeta({
    title: 'Términos y Condiciones | COACH PRO',
    description: 'Términos y Condiciones de uso de COACH PRO, la plataforma para entrenadores personales.',
  });

  return (
    <section className="section" style={{ paddingTop: 110 }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: 30 }}>
          <div className="section-tag">
            <i className="fa-solid fa-file-signature" /> Legal
          </div>
          <h1 className="section-title">
            Términos y <span>Condiciones</span>
          </h1>
        </div>

        <div className="legal-content">
          <p className="legal-updated">Última actualización: 16 de septiembre de 2026.</p>

          <p>
            Estos Términos y Condiciones regulan el uso de <strong>COACH PRO</strong>, una plataforma que permite a
            entrenadores personales gestionar alumnos, diseñar rutinas y coordinar turnos. Al registrarte como
            entrenador/a o al usar un panel de alumno provisto por tu entrenador, aceptás estos términos.
          </p>

          <h2>1. Quién puede usar COACH PRO</h2>
          <p>
            El registro como entrenador/a está pensado para profesionales o aspirantes a entrenador personal mayores
            de 18 años. Los alumnos acceden a su portal a través de un enlace personal que les comparte su propio
            entrenador/a, sin necesidad de crear una cuenta propia.
          </p>

          <h2>2. Cuenta de entrenador y activación</h2>
          <p>
            Al registrarte, tu cuenta queda en estado <strong>pendiente de activación</strong>. Para habilitar el uso
            completo del panel, coordinamos la activación manualmente por WhatsApp. No procesamos pagos con tarjeta
            dentro del sitio: el cobro y la activación se coordinan directamente con nuestro equipo.
          </p>

          <h2>3. Uso aceptable</h2>
          <ul>
            <li>Usar la plataforma únicamente para gestionar tu propio negocio de entrenamiento y a tus propios alumnos.</li>
            <li>No cargar datos de personas que no hayan aceptado ser tus alumnos dentro de la plataforma.</li>
            <li>No intentar acceder a cuentas, alumnos o rutinas de otros entrenadores.</li>
            <li>No usar la plataforma para enviar spam o contenido no solicitado a través de los enlaces de WhatsApp generados.</li>
          </ul>

          <h2>4. Contenido y responsabilidad de las rutinas</h2>
          <p>
            Las rutinas, cargas, series y recomendaciones técnicas cargadas en la plataforma son elaboradas y
            asignadas exclusivamente por cada entrenador/a bajo su propio criterio profesional.{' '}
            <strong>COACH PRO es una herramienta de gestión y no reemplaza el criterio médico ni deportivo del
            entrenador/a</strong>, quien es responsable de evaluar la aptitud física de sus alumnos antes de indicar
            cualquier ejercicio.
          </p>

          <h2>5. Propiedad de los datos</h2>
          <p>
            Los datos de alumnos, rutinas y turnos que cargás pertenecen a vos como entrenador/a. Podés solicitar la
            exportación o eliminación completa de tu información en cualquier momento, según se detalla en nuestra{' '}
            <Link to="/privacidad">Política de Privacidad</Link>.
          </p>

          <h2>6. Disponibilidad del servicio</h2>
          <p>
            Trabajamos para mantener la plataforma disponible de forma continua, pero al depender de servicios de
            terceros (hosting, base de datos en la nube), no garantizamos disponibilidad ininterrumpida al 100%. Ante
            una caída del servicio, priorizamos restablecerlo lo antes posible.
          </p>

          <h2>7. Suspensión o baja de cuenta</h2>
          <p>
            Podemos suspender una cuenta que incumpla el punto 3 (uso aceptable) previo aviso, salvo casos de uso
            indebido evidente. Cualquier entrenador/a puede solicitar la baja de su cuenta en cualquier momento
            escribiéndonos por WhatsApp o email.
          </p>

          <h2>8. Cambios a estos términos</h2>
          <p>
            Podemos actualizar estos Términos y Condiciones a medida que la plataforma incorpore nuevas funciones.
            Los cambios relevantes se reflejan actualizando la fecha al inicio de esta página.
          </p>

          <h2>9. Ley aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia se resolverá en
            los tribunales ordinarios competentes.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Ante cualquier consulta sobre estos términos, escribinos a <a href="mailto:hola@coachpro.com">hola@coachpro.com</a>{' '}
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
