import { motion } from 'framer-motion';
import {type Service } from '../../types';
import { Button } from './Button';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

export const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  const categoryIcons: Record<string, string> = {
    ears: '👂',
    eyebrows: '👁️',
    lashes: '👀',
    sugaring: '🍬',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{categoryIcons[service.category]}</div>
        <div className="text-2xl font-bold text-primary">{service.price} ₽</div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
      <p className="text-gray-500 text-sm mb-4">
        ⏱️ {service.duration} минут
      </p>
      {service.description && (
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
      )}
      <Button size="sm" onClick={() => onBook(service)}>
        Записаться
      </Button>
    </motion.div>
  );
};