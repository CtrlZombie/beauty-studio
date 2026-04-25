import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface TrainingRequest {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  course_type: string;
  status: string;
  created_at: string;
}

const courseLabels: Record<string, string> = {
  eyebrows: 'Брови',
  lashes: 'Ресницы',
  piercing: 'Пирсинг (базовый)',
  sugaring: 'Шугаринг',
  complex: 'Комплекс (брови+ресницы)',
};

const statusLabels: Record<string, string> = {
  new: 'Новая',
  processed: 'Обработана',
  cancelled: 'Отменена',
};

export const TrainingRequestsManager = () => {
  const [requests, setRequests] = useState<TrainingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      let query = supabase.from('trainings').select('*').order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка загрузки заявок');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('trainings')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      setRequests(requests.map(r => (r.id === id ? { ...r, status: newStatus } : r)));
      toast.success('Статус обновлён');
    } catch (error) {
      console.error(error);
      toast.error('Ошибка обновления');
    }
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-light">Заявки на обучение</h2>
        <button onClick={loadRequests} className="text-xs text-text-muted hover:text-accent-gold">
          Обновить
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'new', 'processed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              filter === status ? 'bg-accent-gold text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {status === 'all' ? 'Все' : statusLabels[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">Загрузка...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-8 text-text-muted">Нет заявок</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr><th className="text-left p-2">Дата</th><th>Имя</th><th>Телефон</th><th>Курс</th><th>Статус</th><th></th></tr>
            </thead>
            <tbody>
              {filteredRequests.map(req => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 text-text-muted">{new Date(req.created_at).toLocaleDateString()}</td>
                  <td className="p-2 font-medium">{req.full_name}</td>
                  <td className="p-2">{req.phone}</td>
                  <td className="p-2">{courseLabels[req.course_type] || req.course_type}</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      req.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                      req.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {statusLabels[req.status]}
                    </span>
                  </td>
                  <td className="p-2">
                    {req.status === 'new' && (
                      <button
                        onClick={() => updateStatus(req.id, 'processed')}
                        className="text-xs text-accent-gold hover:underline"
                      >
                        Отметить обработанной
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};