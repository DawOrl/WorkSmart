import { useEffect } from 'react';
import AppRouter from './router';
import { useAuth } from './hooks/useAuth';

export default function App() {
  // Initialize auth listener on mount
  useAuth();

  return <AppRouter />;
}
