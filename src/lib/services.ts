import { supabase } from './supabase';
import { type Service } from '../types';

let cachedServices: Service[] = [];

export const loadServices = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) throw error;
    
    // Приводим данные к правильному типу
    cachedServices = (data || []).map(item => ({
      ...item,
      category: item.category as Service['category']
    }));
    
    return cachedServices;
  } catch (error) {
    console.error('Error loading services:', error);
    return [];
  }
};

export const refreshServices = async (): Promise<Service[]> => {
  return loadServices();
};

export const getServices = (): Service[] => cachedServices;