import { motion } from 'framer-motion';
import { CategoryCard } from '../ui/CategoryCard';
import { services } from '../../data/services';

interface CategoriesSectionProps {
  categories: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  onSelectCategory: (id: string) => void;
}

export const CategoriesSection = ({ categories, onSelectCategory }: CategoriesSectionProps) => {
  return (
    <section id="services" className="container-custom py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-light text-gray-900 mb-3">Направления</h2>
        <p className="text-gray-400 max-w-md mx-auto">Выберите категорию услуг</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={{
              ...category,
              count: services.filter(s => s.category === category.id).length
            }}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </div>
    </section>
  );
};