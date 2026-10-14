import { cn, sourceLabels } from '@/lib/utils';
import type { JobSource } from '@/types';

/** Where the offer was collected. Square tag, not a pill: it is a label, not a status. */
export default function SourceTag({ source, className }: { source: JobSource; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 items-center whitespace-nowrap rounded-sm border bg-background px-1.5 text-xs font-medium text-muted-foreground', className)}>
      {sourceLabels[source] ?? source}
    </span>
  );
}
