import { Link } from 'react-router-dom';
import { featuredStory, transformationCards, reviews } from '../../data/transformationsContent.js';
import useDocumentMeta from '../../hooks/useDocumentMeta.js';

export default function Transformaciones() {
  useDocumentMeta({
    title: 'Casos de Éxito | COACH PRO',
    description: 'Resultados reales de entrenadores que dejaron las planillas sueltas y profesionalizaron su negocio con COACH PRO.',
  });

  return (
    <>
      <section className="section slider-section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <i className="fa-solid fa-trophy" /> Casos de Éxito
            </div>
            <h2 className="section-title">
              Entrenadores que ya <span>crecieron con COACH PRO</span>
            </h2>
            <p className="section-desc">
              Estos son resultados reales de entrenadores que dejaron las planillas sueltas y profesionalizaron su
              negocio con la plataforma.
            </p>
          </div>

          <div className="comparison-wrapper">
            <div className="before-after-box">
              <img src={featuredStory.image} alt={featuredStory.imageAlt} />
            </div>

            <div className="comparison-story-card glass-card" style={{ padding: 24 }}>
              <div className="section-tag" style={{ marginBottom: 12 }}>
                <i className="fa-solid fa-check" /> {featuredStory.tag}
              </div>
              <h3>{featuredStory.name}</h3>
              <p style={{ margin: '12px 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                {featuredStory.quote}
              </p>
              <div className="metrics-pill-grid">
                {featuredStory.metrics.map((m) => (
                  <div className="metric-pill-item" key={m.label}>
                    <span>{m.label}</span>
                    <strong>{m.value}</strong>
                  </div>
                ))}
              </div>
              <Link className="btn btn-primary btn-sm btn-full" to="/login?tab=register">
                <i className="fa-solid fa-bolt" /> Quiero Resultados Así
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">
              <i className="fa-solid fa-star" /> Testimonios Verificados
            </div>
            <h2 className="section-title">
              Negocios que <span>hablan por sí solos</span>
            </h2>
            <p className="section-desc">Entrenadores que profesionalizaron su marca y hoy gestionan su negocio con COACH PRO.</p>
          </div>

          <div className="transformations-grid">
            {transformationCards.map((card) => (
              <div className="transformation-card" key={card.name}>
                <div className="trans-img-holder">
                  <img src={card.image} alt={card.imageAlt} />
                  <span className="trans-badge">{card.badge}</span>
                </div>
                <div className="trans-body">
                  <div className="trans-stats">
                    <span className="trans-stat-tag">{card.statTag}</span>
                    <span className="trans-duration">{card.duration}</span>
                  </div>
                  <h4>{card.name}</h4>
                  <p className="trans-quote">{card.quote}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="reviews-grid" style={{ marginTop: 24 }}>
            {reviews.map((review) => (
              <div className="review-card" key={review.name}>
                <div className="review-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i className="fa-solid fa-star" key={i} />
                  ))}
                </div>
                <p className="review-text">{review.text}</p>
                <div className="reviewer-meta">
                  <img src={review.avatar} alt={review.avatarAlt} className="reviewer-avatar" />
                  <div className="reviewer-info">
                    <h5>{review.name}</h5>
                    <span>{review.meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
