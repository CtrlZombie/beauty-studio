import { motion } from 'framer-motion';
import { ServiceIcon } from './ServiceIcons';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    color: string;
  };
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const colorClasses: Record<string, { gradient: string; bg: string; iconBg: string }> = {
    amber: {
      gradient: 'from-amber-500 to-orange-500',
      bg: 'hover:shadow-amber-200/50',
      iconBg: 'bg-amber-100 group-hover:bg-amber-200'
    },
    emerald: {
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'hover:shadow-emerald-200/50',
      iconBg: 'bg-emerald-100 group-hover:bg-emerald-200'
    },
    purple: {
      gradient: 'from-purple-500 to-pink-500',
      bg: 'hover:shadow-purple-200/50',
      iconBg: 'bg-purple-100 group-hover:bg-purple-200'
    },
    pink: {
      gradient: 'from-rose-500 to-pink-500',
      bg: 'hover:shadow-rose-200/50',
      iconBg: 'bg-rose-100 group-hover:bg-rose-200'
    },
  };

  const config = colorClasses[category.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${config.bg}`}>
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${config.gradient}`} />
        
        <div className="p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${config.iconBg} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
            <ServiceIcon category={category.id} className="w-10 h-10" />
          </div>
          
          <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-pink-600 transition-colors">
            {category.name}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed">
            {category.description}
          </p>
          
          <div className="mt-6 inline-flex items-center text-pink-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span>Выбрать услуги</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};