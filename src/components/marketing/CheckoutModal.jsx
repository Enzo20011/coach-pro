import { useId, useRef, useState } from 'react';
import { useCheckoutModal } from '../../context/CheckoutModalContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { platformWhatsAppLink } from '../../lib/whatsapp.js';
import useModalA11y from '../../hooks/useModalA11y.js';

const GOAL_OPTIONS = [
  'Quiero una demo de la plataforma',
  'Quiero info de precios para mi negocio',
  'Tengo una consulta técnica',
];

const emptyForm = { name: '', phone: '', email: '', goal: GOAL_OPTIONS[0] };

export default function CheckoutModal() {
  const { isOpen, planName, planPrice, close } = useCheckoutModal();
  const showToast = useToast();
  const [form, setForm] = useState(emptyForm);
  const dialogRef = useRef(null);
  const titleId = useId();
  useModalA11y(isOpen, close, dialogRef);

  function handleChange(e) {
    const { id, value } = e.target;
    const key = id.replace('client', '').toLowerCase();
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    close();
    const text =
      `¡Hola equipo de COACH PRO! Soy entrenador/a y quiero más información.\n` +
      `🎯 *Motivo:* ${form.goal}\n👤 *Nombre:* ${form.name}\n📱 *WhatsApp:* ${form.phone}\n✉️ *Email:* ${form.email}\n\n` +
      `¿Podemos coordinar una charla para conocer la plataforma?`;
    showToast('¡Consulta enviada! Abriendo WhatsApp...');
    setTimeout(() => window.open(platformWhatsAppLink(text), '_blank'), 1000);
    setForm(emptyForm);
  }

  return (
    <div
      className={`modal-overlay${isOpen ? ' open' : ''}`}
      id="checkoutModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <div className="modal-header">
          <h3 id={titleId}>
            <i className="fa-solid fa-comments" style={{ color: 'var(--primary)', marginRight: 8 }} aria-hidden="true" /> Solicitar una
            Demo
          </h3>
          <button className="modal-close" aria-label="Cerrar ventana" onClick={close} type="button">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        <div className="modal-body">
          <div className="checkout-plan-summary">
            <div>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Consulta sobre:
              </span>
              <h4>{planName}</h4>
            </div>
            <div className="checkout-price">{planPrice}</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label htmlFor="clientName">Nombre Completo</label>
              <input
                type="text"
                id="clientName"
                className="form-input"
                placeholder="Tu nombre y apellido"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label htmlFor="clientPhone">Teléfono de WhatsApp</label>
              <input
                type="tel"
                id="clientPhone"
                className="form-input"
                placeholder="+54 9 11 1234-5678"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label htmlFor="clientEmail">Correo Electrónico</label>
              <input
                type="email"
                id="clientEmail"
                className="form-input"
                placeholder="tuemail@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label htmlFor="clientGoal">¿Qué te interesa?</label>
              <select id="clientGoal" className="form-input" value={form.goal} onChange={handleChange}>
                {GOAL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              <i className="fa-solid fa-paper-plane" /> Enviar Consulta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
