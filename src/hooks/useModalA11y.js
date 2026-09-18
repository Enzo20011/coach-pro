import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal accessibility behavior: focuses the dialog on open, restores
 * focus to whatever triggered it on close, closes on Escape, and traps Tab
 * navigation inside the dialog while it's open.
 */
export default function useModalA11y(isOpen, onClose, dialogRef) {
  const previouslyFocused = useRef(null);
  // Los componentes que llaman a este hook suelen pasar un `onClose` inline
  // (`onClose={() => setX(false)}`), que cambia de referencia en cada
  // render. Guardarlo en un ref (en vez de listarlo como dependencia del
  // efecto) evita que el efecto se re-dispare — y vuelva a robarle el foco al
  // primer elemento del modal (el botón de cerrar) — cada vez que el usuario
  // tipea algo dentro del modal y el padre re-renderiza.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocused.current = document.activeElement;
    const node = dialogRef.current;
    const firstFocusable = node?.querySelector(FOCUSABLE_SELECTOR);
    (firstFocusable || node)?.focus();

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !node) return;
      const items = node.querySelectorAll(FOCUSABLE_SELECTOR);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused.current && document.contains(previouslyFocused.current)) {
        previouslyFocused.current.focus();
      }
    };
  }, [isOpen, dialogRef]);
}
