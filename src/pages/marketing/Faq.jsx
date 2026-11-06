import { faqItems } from '../../data/faqItems.js';
import { platformWhatsAppLink } from '../../lib/whatsapp.js';
import FaqAccordion from '../../components/marketing/FaqAccordion.jsx';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';

export default function Faq() {
  useDocumentMeta({
    title: 'Preguntas Frecuentes | COACH PRO',
    description: 'Lo que suelen preguntar los entrenadores antes de empezar.',
  });

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Preguntas frecuentes
          </h2>
          <p className="section-desc">Lo que suelen preguntar los entrenadores antes de empezar.</p>
        </div>

        <div style={{ maxWidth: 780, margin: '0 auto 40px auto' }}>
          <FaqAccordion items={faqItems} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.95rem' }}>
            ¿Tenés otra duda sobre la plataforma? Escribinos directamente por WhatsApp.
          </p>
          <a
            href={platformWhatsAppLink('Hola! Tengo una consulta sobre COACH PRO.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <i className="fa-brands fa-whatsapp" /> Consultar Ahora
          </a>
        </div>
      </div>
    </section>
  );
}
