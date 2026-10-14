import type { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export default function PageHeader({ title, description, action }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em]">{title}</h1>
        {description && <p className="mt-2 max-w-prose text-[0.9375rem] text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  );
}
