import { Link } from 'react-router-dom';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';

export default function NotFound() {
  useDocumentMeta({ title: 'Página no encontrada | COACH PRO' });

  return (
    <section className="not-found-section">
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="section-tag" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
          <i className="fa-solid fa-triangle-exclamation" /> Error 404
        </div>
        <div className="not-found-code">404</div>
        <h1 className="section-title" style={{ marginBottom: 14 }}>
          Esta página se perdió la serie
        </h1>
        <p className="section-desc" style={{ margin: '0 auto' }}>
          El enlace que seguiste puede estar roto, o la página cambió de dirección. Revisá la URL o volvé a un lugar
          conocido.
        </p>
        <div className="not-found-links" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-primary" to="/">
            <i className="fa-solid fa-house" /> Volver al Inicio
          </Link>
          <Link className="btn btn-secondary" to="/planes">
            <i className="fa-solid fa-rocket" /> Ver Planes
          </Link>
          <Link className="btn btn-secondary" to="/faq">
            <i className="fa-solid fa-circle-question" /> Ir a FAQ
          </Link>
        </div>
      </div>
    </section>
  );
}
