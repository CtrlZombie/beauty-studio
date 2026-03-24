import { motion } from 'framer-motion';
import { type Service } from '../../types';
import { Button } from './Button';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

export const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  const categoryConfig: Record<string, { icon: string; color: string; bg: string }> = {
    ears: { 
      icon: '👂', 
      color: 'from-amber-400 to-orange-500',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50'
    },
    eyebrows: { 
      icon: '👁️', 
      color: 'from-emerald-400 to-teal-500',
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50'
    },
    lashes: { 
      icon: '👀', 
      color: 'from-purple-400 to-pink-500',
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    sugaring: { 
      icon: '🍬', 
      color: 'from-rose-400 to-pink-500',
      bg: 'bg-gradient-to-br from-rose-50 to-pink-50'
    },
  };
  
  const config = categoryConfig[service.category] || { 
    icon: '✨', 
    color: 'from-gray-400 to-gray-500',
    bg: 'bg-gray-50'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Градиентная полоска сверху */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.color} group-hover:h-1.5 transition-all duration-300`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`text-5xl group-hover:scale-110 transition-transform duration-300`}>
            {config.icon}
          </div>
          <div className="text-2xl font-bold text-pink-500">
            {service.price} ₽
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 group-hover:text-pink-600 transition-colors">
          {service.name}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <span>⏱️</span>
          <span>{service.duration} минут</span>
        </div>
        
        {service.description && (
          <p className="text-gray-600 text-sm mb-5">
            {service.description}
          </p>
        )}
        
        <Button 
          size="sm" 
          onClick={() => onBook(service)}
          className="w-full"
        >
          Записаться
          <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Button>
      </div>
    </motion.div>
  );
};