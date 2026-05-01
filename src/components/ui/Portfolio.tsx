import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORKS } from '../../constants/Works';

export const Portfolio = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section className="container-custom py-20">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="w-12 h-px bg-pink-200 mx-auto mb-8" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Наши работы</h2>
        <p className="text-gray-500 text-sm tracking-wide">Результаты, которыми мы гордимся</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WORKS.map((work, index) => (
          <motion.div
            key={work.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            className="group cursor-pointer"
            onClick={() => setSelectedImage(work.id)}
          >
            <div className="relative overflow-hidden bg-gray-50 rounded-2xl">
              <img
                src={work.image}
                alt={work.title}
                className="w-full aspect-[4/5] object-cover transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white text-sm tracking-wide font-light">{work.title}</p>
                <div className="w-8 h-px bg-pink-400 mt-2" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={WORKS.find(w => w.id === selectedImage)?.image}
                alt={WORKS.find(w => w.id === selectedImage)?.title}
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-lg font-light">{WORKS.find(w => w.id === selectedImage)?.title}</p>
                <div className="w-12 h-px bg-pink-400 mt-2" />
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};