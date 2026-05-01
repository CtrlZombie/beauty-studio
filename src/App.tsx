// src/app/App.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { BookingModal } from './features/booking/components/BookingModal';
import { CategoryPage } from './components/ui/CategoryPage';
import { AboutMaster } from './components/ui/AboutMaster';
import { Portfolio } from './components/ui/Portfolio';
import { Reviews } from './components/ui/Reviews';
import { AuthModal } from './components/ui/AuthModal';
import { Profile } from './components/ui/Profile';
import { AdminPanel } from './components/ui/AdminPanel';
import { Map } from './components/ui/Map';
import { TrainingRequest } from './components/ui/TrainingRequest';
import { HeroSection } from './components/sections/HeroSection';
import { CategoriesSection } from './components/sections/CategoriesSection';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { useAuth } from './contexts/AuthContext';
import { type Service } from './types';
import { SEO } from './components/SEO';
import { getPageTitle, getPageDescription } from './utils/seoHelper';
import { CATEGORIES } from './constants/Categories';
import { useBookingModal } from './hooks/useBookingModal';
import { useAuthModal } from './hooks/useAuthModal';
import { useCategoryNavigation } from './hooks/useCategoryNavigation';
import { useBookingStore } from './features/booking/store/bookingStore';

function App() {
  const { user, isAdmin } = useAuth();
  const { setSelectedService } = useBookingStore(); 

  const {
    isBookingModalOpen,
    skipServiceSelection,
    openBookingModal,
    closeBookingModal,
  } = useBookingModal();

  const {
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  } = useAuthModal();

  const {
    selectedCategory,
    filteredServices,
    currentCategory,
    currentPage,
    goToMain,
    goToProfile,
    goToAdmin,
    goToCategory,
  } = useCategoryNavigation();

  const handleBook = (service: Service) => {
    setSelectedService(service);
    openBookingModal(true); // skipServiceSelection = true
  };

  const handleQuickBooking = () => {
    openBookingModal(false); // выбирать услугу
  };

  return (
    <div className="min-h-screen">
      <SEO title={getPageTitle(currentPage)} description={getPageDescription(currentPage)} />
      <Toaster position="top-center" richColors />
      
      <Header
        user={user}
        isAdmin={isAdmin}
        onAdminClick={goToAdmin}
        onProfileClick={goToProfile}
        onAuthClick={openAuthModal}
        onBookingClick={handleQuickBooking}
        onLogoClick={goToMain}
      />

      <AnimatePresence mode="wait">
        {selectedCategory === 'profile' ? (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container-custom">
            <Profile />
            <button onClick={goToMain} className="mt-4 text-gray-500 hover:text-gray-700">
              ← Вернуться на главную
            </button>
          </motion.div>
        ) : selectedCategory === 'admin' ? (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminPanel />
            <button onClick={goToMain} className="fixed bottom-8 right-8 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg hover:bg-gray-800 transition-colors">
              ← На главную
            </button>
          </motion.div>
        ) : !selectedCategory ? (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HeroSection onQuickBooking={handleQuickBooking} />
            <CategoriesSection categories={CATEGORIES} onSelectCategory={goToCategory} />
            <AboutMaster />
            <Portfolio />
            <Reviews />
            <Map address="Магнитогорск, ул. Доменщиков 13" />
            <TrainingRequest />
            <Footer />
          </motion.div>
        ) : (
          <CategoryPage
            key={selectedCategory}
            category={currentCategory!}
            services={filteredServices}
            onBack={goToMain}
            onBook={handleBook}
          />
        )}
      </AnimatePresence>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBookingModal}
        skipServiceSelection={skipServiceSelection}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
}

export default App;