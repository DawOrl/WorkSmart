import { cn } from '@/lib/utils';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

/** Accessible on/off switch (role="switch"), 44px hit area. */
export default function Switch({ checked, onChange, label, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex h-11 w-14 items-center justify-center rounded-md disabled:opacity-50"
    >
      <span className={cn('relative h-6 w-10 rounded-full border transition-colors', checked ? 'border-primary bg-primary' : 'border-input bg-sunken')}>
        <span
          className={cn(
            'absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-surface shadow-sm transition-transform',
            checked ? 'translate-x-[1.125rem]' : 'translate-x-[0.1875rem]',
          )}
        />
      </span>
    </button>
  );
}
