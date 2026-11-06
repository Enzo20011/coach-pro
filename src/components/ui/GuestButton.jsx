import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

/** Entra al panel con datos de prueba guardados solo en este navegador. */
export default function GuestButton({ className = 'btn btn-secondary', children = 'Entrar como invitado' }) {
  const { loginAsGuest } = useAuth();
  const navigate = useNavigate();

  async function handleClick() {
    await loginAsGuest();
    navigate('/admin');
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
