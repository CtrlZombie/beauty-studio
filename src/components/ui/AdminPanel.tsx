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
      pending: 'bg-accent-gold/10 text-accent-gold',
      confirmed: 'bg-success/10 text-success',
      cancelled: 'bg-error/10 text-error',
      completed: 'bg-accent-deep/10 text-accent-deep',
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
        <h2 className="font-display text-2xl font-light text-text-primary mb-4">Доступ запрещен</h2>
        <p className="text-text-muted">У вас нет прав администратора</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-light text-text-primary mb-8">Админ-панель</h1>

      {/* Вкладки */}
      <div className="flex gap-6 mb-8 border-b border-text-muted/10">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 text-sm transition-all duration-300 ${
            activeTab === 'appointments'
              ? 'border-b border-accent-gold text-text-primary'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Записи
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 text-sm transition-all duration-300 ${
            activeTab === 'services'
              ? 'border-b border-accent-gold text-text-primary'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Услуги
        </button>
        <button
          onClick={() => setActiveTab('trainings')}
          className={`pb-3 text-sm transition-all duration-300 ${
            activeTab === 'trainings'
              ? 'border-b border-accent-gold text-text-primary'
              : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Обучение
        </button>
      </div>

      {activeTab === 'appointments' && (
        <>
          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-soft border border-text-muted/5">
              <div className="text-2xl font-light text-text-primary">{stats.total}</div>
              <div className="text-xs text-text-muted mt-1">Всего записей</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-text-muted/5">
              <div className="text-2xl font-light text-accent-gold">{stats.pending}</div>
              <div className="text-xs text-text-muted mt-1">Ожидают</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-text-muted/5">
              <div className="text-2xl font-light text-success">{stats.confirmed}</div>
              <div className="text-xs text-text-muted mt-1">Подтверждено</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-text-muted/5">
              <div className="text-2xl font-light text-accent-deep">{stats.completed}</div>
              <div className="text-xs text-text-muted mt-1">Выполнено</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft border border-text-muted/5">
              <div className="text-2xl font-light text-text-primary">{stats.totalIncome} ₽</div>
              <div className="text-xs text-text-muted mt-1">Доход</div>
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
                    ? 'bg-accent-gold text-white'
                    : 'bg-background-secondary text-text-muted hover:text-text-primary'
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
              className="w-full md:w-80 px-4 py-2 bg-white border border-text-muted/20 rounded-xl focus:border-accent-gold focus:outline-none transition-all duration-300 text-sm"
            />
          </div>

          {/* Таблица записей */}
          <div className="bg-white rounded-2xl border border-text-muted/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-secondary border-b border-text-muted/10">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">Клиент</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">Услуга</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">Дата и время</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">Стоимость</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">Статус</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-text-muted">
                        <div className="w-6 h-6 border border-accent-gold border-t-transparent rounded-full animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-text-muted">Нет записей</td>
                    </tr>
                  ) : (
                    filteredAppointments.map((app) => (
                      <tr key={app.id} className="border-b border-text-muted/5 hover:bg-background-secondary/50 transition-colors duration-300">
                        <td className="p-4">
                          <div className="font-medium text-text-primary text-sm">{app.client_name}</div>
                          <div className="text-text-muted text-xs mt-0.5">{app.client_phone}</div>
                        </td>
                        <td className="p-4 text-text-secondary text-sm">{app.service_name}</td>
                        <td className="p-4">
                          <div className="text-text-primary text-sm">{new Date(app.appointment_date).toLocaleDateString('ru-RU')}</div>
                          <div className="text-text-muted text-xs mt-0.5">{app.appointment_time}</div>
                        </td>
                        <td className="p-4 text-text-primary text-sm">{app.price} ₽</td>
                        <td className="p-4">{getStatusBadge(app.status)}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {app.status === 'pending' && (
                              <button onClick={() => updateStatus(app.id, 'confirmed')} className="px-3 py-1 bg-success/10 text-success text-xs rounded-lg hover:bg-success/20">Подтвердить</button>
                            )}
                            {(app.status === 'pending' || app.status === 'confirmed') && (
                              <button onClick={() => updateStatus(app.id, 'cancelled')} className="px-3 py-1 bg-error/10 text-error text-xs rounded-lg hover:bg-error/20">Отменить</button>
                            )}
                            {app.status === 'confirmed' && (
                              <button onClick={() => updateStatus(app.id, 'completed')} className="px-3 py-1 bg-accent-deep/10 text-accent-deep text-xs rounded-lg hover:bg-accent-deep/20">Выполнить</button>
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
          <button onClick={loadAppointments} className="mt-6 text-xs text-text-muted hover:text-accent-gold transition-colors duration-300">
            Обновить список
          </button>
        </>
      )}

      {activeTab === 'services' && <ServicesManager />}
      {activeTab === 'trainings' && <TrainingRequestsManager />}
    </div>
  );
};