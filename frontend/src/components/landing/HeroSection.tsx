import { Link } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="noise-overlay relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center"
      style={{ background: 'linear-gradient(160deg, #f0f6ff 0%, #faf5ff 50%, #f0fffe 100%)' }}
    >
      {/* ── Animated gradient orbs ─────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blue orb – top left */}
        <div
          className="animate-blob-1 absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        {/* Purple orb – top right */}
        <div
          className="animate-blob-2 absolute -right-32 top-10 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />
        {/* Cyan orb – bottom center */}
        <div
          className="animate-blob-3 absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        {/* Extra pink accent */}
        <div
          className="animate-blob-2 absolute bottom-20 right-10 h-[300px] w-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.14) 0%, transparent 70%)', filter: 'blur(45px)', animationDelay: '10s' }}
        />
      </div>

      {/* ── Dot grid ─────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Badge ────────────────────────────────────────────────── */}
      <div
        className="relative mb-6 inline-flex items-center gap-2 overflow-hidden rounded-full border bg-white/80 px-4 py-1.5 text-sm font-medium shadow-md backdrop-blur-sm"
        style={{ animation: 'fade-in-scale 0.6s ease forwards' }}
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        Darmowy start · Bez karty kredytowej
        {/* Shimmer sweep */}
        <span className="animate-shimmer-badge pointer-events-none absolute inset-0 rounded-full" />
      </div>

      {/* ── Main headline ─────────────────────────────────────────── */}
      <h1
        className="mb-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
        style={{ animation: 'fadeInUp 0.8s ease forwards' }}
      >
        Znajdź{' '}
        <span className="gradient-text-animated">
          idealną pracę
        </span>{' '}
        z pomocą AI
      </h1>

      {/* ── Sub-headline ──────────────────────────────────────────── */}
      <p
        className="mb-8 max-w-xl text-lg text-muted-foreground"
        style={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}
      >
        Wgraj CV, otrzymaj spersonalizowany ranking ofert ze wszystkich polskich portali.
        AI analizuje każdą ofertę i mówi Ci dokładnie, co poprawić.
      </p>

      {/* ── CTA buttons ───────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-3 sm:flex-row"
        style={{ animation: 'fadeInUp 0.8s ease 0.4s both' }}
      >
        <Link
          to="/auth"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
        >
          {/* Hover shimmer on primary button */}
          <span
            className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-white/20 skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-[200%]"
          />
          <Upload className="h-4 w-4" />
          Wgraj CV za darmo
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 rounded-lg border bg-white/70 px-6 py-3 text-base font-semibold backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
        >
          Zobacz cennik
        </Link>
      </div>

      {/* ── Source logos ──────────────────────────────────────────── */}
      <div
        className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground"
        style={{ animation: 'fadeInUp 0.8s ease 0.6s both' }}
      >
        <span className="font-medium">Oferty z:</span>
        {['JustJoin.it', 'Pracuj.pl', 'NoFluffJobs', 'RocketJobs', 'OLX'].map(src => (
          <span
            key={src}
            className="rounded-md border bg-white/80 px-2.5 py-1 font-medium shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:shadow-md"
          >
            {src}
          </span>
        ))}
      </div>

      {/* ── Floating accent shapes ────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-float absolute left-[8%] top-[20%] h-3 w-3 rounded-full bg-blue-400/40"
          style={{ boxShadow: '0 0 12px 4px rgba(59,130,246,0.3)' }}
        />
        <div
          className="animate-float-delayed absolute right-[12%] top-[35%] h-2 w-2 rounded-full bg-purple-400/50"
          style={{ boxShadow: '0 0 10px 3px rgba(139,92,246,0.3)' }}
        />
        <div
          className="animate-float absolute left-[18%] bottom-[25%] h-2.5 w-2.5 rounded-full bg-cyan-400/40"
          style={{ boxShadow: '0 0 10px 3px rgba(6,182,212,0.3)' }}
        />
        <div
          className="animate-float-delayed absolute right-[20%] bottom-[30%] h-2 w-2 rounded-full bg-pink-400/40"
          style={{ boxShadow: '0 0 8px 2px rgba(244,114,182,0.3)' }}
        />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
