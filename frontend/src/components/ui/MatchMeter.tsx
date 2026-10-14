import { cn, matchTone, matchToneLabel, type MatchTone } from '@/lib/utils';

const TICKS = 20;

const fill: Record<MatchTone, string> = {
  strong: 'bg-primary',
  good: 'bg-foreground/75',
  partial: 'bg-foreground/45',
  weak: 'bg-foreground/25',
};

const text: Record<MatchTone, string> = {
  strong: 'text-primary',
  good: 'text-foreground',
  partial: 'text-foreground/80',
  weak: 'text-muted-foreground',
};

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  /** Overrides the default match wording, e.g. for the ATS readability score. */
  label?: string;
  className?: string;
}

/**
 * Match score as a ruler of 20 ticks: readable at a glance, calm (no red/green
 * traffic lights for a stressful decision), and the same shape everywhere.
 */
export default function MatchMeter({ score, size = 'md', showLabel = false, label, className }: Props) {
  const tone = matchTone(score);
  const filled = Math.round((score / 100) * TICKS);

  return (
    <div
      className={cn('flex items-center gap-3', className)}
      role="img"
      aria-label={`${label ?? 'Dopasowanie'} ${score} na 100${label ? '' : `, ${matchToneLabel[tone].toLowerCase()}`}`}
    >
      <span
        className={cn(
          'num font-semibold tracking-tight',
          text[tone],
          size === 'sm' && 'w-8 text-right text-[0.9375rem]',
          size === 'md' && 'w-10 text-right text-xl',
          size === 'lg' && 'font-display text-6xl font-medium leading-none',
        )}
      >
        {score}
      </span>
      <div className="min-w-0 flex-1">
        <div className={cn('flex gap-[2px]', size === 'lg' ? 'h-4' : size === 'md' ? 'h-3' : 'h-2.5')} aria-hidden>
          {Array.from({ length: TICKS }, (_, i) => (
            <span
              key={i}
              className={cn(
                'flex-1 rounded-[1px]',
                i < filled ? fill[tone] : 'bg-foreground/10',
                i % 5 === 4 && i < TICKS - 1 && 'mr-[2px]',
              )}
            />
          ))}
        </div>
        {showLabel && <p className={cn('mt-1.5 text-meta', text[tone])}>{label ?? matchToneLabel[tone]}</p>}
      </div>
    </div>
  );
}
