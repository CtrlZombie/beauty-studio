import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Visit {
  id: string;
  service_name: string;
  price: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
}

export const VisitHistory = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (user) {
      loadVisitHistory();
    }
  }, [user]);

  const loadVisitHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error) {
      console.error('Error loading visit history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = visits.filter(visit => {
    if (filter === 'all') return true;
    return visit.status === filter;
  });

  const completedVisits = visits.filter(v => v.status === 'completed');
  const totalSpent = completedVisits.reduce((sum, v) => sum + v.price, 0);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-light text-gray-900">История посещений</h2>
            <p className="text-sm text-gray-400 mt-1">
              Всего визитов: {completedVisits.length} | Потрачено: {totalSpent} ₽
            </p>
          </div>
          
          {/* Фильтры */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Выполнено
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Отменено
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">У вас пока нет посещений</p>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-4 text-pink-500 text-sm hover:text-pink-600"
            >
              Записаться сейчас →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVisits.map((visit, index) => (
              <motion.div
                key={visit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-medium text-gray-800">{visit.service_name}</h3>
                      {getStatusBadge(visit.status)}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>📅 {formatDate(visit.appointment_date)}</span>
                      <span>⏰ {visit.appointment_time}</span>
                      <span>💰 {visit.price} ₽</span>
                    </div>
                    {visit.status === 'completed' && (
                      <div className="mt-2 text-xs text-gray-400">
                        <span>✅ Визит завершен</span>
                      </div>
                    )}
                    {visit.status === 'cancelled' && (
                      <div className="mt-2 text-xs text-red-400">
                        <span>❌ Запись отменена</span>
                      </div>
                    )}
                  </div>
                  
                  {(visit.status === 'completed' || visit.status === 'confirmed') && (
                    <button
                      onClick={() => {
                        // Здесь можно добавить запись на эту же услугу
                        const service = { name: visit.service_name };
                      }}
                      className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-colors"
                    >
                      Записаться снова
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Кнопка обновить */}
        <button
          onClick={loadVisitHistory}
          className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Обновить историю
        </button>
      </div>
    </div>
  );
};