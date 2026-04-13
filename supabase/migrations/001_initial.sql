-- WorkSmart database schema
-- Run in Supabase SQL Editor or via Supabase CLI: supabase db push

-- Enable pgvector extension for embeddings
create extension if not exists vector;

-- ─── Profiles (extends auth.users) ──────────────────────────────────────────
create table public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  plan            text not null default 'free' check (plan in ('free', 'pro', 'premium')),
  stripe_customer_id text,
  created_at      timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── CV Profiles ─────────────────────────────────────────────────────────────
create table public.cv_profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  file_url    text,
  raw_text    text,
  skills      text[]          not null default '{}',
  experience  jsonb           not null default '[]',
  education   jsonb           not null default '[]',
  ats_score   integer         not null default 0 check (ats_score between 0 and 100),
  suggestions jsonb           not null default '[]',
  embedding   vector(1536),   -- pgvector embedding for semantic search
  created_at  timestamptz     not null default now(),
  updated_at  timestamptz     not null default now(),
  unique (user_id)            -- one active CV per user
);

-- ─── Job Listings ─────────────────────────────────────────────────────────────
create table public.job_listings (
  id          uuid primary key default gen_random_uuid(),
  external_id text unique not null,
  source      text not null check (source in ('justjoin', 'pracuj', 'nofluffjobs', 'rocketjobs', 'olx')),
  title       text not null,
  company     text,
  location    text,
  remote_type text check (remote_type in ('remote', 'hybrid', 'office')),
  salary_min  integer,
  salary_max  integer,
  currency    text not null default 'PLN',
  description text,
  requirements text[]  not null default '{}',
  url         text not null,
  embedding   vector(1536),
  is_active   boolean not null default true,
  scraped_at  timestamptz not null default now(),
  expires_at  timestamptz
);

-- HNSW index for fast vector similarity search
create index on public.job_listings using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

create index on public.job_listings (source, is_active, scraped_at desc);

-- ─── Match Scores ─────────────────────────────────────────────────────────────
create table public.match_scores (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  job_id           uuid not null references public.job_listings(id) on delete cascade,
  score            integer not null check (score between 0 and 100),
  missing_skills   text[] not null default '{}',
  matching_skills  text[] not null default '{}',
  recommendation   text,
  computed_at      timestamptz not null default now(),
  unique (user_id, job_id)
);

create index on public.match_scores (user_id, score desc, computed_at desc);

-- ─── Applications Tracker ─────────────────────────────────────────────────────
create table public.applications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  job_id        uuid references public.job_listings(id) on delete set null,
  status        text not null default 'sent' check (status in ('sent', 'interview', 'rejected', 'offer')),
  applied_at    timestamptz not null default now(),
  notes         text,
  follow_up_at  timestamptz
);

create index on public.applications (user_id, applied_at desc);

-- ─── Alert Rules ─────────────────────────────────────────────────────────────
create table public.alerts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  min_score    integer not null default 75 check (min_score between 0 and 100),
  keywords     text[] not null default '{}',
  locations    text[] not null default '{}',
  is_active    boolean not null default true,
  last_sent_at timestamptz,
  created_at   timestamptz not null default now()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.cv_profiles    enable row level security;
alter table public.match_scores   enable row level security;
alter table public.applications   enable row level security;
alter table public.alerts         enable row level security;
-- job_listings is public read, backend-write only (service role)
alter table public.job_listings   enable row level security;

-- Profiles: users can read/update their own
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- CV Profiles
create policy "Users can manage own CV"  on public.cv_profiles for all using (auth.uid() = user_id);

-- Job listings: anyone authenticated can read
create policy "Authenticated users can view jobs" on public.job_listings for select to authenticated using (true);

-- Match scores
create policy "Users can view own matches" on public.match_scores for select using (auth.uid() = user_id);

-- Applications
create policy "Users can manage own applications" on public.applications for all using (auth.uid() = user_id);

-- Alerts
create policy "Users can manage own alerts" on public.alerts for all using (auth.uid() = user_id);
