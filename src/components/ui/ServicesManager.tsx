import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Service {
  id: string;
  category: string;
  name: string;
  price: number;
  duration: number;
  description: string | null;
  is_active: boolean;
}

const categories = [
  { id: 'ears', name: 'Прокол ушей' },
  { id: 'eyebrows', name: 'Брови' },
  { id: 'lashes', name: 'Ресницы' },
  { id: 'sugaring', name: 'Шугаринг' },
  { id: 'piercing', name: 'Пирсинг' },

];

export const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'ears',
    name: '',
    price: '',
    duration: '',
    description: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      category: formData.category,
      name: formData.name,
      price: parseInt(formData.price),
      duration: parseInt(formData.duration),
      description: formData.description || null,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Услуга обновлена');
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        if (error) throw error;
        toast.success('Услуга добавлена');
      }
      
      resetForm();
      loadServices();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка сохранения');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить услугу?')) return;
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success('Услуга удалена');
      loadServices();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка удаления');
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !current })
        .eq('id', id);
      if (error) throw error;
      toast.success(current ? 'Услуга скрыта' : 'Услуга активна');
      loadServices();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка');
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'ears',
      name: '',
      price: '',
      duration: '',
      description: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const editService = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      category: service.category,
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
      description: service.description || '',
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light">Управление услугами</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            + Добавить услугу
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? 'Редактировать' : 'Новая услуга'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Категория</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Название</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Цена (₽)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Длительность (мин)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Описание</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg">
                Сохранить
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg">
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm">Категория</th>
              <th className="p-3 text-left text-sm">Услуга</th>
              <th className="p-3 text-left text-sm">Цена</th>
              <th className="p-3 text-left text-sm">Длительность</th>
              <th className="p-3 text-left text-sm">Статус</th>
              <th className="p-3 text-left text-sm">Действия</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t">
                <td className="p-3">{categories.find(c => c.id === service.category)?.name}</td>
                <td className="p-3">{service.name}</td>
                <td className="p-3">{service.price} ₽</td>
                <td className="p-3">{service.duration} мин</td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleActive(service.id, service.is_active)}
                    className={`px-2 py-1 rounded-full text-xs ${
                      service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {service.is_active ? 'Активна' : 'Скрыта'}
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => editService(service)} className="text-blue-500 mr-2">✏️</button>
                  <button onClick={() => handleDelete(service.id)} className="text-red-500">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};