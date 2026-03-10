import apiClient from './api-client';
import { QueueEntry } from '../../types';

export const queueService = {
  getLiveQueue: async (): Promise<QueueEntry[]> => {
    const { data } = await apiClient.get('/queue/live');
    return data;
  },
  joinQueue: async (entry: Partial<QueueEntry>): Promise<QueueEntry> => {
    const { data } = await apiClient.post('/queue/join', entry);
    return data;
  },
  updateStatus: async (id: string, status: string): Promise<void> => {
    await apiClient.patch(`/queue/${id}/status`, { status });
  },
};