import { Link } from 'react-router-dom';
import MatchMeter from '@/components/ui/MatchMeter';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { sourceLabels } from '@/lib/utils';

export default function Hero() {
  return (
    <section className="container pb-12 pt-6 sm:pb-16 lg:pt-10">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6">
        <div className="animate-settle">
          <h1 className="max-w-[13ch] font-display text-[2.75rem] font-medium leading-[1.04] tracking-[-0.02em] sm:text-6xl lg:text-[4.25rem]">
            Pięć portali z ofertami. Jedna lista ułożona pod <span className="mark">Twoje CV</span>.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-8 text-muted-foreground">
            WorkSmart zbiera ogłoszenia z JustJoin.it, Pracuj.pl, NoFluffJobs, RocketJobs i OLX, porównuje każde z Twoim CV
            i pokazuje, czego brakuje. Ty decydujesz, gdzie aplikować.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/auth" className={buttonVariants({ size: 'lg' })}>
              Wgraj CV i zobacz dopasowania
            </Link>
            <a href="#jak-to-dziala" className={buttonVariants({ variant: 'ghost', size: 'lg', className: 'text-foreground' })}>
              Jak liczymy dopasowanie
            </a>
          </div>
          <p className="mt-6 text-meta text-muted-foreground">
            Plan Free bez karty. Nowe oferty zbieramy codziennie o 7:00 i 19:00.
          </p>
        </div>

        {/* Sculpture: your profile (pine key) above an offer's requirements (plaster block). */}
        <div className="relative mx-auto w-full max-w-[480px] animate-settle [animation-delay:120ms] lg:max-w-[560px]">
          <img
            src="/img/dopasowanie.webp"
            alt="Rzeźba: zielony klucz z zębami różnej długości zawieszony nad jasnym blokiem z wyciętymi szczelinami. Zęby trafiają dokładnie w szczeliny."
            width={1182}
            height={1109}
            fetchPriority="high"
            className="w-full"
          />
          <figure className="relative -mt-10 ml-auto w-[min(20rem,88%)] rounded-lg border bg-surface p-4 shadow-lift lg:absolute lg:bottom-[4%] lg:-left-10 lg:mt-0 lg:w-[19rem]">
            <p className="text-meta text-muted-foreground">Przykład z listy dopasowań · {sourceLabels.nofluffjobs}</p>
            <p className="mt-1 font-medium leading-snug">Mid Frontend Developer</p>
            <p className="text-meta text-muted-foreground">Kwadrat Software House · zdalnie</p>
            <MatchMeter score={89} size="sm" className="mt-3" />
            <figcaption className="mt-3 border-t pt-2.5 text-meta">
              Brakuje: <span className="gap-mark">Figma</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
