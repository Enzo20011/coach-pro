import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const timeoutRef = useRef(null);

  const showToast = useCallback((msg) => {
    setMessage(msg);
    setShow(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(false), 3500);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={`toast-notification${show ? ' show' : ''}`} id="toastNotification">
        <i className="fa-solid fa-check-circle" />
        <span>{message}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}
