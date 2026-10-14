import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  as?: 'section' | 'div' | 'aside';
}

/** A sheet on the desk: surface colour and one hairline, no shadow. */
export default function Panel({ title, description, action, children, className, bodyClassName, as: Tag = 'section' }: Props) {
  return (
    <Tag className={cn('rounded-lg border bg-surface', className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-[0.9375rem] font-semibold leading-6">{title}</h2>}
            {description && <p className="mt-0.5 text-meta text-muted-foreground">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={cn('px-5 py-4', bodyClassName)}>{children}</div>
    </Tag>
  );
}
