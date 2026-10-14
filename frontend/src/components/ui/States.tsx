import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface StateProps {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Empty state: says why it is empty and offers the one action that fills it. */
export function EmptyState({ title, children, action, className }: StateProps) {
  return (
    <div className={cn('rounded-lg border border-dashed border-input bg-surface/60 px-6 py-10 text-center', className)}>
      <p className="font-display text-xl">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{children}</div>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

/** Error state: what failed and how to try again. */
export function ErrorState({ message, onRetry, className }: { message: string; onRetry?: () => void; className?: string }) {
  return (
    <div role="alert" className={cn('flex flex-col gap-3 rounded-lg border border-destructive/25 bg-destructive-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <p className="text-sm text-destructive">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Spróbuj ponownie
        </Button>
      )}
    </div>
  );
}

/** Loading rows shaped like the list they stand in for. */
export function LoadingRows({ rows = 4, label = 'Ładowanie', className }: { rows?: number; label?: string; className?: string }) {
  return (
    <div className={cn('divide-y rounded-lg border bg-surface', className)} aria-busy="true" aria-live="polite">
      <span className="sr-only">{label}…</span>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4" aria-hidden>
          <div className="flex-1 space-y-2">
            <div className="animate-skeleton h-3.5 w-2/5 rounded-sm bg-sunken" style={{ animationDelay: `${i * 120}ms` }} />
            <div className="animate-skeleton h-3 w-3/5 rounded-sm bg-sunken/70" style={{ animationDelay: `${i * 120}ms` }} />
          </div>
          <div className="animate-skeleton h-3 w-28 rounded-sm bg-sunken" style={{ animationDelay: `${i * 120}ms` }} />
        </div>
      ))}
    </div>
  );
}
