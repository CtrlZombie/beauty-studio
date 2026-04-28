import { motion } from 'framer-motion';

export const AboutMaster = () => {
  const certificates = [
    { id: 1, title: 'Диплом визажиста', year: '2020', image: 'https://placehold.co/400x300/FEF9F0/D4AF37?text=Диплом' },
    { id: 2, title: 'Сертификат brow-стилиста', year: '2021', image: 'https://placehold.co/400x300/FEF9F0/D4AF37?text=Сертификат' },
    { id: 3, title: 'Курсы ламинирования', year: '2022', image: 'https://placehold.co/400x300/FEF9F0/D4AF37?text=Курсы' },
  ];

  return (
    <section className="container-custom py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        {/* Фото мастера */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border-2 border-pink-200 rounded-2xl" />
          <img
            src="/images/portfolio/master.webp"
            alt="Мастер"
            className="relative rounded-2xl shadow-xl w-full object-cover aspect-square"
          />
        </div>

        {/* Информация */}
        <div>
          <span className="text-sm text-pink-500 uppercase tracking-wider">О мастере</span>
          <h2 className="text-3xl font-bold mt-2 mb-4 text-gray-900">Екатерина Сташок</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Профессиональный мастер. Специализируюсь на создании идеальных бровей,
            натуральном ламинировании ресниц и безопасном пирсинге. Постоянно повышаю квалификацию
            и слежу за трендами, чтобы предлагать клиентам только лучшие техники.
          </p>
          
          {/* Сертификаты */}
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Сертификаты и дипломы</h3>
          <div className="grid grid-cols-3 gap-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={'/images/portfolio/brush_sert.webp'}
                    alt={cert.title}
                    className="w-full aspect-[4/3] object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-pink-500/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs text-center p-2 font-medium">{cert.title}</span>
                  </div>
                </div>
                <p className="text-xs text-center mt-2 text-gray-500">{cert.year}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};