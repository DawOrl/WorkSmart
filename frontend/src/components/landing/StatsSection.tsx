import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 500000, label: 'Ofert pracy', suffix: '+', color: 'from-blue-500 to-cyan-400' },
  { value: 6, label: 'Portali w jednym miejscu', suffix: '', color: 'from-purple-500 to-violet-400' },
  { value: 78, label: 'Średni match score', suffix: '%', color: 'from-green-500 to-emerald-400' },
  { value: 4.5, label: 'Miesięcy szukania pracy średnio', suffix: 'mies.', color: 'from-orange-500 to-amber-400' },
];

function useCountUp(end: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = Date.now();
    const isFloat = !Number.isInteger(end);
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(isFloat ? 1 : 0)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function StatCard({ value, label, suffix, color, started, index }: {
  value: number; label: string; suffix: string; color: string; started: boolean; index: number;
}) {
  const count = useCountUp(value, 1800, started);
  return (
    <div
      className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/60 bg-white/60 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        opacity: started ? 1 : 0,
        transform: started ? 'none' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 120}ms, transform 0.5s ease ${index * 120}ms, box-shadow 0.3s ease`,
      }}
    >
      {/* Top gradient line */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />

      {/* Glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.05) 0%, transparent 70%)' }}
      />

      <span className={`bg-gradient-to-br ${color} bg-clip-text text-4xl font-bold text-transparent`}>
        {Number.isInteger(value) ? Math.round(count).toLocaleString('pl-PL') : count}
        <span className="ml-1 text-xl">{suffix}</span>
      </span>
      <span className="text-center text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden py-20">
      {/* ── Background ────────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #ecfdf5 100%)' }}
      />

      {/* Animated mesh orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-blob-2 absolute left-1/4 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 65%)', filter: 'blur(50px)' }}
        />
        <div
          className="animate-blob-1 absolute right-1/4 bottom-0 h-[300px] w-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 65%)', filter: 'blur(50px)' }}
        />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container relative mx-auto px-4">
        <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight">
          Dane mówią same za siebie
        </h2>
        <div ref={ref} className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} started={started} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
