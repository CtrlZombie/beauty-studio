import {type Service } from '../types';

export const services: Service[] = [
  // Прокол ушей
  { id: 'ears-kids', category: 'ears', name: 'Прокол ушей (дети до 12 лет)', price: 1000, duration: 30, description: 'Безопасный прокол для детей' },
  { id: 'ears-adult-two', category: 'ears', name: 'Прокол ушей (взрослые, две мочки)', price: 800, duration: 20 },
  { id: 'ears-adult-one', category: 'ears', name: 'Прокол ушей (взрослые, одна мочка)', price: 500, duration: 15 },
  { id: 'ears-cartilage', category: 'ears', name: 'Прокол хряща', price: 800, duration: 25 },
  
  // Брови
  { id: 'brows-lamination', category: 'eyebrows', name: 'Долговременная укладка бровей', price: 900, duration: 60 },
  { id: 'brows-correction', category: 'eyebrows', name: 'Коррекция бровей (воск/пинцет)', price: 500, duration: 30 },
  { id: 'brows-dye', category: 'eyebrows', name: 'Окрашивание бровей', price: 400, duration: 20 },
  { id: 'brows-combo', category: 'eyebrows', name: 'Все включено (укладка+коррекция+окрашивание)', price: 1300, duration: 80 },
  
  // Ресницы
  { id: 'lashes-lamination', category: 'lashes', name: 'Ламинирование ресниц', price: 1000, duration: 60 },
  { id: 'lashes-dye', category: 'lashes', name: 'Окрашивание ресниц', price: 400, duration: 20 },
  { id: 'lashes-combo', category: 'lashes', name: 'Все включено (ламинирование+окрашивание)', price: 1300, duration: 70 },
  
  // Шугаринг
  { id: 'sugar-bikini-deep', category: 'sugaring', name: 'Глубокое бикини', price: 1000, duration: 40 },
  { id: 'sugar-underarms', category: 'sugaring', name: 'Подмышечные впадины', price: 300, duration: 20 },
  { id: 'sugar-arms', category: 'sugaring', name: 'Руки', price: 700, duration: 30 },
  { id: 'sugar-legs-full', category: 'sugaring', name: 'Ноги', price: 900, duration: 50 },
  { id: 'sugar-legs-part', category: 'sugaring', name: 'Голень/бедро', price: 500, duration: 30 },
  { id: 'sugar-stomach', category: 'sugaring', name: 'Живот дорожка', price: 300, duration: 15 },
  { id: 'sugar-back', category: 'sugaring', name: 'Спина', price: 500, duration: 25 },
  { id: 'sugar-bikini-underarms', category: 'sugaring', name: 'Глубокое бикини + подмышки', price: 1100, duration: 55 },
  { id: 'sugar-bikini-underarms-leg', category: 'sugaring', name: 'Глубокое бикини + подмышки + голень', price: 1600, duration: 70 },
  { id: 'sugar-bikini-underarms-legs-full', category: 'sugaring', name: 'Глубокое бикини + подмышки + ноги', price: 1800, duration: 85 },
];