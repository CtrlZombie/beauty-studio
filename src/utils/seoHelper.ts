// Для разных страниц можно использовать разные заголовки
export const getPageTitle = (page: string | null) => {
  const titles: Record<string, string> = {
    profile: "Личный кабинет | Beauty Studio",
    admin: "Админ-панель | Beauty Studio",
    ears: "Прокол ушей | Beauty Studio",
    eyebrows: "Брови | Beauty Studio",
    lashes: "Ресницы | Beauty Studio",
    sugaring: "Шугаринг | Beauty Studio",
  };
  
  return titles[page || ''] || "Студия красоты Екатерины Сташок. Магнитогорск";
};

export const getPageDescription = (page: string | null) => {
  const descriptions: Record<string, string> = {
    profile: "Управляйте своими записями, смотрите историю посещений в личном кабинете Beauty Studio",
    admin: "Панель управления записями, статистика и аналитика салона красоты",
    ears: "Безопасный прокол ушей в Магнитогорске. Профессиональный пирсинг с заботой о клиентах",
    eyebrows: "Коррекция, окрашивание и ламинирование бровей. Идеальная форма от профессионалов",
    lashes: "Ламинирование и окрашивание ресниц. Натуральный и эффектный взгляд",
    sugaring: "Сахарная эпиляция в Магнитогорске. Гладкая кожа без раздражения",
  };
  
  return descriptions[page || ''] || "Профессиональный уход за собой. Запись онлайн на удобное время";
};