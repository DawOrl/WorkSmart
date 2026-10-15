# WorkSmart

**AI copilot szukania pracy dla Polaków** – agreguje oferty z największych polskich portali, analizuje Twoje CV i dobiera oferty przez AI match score.

## Funkcje

- **CV Analyzer** – prześlij PDF/DOCX, otrzymaj ATS score i top 3 sugestie poprawek
- **Job Aggregator** – oferty z OLX, Pracuj.pl, RocketJobs, NoFluffJobs, JustJoin.it w jednym miejscu
- **Match Score** – AI porównuje Twój profil z każdą ofertą (0–100%)
- **Alerty** – powiadomienie gdy pojawi się oferta powyżej Twojego progu
- **Tracker** – kanban do śledzenia statusu aplikacji
- **Letter Writer** *(Pro)* – list motywacyjny pod konkretną ofertę w 30 sekund

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS (własne komponenty UI) |
| Backend | Node.js + Express 5 + TypeScript |
| Baza danych | Supabase (PostgreSQL + pgvector) |
| AI | Claude API (Anthropic) |
| Scraping | Playwright + node-cron |
| Email | Resend |
| Płatności | Stripe PLN |
| Hosting | Vercel (frontend) |

## Struktura monorepo

```
WorkSmart/
├── frontend/     # React + Vite app
├── backend/      # Node.js + Express API
└── supabase/     # SQL migrations
```

## Uruchomienie lokalne

### Wymagania
- Node.js >= 22
- Konto Supabase (darmowe)
- Klucz API Anthropic

### Setup

```bash
# Klonuj repo
git clone https://github.com/DawOrl/WorkSmart.git
cd WorkSmart

# Zainstaluj zależności
npm install

# Skonfiguruj zmienne środowiskowe
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Uzupełnij wartości w obu plikach .env

# Uruchom dev
npm run dev
```

Frontend dostępny na `http://localhost:5173`, backend na `http://localhost:3001`.

## Tryb demo (bez kluczy)

Są dwa tryby demo. Żaden nie nadpisuje Twoich plików ze zmiennymi środowiskowymi.

| Polecenie | Co robi |
|---|---|
| `npm run demo` | Statyczne demo: sam frontend, API odpowiada w przeglądarce z danych w `backend/src/demo/`. Nie potrzebuje backendu, kluczy ani bazy. |
| `npm run demo:api` | Frontend z mockiem logowania + backend Express z `DEMO_MODE=true` (dane w pamięci, bez scrapowania i bez wysyłki e-maili). Skrypt ustawia zmienne w linii poleceń, działa w powłokach POSIX (macOS, Linux). |

W obu trybach logowanie przyjmuje dowolny e-mail i hasło, a konto należy do przykładowej kandydatki z wgranym CV, dopasowaniami, trackerem i alertami. Dane demo (`backend/src/demo/data.ts`, `backend/src/demo/letter.ts`) są jedynym źródłem prawdy dla obu trybów. Firmy i osoby w danych są fikcyjne.

Statyczne demo buduje się poleceniem `npm run build:demo` (wynik w `frontend/dist`). Tryb `--mode static-demo` celowo nie czyta lokalnych plików ze zmiennymi z katalogu `frontend/`, więc Twoje klucze nie trafią do paczki.

## Wdrożenie demo na Vercel

Publiczne demo to statyczny build frontendu. Nie potrzebuje backendu, bazy ani żadnych zmiennych środowiskowych. Cała konfiguracja jest w `vercel.json` w katalogu głównym repo: instalacja `npm ci`, build `npm run build:demo`, katalog wyjściowy `frontend/dist` i przekierowanie wszystkich ścieżek SPA na `index.html`.

1. Na vercel.com wybierz **Add New… → Project** i zaimportuj repozytorium `DawOrl/WorkSmart`.
2. **Root Directory**: zostaw katalog główny repo (`./`). Nie ustawiaj `frontend`, bo build korzysta z danych demo w `backend/src/demo/`.
3. **Framework Preset**: Vite (Vercel odczyta go z `vercel.json`). Pól Build Command, Output Directory i Install Command nie zmieniaj, `vercel.json` je nadpisuje.
4. **Environment Variables**: nie dodawaj żadnych. W szczególności nie wpisuj kluczy Supabase ani Stripe do projektu demo.
5. Kliknij **Deploy**. Po buildzie sprawdź stronę główną, `/auth` (logowanie dowolnymi danymi), `/dashboard`, `/jobs`, kartę oferty, `/tracker`, `/cv`, `/letter` oraz odświeżenie przeglądarki na podstronie (np. `/tracker`), które musi działać dzięki przekierowaniu SPA.
6. Opcjonalnie: **Settings → Domains**, żeby nadać demo własny adres.

Ten sam build sprawdzisz lokalnie:

```bash
npm run build:demo
cd frontend && npx vite preview --port 4173
```

Demo wdraża wyłącznie integracja Git Vercela z katalogu głównego repo (`vercel.json`). Workflow `.github/workflows/deploy.yml` (zwykły, nie-demo frontend z `frontend/`, `vercel --prod`) uruchamia się tylko ręcznie (`workflow_dispatch`), żeby push na `main` nie robił drugiego, konkurencyjnego wdrożenia produkcyjnego, które nadpisałoby demo.

Build demo przypina zmienne `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY` i `VITE_API_URL` do pustych wartości i podmienia `@supabase/supabase-js` na pustą zaślepkę, więc nawet zmienne wpisane omyłkowo w panelu Vercela nie trafią do paczki.

## Model cenowy

| Plan | Cena | Funkcje |
|---|---|---|
| Free | 0 zł | CV upload, top 10 ofert/dzień, 1 alert/tydzień |
| Pro | 29 zł/mies. | Unlimited oferty + alerty, listy motywacyjne (10/mies.), tygodniowy raport |
| Premium | 99 zł/mies. | Wszystko + nielimitowane listy, mock interview AI |

## Licencja

MIT
