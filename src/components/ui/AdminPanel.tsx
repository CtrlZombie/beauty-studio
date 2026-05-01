import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ServicesManager } from './ServicesManager';
import { TrainingRequestsManager } from './TrainingRequestsManager';

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
  const [activeTab, setActiveTab] = useState<'appointments' | 'services' | 'trainings'>('appointments');

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
      setAppointments(appointments.map(app => app.id === id ? { ...app, status: newStatus } : app));
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
        <h2 className="text-2xl font-light text-gray-800 mb-4">Доступ запрещен</h2>
        <p className="text-gray-500">У вас нет прав администратора</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-light text-gray-800 mb-8">Админ-панель</h1>

      {/* Вкладки */}
      <div className="flex gap-6 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 text-sm transition-all duration-300 ${
            activeTab === 'appointments'
              ? 'border-b-2 border-pink-500 text-pink-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Записи
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 text-sm transition-all duration-300 ${
            activeTab === 'services'
              ? 'border-b-2 border-pink-500 text-pink-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Услуги
        </button>
        <button
          onClick={() => setActiveTab('trainings')}
          className={`pb-3 text-sm transition-all duration-300 ${
            activeTab === 'trainings'
              ? 'border-b-2 border-pink-500 text-pink-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Обучение
        </button>
      </div>

      {activeTab === 'appointments' && (
        <>
          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-light text-gray-800">{stats.total}</div>
              <div className="text-xs text-gray-400 mt-1">Всего записей</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-light text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-gray-400 mt-1">Ожидают</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-light text-green-600">{stats.confirmed}</div>
              <div className="text-xs text-gray-400 mt-1">Подтверждено</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-light text-blue-600">{stats.completed}</div>
              <div className="text-xs text-gray-400 mt-1">Выполнено</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-light text-gray-800">{stats.totalIncome} ₽</div>
              <div className="text-xs text-gray-400 mt-1">Доход</div>
            </div>
          </div>

          {/* Фильтры */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 ${
                  filter === status
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status === 'all' && 'Все'}
                {status === 'pending' && 'Ожидают'}
                {status === 'confirmed' && 'Подтверждено'}
                {status === 'completed' && 'Выполнено'}
                {status === 'cancelled' && 'Отменено'}
              </button>
            ))}
          </div>

          {/* Поиск */}
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени, телефону или услуге..."
              className="w-full md:w-80 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none transition-all duration-300 text-sm"
            />
          </div>

          {/* Таблица записей */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Клиент</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Услуга</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Дата и время</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Стоимость</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-gray-400">
                        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-gray-500">Нет записей</td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app) => (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300">
                        <td className="p-4">
                          <div className="font-medium text-gray-800 text-sm">{app.client_name}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{app.client_phone}</div>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">{app.service_name}</td>
                        <td className="p-4">
                          <div className="text-gray-800 text-sm">{new Date(app.appointment_date).toLocaleDateString('ru-RU')}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{app.appointment_time}</div>
                        </td>
                        <td className="p-4 text-gray-800 text-sm">{app.price} ₽</td>
                        <td className="p-4">{getStatusBadge(app.status)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {app.status === 'pending' && (
                              <button onClick={() => updateStatus(app.id, 'confirmed')} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200 transition-colors">
                                Подтвердить
                              </button>
                            )}
                            {(app.status === 'pending' || app.status === 'confirmed') && (
                              <button onClick={() => updateStatus(app.id, 'cancelled')} className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200 transition-colors">
                                Отменить
                              </button>
                            )}
                            {app.status === 'confirmed' && (
                              <button onClick={() => updateStatus(app.id, 'completed')} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 transition-colors">
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
          <button onClick={loadAppointments} className="mt-6 text-xs text-gray-400 hover:text-pink-500 transition-colors duration-300">
            Обновить список
          </button>
        </>
      )}

      {activeTab === 'services' && <ServicesManager />}
      {activeTab === 'trainings' && <TrainingRequestsManager />}
    </div>
  );
};