import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Alert } from '@/types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Alert[]>('/api/alerts');
      setAlerts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAlert = async (payload: Partial<Alert>) => {
    const { data } = await api.post<Alert>('/api/alerts', payload);
    setAlerts(prev => [...prev, data]);
    return data;
  };

  const updateAlert = async (id: string, payload: Partial<Alert>) => {
    const { data } = await api.patch<Alert>(`/api/alerts/${id}`, payload);
    setAlerts(prev => prev.map(a => a.id === id ? data : a));
    return data;
  };

  const deleteAlert = async (id: string) => {
    await api.delete(`/api/alerts/${id}`);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return { alerts, loading, fetchAlerts, createAlert, updateAlert, deleteAlert };
}
