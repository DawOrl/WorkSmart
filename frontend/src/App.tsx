import AppRouter from './router';
import { useAuthListener } from './hooks/useAuth';

export default function App() {
  useAuthListener();
  return <AppRouter />;
}
