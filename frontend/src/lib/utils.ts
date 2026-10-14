import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { JobSource, RemoteType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const nf = new Intl.NumberFormat('pl-PL');

/** Salary range in PLN, e.g. "12 000–17 000 zł" */
export function formatSalary(min?: number, max?: number, currency = 'PLN'): string {
  const unit = currency === 'PLN' ? 'zł' : currency;
  if (!min && !max) return 'Widełki nie podane';
  if (min && max) return `${nf.format(min)}–${nf.format(max)} ${unit}`;
  if (min) return `od ${nf.format(min)} ${unit}`;
  return `do ${nf.format(max!)} ${unit}`;
}

/** "14 października 2026" */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** "14 paź" */
export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
}

/** Polish plural: plural(5, 'dzień', 'dni', 'dni') */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Whole days between a date and now (past dates give positive numbers). */
export function daysSince(dateString: string): number {
  return Math.floor((Date.now() - new Date(dateString).getTime()) / 86_400_000);
}

/** "dziś", "wczoraj", "3 dni temu", "5 godz. temu" */
export function timeAgo(dateString: string): string {
  const ms = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(ms / 3_600_000);
  if (hours < 1) return 'przed chwilą';
  if (hours < 24) return `${hours} godz. temu`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'wczoraj';
  return `${days} ${plural(days, 'dzień', 'dni', 'dni')} temu`;
}

export const sourceLabels: Record<JobSource, string> = {
  justjoin: 'JustJoin.it',
  pracuj: 'Pracuj.pl',
  nofluffjobs: 'NoFluffJobs',
  rocketjobs: 'RocketJobs',
  olx: 'OLX',
};

export const remoteLabels: Record<RemoteType, string> = {
  remote: 'Zdalnie',
  hybrid: 'Hybrydowo',
  office: 'Stacjonarnie',
};

/** Place and mode in one string without repeating "Zdalnie". */
export function placeLabel(location?: string, remote?: RemoteType): string {
  const mode = remote ? remoteLabels[remote] : undefined;
  if (!location) return mode ?? '';
  if (!mode || location === mode) return location;
  return `${location} · ${mode.toLowerCase()}`;
}

export type MatchTone = 'strong' | 'good' | 'partial' | 'weak';

export function matchTone(score: number): MatchTone {
  if (score >= 80) return 'strong';
  if (score >= 65) return 'good';
  if (score >= 50) return 'partial';
  return 'weak';
}

export const matchToneLabel: Record<MatchTone, string> = {
  strong: 'Mocne dopasowanie',
  good: 'Dobre dopasowanie',
  partial: 'Częściowe',
  weak: 'Słabe',
};

export function firstName(fullName?: string, email?: string): string | undefined {
  if (fullName) return fullName.split(' ')[0];
  return email?.split('@')[0];
}

/** Wording for the ATS readability score (not a match). */
export function atsLabel(score: number): string {
  if (score >= 85) return 'Bardzo dobra czytelność';
  if (score >= 65) return 'Dobra czytelność';
  if (score >= 50) return 'Średnia czytelność';
  return 'Słaba czytelność';
}
