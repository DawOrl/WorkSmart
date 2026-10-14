import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Wordmark from '@/components/ui/Wordmark';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3" aria-busy="true">
        <Wordmark className="text-2xl" />
        <p className="text-meta text-muted-foreground">Wczytuję Twoje konto…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
