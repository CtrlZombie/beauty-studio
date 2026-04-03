import { motion } from 'framer-motion';

interface MapProps {
  address: string;
  title?: string;
}

export const Map = ({ address, title = "Как нас найти" }: MapProps) => {
  // Кодируем адрес для URL
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://yandex.ru/map-widget/v1/?um=constructor&source=constructor&scroll=true&mode=search&text=${encodedAddress}`;
  
  return (
    <section className="container-custom py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <span className="text-sm text-gray-400 uppercase tracking-wider">Локация</span>
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 mt-2">
          {title}
        </h2>
        <p className="text-gray-500 mt-2">
          {address}
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="relative rounded-2xl overflow-hidden shadow-lg"
      >
        {/* Яндекс карта */}
        <iframe
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="w-full"
          title="Карта проезда"
        />
        
        {/* Дополнительная информация */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">{address}</p>
              <p className="text-gray-500 text-xs">Кабинет в помещении парикмахерской "Эва"</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Подсказка как добраться */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-6 text-center"
      >
        <div className="inline-flex flex-wrap gap-4 justify-center text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Вход с улицы</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Остановка "Плавательный бассейн" в 2 минутах</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Есть парковка</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};