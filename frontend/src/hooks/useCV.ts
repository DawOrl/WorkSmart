import { useState } from 'react';
import { api } from '@/lib/api';
import type { CVProfile } from '@/types';

export function useCV() {
  const [cvProfile, setCvProfile] = useState<CVProfile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadCV = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('cv', file);
      const { data } = await api.post<CVProfile>('/api/cv/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCvProfile(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Błąd przesyłania CV';
      setError(msg);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const loadCV = async () => {
    try {
      const { data } = await api.get<CVProfile>('/api/cv/me');
      setCvProfile(data);
    } catch {
      // No CV yet
    }
  };

  return { cvProfile, uploading, error, uploadCV, loadCV };
}
