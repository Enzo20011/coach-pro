import { Outlet, useLocation } from 'react-router-dom';
import SkipLink from '../components/layout/SkipLink.jsx';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import WhatsAppWidget from '../components/layout/WhatsAppWidget.jsx';
import MobileStickyBar from '../components/layout/MobileStickyBar.jsx';
import CheckoutModal from '../components/marketing/CheckoutModal.jsx';
import { CheckoutModalProvider } from '../context/CheckoutModalContext.jsx';

export default function MarketingLayout() {
  const location = useLocation();

  return (
    <CheckoutModalProvider>
      <SkipLink />
      <Header />
      <main id="main-content" className="page-transition" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget />
      <MobileStickyBar />
      <CheckoutModal />
    </CheckoutModalProvider>
  );
}
