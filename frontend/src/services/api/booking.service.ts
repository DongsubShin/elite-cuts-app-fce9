import apiClient from './api-client';
import { Booking, Service } from '../../types';

export const bookingService = {
  getServices: async (): Promise<Service[]> => {
    const { data } = await apiClient.get('/services');
    return data;
  },
  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    const { data } = await apiClient.post('/bookings', bookingData);
    return data;
  },
  getBookings: async (): Promise<Booking[]> => {
    const { data } = await apiClient.get('/bookings');
    return data;
  },
};