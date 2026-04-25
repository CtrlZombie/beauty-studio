import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { services } from '../data/services';
import { Button } from '../components/ui/Button';
import { BookingModal } from '../features/booking/components/BookingModal';
import { useBookingStore } from '../features/booking/store/bookingStore';
import { CategoryCard } from '../components/ui/CategoryCard';
import { CategoryPage } from '../components/ui/CategoryPage';
import { AboutMaster } from '../components/ui/AboutMaster';
import { Portfolio } from '../components/ui/Portfolio';
import { Reviews } from '../components/ui/Reviews';
import { AuthModal } from '../components/ui/AuthModal';
import { Profile } from '../components/ui/Profile';
import { AdminPanel } from '../components/ui/AdminPanel';
import { Map } from '../components/ui/Map';
import { useAuth } from '../contexts/AuthContext';
import { type Service } from '../types';
import { SEO } from '../components/SEO';
import { getPageTitle, getPageDescription } from '../utils/seoHelper';
import { TrainingRequest } from '../components/ui/TrainingRequest';

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
    { 
      id: 'ears', 
      name: 'Прокол ушей', 
      description: 'Профессиональный пирсинг с заботой о безопасности'
    },
    { 
      id: 'eyebrows', 
      name: 'Брови', 
      description: 'Идеальная форма и безупречный уход'
    },
    { 
      id: 'lashes', 
      name: 'Ресницы', 
      description: 'Взгляд, который невозможно забыть'
    },
    { 
      id: 'sugaring', 
      name: 'Шугаринг', 
      description: 'Гладкая и нежная кожа надолго'
    },
    { 
      id: 'piercing', 
      name: 'Пирсинг', 
      description: 'Стильные украшения для тела' 
    },
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
      <SEO 
        title={getPageTitle(currentPage)}
        description={getPageDescription(currentPage)}
      />
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-xl font-light tracking-wide hover:text-gray-600 transition-colors"
            >
              Студия красоты Екатерины Сташок
            </button>
            <div className="flex gap-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedCategory('admin')}
                    >
                      Админ-панель
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setSelectedCategory('profile')}>
                    Личный кабинет
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                  Войти
                </Button>
              )}
              <Button size="sm" onClick={handleQuickBooking}>
                Записаться
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {selectedCategory === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container-custom"
          >
            <Profile />
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-4 text-gray-500 hover:text-gray-700"
            >
              ← Вернуться на главную
            </button>
          </motion.div>
        ) : selectedCategory === 'admin' ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminPanel />
            <button
              onClick={() => setSelectedCategory(null)}
              className="fixed bottom-8 right-8 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg hover:bg-gray-800 transition-colors"
            >
              ← На главную
            </button>
          </motion.div>
        ) : !selectedCategory ? (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Hero секция */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-white to-purple-100">
              <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              <div className="container mx-auto px-4 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-lg"
                  >
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-700 font-medium">Принимаем записи онлайн</span>
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-5xl md:text-7xl font-bold mb-6"
                  >
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Студия красоты Екатерины Сташок
                    </span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
                  >
                    Профессиональный уход за собой. Запишитесь на процедуру и получите идеальный результат
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Button size="lg" onClick={handleQuickBooking}>
                      Записаться сейчас
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={() => {
                        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Наши услуги
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                  <path fill="white" fillOpacity="0.9" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
              </div>
            </section>

            {/* Категории */}
            <section id="services" className="container-custom py-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="heading-2 text-gray-900 mb-3">Направления</h2>
                <p className="text-gray-400 max-w-md mx-auto">Выберите категорию услуг</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={{
                      ...category,
                      count: services.filter(s => s.category === category.id).length
                    }}
                    onClick={() => setSelectedCategory(category.id)}
                  />
                ))}
              </div>
            </section>

            <AboutMaster />
            <Portfolio />
            <Reviews />
            <Map address="Магнитогорск, ул. Доменщиков 13" />
            <TrainingRequest />
            {/* Footer */}
            <footer className="border-t border-gray-100 py-12 mt-16">
              <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Beauty Studio</h3>
                    <p className="text-gray-400 text-sm">Профессиональный уход и эстетика</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Контакты</h4>
                    <div className="space-y-2 text-gray-400 text-sm">
                      <p>+7 (999) 123-45-67</p>
                      <p>info@beautystudio.ru</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">График</h4>
                    <div className="space-y-2 text-gray-400 text-sm">
                      <p>Пн-Пт: 10:00 - 20:00</p>
                      <p>Сб: 10:00 - 18:00</p>
                      <p>Вс: Выходной</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm">
                  © 2024 Beauty Studio
                </div>
              </div>
            </footer>
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
        onClose={() => {
          setIsBookingModalOpen(false);
          setSkipServiceSelection(false);
        }}
        skipServiceSelection={skipServiceSelection}
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

export default App;