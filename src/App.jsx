import { Routes, Route } from 'react-router-dom';
import MarketingLayout from './layouts/MarketingLayout.jsx';
import Home from './pages/marketing/Home.jsx';
import Planes from './pages/marketing/Planes.jsx';
import RutinaDemo from './pages/marketing/RutinaDemo.jsx';
import Transformaciones from './pages/marketing/Transformaciones.jsx';
import Faq from './pages/marketing/Faq.jsx';
import Privacidad from './pages/marketing/Privacidad.jsx';
import Terminos from './pages/marketing/Terminos.jsx';
import NotFound from './pages/marketing/NotFound.jsx';
import Login from './pages/Login.jsx';
import Activar from './pages/Activar.jsx';
import Admin from './pages/admin/Admin.jsx';
import AlumnoApp from './pages/alumno/AlumnoApp.jsx';
import Reservar from './pages/reservar/Reservar.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/rutina-demo" element={<RutinaDemo />} />
        <Route path="/transformaciones" element={<Transformaciones />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth y apps — cada una con su propio layout (sin header/footer de marketing) */}
      <Route path="/login" element={<Login />} />
      <Route path="/activar" element={<Activar />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/alumno" element={<AlumnoApp />} />
      <Route path="/reservar" element={<Reservar />} />
    </Routes>
  );
}
