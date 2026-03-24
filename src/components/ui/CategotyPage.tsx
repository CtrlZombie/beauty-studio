import { motion } from 'framer-motion';
import { type Service } from '../../types';
import { ServiceCard } from './ServiceCard';
import { Button } from './Button';
import { ServiceIcon } from './ServiceIcons';

interface CategoryPageProps {
  category: {
    id: string;
    name: string;
    description: string;
    color: string;
  };
  services: Service[];
  onBack: () => void;
  onBook: (service: Service) => void;
}

export const CategoryPage = ({ category, services, onBack, onBook }: CategoryPageProps) => {
  const colorClasses: Record<string, string> = {
    amber: 'from-amber-500 to-orange-500',
    emerald: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-rose-500 to-pink-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50"
    >
      {/* Header с кнопкой назад */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="!p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[category.color]} flex items-center justify-center`}>
                <ServiceIcon category={category.id} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Услуги категории */}
      <div className="container mx-auto px-4 py-12">
        <div className={`inline-block mb-8 px-4 py-2 rounded-full bg-gradient-to-r ${colorClasses[category.color]} text-white text-sm font-medium`}>
          {services.length} {services.length === 1 ? 'услуга' : services.length < 5 ? 'услуги' : 'услуг'}
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