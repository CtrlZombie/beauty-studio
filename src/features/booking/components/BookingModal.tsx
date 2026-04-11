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
  skipServiceSelection?: boolean;
}

interface BookedSlot {
  appointment_date: string;
  appointment_time: string;
}

export const BookingModal = ({
  isOpen,
  onClose,
  skipServiceSelection = false,
}: BookingModalProps) => {
  const [step, setStep] = useState<"service" | "datetime" | "form">("service");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const { selectedService, setSelectedService, resetBooking } =
    useBookingStore();

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

  useEffect(() => {
    if (skipServiceSelection && selectedService && step === "service") {
      setStep("datetime");
    }
  }, [skipServiceSelection, selectedService, step]);

  useEffect(() => {
    if (selectedDate) {
      loadBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const loadBookedSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      console.log("=== loadBookedSlots ===");
      console.log("Запрашиваем дату:", formattedDate);

      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_date, appointment_time")
        .eq("appointment_date", formattedDate)
        .neq("status", "cancelled");

      if (error) throw error;

      console.log("Данные из Supabase:", data);
      console.log(
        "Тип appointment_date в первых данных:",
        typeof data?.[0]?.appointment_date,
      );

      setBookedSlots(data || []);
    } catch (error) {
      console.error("Error loading booked slots:", error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const isSlotBooked = (time: string) => {
    if (!selectedDate) return false;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    return bookedSlots.some((slot) => {
      const slotDate = slot.appointment_date.split("T")[0];
      // Убираем секунды из времени из базы (обрезаем :00 в конце)
      const slotTime = slot.appointment_time.replace(/:00$/, "");
      return slotDate === formattedDate && slotTime === time;
    });
  };

  const isSlotPast = (time: string) => {
    if (!selectedDate) return false;

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = selectedDate.toDateString() === today.toDateString();

    if (isToday) {
      const [hours, minutes] = time.split(":").map(Number);
      const slotTime = new Date(selectedDate);
      slotTime.setHours(hours, minutes, 0, 0);
      return slotTime < now;
    }
    return false;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleReset = () => {
    resetBooking();
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setStep(skipServiceSelection && selectedService ? "datetime" : "service");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={handleReset}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md max-h-[85vh] overflow-y-auto cursor-default custom-scroll"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleReset}
            className="absolute -top-10 right-0 text-white hover:text-gray-200 text-2xl z-10"
          >
            ✕
          </button>

          {step === "service" && (
            <div className="bg-white rounded-2xl p-5">
              <h3 className="text-xl font-semibold mb-4">Выберите услугу</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scroll pr-1">
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
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {service.price} ₽ • {service.duration} мин
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "datetime" && (
            <div className="bg-white rounded-2xl p-5">
              <h3 className="text-lg font-semibold mb-1">
                {selectedService?.name}
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Выберите дату и время
              </p>

              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateDisabled}
                locale={ru}
                className="mx-auto text-sm"
              />

              {selectedDate && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">
                    {format(selectedDate, "dd MMMM", { locale: ru })}:
                  </h4>
                  {isLoadingSlots ? (
                    <div className="text-center py-3">
                      <div className="inline-block w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {allAvailableTimes.map((time) => {
                        const isBooked = isSlotBooked(time);
                        const isPast = isSlotPast(time);
                        const isAvailable = !isBooked && !isPast;

                        return (
                          <button
                            key={time}
                            onClick={() => isAvailable && setSelectedTime(time)}
                            disabled={!isAvailable}
                            className={`py-2 rounded-lg border text-sm transition-all ${
                              isAvailable && selectedTime === time
                                ? "bg-pink-500 text-white border-pink-500"
                                : ""
                            }
                            ${
                              isAvailable && selectedTime !== time
                                ? "border-gray-200 hover:border-pink-500 hover:bg-pink-50 cursor-pointer"
                                : ""
                            }
                            ${
                              isBooked
                                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through"
                                : ""
                            }
                            ${
                              isPast && !isBooked
                                ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-5">
                {!skipServiceSelection && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep("service")}
                  >
                    Назад
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setStep("form")}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1"
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
