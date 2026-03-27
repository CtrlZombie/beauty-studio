import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    count: number;
  };
  onClick: () => void;
}

export const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="group w-full text-left"
    >
      <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 card-hover">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500" />
        
        <div className="relative z-10">
          <div className="text-sm text-gray-400 mb-2 tracking-wide">
            {category.count} услуг
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {category.description}
          </p>
          <div className="mt-4 flex items-center text-gray-400 text-sm group-hover:text-gray-600 transition-colors">
            <span>Подробнее</span>
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.button>
  );
};