import { useState } from 'react';
import { platformWhatsAppLink } from '../../lib/whatsapp.js';

export default function WhatsAppWidget() {
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const link = platformWhatsAppLink('Hola! Quiero conocer más sobre COACH PRO para mi negocio de entrenador.');

  return (
    <div className="whatsapp-widget-container">
      {bubbleVisible && (
        <div className="whatsapp-chat-bubble" onClick={() => window.open(link, '_blank')}>
          <div className="bubble-header">
            <div className="bubble-sender">
              <i className="fa-solid fa-circle" style={{ fontSize: '0.6rem', color: '#00ff87' }} /> Equipo COACH PRO
            </div>
            <button
              className="bubble-close"
              aria-label="Cerrar mensaje"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBubbleVisible(false);
              }}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className="bubble-text">
            ¡Hola! 👋 ¿Querés conocer cómo COACH PRO puede ayudarte a gestionar tu negocio de entrenador?
          </div>
        </div>
      )}
      <a
        href={link}
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <i className="fa-brands fa-whatsapp" />
      </a>
    </div>
  );
}
