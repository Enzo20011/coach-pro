import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CheckoutModalContext = createContext(null);

export function CheckoutModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [planName, setPlanName] = useState('Demo de COACH PRO');
  const [planPrice, setPlanPrice] = useState('');

  const open = useCallback((name = 'Demo de COACH PRO', price = '') => {
    setPlanName(name);
    setPlanPrice(price);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, planName, planPrice, open, close }),
    [isOpen, planName, planPrice, open, close]
  );

  return <CheckoutModalContext.Provider value={value}>{children}</CheckoutModalContext.Provider>;
}

export function useCheckoutModal() {
  const ctx = useContext(CheckoutModalContext);
  if (!ctx) throw new Error('useCheckoutModal debe usarse dentro de <CheckoutModalProvider>');
  return ctx;
}
