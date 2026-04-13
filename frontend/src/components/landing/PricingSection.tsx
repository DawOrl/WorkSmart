import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '0 zł',
    period: 'zawsze',
    description: 'Zacznij bezpłatnie',
    highlight: false,
    features: [
      { text: 'Upload CV + analiza', included: true },
      { text: 'Top 10 dopasowanych ofert/dzień', included: true },
      { text: 'Match score dla każdej oferty', included: true },
      { text: '1 alert e-mail / tydzień', included: true },
      { text: 'Tracker aplikacji', included: false },
      { text: 'Listy motywacyjne', included: false },
      { text: 'Alerty real-time', included: false },
    ],
    cta: 'Zacznij za darmo',
    href: '/auth',
  },
  {
    name: 'Pro',
    price: '29 zł',
    period: 'miesięcznie',
    description: 'Dla poważnych poszukiwaczy',
    highlight: true,
    features: [
      { text: 'Wszystko z Free', included: true },
      { text: 'Unlimited oferty + alerty', included: true },
      { text: 'Tracker aplikacji', included: true },
      { text: 'Listy motywacyjne AI (10/mies.)', included: true },
      { text: 'Szczegółowa analiza ATS', included: true },
      { text: 'Tygodniowy raport kariery', included: true },
      { text: 'Mostek kompetencji', included: true },
    ],
    cta: 'Wybierz Pro',
    href: '/auth?plan=pro',
  },
  {
    name: 'Premium',
    price: '99 zł',
    period: 'miesięcznie',
    description: 'Kompletny pakiet',
    highlight: false,
    features: [
      { text: 'Wszystko z Pro', included: true },
      { text: 'Nielimitowane listy motyw.', included: true },
      { text: 'Mock interview AI (chat)', included: true },
      { text: 'CV rewrite full service', included: true },
      { text: 'Priorytet powiadomień', included: true },
      { text: 'B2B / licencje uczelni', included: true },
      { text: 'Dedykowane wsparcie', included: true },
    ],
    cta: 'Wybierz Premium',
    href: '/auth?plan=premium',
  },
];

export default function PricingSection() {
  return (
    <section className="bg-secondary/20 py-20" id="cennik">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold">Prosty cennik</h2>
          <p className="text-muted-foreground">Zacznij za darmo, przejdź na Pro gdy będziesz gotowy</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-2xl bg-background p-6 shadow-sm ${
                plan.highlight
                  ? 'border-2 border-primary shadow-lg scale-105'
                  : 'border'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Najpopularniejszy
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/ {plan.period}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="mb-6 space-y-2">
                {plan.features.map(f => (
                  <li key={f.text} className="flex items-center gap-2 text-sm">
                    {f.included
                      ? <Check className="h-4 w-4 text-green-500 shrink-0" />
                      : <X className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                    }
                    <span className={f.included ? '' : 'text-muted-foreground/50'}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={plan.href}
                className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-all hover:opacity-90 ${
                  plan.highlight
                    ? 'bg-primary text-primary-foreground'
                    : 'border bg-background hover:bg-accent'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
