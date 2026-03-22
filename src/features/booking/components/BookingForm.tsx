import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '../store/bookingStore';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';

const bookingSchema = z.object({
  client_name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  client_phone: z.string().min(10, 'Введите корректный номер телефона'),
  telegram_username: z.string().optional(),
  receive_notifications: z.boolean().default(false),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BookingForm = ({
  selectedDate,
  selectedTime,
  onSuccess,
  onCancel,
}: BookingFormProps) => {
  const { selectedService, resetBooking } = useBookingStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      receive_notifications: false,
    },
  });

  const receiveNotifications = watch('receive_notifications');

  const onSubmit = async (data: BookingFormValues) => {
    if (!selectedService) {
      toast.error('Выберите услугу');
      return;
    }

    const appointment = {
      client_name: data.client_name,
      client_phone: data.client_phone,
      telegram_chat_id: data.receive_notifications && data.telegram_username
        ? data.telegram_username
        : undefined,
      service_id: selectedService.id,
      service_name: selectedService.name,
      price: selectedService.price,
      appointment_date: selectedDate.toISOString().split('T')[0],
      appointment_time: selectedTime,
      status: 'pending',
      reminder_sent_1day: false,
      reminder_sent_2hour: false,
    };

    try {
      const { error } = await supabase.from('appointments').insert([appointment]);
      
      if (error) throw error;
      
      toast.success('Запись создана! Ждите подтверждения в Telegram');
      resetBooking();
      onSuccess();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Ошибка при записи. Попробуйте позже');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
    >
      <h3 className="text-2xl font-bold mb-4">Запись на услугу</h3>
      <p className="text-gray-600 mb-4">
        {selectedService?.name} • {selectedService?.price} ₽
      </p>
      <p className="text-sm text-gray-500 mb-6">
        {selectedDate.toLocaleDateString('ru-RU')} в {selectedTime}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            {...register('client_name')}
            placeholder="Ваше имя *"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.client_name && (
            <p className="text-red-500 text-sm mt-1">{errors.client_name.message}</p>
          )}
        </div>

        <div>
          <input
            {...register('client_phone')}
            placeholder="Телефон *"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.client_phone && (
            <p className="text-red-500 text-sm mt-1">{errors.client_phone.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('receive_notifications')}
            className="w-4 h-4 text-primary"
          />
          <label className="text-sm">Получать напоминания в Telegram</label>
        </div>

        <AnimatePresence>
          {receiveNotifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                {...register('telegram_username')}
                placeholder="@username в Telegram"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Подтвердить запись
          </Button>
        </div>
      </form>
    </motion.div>
  );
};