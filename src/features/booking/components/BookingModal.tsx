import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { BookingForm } from "./BookingForm";
import { useBookingStore } from "../store/bookingStore";
import { Button } from "../../../components/ui/Button";
import { services } from "../../../data/services";
import { supabase } from "../../../lib/supabase";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookedSlot {
  appointment_date: string;
  appointment_time: string;
}

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState<"service" | "datetime" | "form">("service");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const { selectedService, setSelectedService, resetBooking } =
    useBookingStore();

  // Все доступные временные слоты
  const allAvailableTimes = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Загружаем занятые слоты для выбранной даты
  useEffect(() => {
    if (selectedDate) {
      loadBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadBookedSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_date, appointment_time")
        .eq("appointment_date", formattedDate)
        .neq("status", "cancelled"); // Исключаем отмененные записи

      if (error) throw error;
      setBookedSlots(data || []);
    } catch (error) {
      console.error("Error loading booked slots:", error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Проверка, свободен ли слот
  const isSlotAvailable = (time: string) => {
    if (!selectedDate) return false;
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    return !bookedSlots.some(
      (slot) =>
        slot.appointment_date === formattedDate &&
        slot.appointment_time === time,
    );
  };

  // Получаем доступные временные слоты
  const getAvailableTimes = () => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Проверяем, выбран ли сегодняшний день
    const isToday =
      selectedDate && selectedDate.toDateString() === today.toDateString();

    return allAvailableTimes.filter((time) => {
      // Сначала проверяем, свободен ли слот
      if (!isSlotAvailable(time)) return false;

      // Если это сегодня, проверяем, не прошло ли уже это время
      if (isToday && selectedDate) {
        const [hours, minutes] = time.split(":").map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(hours, minutes, 0, 0);

        // Если время уже прошло, не показываем его
        if (slotTime < now) return false;
      }

      return true;
    });
  };

  // Проверка, можно ли выбрать дату (не в прошлом)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // Сбрасываем выбранное время при смене даты
  };

  const handleReset = () => {
    resetBooking();
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setStep("service");
    onClose();
  };

  if (!isOpen) return null;

  const availableTimes = getAvailableTimes();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleReset}
            className="absolute -top-10 right-0 text-white hover:text-gray-200 text-2xl z-10"
          >
            ✕
          </button>

          {step === "service" && (
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">Выберите услугу</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setStep("datetime");
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedService?.id === service.id
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-500">
                      {service.price} ₽ • {service.duration} мин
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "datetime" && (
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">Выберите дату и время</h3>

              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                locale={ru}
                className="mx-auto"
              />

              {selectedDate && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">
                    Доступное время на{" "}
                    {format(selectedDate, "dd MMMM yyyy", { locale: ru })}:
                  </h4>
                  {isLoadingSlots ? (
                    <div className="text-center py-4">
                      <div className="inline-block w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-gray-500 mt-2">
                        Загрузка расписания...
                      </p>
                    </div>
                  ) : availableTimes.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 rounded-lg border transition-all ${
                            selectedTime === time
                              ? "bg-pink-500 text-white border-pink-500"
                              : "border-gray-200 hover:border-pink-500 hover:bg-pink-50"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">
                        На эту дату нет свободного времени
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Пожалуйста, выберите другую дату
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep("service")}>
                  Назад
                </Button>
                <Button
                  onClick={() => setStep("form")}
                  disabled={
                    !selectedDate ||
                    !selectedTime ||
                    !isSlotAvailable(selectedTime || "")
                  }
                >
                  Далее
                </Button>
              </div>
            </div>
          )}

          {step === "form" && selectedDate && selectedTime && (
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSuccess={handleReset}
              onCancel={() => setStep("datetime")}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
