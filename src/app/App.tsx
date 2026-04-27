import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { services } from '../data/services';
import { BookingModal } from '../features/booking/components/BookingModal';
import { useBookingStore } from '../features/booking/store/bookingStore';
import { CategoryPage } from '../components/ui/CategoryPage';
import { AboutMaster } from '../components/ui/AboutMaster';
import { Portfolio } from '../components/ui/Portfolio';
import { Reviews } from '../components/ui/Reviews';
import { AuthModal } from '../components/ui/AuthModal';
import { Profile } from '../components/ui/Profile';
import { AdminPanel } from '../components/ui/AdminPanel';
import { Map } from '../components/ui/Map';
import { TrainingRequest } from '../components/ui/TrainingRequest';
import { HeroSection } from '../components/sections/HeroSection';
import { CategoriesSection } from '../components/sections/CategoriesSection';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { useAuth } from '../contexts/AuthContext';
import { type Service } from '../types';
import { SEO } from '../components/SEO';
import { getPageTitle, getPageDescription } from '../utils/seoHelper';

function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [skipServiceSelection, setSkipServiceSelection] = useState(false);
  const { setSelectedService } = useBookingStore();
  const { user, isAdmin } = useAuth();

  const handleBook = (service: Service) => {
    setSelectedService(service);
    setSkipServiceSelection(true);
    setIsBookingModalOpen(true);
  };

  const handleQuickBooking = () => {
    setSkipServiceSelection(false);
    setIsBookingModalOpen(true);
  };

  const categories = [
    { id: 'ears', name: 'Прокол ушей', description: 'Профессиональный пирсинг с заботой о безопасности' },
    { id: 'eyebrows', name: 'Брови', description: 'Идеальная форма и безупречный уход' },
    { id: 'lashes', name: 'Ресницы', description: 'Взгляд, который невозможно забыть' },
    { id: 'sugaring', name: 'Шугаринг', description: 'Гладкая и нежная кожа надолго' },
    { id: 'piercing', name: 'Пирсинг', description: 'Стильные украшения для тела' },
  ];

  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory)
    : [];

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const currentPage = selectedCategory === 'profile' ? 'profile' 
    : selectedCategory === 'admin' ? 'admin'
    : selectedCategory;

  return (
    <div className="min-h-screen">
      <SEO title={getPageTitle(currentPage)} description={getPageDescription(currentPage)} />
      <Toaster position="top-center" richColors />
      
      <Header
        user={user}
        isAdmin={isAdmin}
        onAdminClick={() => setSelectedCategory('admin')}
        onProfileClick={() => setSelectedCategory('profile')}
        onAuthClick={() => setIsAuthModalOpen(true)}
        onBookingClick={handleQuickBooking}
        onLogoClick={() => setSelectedCategory(null)}
      />

      <AnimatePresence mode="wait">
        {selectedCategory === 'profile' ? (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container-custom">
            <Profile />
            <button onClick={() => setSelectedCategory(null)} className="mt-4 text-gray-500 hover:text-gray-700">
              ← Вернуться на главную
            </button>
          </motion.div>
        ) : selectedCategory === 'admin' ? (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AdminPanel />
            <button onClick={() => setSelectedCategory(null)} className="fixed bottom-8 right-8 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg hover:bg-gray-800 transition-colors">
              ← На главную
            </button>
          </motion.div>
        ) : !selectedCategory ? (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HeroSection onQuickBooking={handleQuickBooking} />
            <CategoriesSection categories={categories} onSelectCategory={setSelectedCategory} />
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
            onBack={() => setSelectedCategory(null)}
            onBook={handleBook}
          />
        )}
      </AnimatePresence>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => { setIsBookingModalOpen(false); setSkipServiceSelection(false); }}
        skipServiceSelection={skipServiceSelection}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;