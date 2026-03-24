import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { services } from '../data/services';
import { ServiceCard } from '../components/ui/ServiceCard';
import { Button } from '../components/ui/Button';
import { BookingModal } from '../features/booking/components/BookingModal';
import { useBookingStore } from '../features/booking/store/bookingStore';
import { type Service } from '../types';

function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { setSelectedService } = useBookingStore();

  const handleBook = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const categories = [
    { id: 'ears', name: 'Прокол ушей', icon: '👂' },
    { id: 'eyebrows', name: 'Брови', icon: '👁️' },
    { id: 'lashes', name: 'Ресницы', icon: '👀' },
    { id: 'sugaring', name: 'Шугаринг', icon: '🍬' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Toaster position="top-center" richColors />
      
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-purple-100/50" />
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Beauty Studio
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Профессиональный уход за собой. Запишитесь на процедуру и получите идеальный результат
            </p>
            <Button size="lg" onClick={() => setIsBookingModalOpen(true)}>
              Записаться сейчас
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="font-medium">{cat.name}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Наши услуги
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBook={handleBook}
            />
          ))}
        </div>
      </section>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}

export default App;