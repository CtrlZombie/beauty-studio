import { motion } from "framer-motion";
import { type Service } from "../../types";
import { Button } from "./Button";
import { ServiceIcon } from "./ServiceIcons";

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

export const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  const categoryConfig: Record<string, { color: string; bg: string }> = {
    ears: {
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
    },
    eyebrows: {
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
    },
    lashes: {
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
    },
    sugaring: {
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-50",
    },
    piercing: {
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
    },
  };

  const config = categoryConfig[service.category] || {
    color: "from-gray-500 to-gray-600",
    bg: "bg-gray-50",
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
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.color} group-hover:h-1.5 transition-all duration-300`}
      />

      <div className="p-6">
        {/* Иконка и цена */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            <ServiceIcon category={service.category} className="w-6 h-6" />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {service.price} ₽
          </div>
        </div>

        {/* Название услуги */}
        <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-pink-600 transition-colors">
          {service.name}
        </h3>

        {/* Длительность */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{service.duration} минут</span>
        </div>

        {/* Описание */}
        {service.description && (
          <p className="text-gray-500 text-sm mb-5 line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Кнопка записи */}
        <Button
          size="sm"
          onClick={() => onBook(service)}
          className="w-full group/btn"
        >
          <span>Записаться</span>
          <svg
            className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    </motion.div>
  );
};
