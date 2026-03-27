import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      name: 'Лина',
      service: 'Прокол мочек и хряща уха (пистолет, катетер)',
      rating: 5,
      text: 'Девушка очень милая, все было на высшем уровне, легкая рука , ребенку 2 года, ушки проколола хорошо 👌',
      date: '26 марта 2026',
    },
    {
      id: 2,
      name: 'Inga',
      service: 'Пирсинг',
      rating: 5,
      text: 'Большое спасибо мастеру за работу,делали прокол губы,было совсем не больно,мастер очень приятная девушка. Перед записью списались, мастер ответила на все вопросы и предложила выбрать украшение на мой выбор. Очень советую,цена хорошая,качественно выполненная работа,очень понравилось,обязательно приду еще😊',
      date: '25 марта 2026',
    },
    {
      id: 3,
      name: 'Rina',
      service: 'Брови, коррекция, ламинирование',
      rating: 5,
      text: 'Мастер просто супер! Очень общительная и дружелюбная. Впервые в жизни мне сделали такие идеальные брови! Я очень довольна результатом, однозначно буду ходить к Екатерине ещё',
      date: '20 февраля 2026',
    },
    {
      id: 4,
      name: 'Олеся Воротилова',
      service: 'Прокол мочек и хряща уха (пистолет, катетер)',
      rating: 5,
      text: 'Отличный мастер, сделали все быстро, совсем не больно. Записывайтесь к Екатерине не пожалеете.',
      date: '19 января 2026',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section className="container-custom py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="text-sm text-pink-500 uppercase tracking-wider">Отзывы</span>
        <h2 className="text-3xl font-bold mt-2">Что говорят клиенты</h2>
        <p className="text-gray-500 mt-2">Более 200 довольных клиентов</p>
      </motion.div>

      <div className="max-w-4xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
          >
            <div className="flex justify-center mb-4">
              {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
              "{reviews[currentIndex].text}"
            </p>
            <div className="border-t border-gray-100 pt-6">
              <h4 className="font-semibold text-gray-900">{reviews[currentIndex].name}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {reviews[currentIndex].service} • {reviews[currentIndex].date}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Кнопки навигации */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Индикаторы */}
      <div className="flex justify-center gap-2 mt-8">
        {reviews.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-pink-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
};