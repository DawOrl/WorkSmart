// In-browser API for the static demo (VITE_DEMO_STATIC). Mirrors the Express
// routes in backend/src/routes and answers from the same demo data the backend
// uses in DEMO_MODE. Changes live in memory until the page is reloaded.

import { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { createDemoStore, DEMO_USER_ID } from '@demo-data/data';
import { demoLetter, type LetterLanguage, type LetterStyle } from '@demo-data/letter';
import type { Alert, Application, JobListing, MatchScore, UserProfile } from '@/types';

const db = createDemoStore();
const jobs = () => db.job_listings as JobListing[];
const withJob = <T extends { job_id: string }>(row: T) => ({ ...row, job: jobs().find(j => j.id === row.job_id) });

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function body(config: InternalAxiosRequestConfig): Record<string, unknown> {
  if (typeof config.data === 'string' && config.data) return JSON.parse(config.data);
  if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) return config.data;
  return {};
}

function uid(prefix: string) {
  const rand = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(16).slice(2, 10);
  return `${prefix}-${rand}`;
}

type Handler = (ctx: { params: Record<string, string>; query: URLSearchParams; config: InternalAxiosRequestConfig }) => unknown;
type Route = [method: string, pattern: RegExp, keys: string[], handler: Handler];

const routes: Route[] = [];
function on(method: string, path: string, handler: Handler) {
  const keys: string[] = [];
  const pattern = new RegExp('^' + path.replace(/:(\w+)/g, (_m, key) => { keys.push(key); return '([^/]+)'; }) + '$');
  routes.push([method, pattern, keys, handler]);
}

// ── Profile & CV ─────────────────────────────────────────────────────────────
on('get', '/api/me', () => db.profiles[0] as UserProfile);

on('get', '/api/cv/me', () => {
  const cv = db.cv_profiles.find(c => c.user_id === DEMO_USER_ID);
  if (!cv) throw new HttpError(404, 'No CV profile found');
  return cv;
});

on('post', '/api/cv/upload', async ({ config }) => {
  if (!(config.data instanceof FormData) || !config.data.get('cv')) throw new HttpError(400, 'No file uploaded');
  await wait(1400);
  const cv = db.cv_profiles[0];
  const file = config.data.get('cv');
  Object.assign(cv, { updated_at: new Date().toISOString(), file_url: file instanceof File ? file.name : cv.file_url });
  return cv;
});

// ── Jobs & matches ───────────────────────────────────────────────────────────
on('get', '/api/jobs', ({ query }) => {
  const page = Math.max(1, Number(query.get('page') ?? 1));
  const limit = Math.max(1, Number(query.get('limit') ?? 20));
  const source = query.get('source');
  const remote = query.get('remote_type');
  const location = query.get('location')?.toLowerCase();
  const search = query.get('search')?.toLowerCase();

  const filtered = jobs()
    .filter(j => j.is_active)
    .filter(j => !source || j.source === source)
    .filter(j => !remote || j.remote_type === remote)
    .filter(j => !location || (j.location ?? '').toLowerCase().includes(location))
    .filter(j => !search || `${j.title} ${j.company ?? ''} ${j.description ?? ''} ${j.requirements.join(' ')}`.toLowerCase().includes(search))
    .sort((a, b) => b.scraped_at.localeCompare(a.scraped_at));

  return { jobs: filtered.slice((page - 1) * limit, page * limit), total: filtered.length, page, limit };
});

on('get', '/api/jobs/:id', ({ params }) => {
  const job = jobs().find(j => j.id === params.id);
  if (!job) throw new HttpError(404, 'Job not found');
  return job;
});

on('get', '/api/matches', ({ query }) => {
  const limit = Number(query.get('limit') ?? 10);
  const matches = (db.match_scores as MatchScore[])
    .filter(m => m.user_id === DEMO_USER_ID)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(withJob);
  return { matches, plan: 'pro' };
});

on('post', '/api/matches/refresh', async () => {
  await wait(600);
  return { message: 'Computed 0 matches', count: 0 };
});

// ── Applications (tracker) ───────────────────────────────────────────────────
on('get', '/api/applications', () =>
  (db.applications as Application[])
    .slice()
    .sort((a, b) => b.applied_at.localeCompare(a.applied_at))
    .map(withJob));

on('post', '/api/applications', ({ config }) => {
  const input = body(config);
  if (typeof input.job_id !== 'string') throw new HttpError(400, 'job_id is required');
  const row: Application = {
    id: uid('app'),
    user_id: DEMO_USER_ID,
    job_id: input.job_id,
    status: (input.status as Application['status']) ?? 'sent',
    applied_at: new Date().toISOString(),
    notes: typeof input.notes === 'string' ? input.notes : '',
  };
  db.applications.push(row);
  return withJob(row);
});

on('patch', '/api/applications/:id', ({ params, config }) => {
  const row = db.applications.find(a => a.id === params.id);
  if (!row) throw new HttpError(404, 'Application not found');
  Object.assign(row, body(config));
  return withJob(row);
});

on('delete', '/api/applications/:id', ({ params }) => {
  db.applications = db.applications.filter(a => a.id !== params.id);
  return null;
});

// ── Alerts ───────────────────────────────────────────────────────────────────
on('get', '/api/alerts', () => db.alerts as Alert[]);

on('post', '/api/alerts', ({ config }) => {
  const input = body(config);
  const row: Alert = {
    id: uid('alert'),
    user_id: DEMO_USER_ID,
    min_score: Number(input.min_score ?? 75),
    keywords: (input.keywords as string[]) ?? [],
    locations: (input.locations as string[]) ?? [],
    is_active: input.is_active !== false,
    created_at: new Date().toISOString(),
  };
  db.alerts.push(row);
  return row;
});

on('patch', '/api/alerts/:id', ({ params, config }) => {
  const row = db.alerts.find(a => a.id === params.id);
  if (!row) throw new HttpError(404, 'Alert not found');
  Object.assign(row, body(config));
  return row;
});

on('delete', '/api/alerts/:id', ({ params }) => {
  db.alerts = db.alerts.filter(a => a.id !== params.id);
  return null;
});

// ── Cover letters ────────────────────────────────────────────────────────────
on('post', '/api/letter/generate', async ({ config }) => {
  const input = body(config);
  const job = jobs().find(j => j.id === input.job_id);
  if (!job) throw new HttpError(404, 'Job not found');
  await wait(1500);
  return { letter: demoLetter(job, (input.style as LetterStyle) ?? 'formal', (input.language as LetterLanguage) ?? 'pl') };
});

// ── Adapter ──────────────────────────────────────────────────────────────────
export async function mockAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const method = (config.method ?? 'get').toLowerCase();
  const url = new URL(config.url ?? '/', window.location.origin);
  const respond = (status: number, data: unknown): AxiosResponse => ({
    data, status, statusText: String(status), headers: new AxiosHeaders(), config, request: {},
  });

  await wait(180 + Math.round(Math.random() * 160));

  for (const [m, pattern, keys, handler] of routes) {
    if (m !== method) continue;
    const hit = url.pathname.match(pattern);
    if (!hit) continue;
    const params = Object.fromEntries(keys.map((key, i) => [key, decodeURIComponent(hit[i + 1])]));
    try {
      const data = await handler({ params, query: url.searchParams, config });
      return respond(data === null ? 204 : 200, data);
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;
      const response = respond(status, { error: err instanceof Error ? err.message : 'Error' });
      throw new AxiosError(response.data.error, String(status), config, {}, response);
    }
  }

  const response = respond(404, { error: `No demo route for ${method.toUpperCase()} ${url.pathname}` });
  throw new AxiosError(response.data.error, '404', config, {}, response);
}
