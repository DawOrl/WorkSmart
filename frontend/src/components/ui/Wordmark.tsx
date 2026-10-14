import { cn } from '@/lib/utils';

/** Product name set in the display serif. No invented logo: the favicon repeats the key shape from the hero sculpture. */
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('font-display text-[1.375rem] font-medium leading-none tracking-[-0.01em]', className)}>
      Work<span className="italic">Smart</span>
    </span>
  );
}
