import { LayoutList, FileText, Briefcase, Columns3, Bell, PenLine, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  short: string;
  icon: LucideIcon;
  pro?: boolean;
}

// Icons are wayfinding only (navigation), drawn at 1.75 stroke to match the type weight.
export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Pulpit', short: 'Pulpit', icon: LayoutList },
  { to: '/jobs', label: 'Oferty', short: 'Oferty', icon: Briefcase },
  { to: '/tracker', label: 'Tracker aplikacji', short: 'Tracker', icon: Columns3 },
  { to: '/cv', label: 'Moje CV', short: 'CV', icon: FileText },
  { to: '/letter', label: 'Listy motywacyjne', short: 'Listy', icon: PenLine, pro: true },
  { to: '/alerts', label: 'Alerty', short: 'Alerty', icon: Bell },
];
