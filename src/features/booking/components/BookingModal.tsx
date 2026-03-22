import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { BookingForm } from './BookingForm';
import { useBookingStore } from '../store/bookingStore';
import { Button } from '../../../components/ui/Button';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  const [step, setStep] = useState<'service' | 'datetime' | 'form'>('service');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const { selectedService, setSelectedService, resetBooking } = useBookingStore();

  const availableTimes = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  const handleReset = () => {
    resetBooking();
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setStep('service');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-2xl w-full"
        >
          <button
            onClick={handleReset}
            className="absolute -top-10 right-0 text-white hover:text-gray-200 text-2xl"
          >
            ✕
          </button>

          {step === 'service' && (
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">Выберите услугу</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* Здесь нужно отобразить список услуг из services */}
                <p className="text-gray-500">Выберите услугу из списка выше</p>
              </div>
              <Button onClick={() => selectedService && setStep('datetime')} disabled={!selectedService}>
                Далее
              </Button>
            </div>
          )}

          {step === 'datetime' && (
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4">Выберите дату и время</h3>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: new Date() }}
                className="mx-auto"
              />
              {selectedDate && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Доступное время:</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 rounded-lg border transition-all ${
                          selectedTime === time
                            ? 'bg-primary text-white border-primary'
                            : 'border-gray-200 hover:border-primary'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep('service')}>
                  Назад
                </Button>
                <Button onClick={() => setStep('form')} disabled={!selectedDate || !selectedTime}>
                  Далее
                </Button>
              </div>
            </div>
          )}

          {step === 'form' && selectedDate && selectedTime && (
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSuccess={handleReset}
              onCancel={() => setStep('datetime')}
            />
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};