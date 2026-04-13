import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format match score as colored string */
export function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-500';
}

/** Format salary range in PLN */
export function formatSalary(min?: number, max?: number, currency = 'PLN'): string {
  if (!min && !max) return 'Brak danych';
  if (min && max) return `${min.toLocaleString('pl-PL')} – ${max.toLocaleString('pl-PL')} ${currency}`;
  if (min) return `od ${min.toLocaleString('pl-PL')} ${currency}`;
  return `do ${max!.toLocaleString('pl-PL')} ${currency}`;
}

/** Format date to Polish locale */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
