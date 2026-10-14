import { Link } from 'react-router-dom';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/buttonVariants';

type Cell = string | boolean;

const plans = [
  { key: 'free', name: 'Free', price: '0 zł', period: 'na zawsze', cta: 'Zacznij za darmo', href: '/auth' },
  { key: 'pro', name: 'Pro', price: '29 zł', period: 'miesięcznie', cta: 'Wybierz Pro', href: '/auth?plan=pro' },
  { key: 'premium', name: 'Premium', price: '99 zł', period: 'miesięcznie', cta: 'Wybierz Premium', href: '/auth?plan=premium' },
] as const;

const rows: { label: string; values: [Cell, Cell, Cell] }[] = [
  { label: 'Analiza CV i wynik ATS', values: [true, true, true] },
  { label: 'Dopasowanie do każdej oferty', values: [true, true, true] },
  { label: 'Oferty na liście', values: ['10 najlepszych dziennie', 'Bez limitu', 'Bez limitu'] },
  { label: 'Alerty e-mail', values: ['1 w tygodniu', 'Bez limitu', 'Bez limitu'] },
  { label: 'Tracker aplikacji', values: [false, true, true] },
  { label: 'Listy motywacyjne', values: [false, '10 miesięcznie', 'Bez limitu'] },
  { label: 'Tygodniowy raport', values: [false, true, true] },
  { label: 'Próbna rozmowa kwalifikacyjna (czat)', values: [false, false, true] },
];

function Value({ value }: { value: Cell }) {
  if (value === true) return <><Check className="h-4 w-4 text-primary" aria-hidden /><span className="sr-only">Tak</span></>;
  if (value === false) return <><Minus className="h-4 w-4 text-muted-foreground/60" aria-hidden /><span className="sr-only">Nie</span></>;
  return <span>{value}</span>;
}

/**
 * Pricing as a comparison table: the three tiers are the real model from the
 * product brief. Pro is tinted because it is the plan that unlocks the tracker
 * and letters this page talks about, not to fake popularity.
 */
export default function PricingSection() {
  return (
    <section id="cennik" className="scroll-mt-6 border-t">
      <div className="container py-20 lg:py-28">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <h2 className="max-w-[16ch] font-display text-4xl font-medium leading-[1.08] tracking-[-0.015em] sm:text-5xl">
            Zacznij za darmo. Płać, gdy szukasz na poważnie.
          </h2>
          <p className="max-w-prose text-lg leading-8 text-muted-foreground">
            Free wystarczy, żeby sprawdzić swoje CV i dziesięć najlepszych ofert dziennie. Pro dodaje tracker, listy i alerty bez limitu.
          </p>
        </div>

        {/* Desktop: one table, easy to compare row by row */}
        <div className="mt-12 hidden overflow-hidden rounded-lg border bg-surface md:block">
          <table className="w-full table-fixed text-left text-[0.9375rem]">
            <caption className="sr-only">Porównanie planów WorkSmart</caption>
            <thead>
              <tr className="border-b">
                <th scope="col" className="w-[34%] px-6 py-5 align-bottom text-meta font-medium text-muted-foreground">Plan</th>
                {plans.map(p => (
                  <th key={p.key} scope="col" className={cn('px-6 py-5 align-bottom', p.key === 'pro' && 'bg-primary-soft/70')}>
                    <span className="block text-sm font-semibold">{p.name}</span>
                    <span className="mt-1 block font-display text-4xl font-medium">{p.price}</span>
                    <span className="block text-meta font-normal text-muted-foreground">{p.period}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map(row => (
                <tr key={row.label}>
                  <th scope="row" className="px-6 py-3.5 font-normal">{row.label}</th>
                  {row.values.map((v, i) => (
                    <td key={i} className={cn('px-6 py-3.5', plans[i].key === 'pro' && 'bg-primary-soft/70')}>
                      <span className="flex items-center"><Value value={v} /></span>
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="px-6 py-5" />
                {plans.map(p => (
                  <td key={p.key} className={cn('px-6 py-5', p.key === 'pro' && 'bg-primary-soft/70')}>
                    <Link to={p.href} className={buttonVariants({ variant: p.key === 'pro' ? 'primary' : 'secondary', className: 'w-full' })}>
                      {p.cta}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile: one sheet per plan */}
        <div className="mt-10 space-y-4 md:hidden">
          {plans.map((p, pi) => (
            <div key={p.key} className={cn('rounded-lg border px-5 py-5', p.key === 'pro' ? 'border-primary/40 bg-primary-soft/60' : 'bg-surface')}>
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <p><span className="font-display text-3xl">{p.price}</span> <span className="text-meta text-muted-foreground">{p.period}</span></p>
              </div>
              <ul className="mt-4 space-y-2 text-[0.9375rem]">
                {rows.filter(r => r.values[pi] !== false).map(r => (
                  <li key={r.label} className="flex items-start justify-between gap-4 border-b border-dashed pb-2 last:border-0">
                    <span>{r.label}</span>
                    {typeof r.values[pi] === 'string' && <span className="text-right text-muted-foreground">{r.values[pi]}</span>}
                  </li>
                ))}
              </ul>
              <Link to={p.href} className={buttonVariants({ variant: p.key === 'pro' ? 'primary' : 'secondary', className: 'mt-5 w-full' })}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
