import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Button } from './Button';

interface TrainingRequestProps {
  className?: string;
}

export const TrainingRequest = ({ className = '' }: TrainingRequestProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    phone: '+7',
    email: '',
    course_type: 'eyebrows',
  });

  const formatPhone = (value: string) => {
    let digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '+7';
    if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
    const limited = digits.slice(0, 10);
    if (limited.length === 0) return '+7';
    if (limited.length <= 3) return `+7 (${limited}`;
    if (limited.length <= 6) return `+7 (${limited.slice(0, 3)}) ${limited.slice(3)}`;
    if (limited.length <= 8) return `+7 (${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    return `+7 (${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6, 8)}-${limited.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, phone: formatPhone(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast.error('Введите имя');
      return;
    }
    const cleanPhone = form.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11) {
      toast.error('Введите полный номер телефона');
      return;
    }
    setLoading(true);

    try {
      // 1. Сохраняем заявку в базу
      const { error } = await supabase.from('trainings').insert([{
        full_name: form.full_name,
        phone: form.phone,
        email: form.email || null,
        course_type: form.course_type,
      }]);
      if (error) throw error;

      // 2. Отправляем уведомление админу в Telegram
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/telegram-notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'new-training',
          data: {
            full_name: form.full_name,
            phone: form.phone,
            email: form.email,
            course_type: form.course_type,
          },
        }),
      }).catch((err) => console.error('Telegram notify error:', err));

      toast.success('Заявка отправлена! Мы свяжемся с вами.');
      setForm({ full_name: '', phone: '+7', email: '', course_type: 'eyebrows' });
    } catch (err) {
      console.error(err);
      toast.error('Ошибка при отправке. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const courseOptions = [
    { value: 'eyebrows', label: 'Брови' },
    { value: 'lashes', label: 'Ресницы' },
    { value: 'piercing', label: 'Пирсинг (базовый)' },
    { value: 'sugaring', label: 'Шугаринг' },
    { value: 'complex', label: 'Комплекс (брови+ресницы)' },
  ];

  return (
    <section className={`container-custom py-20 ${className}`}>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-px bg-accent-gold/40 mx-auto mb-6" />
          <h2 className="font-display text-2xl md:text-3xl font-light text-text-primary mb-3">
            Запись на обучение
          </h2>
          <p className="text-text-muted text-sm">
            Освойте профессию мастера с нуля или повысьте квалификацию
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Ваше имя *"
              required
              className="w-full px-4 py-3 border-b border-text-muted/20 focus:border-accent-gold outline-none transition-colors"
            />
          </div>
          <div>
            <input
              type="tel"
              value={form.phone}
              onChange={handlePhoneChange}
              placeholder="Телефон *"
              required
              className="w-full px-4 py-3 border-b border-text-muted/20 focus:border-accent-gold outline-none transition-colors"
            />
          </div>
          <div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email (необязательно)"
              className="w-full px-4 py-3 border-b border-text-muted/20 focus:border-accent-gold outline-none transition-colors"
            />
          </div>
          <div>
            <select
              value={form.course_type}
              onChange={(e) => setForm({ ...form, course_type: e.target.value })}
              className="w-full px-4 py-3 border-b border-text-muted/20 focus:border-accent-gold outline-none transition-colors bg-transparent"
            >
              {courseOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <Button type="submit" isLoading={loading} className="w-full mt-4">
            Отправить заявку
          </Button>
        </form>
      </div>
    </section>
  );
};