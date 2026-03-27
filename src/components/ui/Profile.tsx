import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from './Button';

interface Appointment {
  id: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  price: number;
  status: string;
}

export const Profile = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user?.id)
        .order('appointment_date', { ascending: false });
      
      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    if (!confirm('Отменить запись?')) return;
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
      loadAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения';
      case 'confirmed': return 'Подтверждено';
      case 'cancelled': return 'Отменено';
      case 'completed': return 'Выполнено';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-light">Личный кабинет</h1>
            <div className="mt-2">
              <p className="text-gray-500 text-sm">
                {profile?.email || user.email}
              </p>
            </div>
            {isAdmin && (
              <span className="inline-block mt-2 px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded">
                Администратор
              </span>
            )}
          </div>
          <Button variant="outline" onClick={signOut}>
            Выйти
          </Button>
        </div>

        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-xl font-light mb-4">Мои записи</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">У вас пока нет записей</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((app) => (
                <div key={app.id} className="border border-gray-100 rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-medium">{app.service_name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(app.appointment_date).toLocaleDateString('ru-RU')} в {app.appointment_time}
                    </p>
                    <p className="text-sm font-medium text-pink-500 mt-1">{app.price} ₽</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>
                    {app.status === 'pending' && (
                      <button
                        onClick={() => cancelAppointment(app.id)}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Отменить
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};