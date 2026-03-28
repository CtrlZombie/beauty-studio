import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useBookingStore } from "../store/bookingStore";
import { Button } from "../../../components/ui/Button";
import { supabase } from "../../../lib/supabase";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "+7",
    receive_notifications: false,
    telegram_username: "",
  });
  const [errors, setErrors] = useState<{
    client_name?: string;
    client_phone?: string;
  }>({});

  // Функция для форматирования телефона (пользователь вводит только цифры, +7 ставится автоматически)
  const formatPhoneNumber = (value: string) => {
    // Удаляем все нецифровые символы
    let digits = value.replace(/\D/g, "");

    // Если пользователь начал вводить номер, всегда показываем +7
    if (digits.length === 0) return "+7";

    // Убираем первые цифры, если пользователь ввел 7 или 8 в начале
    if (digits.startsWith("7") || digits.startsWith("8")) {
      digits = digits.slice(1);
    }

    // Ограничиваем 10 цифрами (после +7)
    const limitedDigits = digits.slice(0, 10);

    // Форматируем по маске +7 (XXX) XXX-XX-XX
    if (limitedDigits.length === 0) return "+7";
    if (limitedDigits.length <= 3) return `+7 (${limitedDigits}`;
    if (limitedDigits.length <= 6)
      return `+7 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
    if (limitedDigits.length <= 8)
      return `+7 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6)}`;
    return `+7 (${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)}-${limitedDigits.slice(6, 8)}-${limitedDigits.slice(8, 10)}`;
  };

  // Обработчик изменения телефона
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, client_phone: formatted });
  };

  const checkSlotAvailable = async (date: string, time: string) => {
    const { data, error } = await supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", date)
      .eq("appointment_time", time)
      .neq("status", "cancelled");

    if (error) throw error;
    return data?.length === 0;
  };

  const validate = () => {
    const newErrors: { client_name?: string; client_phone?: string } = {};

    if (!formData.client_name.trim()) {
      newErrors.client_name = "Введите имя";
    } else if (formData.client_name.length < 2) {
      newErrors.client_name = "Имя должно содержать минимум 2 символа";
    }

    if (!formData.client_phone.trim() || formData.client_phone === "+7") {
      newErrors.client_phone = "Введите телефон";
    } else {
      const phoneDigits = formData.client_phone.replace(/\D/g, "");
      if (phoneDigits.length !== 11) {
        newErrors.client_phone = "Введите полный номер телефона (11 цифр)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) {
      toast.error("Выберите услугу");
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);

    const appointmentDate = selectedDate.toISOString().split("T")[0];

    try {
      // Проверяем, не занят ли слот
      const isAvailable = await checkSlotAvailable(
        appointmentDate,
        selectedTime,
      );

      if (!isAvailable) {
        toast.error(
          "❌ К сожалению, это время уже занято. Пожалуйста, выберите другое время",
        );
        onCancel();
        return;
      }

      // Получаем текущего пользователя (если есть)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const appointment = {
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        telegram_chat_id:
          formData.receive_notifications && formData.telegram_username
            ? formData.telegram_username
            : null,
        service_id: selectedService.id,
        service_name: selectedService.name,
        price: selectedService.price,
        appointment_date: appointmentDate,
        appointment_time: selectedTime,
        status: "pending" as const,
        reminder_sent_1day: false,
        reminder_sent_2hour: false,
        user_id: user?.id || null, // Если пользователь не авторизован, ставим null
      };

      const { error } = await supabase
        .from("appointments")
        .insert([appointment]);

      if (error) throw error;

      toast.success("✅ Запись создана!");
      resetBooking();
      onSuccess();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("❌ Ошибка при записи. Попробуйте позже");
    } finally {
      setIsSubmitting(false);
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
        {selectedDate.toLocaleDateString("ru-RU")} в {selectedTime}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            value={formData.client_name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, client_name: e.target.value })
            }
            placeholder="Ваше имя *"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.client_name && (
            <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            value={formData.client_phone}
            onChange={handlePhoneChange}
            placeholder="+7 (___) ___-__-__"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          {errors.client_phone && (
            <p className="text-red-500 text-sm mt-1">{errors.client_phone}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.receive_notifications}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({
                ...formData,
                receive_notifications: e.target.checked,
              })
            }
            className="w-4 h-4 text-pink-500"
          />
          <label className="text-sm">Получать напоминания в Telegram</label>
        </div>

        <AnimatePresence>
          {formData.receive_notifications && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                value={formData.telegram_username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    telegram_username: e.target.value,
                  })
                }
                placeholder="@username в Telegram"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
