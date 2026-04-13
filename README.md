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
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui + ReactBits |
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

## Model cenowy

| Plan | Cena | Funkcje |
|---|---|---|
| Free | 0 zł | CV upload, top 10 ofert/dzień, 1 alert/tydzień |
| Pro | 29 zł/mies. | Unlimited oferty + alerty, listy motywacyjne (10/mies.), tygodniowy raport |
| Premium | 99 zł/mies. | Wszystko + nielimitowane listy, mock interview AI |

## Licencja

MIT
