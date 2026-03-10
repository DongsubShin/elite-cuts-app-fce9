export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'barber';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  startTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
}

export interface QueueEntry {
  id: string;
  clientName: string;
  serviceName: string;
  estimatedWaitMinutes: number;
  position: number;
  status: 'waiting' | 'in-progress' | 'completed';
  joinedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit?: string;
  totalSpent: number;
  loyaltyPoints: number;
}

export interface AnalyticsSummary {
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  activeQueueCount: number;
  topServices: { name: string; count: number }[];
}