import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ServicesManager } from './ServicesManager';

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  service_name: string;
  price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
}

export const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'appointments' | 'services'>('appointments');

  useEffect(() => {
    if (isAdmin) {
      loadAppointments();
    }
  }, [isAdmin]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false });

      const { data, error } = await query;
      
      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    const texts: Record<string, string> = {
      pending: 'Ожидает',
      confirmed: 'Подтверждено',
      cancelled: 'Отменено',
      completed: 'Выполнено',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {texts[status]}
      </span>
    );
  };

  const filteredAppointments = appointments.filter(app => {
    if (filter !== 'all' && app.status !== filter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        app.client_name.toLowerCase().includes(searchLower) ||
        app.client_phone.includes(search) ||
        app.service_name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    totalIncome: appointments
      .filter(a => a.status === 'completed' || a.status === 'confirmed')
      .reduce((sum, a) => sum + a.price, 0),
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-light mb-4">Доступ запрещен</h2>
        <p className="text-gray-500">У вас нет прав администратора</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-light mb-8">Админ-панель</h1>
      
      {/* Вкладки */}
      <div className="flex gap-4 mb-6 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 px-2 text-sm transition-colors ${
            activeTab === 'appointments'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Записи
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-2 text-sm transition-colors ${
            activeTab === 'services'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Услуги
        </button>
      </div>

      {activeTab === 'appointments' ? (
        <>
          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-semibold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-400">Всего записей</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-semibold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-400">Ожидают</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-semibold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-gray-400">Подтверждено</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-semibold text-blue-600">{stats.completed}</div>
              <div className="text-sm text-gray-400">Выполнено</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-semibold text-gray-800">{stats.totalIncome} ₽</div>
              <div className="text-sm text-gray-400">Доход</div>
            </div>
          </div>
          
          {/* Фильтры */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Ожидают
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'confirmed' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Подтверждено
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Выполнено
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Отменено
            </button>
          </div>
          
          {/* Поиск */}
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени, телефону или услуге..."
              className="w-full md:w-96 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
          
          {/* Таблица записей */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Клиент</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Услуга</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Дата и время</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Стоимость</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Статус</th>
                    <th className="text-left p-4 text-sm font-medium text-gray-500">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-gray-400">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-gray-400">
                        Нет записей
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app) => (
                      <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-gray-800">{app.client_name}</div>
                          <div className="text-sm text-gray-400">{app.client_phone}</div>
                        </td>
                        <td className="p-4 text-gray-600">{app.service_name}</td>
                        <td className="p-4">
                          <div>{new Date(app.appointment_date).toLocaleDateString('ru-RU')}</div>
                          <div className="text-sm text-gray-400">{app.appointment_time}</div>
                        </td>
                        <td className="p-4 font-medium text-gray-700">{app.price} ₽</td>
                        <td className="p-4">{getStatusBadge(app.status)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {app.status === 'pending' && (
                              <button
                                onClick={() => updateStatus(app.id, 'confirmed')}
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Подтвердить
                              </button>
                            )}
                            {(app.status === 'pending' || app.status === 'confirmed') && (
                              <button
                                onClick={() => updateStatus(app.id, 'cancelled')}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                              >
                                Отменить
                              </button>
                            )}
                            {app.status === 'confirmed' && (
                              <button
                                onClick={() => updateStatus(app.id, 'completed')}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Выполнить
                              </button>
                            )}
                          </div>
                         </td>
                       </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <button
            onClick={loadAppointments}
            className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Обновить список
          </button>
        </>
      ) : (
        <ServicesManager />
      )}
    </div>
  );
};