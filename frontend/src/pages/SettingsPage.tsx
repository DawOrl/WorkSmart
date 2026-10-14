import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/hooks/useAuth';
import { isDemo } from '@/lib/env';
import { formatDate } from '@/lib/utils';
import PageHeader from '@/components/ui/PageHeader';
import Panel from '@/components/ui/Panel';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/buttonVariants';

const planName = { free: 'Free', pro: 'Pro', premium: 'Premium' } as const;
const planNote = {
  free: 'Top 10 ofert dziennie i 1 alert tygodniowo.',
  pro: '29 zł miesięcznie. Bez limitu ofert i alertów, 10 listów motywacyjnych w miesiącu.',
  premium: '99 zł miesięcznie. Wszystko z Pro i listy bez limitu.',
} as const;

export default function SettingsPage() {
  const { profile, user } = useAuthStore();
  const plan = profile?.plan ?? 'free';

  const rows: [string, string][] = [
    ['Imię i nazwisko', profile?.full_name ?? 'Nie podano'],
    ['E-mail', profile?.email ?? user?.email ?? 'Nie podano'],
    ['Konto od', profile?.created_at ? formatDate(profile.created_at) : 'Nie podano'],
  ];

  return (
    <div className="mx-auto max-w-2xl animate-settle">
      <PageHeader title="Ustawienia" />

      <div className="space-y-6">
        <Panel title="Konto" bodyClassName="p-0">
          <dl className="divide-y">
            {rows.map(([label, value]) => (
              <div key={label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[12rem_minmax(0,1fr)]">
                <dt className="text-meta text-muted-foreground sm:text-sm">{label}</dt>
                <dd className="break-words text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title={`Plan ${planName[plan]}`} action={<Link to="/pricing" className="text-sm font-medium text-primary hover:underline">Porównaj plany</Link>}>
          <p className="text-sm text-muted-foreground">{planNote[plan]}</p>
          {plan === 'free' && <Link to="/pricing" className={buttonVariants({ className: 'mt-4' })}>Przejdź na Pro</Link>}
        </Panel>

        {isDemo && (
          <p className="rounded-lg bg-sunken/70 px-5 py-4 text-sm text-muted-foreground">
            To konto demonstracyjne. Dane są przykładowe, e-maile nie są wysyłane, a zmiany znikają po odświeżeniu strony.
          </p>
        )}

        <div className="flex justify-end">
          <Button variant="danger" onClick={() => void signOut()}>Wyloguj się</Button>
        </div>
      </div>
    </div>
  );
}
