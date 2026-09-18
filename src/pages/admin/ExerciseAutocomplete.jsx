import { useEffect, useMemo, useRef, useState } from 'react';
import a from '../../styles/admin.module.css';

function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Input de nombre de ejercicio con sugerencias de la biblioteca del coach +
 * catálogo común. Elegir una sugerencia completa series/reps/RIR/descanso/nota
 * de una — el objetivo es que cargar una rutina sea sobre todo "elegir y
 * ajustar" en vez de tipear todo de cero ejercicio por ejercicio.
 */
export default function ExerciseAutocomplete({ value, suggestions, onChangeName, onSelectSuggestion, ariaLabel }) {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef(null);

  const filtered = useMemo(() => {
    const q = normalize(value.trim());
    if (!q) return suggestions.slice(0, 8);

    // Prioriza: nombre empieza con la búsqueda > nombre la contiene > coincide
    // por grupo muscular ("hombro" trae todo Hombros aunque no esté en el nombre).
    const scored = suggestions
      .map((s) => {
        const name = normalize(s.name);
        const category = normalize(s.category);
        let score = -1;
        if (name.startsWith(q)) score = 3;
        else if (name.includes(q)) score = 2;
        else if (category.startsWith(q)) score = 1;
        else if (category.includes(q)) score = 0;
        return { item: s, score };
      })
      .filter((s) => s.score >= 0)
      .sort((a1, b1) => b1.score - a1.score);

    return scored.slice(0, 8).map((s) => s.item);
  }, [value, suggestions]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectItem(item) {
    onSelectSuggestion(item);
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open || filtered.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[highlightIndex]) {
      e.preventDefault();
      selectItem(filtered[highlightIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={a['exercise-autocomplete']}>
      <input
        type="text"
        className={a['form-input']}
        value={value}
        placeholder="Nombre del Ejercicio"
        aria-label={ariaLabel}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        onChange={(e) => {
          onChangeName(e.target.value);
          setOpen(true);
          setHighlightIndex(0);
        }}
        onFocus={() => {
          setOpen(true);
          setHighlightIndex(0);
        }}
        onKeyDown={handleKeyDown}
      />
      {open && filtered.length > 0 && (
        <ul className={a['exercise-suggest-list']} role="listbox">
          {filtered.map((item, i) => (
            <li
              key={item.name}
              role="option"
              aria-selected={i === highlightIndex}
              className={`${a['exercise-suggest-item']} ${i === highlightIndex ? a.highlighted : ''}`}
              onMouseDown={(e) => {
                e.preventDefault();
                selectItem(item);
              }}
              onMouseEnter={() => setHighlightIndex(i)}
            >
              <span className={a['suggest-name']}>
                {item.name}
                {item.category && <span className={a['suggest-category']}>{item.category}</span>}
              </span>
              <span className={a['suggest-meta']}>
                {item.sets}x{item.reps}
                {item.rir ? ` · ${item.rir}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
