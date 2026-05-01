import { useState } from 'react';
import { services } from '../data/services';
import { CATEGORIES } from '../constants/Categories';
import { PAGE_PROFILE, PAGE_ADMIN } from '../constants/Pages';

export const useCategoryNavigation = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = selectedCategory
    ? services.filter(service => service.category === selectedCategory)
    : [];

  const currentCategory = CATEGORIES.find(c => c.id === selectedCategory);

  const currentPage = selectedCategory === PAGE_PROFILE ? PAGE_PROFILE 
    : selectedCategory === PAGE_ADMIN ? PAGE_ADMIN
    : selectedCategory;

  const goToMain = () => setSelectedCategory(null);
  const goToProfile = () => setSelectedCategory(PAGE_PROFILE);
  const goToAdmin = () => setSelectedCategory(PAGE_ADMIN);
  const goToCategory = (categoryId: string) => setSelectedCategory(categoryId);

  return {
    selectedCategory,
    filteredServices,
    currentCategory,
    currentPage,
    goToMain,
    goToProfile,
    goToAdmin,
    goToCategory,
  };
};