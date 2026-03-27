import { motion } from 'framer-motion';
import { type Service } from '../../types';
import { ServiceCard } from './ServiceCard';

interface CategoryPageProps {
  category: {
    id: string;
    name: string;
    description: string;
  };
  services: Service[];
  onBack: () => void;
  onBook: (service: Service) => void;
}

export const CategoryPage = ({ category, services, onBack, onBook }: CategoryPageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Назад</span>
            </button>
            
            <div>
              <h1 className="text-2xl font-light text-gray-900">{category.name}</h1>
              <p className="text-sm text-gray-400 mt-1">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Услуги */}
      <div className="container-custom py-12">
        <div className="mb-8">
          <span className="text-sm text-gray-400">{services.length} услуги</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ServiceCard service={service} onBook={onBook} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};