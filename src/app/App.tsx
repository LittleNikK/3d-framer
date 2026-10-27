import { RouterProvider, useRouter } from './router';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ToastContainer } from '../components/layout/ToastContainer';
import { HomePage } from '../pages/HomePage';
import { CustomizerPage } from '../pages/CustomizerPage';
import { SavedDesignsPage } from '../pages/SavedDesignsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { NotFoundPage } from '../pages/NotFoundPage';

function AppContent() {
  const { route } = useRouter();

  const renderRoute = () => {
    switch (route) {
      case 'home':
        return <HomePage />;
      case 'customize':
        return <CustomizerPage />;
      case 'designs':
        return <SavedDesignsPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-[#f1f5f9] selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />
      <main className="flex-1 flex flex-col w-full relative">
        {renderRoute()}
      </main>
      {route !== 'customize' && <Footer />}
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
