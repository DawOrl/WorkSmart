import axios from 'axios';
import { supabase } from './supabase';
import { isStaticDemo } from './env';

export const api = axios.create({
  baseURL: isStaticDemo ? '' : (import.meta.env.VITE_API_URL ?? 'http://localhost:3001'),
});

// Static demo: answer every request in the browser from the shared demo data.
// The import is lazy, so regular builds never ship the demo data.
if (isStaticDemo) {
  api.defaults.adapter = async config => {
    const { mockAdapter } = await import('@/demo/mockApi');
    return mockAdapter(config);
  };
}

// Attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to auth on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  },
);

/** Human-readable message for a failed request, in Polish. */
export function apiErrorMessage(err: unknown, fallback = 'Nie udało się pobrać danych.'): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.';
    if (err.response.status === 429) return 'Zbyt wiele zapytań w krótkim czasie. Odczekaj chwilę i spróbuj ponownie.';
    if (err.response.status === 403) return 'Ta funkcja wymaga planu Pro.';
  }
  return fallback;
}
