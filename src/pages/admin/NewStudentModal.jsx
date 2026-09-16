import { useState } from 'react';
import ModalShell from './ModalShell.jsx';
import a from '../../styles/admin.module.css';

const emptyForm = { name: '', phone: '', email: '', plan: 'Coaching Integral', goal: '' };

export default function NewStudentModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreate(form);
      setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleIcon="fa-solid fa-user-plus" title="Registrar Nuevo Alumno">
      <form onSubmit={handleSubmit}>
        <div className={a['form-group']} style={{ marginBottom: 12 }}>
          <label htmlFor="newStudentName">Nombre y Apellido</label>
          <input type="text" id="newStudentName" className={a['form-input']} placeholder="Ej: Gonzalo Rossi" value={form.name} onChange={set('name')} required />
        </div>
        <div className={a['form-group']} style={{ marginBottom: 12 }}>
          <label htmlFor="newStudentPhone">Número de WhatsApp (con código de país)</label>
          <input type="tel" id="newStudentPhone" className={a['form-input']} placeholder="+54 9 11 2233-4455" value={form.phone} onChange={set('phone')} required />
        </div>
        <div className={a['form-group']} style={{ marginBottom: 12 }}>
          <label htmlFor="newStudentEmail">Email</label>
          <input type="email" id="newStudentEmail" className={a['form-input']} placeholder="gonzalo@ejemplo.com" value={form.email} onChange={set('email')} required />
        </div>
        <div className={a['form-group']} style={{ marginBottom: 12 }}>
          <label htmlFor="newStudentPlan">Plan de Suscripción</label>
          <select id="newStudentPlan" className={a['form-select']} value={form.plan} onChange={set('plan')}>
            <option value="Coaching Integral">Coaching Integral (1 a 1)</option>
            <option value="Rutina Online">Rutina Online</option>
            <option value="VIP Presencial">VIP Presencial / Híbrido</option>
          </select>
        </div>
        <div className={a['form-group']} style={{ marginBottom: 18 }}>
          <label htmlFor="newStudentGoal">Meta Principal de Entrenamiento</label>
          <input type="text" id="newStudentGoal" className={a['form-input']} placeholder="Ej: Hipertrofia de hombros y sentadilla 100kg" value={form.goal} onChange={set('goal')} required />
        </div>
        <button type="submit" className={`${a.btn} ${a['btn-primary']}`} style={{ width: '100%' }} disabled={submitting}>
          <i className="fa-solid fa-check" /> Registrar Alumno
        </button>
      </form>
    </ModalShell>
  );
}
