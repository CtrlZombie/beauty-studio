import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Portfolio = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const works = [
    { id: 1, category: 'Брови', before: 'https://placehold.co/600x400/FEE2E2/EC489A?text=До', after: 'https://placehold.co/600x400/EC489A/FFFFFF?text=После' },
    { id: 2, category: 'Ресницы', before: 'https://placehold.co/600x400/FEE2E2/EC489A?text=До', after: 'https://placehold.co/600x400/EC489A/FFFFFF?text=После' },
    { id: 3, category: 'Пирсинг', before: 'https://placehold.co/600x400/FEE2E2/EC489A?text=До', after: 'https://placehold.co/600x400/EC489A/FFFFFF?text=После' },
    { id: 4, category: 'Шугаринг', before: 'https://placehold.co/600x400/FEE2E2/EC489A?text=До', after: 'https://placehold.co/600x400/EC489A/FFFFFF?text=После' },
    { id: 5, category: 'Брови', before: 'https://placehold.co/600x400/FEE2E2/EC489A?text=До', after: 'https://placehold.co/600x400/EC489A/FFFFFF?text=После' },
    { id: 6, category: 'Ресницы', before: 'https://placehold.co/600x400/FEE2E2/EC489A?text=До', after: 'https://placehold.co/600x400/EC489A/FFFFFF?text=После' },
  ];

  return (
    <section className="container-custom py-20 bg-gray-50 rounded-3xl my-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <span className="text-sm text-pink-500 uppercase tracking-wider">Наши работы</span>
        <h2 className="text-3xl font-bold mt-2">Портфолио</h2>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          Результаты работ до и после. Каждый случай индивидуален
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedImage(work.id)}
          >
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <div className="grid grid-cols-2">
                <img src={work.before} alt="До" className="w-full h-64 object-cover" />
                <img src={work.after} alt="После" className="w-full h-64 object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium">Посмотреть детали</span>
              </div>
              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                {work.category}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Модальное окно с деталями */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <img
                  src={works.find(w => w.id === selectedImage)?.before}
                  alt="До"
                  className="w-full h-96 object-cover"
                />
                <img
                  src={works.find(w => w.id === selectedImage)?.after}
                  alt="После"
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <p className="text-gray-600">
                  {works.find(w => w.id === selectedImage)?.category}
                </p>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="mt-4 text-pink-500 hover:text-pink-600"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};