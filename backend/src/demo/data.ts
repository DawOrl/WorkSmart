// ─── Demo data ───────────────────────────────────────────────────────────────
// Single source of truth for demo mode. Used by the backend (DEMO_MODE=true)
// and imported by the frontend's static demo (VITE_DEMO_STATIC=true), so the
// public demo works with no server and no keys.
//
// Companies and people are fictional. Timestamps are relative to "now", so the
// demo never looks stale.

import type { CVProfile, JobListing, MatchScore, Application, Alert, UserProfile } from '../types/index.js';

export const DEMO_USER_ID = 'demo-user-00000000-0000-0000-0000-000000000001';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const ago = (days: number, hours = 0) => new Date(Date.now() - days * DAY - hours * HOUR).toISOString();
const ahead = (days: number, hour: number) => {
  const d = new Date(Date.now() + days * DAY);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const DEMO_PROFILE: UserProfile = {
  id: DEMO_USER_ID,
  email: 'demo@worksmart.pl',
  full_name: 'Marta Zielińska',
  plan: 'pro',
  created_at: ago(64),
};

export const DEMO_CV: CVProfile = {
  id: 'demo-cv-00000000-0000-0000-0000-000000000001',
  user_id: DEMO_USER_ID,
  file_url: 'marta-zielinska-cv.pdf',
  raw_text: 'Marta Zielińska, Frontend Developer z 3-letnim doświadczeniem w React i TypeScript...',
  skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'REST API', 'Git', 'Node.js', 'SQL', 'Agile / Scrum'],
  experience: [
    {
      company: 'Koszyk24',
      role: 'Frontend Developer',
      start: '2023-03',
      description: 'Panel sprzedawcy w React i TypeScript, migracja modułów z JavaScript, wspólna biblioteka komponentów z zespołem projektowym.',
    },
    {
      company: 'Studio Klon',
      role: 'Junior Frontend Developer',
      start: '2022-01',
      end: '2023-02',
      description: 'Strony i sklepy dla lokalnych firm: HTML, CSS, JavaScript, pierwsze projekty w React.',
    },
  ],
  education: [
    { institution: 'Politechnika Łódzka', degree: 'Inżynier', field: 'Informatyka', graduation: '2021' },
  ],
  ats_score: 72,
  suggestions: [
    {
      issue: 'Brak słów kluczowych o testowaniu',
      fix: 'Jeśli piszesz testy, dopisz Jest albo React Testing Library w sekcji Umiejętności. Systemy ATS szukają tych nazw dosłownie.',
      impact: 'high',
    },
    {
      issue: 'Podsumowanie ma jedno zdanie',
      fix: 'Rozwiń je do 3-4 zdań: specjalizacja, najważniejszy projekt i czego szukasz w nowej pracy.',
      impact: 'medium',
    },
    {
      issue: 'Brak linku do GitHuba lub portfolio',
      fix: 'Dodaj adres w nagłówku CV, obok telefonu i e-maila.',
      impact: 'medium',
    },
    {
      issue: 'Daty zapisane w dwóch formatach',
      fix: 'Ujednolić zapis do MM.RRRR, np. 03.2023. Część systemów ATS źle czyta mieszane formaty.',
      impact: 'low',
    },
  ],
  created_at: ago(40),
  updated_at: ago(2, 3),
};

type JobSeed = Omit<JobListing, 'external_id' | 'currency' | 'is_active' | 'url' | 'scraped_at'> & {
  slug: string;
  age: number; // hours since the offer was collected
};

const SOURCE_URL: Record<JobListing['source'], string> = {
  justjoin: 'https://justjoin.it/job-offer/',
  pracuj: 'https://www.pracuj.pl/praca/',
  nofluffjobs: 'https://nofluffjobs.com/pl/job/',
  rocketjobs: 'https://rocketjobs.pl/oferta-pracy/',
  olx: 'https://www.olx.pl/oferta/praca/',
};

const seeds: JobSeed[] = [
  {
    id: 'job-00000001', slug: 'lumen-fintech-frontend-react', source: 'justjoin', age: 5,
    title: 'Frontend Developer (React)', company: 'Lumen Fintech', location: 'Warszawa', remote_type: 'hybrid',
    salary_min: 14000, salary_max: 19000,
    description: 'Rozwijasz aplikację do rozliczeń dla małych firm. Zespół pięciu osób, wydania co tydzień, dwa dni w biurze na Mokotowie.',
    requirements: ['React', 'TypeScript', 'REST API', 'Git', 'Jest', 'Tailwind CSS'],
  },
  {
    id: 'job-00000002', slug: 'kwadrat-mid-frontend', source: 'nofluffjobs', age: 9,
    title: 'Mid Frontend Developer', company: 'Kwadrat Software House', location: 'Zdalnie', remote_type: 'remote',
    salary_min: 12000, salary_max: 17000,
    description: 'Produktowy software house. Budujesz aplikacje SaaS od zera dla klientów z Wielkiej Brytanii, współpracujesz bezpośrednio z projektantem.',
    requirements: ['React', 'TypeScript', 'HTML/CSS', 'Git', 'REST API', 'Figma'],
  },
  {
    id: 'job-00000003', slug: 'polna-logistics-react', source: 'pracuj', age: 20,
    title: 'React Developer', company: 'Polna Logistics', location: 'Wrocław', remote_type: 'hybrid',
    salary_min: 9000, salary_max: 13000,
    description: 'Wewnętrzny system do planowania tras dla floty 400 aut. Mały zespół, dużo samodzielności, mentoring seniora.',
    requirements: ['React', 'JavaScript', 'HTML/CSS', 'Git', 'REST API'],
  },
  {
    id: 'job-00000004', slug: 'sowa-edukacja-fullstack-ts', source: 'nofluffjobs', age: 26,
    title: 'Fullstack Developer (TypeScript)', company: 'Sowa Edukacja', location: 'Kraków', remote_type: 'hybrid',
    salary_min: 13000, salary_max: 18500,
    description: 'Platforma do nauki dla szkół średnich. Frontend w React, backend w Node.js i PostgreSQL, wdrożenia w kontenerach.',
    requirements: ['TypeScript', 'React', 'Node.js', 'SQL', 'Docker', 'Git'],
  },
  {
    id: 'job-00000005', slug: 'medivo-frontend-design-system', source: 'justjoin', age: 30,
    title: 'Frontend Engineer, design system', company: 'Medivo', location: 'Zdalnie', remote_type: 'remote',
    salary_min: 15000, salary_max: 20000,
    description: 'Utrzymujesz bibliotekę komponentów dla czterech aplikacji medycznych. Duży nacisk na dostępność i dokumentację.',
    requirements: ['React', 'TypeScript', 'Storybook', 'Figma', 'Jest', 'Dostępność (WCAG)'],
  },
  {
    id: 'job-00000006', slug: 'wektor-bank-react-native', source: 'rocketjobs', age: 34,
    title: 'React Native Developer', company: 'Wektor Bank', location: 'Warszawa', remote_type: 'hybrid',
    salary_min: 16000, salary_max: 22000,
    description: 'Aplikacja mobilna banku z bazą 300 tys. klientów. Stabilny zespół, jasne procesy, dużo testów automatycznych.',
    requirements: ['React Native', 'TypeScript', 'Redux', 'REST API', 'Git'],
  },
  {
    id: 'job-00000007', slug: 'trasa-node-backend', source: 'justjoin', age: 41,
    title: 'Node.js Backend Developer', company: 'Trasa.io', location: 'Gdańsk', remote_type: 'remote',
    salary_min: 15000, salary_max: 21000,
    description: 'Mikroserwisy do rezerwacji przejazdów. Duży ruch w szczycie, dyżury raz na sześć tygodni.',
    requirements: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'REST API'],
  },
  {
    id: 'job-00000008', slug: 'fala-payments-senior-frontend', source: 'justjoin', age: 47,
    title: 'Senior Frontend Developer', company: 'Fala Payments', location: 'Warszawa', remote_type: 'hybrid',
    salary_min: 20000, salary_max: 27000,
    description: 'Prowadzisz techniczne decyzje w zespole płatności online. Mikrofrontendy, GraphQL, rozbudowany monitoring.',
    requirements: ['React', 'TypeScript', 'GraphQL', 'Redux', 'Webpack', '5+ lat doświadczenia'],
  },
  {
    id: 'job-00000009', slug: 'rybka-studio-vue', source: 'pracuj', age: 52,
    title: 'Frontend Developer (Vue)', company: 'Rybka Studio', location: 'Poznań', remote_type: 'office',
    salary_min: 10000, salary_max: 14000,
    description: 'Agencja interaktywna, projekty dla marek spożywczych. Praca w biurze przy Starym Rynku.',
    requirements: ['Vue.js', 'JavaScript', 'HTML/CSS', 'SCSS', 'Git'],
  },
  {
    id: 'job-00000010', slug: 'brzoza-frontend-ecommerce', source: 'pracuj', age: 58,
    title: 'Frontend Developer, e-commerce', company: 'Sklep Brzoza', location: 'Lublin', remote_type: 'remote',
    salary_min: 11000, salary_max: 15500,
    description: 'Sklep internetowy z meblami ogrodowymi. Przepisujesz katalog produktów na Next.js i dbasz o szybkość stron.',
    requirements: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Git'],
  },
  {
    id: 'job-00000011', slug: 'nadwislanska-webflow-frontend', source: 'rocketjobs', age: 66,
    title: 'Webflow / Frontend Developer', company: 'Agencja Nadwiślańska', location: 'Kraków', remote_type: 'hybrid',
    salary_min: 8000, salary_max: 12000,
    description: 'Strony dla firm usługowych budowane w Webflow, z własnymi skryptami w JavaScript.',
    requirements: ['HTML/CSS', 'JavaScript', 'Webflow', 'Figma'],
  },
  {
    id: 'job-00000012', slug: 'zielony-koszyk-wsparcie-techniczne', source: 'olx', age: 70,
    title: 'Specjalista ds. wsparcia technicznego', company: 'Zielony Koszyk', location: 'Łódź', remote_type: 'office',
    salary_min: 6500, salary_max: 8000,
    description: 'Pomagasz sklepom partnerskim w obsłudze platformy zamówień. Praca zmianowa 8-16 lub 12-20.',
    requirements: ['Obsługa klienta', 'Podstawy HTML', 'Jira', 'Komunikatywność'],
  },
  {
    id: 'job-00000013', slug: 'kadr-ux-ui-designer', source: 'nofluffjobs', age: 75,
    title: 'UX/UI Designer', company: 'Kadr Agency', location: 'Zdalnie', remote_type: 'remote',
    salary_min: 9000, salary_max: 14000,
    description: 'Projektujesz aplikacje dla klientów z branży turystycznej. Badania z użytkownikami co sprint.',
    requirements: ['Figma', 'UX research', 'Prototypowanie', 'Design systems'],
  },
  {
    id: 'job-00000014', slug: 'rogowo-analityk-danych', source: 'olx', age: 80,
    title: 'Analityk danych (SQL)', company: 'Spółdzielnia Rogowo', location: 'Białystok', remote_type: 'hybrid',
    salary_min: 9000, salary_max: 12500,
    description: 'Raporty sprzedaży i logistyki dla zarządu. Hurtownia danych w PostgreSQL, wizualizacje w Power BI.',
    requirements: ['SQL', 'Excel', 'Power BI', 'Python'],
  },
];

export const DEMO_JOBS: JobListing[] = seeds.map(({ slug, age, ...job }) => ({
  ...job,
  external_id: `${job.source}_${slug}`,
  currency: 'PLN',
  url: SOURCE_URL[job.source] + slug,
  is_active: true,
  scraped_at: ago(0, age),
}));

const jobById = (id: string) => DEMO_JOBS.find(j => j.id === id);

type MatchSeed = [jobId: string, score: number, matching: string[], missing: string[], recommendation: string];

const matchSeeds: MatchSeed[] = [
  ['job-00000003', 93, ['React', 'JavaScript', 'HTML/CSS', 'Git', 'REST API'], [],
    'Spełniasz wszystkie wymagania, a z TypeScriptem masz więcej, niż szukają. Warto wspomnieć o migracji panelu w Koszyk24.'],
  ['job-00000002', 89, ['React', 'TypeScript', 'HTML/CSS', 'Git', 'REST API'], ['Figma'],
    'Bardzo dobre dopasowanie. Jeśli pracujesz z makietami od projektanta, dopisz Figmę do CV.'],
  ['job-00000001', 86, ['React', 'TypeScript', 'REST API', 'Git', 'Tailwind CSS'], ['Jest'],
    'Jedyna luka to testy. Jedno zdanie o testach komponentów w CV podniesie wynik powyżej 90.'],
  ['job-00000010', 84, ['React', 'TypeScript', 'Tailwind CSS', 'Git'], ['Next.js'],
    'Stack prawie identyczny z Twoim. Next.js to nadbudowa nad Reactem, możesz go podać jako obszar nauki.'],
  ['job-00000004', 78, ['TypeScript', 'React', 'Node.js', 'SQL', 'Git'], ['Docker'],
    'Mocny frontend i podstawy backendu. Brakuje doświadczenia z kontenerami, o które zapytają na rozmowie.'],
  ['job-00000011', 70, ['HTML/CSS', 'JavaScript'], ['Webflow', 'Figma'],
    'Technicznie poradzisz sobie bez trudu, ale to praca głównie w Webflow, mniej programowania.'],
  ['job-00000006', 64, ['TypeScript', 'REST API', 'Git'], ['React Native', 'Redux'],
    'React Native różni się od Reacta w szczegółach. Do rozważenia, jeśli chcesz wejść w aplikacje mobilne.'],
  ['job-00000009', 62, ['JavaScript', 'HTML/CSS', 'Git'], ['Vue.js', 'SCSS'],
    'Inny framework niż Twój. Przejście z Reacta na Vue jest realne, ale oferta nie wykorzystuje Twojej najmocniejszej strony.'],
  ['job-00000005', 58, ['React', 'TypeScript'], ['Storybook', 'Figma', 'Jest', 'Dostępność (WCAG)'],
    'Ciekawy kierunek, ale wymaga doświadczenia z design systemem i dostępnością, którego CV nie pokazuje.'],
  ['job-00000007', 57, ['Node.js', 'TypeScript', 'REST API'], ['PostgreSQL', 'Redis', 'Docker'],
    'Częściowe dopasowanie. To stanowisko czysto backendowe, a Twoje doświadczenie jest głównie frontendowe.'],
  ['job-00000008', 49, ['React', 'TypeScript'], ['GraphQL', 'Redux', 'Webpack', '5+ lat doświadczenia'],
    'Za wcześnie na tę ofertę: wymaga pięciu lat doświadczenia i prowadzenia decyzji technicznych.'],
  ['job-00000012', 41, ['Podstawy HTML'], ['Obsługa klienta', 'Jira', 'Komunikatywność'],
    'Stanowisko poniżej Twoich kwalifikacji technicznych i z inną ścieżką rozwoju.'],
  ['job-00000014', 38, ['SQL'], ['Excel', 'Power BI', 'Python'],
    'Wspólny jest tylko SQL. To inna ścieżka kariery niż frontend.'],
  ['job-00000013', 31, [], ['Figma', 'UX research', 'Prototypowanie', 'Design systems'],
    'Oferta dla projektanta, nie programisty. Pokazujemy ją, bo trafiła do wyników dla słowa „Frontend”.'],
];

export const DEMO_MATCHES: MatchScore[] = matchSeeds.map(([jobId, score, matching, missing, recommendation], i) => ({
  id: `match-${String(i + 1).padStart(8, '0')}`,
  user_id: DEMO_USER_ID,
  job_id: jobId,
  score,
  matching_skills: matching,
  missing_skills: missing,
  recommendation,
  computed_at: ago(0, 4),
  job: jobById(jobId),
}));

export const DEMO_APPLICATIONS: Application[] = [
  {
    id: 'app-00000001', user_id: DEMO_USER_ID, job_id: 'job-00000002', status: 'interview',
    applied_at: ago(9),
    notes: 'Rozmowa techniczna z liderem zespołu. Przygotować przykład migracji na TypeScript.',
    follow_up_at: ahead(2, 14),
    job: jobById('job-00000002'),
  },
  {
    id: 'app-00000002', user_id: DEMO_USER_ID, job_id: 'job-00000001', status: 'sent',
    applied_at: ago(3), notes: '',
    job: jobById('job-00000001'),
  },
  {
    id: 'app-00000003', user_id: DEMO_USER_ID, job_id: 'job-00000010', status: 'sent',
    applied_at: ago(11), notes: 'Brak odpowiedzi. Napisać krótkie przypomnienie do rekruterki.',
    job: jobById('job-00000010'),
  },
  {
    id: 'app-00000004', user_id: DEMO_USER_ID, job_id: 'job-00000003', status: 'offer',
    applied_at: ago(21), notes: 'Oferta: 12 500 zł brutto, odpowiedź do piątku.',
    job: jobById('job-00000003'),
  },
  {
    id: 'app-00000005', user_id: DEMO_USER_ID, job_id: 'job-00000004', status: 'rejected',
    applied_at: ago(18), notes: 'Odmowa: szukają osoby z Dockerem na produkcji.',
    job: jobById('job-00000004'),
  },
];

export const DEMO_ALERTS: Alert[] = [
  {
    id: 'alert-00000001', user_id: DEMO_USER_ID, min_score: 80,
    keywords: ['React', 'TypeScript'], locations: ['Warszawa', 'Zdalnie'],
    is_active: true, last_sent_at: ago(0, 13), created_at: ago(30),
  },
  {
    id: 'alert-00000002', user_id: DEMO_USER_ID, min_score: 70,
    keywords: ['Frontend'], locations: ['Kraków'],
    is_active: false, created_at: ago(22),
  },
];

/** Fresh mutable copy of every demo table. */
export function createDemoStore(): Record<string, any[]> {
  return {
    profiles: [{ ...DEMO_PROFILE }],
    cv_profiles: [structuredClone(DEMO_CV)],
    job_listings: structuredClone(DEMO_JOBS),
    match_scores: structuredClone(DEMO_MATCHES),
    applications: structuredClone(DEMO_APPLICATIONS),
    alerts: structuredClone(DEMO_ALERTS),
  };
}

/** Mutable in-memory store used by the backend during a demo session */
export const store: Record<string, any[]> = createDemoStore();
