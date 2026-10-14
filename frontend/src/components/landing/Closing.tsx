import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/buttonVariants';

export default function Closing() {
  return (
    <section className="border-t bg-sunken/70">
      <div className="container grid items-center gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-20">
        <div>
          <h2 className="max-w-[20ch] font-display text-4xl font-medium leading-[1.08] tracking-[-0.015em] sm:text-5xl">
            Zacznij od CV. Resztę ułożymy na jednej liście.
          </h2>
          <p className="mt-4 max-w-prose text-lg leading-8 text-muted-foreground">
            Pierwsze dopasowania zobaczysz kilka sekund po wgraniu pliku.
          </p>
          <Link to="/auth" className={buttonVariants({ size: 'lg', className: 'mt-8' })}>
            Wgraj CV za darmo
          </Link>
        </div>
        <img
          src="/img/dopasowanie-zlozone.webp"
          alt="Ta sama rzeźba po dopasowaniu: zielony klucz osadzony w jasnym bloku, zęby wypełniają szczeliny."
          width={900}
          height={647}
          loading="lazy"
          className="mx-auto w-full max-w-[420px]"
        />
      </div>
    </section>
  );
}
