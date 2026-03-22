export interface Service {
  id: string;
  category: 'ears' | 'eyebrows' | 'lashes' | 'sugaring';
  name: string;
  price: number;
  duration: number; // minutes
  description?: string;
}

export interface Appointment {
  id?: string;
  client_name: string;
  client_phone: string;
  telegram_chat_id?: string;
  service_id: string;
  service_name: string;
  price: number;
  appointment_date: string; // ISO string
  appointment_time: string; // HH:MM
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  reminder_sent_1day: boolean;
  reminder_sent_2hour: boolean;
  created_at?: string;
}

export interface BookingFormData {
  client_name: string;
  client_phone: string;
  telegram_username?: string;
  service_id: string;
  appointment_date: Date;
  appointment_time: string;
  receive_notifications: boolean;
}