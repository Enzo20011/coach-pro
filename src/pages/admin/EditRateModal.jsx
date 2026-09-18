import { useEffect, useState } from 'react';
import ModalShell from './ModalShell.jsx';
import a from '../../styles/admin.module.css';

export default function EditRateModal({ isOpen, currentPrice, onClose, onSave }) {
  const [value, setValue] = useState(currentPrice);

  useEffect(() => {
    if (isOpen) setValue(currentPrice);
  }, [isOpen, currentPrice]);

  async function handleSubmit(e) {
    e.preventDefault();
    const parsed = parseInt(value, 10);
    if (!parsed || parsed <= 0) return;
    await onSave(parsed);
  }

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} titleIcon="fa-solid fa-tag" title="Tarifa de tu Personalizado" maxWidth={420}>
      <form onSubmit={handleSubmit}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 14 }}>
          Define cuánto cobras mensualmente por tu plan 1 a 1 de seguimiento y rutinas personalizadas.
        </p>
        <div className={a['form-group']} style={{ marginBottom: 16 }}>
          <label htmlFor="inputNewRate">Precio Mensual (en pesos argentinos)</label>
          <input
            type="number"
            id="inputNewRate"
            className={a['form-input']}
            min="1000"
            max="10000000"
            step="500"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={`${a.btn} ${a['btn-primary']}`} style={{ width: '100%' }}>
          <i className="fa-solid fa-check" /> Actualizar Tarifa de Personalizado
        </button>
      </form>
    </ModalShell>
  );
}
