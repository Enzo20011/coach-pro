import { useMemo, useState } from 'react';
import ModalShell from './ModalShell.jsx';
import a from '../../styles/admin.module.css';

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Elegir varios ejercicios de la biblioteca/catálogo de una sola vez, en vez
 * de tener que apretar "Añadir Ejercicio" y buscar uno por uno para cada fila.
 */
export default function ExercisePickerModal({ isOpen, onClose, suggestions, onAddSelected }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return suggestions;
    return suggestions.filter((s) => normalize(s.name).includes(q) || normalize(s.category).includes(q));
  }, [query, suggestions]);

  function toggle(name) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function handleClose() {
    setQuery('');
    setSelected(new Set());
    onClose();
  }

  function handleAdd() {
    const chosen = suggestions.filter((s) => selected.has(s.name)).map(({ category: _category, ...ex }) => ex);
    onAddSelected(chosen);
    handleClose();
  }

  return (
    <ModalShell isOpen={isOpen} onClose={handleClose} titleIcon="fa-solid fa-list-check" title="Elegir Ejercicios de la Biblioteca">
      <div style={{ padding: '4px 22px 22px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="text"
          className={a['form-input']}
          placeholder="Buscar por nombre o grupo muscular (ej: pecho, sentadilla)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        <div className={a['picker-list']}>
          {filtered.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: 20 }}>
              No hay ejercicios que coincidan con "{query}".
            </p>
          ) : (
            filtered.map((item) => {
              const isChecked = selected.has(item.name);
              return (
                <label key={item.name} className={`${a['picker-item']} ${isChecked ? a.checked : ''}`}>
                  <input type="checkbox" checked={isChecked} onChange={() => toggle(item.name)} />
                  <div className={a['picker-item-info']}>
                    <span className={a['picker-item-name']}>{item.name}</span>
                    {item.category && <span className={a['suggest-category']}>{item.category}</span>}
                  </div>
                  <span className={a['picker-item-meta']}>
                    {item.sets}x{item.reps}
                  </span>
                </label>
              );
            })
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {selected.size} ejercicio{selected.size === 1 ? '' : 's'} seleccionado{selected.size === 1 ? '' : 's'}
          </span>
          <button type="button" className={`${a.btn} ${a['btn-primary']}`} onClick={handleAdd} disabled={selected.size === 0}>
            <i className="fa-solid fa-plus" /> Agregar {selected.size > 0 ? `(${selected.size})` : ''}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
