import { Link } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';

/**
 * Hero section with animated text effects.
 * Uses inline CSS animations as ReactBits fallback –
 * replace with actual ReactBits components after running:
 *   npx shadcn@latest add "https://reactbits.dev/shadcn/blur-text"
 *   npx shadcn@latest add "https://reactbits.dev/shadcn/click-spark"
 */
export default function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background to-secondary/20 px-4 text-center">
      {/* Background grid decoration */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium shadow-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        Darmowy start · Bez karty kredytowej
      </div>

      {/* Main headline – replace with ReactBits BlurText */}
      <h1
        className="mb-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        style={{ animation: 'fadeInUp 0.8s ease forwards' }}
      >
        Znajdź{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          idealną pracę
        </span>{' '}
        z pomocą AI
      </h1>

      {/* Sub-headline */}
      <p
        className="mb-8 max-w-xl text-lg text-muted-foreground"
        style={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}
      >
        Wgraj CV, otrzymaj spersonalizowany ranking ofert ze wszystkich polskich portali.
        AI analizuje każdą ofertę i mówi Ci dokładnie, co poprawić.
      </p>

      {/* CTA buttons – replace inner button with ReactBits ClickSpark */}
      <div
        className="flex flex-col gap-3 sm:flex-row"
        style={{ animation: 'fadeInUp 0.8s ease 0.4s both' }}
      >
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          <Upload className="h-4 w-4" />
          Wgraj CV za darmo
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 rounded-lg border bg-background px-6 py-3 text-base font-semibold transition-all hover:bg-accent"
        >
          Zobacz cennik
        </Link>
      </div>

      {/* Source logos */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <span>Oferty z:</span>
        {['JustJoin.it', 'Pracuj.pl', 'NoFluffJobs', 'RocketJobs', 'OLX'].map(src => (
          <span key={src} className="rounded-md border bg-background px-2 py-1 font-medium">
            {src}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
