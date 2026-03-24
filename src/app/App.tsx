import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { services } from "../data/services";
import { ServiceCard } from "../components/ui/ServiceCard";
import { Button } from "../components/ui/Button";
import { BookingModal } from "../features/booking/components/BookingModal";
import { useBookingStore } from "../features/booking/store/bookingStore";
import { CategoryCard } from "../components/ui/CategoryCard";
import { CategoryPage } from "../components/ui/CategotyPage";
import { type Service } from "../types";

function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { setSelectedService } = useBookingStore();

  const handleBook = (service: Service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const categories = [
    {
      id: "ears",
      name: "Прокол ушей",
      description: "Профессиональный пирсинг с заботой о вашей безопасности",
      color: "amber",
    },
    {
      id: "eyebrows",
      name: "Брови",
      description: "Идеальная форма и безупречный уход",
      color: "emerald",
    },
    {
      id: "lashes",
      name: "Ресницы",
      description: "Взгляд, который невозможно забыть",
      color: "purple",
    },
    {
      id: "sugaring",
      name: "Шугаринг",
      description: "Гладкая и нежная кожа надолго",
      color: "pink",
    },
  ];

  // Фильтруем услуги по выбранной категории
  const filteredServices = selectedCategory
    ? services.filter((service) => service.category === selectedCategory)
    : [];

  // Находим выбранную категорию
  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen">
      <Toaster position="top-center" richColors />

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          // Главная страница с категориями
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero секция */}
            <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-white to-purple-100">
              <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "1s" }}
              />

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
                    <span className="text-sm text-gray-700 font-medium">
                      Принимаем записи онлайн
                    </span>
                  </motion.div>

                  <h1 className="text-5xl md:text-7xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Студия красоты Екатерины Сташок
                    </span>
                  </h1>

                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Профессиональный уход за собой. Выберите направление и
                    запишитесь на удобное время
                  </p>

                  <Button size="lg" onClick={() => setIsBookingModalOpen(true)}>
                    Быстрая запись
                  </Button>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1440 320"
                  className="w-full"
                >
                  <path
                    fill="white"
                    fillOpacity="0.9"
                    d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ></path>
                </svg>
              </div>
            </section>

            {/* Категории */}
            <section className="container mx-auto px-4 py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Наши{" "}
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    направления
                  </span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Выберите категорию услуг, которая вас интересует
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onClick={() => setSelectedCategory(category.id)}
                  />
                ))}
              </div>
            </section>

            {/* Футер */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                      Студия красоты Екатерины Сташок
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Ваш путь к красоте начинается здесь
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Контакты</h4>
                    <div className="space-y-2 text-gray-400 text-sm">
                      <p>📍 г. Магнитогорск, ул. Доменщиков, 123</p>
                      <p>📞 +7 (999) 123-45-67</p>
                      <p>✉️ info@beautystudio.ru</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">График работы</h4>
                    <div className="space-y-2 text-gray-400 text-sm">
                      <p>Пн-Пт: 10:00 - 20:00</p>
                      <p>Сб: 10:00 - 18:00</p>
                      <p>Вс: Выходной</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Мы в соцсетях</h4>
                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 transition-colors"
                      >
                        <span className="text-xl">📷</span>
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 transition-colors"
                      >
                        <span className="text-xl">📘</span>
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 transition-colors"
                      >
                        <span className="text-xl">📱</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                  © 2024 Beauty Studio Ekaterina Stashok. Все права защищены.
                </div>
              </div>
            </footer>
          </motion.div>
        ) : (
          // Страница категории
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
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
}

export default App;
