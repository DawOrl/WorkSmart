import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 500000, label: 'Ofert pracy', suffix: '+' },
  { value: 6, label: 'Portali w jednym miejscu', suffix: '' },
  { value: 78, label: 'Średni match score', suffix: '%' },
  { value: 4.5, label: 'Miesięcy szukania pracy średnio', suffix: 'mies.' },
];

/**
 * Stats section with count-up animation.
 * TODO: Replace useCountUp hook with ReactBits CountUp component after:
 *   npx shadcn@latest add "https://reactbits.dev/shadcn/count-up"
 */
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

function StatCard({ value, label, suffix, started }: { value: number; label: string; suffix: string; started: boolean }) {
  const count = useCountUp(value, 1800, started);
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border bg-background p-6 shadow-sm">
      <span className="text-4xl font-bold text-primary">
        {Number.isInteger(value) ? Math.round(count).toLocaleString('pl-PL') : count}
        <span className="ml-1 text-xl text-muted-foreground">{suffix}</span>
      </span>
      <span className="text-sm text-muted-foreground">{label}</span>
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
    <section ref={ref} className="bg-secondary/20 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-10 text-center text-2xl font-semibold">Dane mówią same za siebie</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(s => (
            <StatCard key={s.label} {...s} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
