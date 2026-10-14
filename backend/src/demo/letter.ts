// ─── Demo cover letters ──────────────────────────────────────────────────────
// Pre-written letters for demo mode, shared by the backend (DEMO_MODE) and the
// frontend static demo. Written for the demo persona from demo/data.ts.

export type LetterStyle = 'formal' | 'conversational' | 'creative';
export type LetterLanguage = 'pl' | 'en';

interface LetterJob {
  title?: string;
  company?: string;
}

export function demoLetter(job: LetterJob | undefined, style: LetterStyle, language: LetterLanguage): string {
  const title = job?.title ?? 'to stanowisko';
  const company = job?.company ?? 'Państwa firmie';

  if (language === 'en') {
    return `Dear Hiring Team,

I would like to apply for the ${title} role at ${company}. For the past three years I have been building interfaces in React and TypeScript, which is exactly the scope described in your offer.

At Koszyk24 I look after the seller dashboard. I proposed and carried out the migration of its core modules from JavaScript to TypeScript, and I am building a shared component library together with our design team. Before that, at Studio Klon, I delivered websites and online shops for local businesses, which taught me to work closely with clients and ship on time.

I would be glad to talk about these projects and learn more about the team at ${company}.

Kind regards,
Marta Zielińska`;
  }

  if (style === 'conversational') {
    return `Dzień dobry,

piszę w sprawie oferty ${title} w ${company}. Od trzech lat pracuję jako frontend developerka i najwięcej satysfakcji daje mi porządkowanie dużych interfejsów tak, żeby dało się je rozwijać bez obaw.

Na co dzień w Koszyk24 rozwijam panel sprzedawcy w React i TypeScript. Zaproponowałam i przeprowadziłam migrację kluczowych modułów na TypeScript, a teraz razem z projektantką budujemy wspólną bibliotekę komponentów. Wcześniej w Studio Klon robiłam strony i sklepy dla lokalnych firm, więc rozmowa z klientem i pilnowanie terminów nie są mi obce.

Chętnie opowiem więcej na rozmowie i dopytam, nad czym teraz pracuje Państwa zespół.

Pozdrawiam serdecznie
Marta Zielińska`;
  }

  if (style === 'creative') {
    return `Dzień dobry,

trzy lata temu przepisałam swój pierwszy formularz z jQuery na React i od tamtej pory lubię momenty, w których chaotyczny interfejs zaczyna mieć sens. Dlatego zainteresowała mnie oferta ${title} w ${company}.

W Koszyk24 panel sprzedawcy był kiedyś zbiorem pojedynczych ekranów pisanych w różnym stylu. Przeniosłam jego kluczowe moduły na TypeScript i razem z projektantką zamieniamy go w spójny system komponentów, z którego korzysta dziś cały zespół. Wcześniej, w Studio Klon, nauczyłam się, że dobra strona to taka, którą klient potrafi sam obsłużyć.

Jeśli szukają Państwo osoby, która lubi porządek w kodzie i w interfejsie, chętnie porozmawiam.

Pozdrawiam
Marta Zielińska`;
  }

  return `Szanowni Państwo,

zgłaszam swoją kandydaturę na stanowisko ${title} w ${company}. Od trzech lat tworzę interfejsy w React i TypeScript, a zakres opisany w ogłoszeniu pokrywa się z tym, czym zajmuję się na co dzień.

W Koszyk24 odpowiadam za panel sprzedawcy. Przeprowadziłam migrację jego kluczowych modułów z JavaScript na TypeScript i współtworzę bibliotekę komponentów razem z zespołem projektowym. Wcześniej, w Studio Klon, budowałam strony i sklepy dla lokalnych firm, co nauczyło mnie bliskiej współpracy z klientem i dowożenia projektów w terminie.

Chętnie opowiem o tych projektach podczas rozmowy i dowiem się więcej o pracy zespołu ${company}.

Z wyrazami szacunku
Marta Zielińska`;
}
