import { create } from 'zustand';
import {type Service, type BookingFormData } from '../../../types';

interface BookingState {
  selectedService: Service | null;
  bookingData: Partial<BookingFormData>;
  setSelectedService: (service: Service | null) => void;
  updateBookingData: (data: Partial<BookingFormData>) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedService: null,
  bookingData: {},
  setSelectedService: (service) => set({ selectedService: service }),
  updateBookingData: (data) =>
    set((state) => ({ bookingData: { ...state.bookingData, ...data } })),
  resetBooking: () => set({ selectedService: null, bookingData: {} }),
}));