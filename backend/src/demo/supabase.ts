// ─── Mock Supabase client for DEMO_MODE ──────────────────────────────────────
// Implements the subset of the Supabase JS API used by our routes/agents.
// All data lives in the in-memory `store` from demo/data.ts.

import { store, DEMO_PROFILE, DEMO_USER_ID } from './data.js';

class MockQueryBuilder {
  private _table: string;
  private _op: 'select' | 'insert' | 'update' | 'upsert' | 'delete' = 'select';
  private _payload: any;
  private _upsertConflict?: string;
  private _filters: ((x: any) => boolean)[] = [];
  private _single = false;
  private _withCount = false;
  private _limit?: number;
  private _offset = 0;
  private _order?: { col: string; asc: boolean };
  private _afterWrite = false; // .select() called after insert/update/upsert

  constructor(table: string) {
    this._table = table;
  }

  // ── Operation setters ───────────────────────────────────────────────────────
  select(cols = '*', opts?: { count?: string }) {
    if (this._op === 'insert' || this._op === 'update' || this._op === 'upsert') {
      this._afterWrite = true;
    } else {
      this._op = 'select';
    }
    this._withCount = !!opts?.count;
    return this;
  }

  insert(payload: any) {
    this._op = 'insert';
    this._payload = payload;
    return this;
  }

  update(payload: any) {
    this._op = 'update';
    this._payload = payload;
    return this;
  }

  upsert(payload: any, opts?: { onConflict?: string; ignoreDuplicates?: boolean }) {
    this._op = 'upsert';
    this._payload = payload;
    this._upsertConflict = opts?.onConflict;
    return this;
  }

  delete() {
    this._op = 'delete';
    return this;
  }

  // ── Filters ─────────────────────────────────────────────────────────────────
  eq(col: string, val: any) {
    this._filters.push(x => x[col] === val);
    return this;
  }

  neq(col: string, val: any) {
    this._filters.push(x => x[col] !== val);
    return this;
  }

  gt(col: string, val: any) {
    this._filters.push(x => x[col] > val);
    return this;
  }

  gte(col: string, val: any) {
    this._filters.push(x => x[col] >= val);
    return this;
  }

  ilike(col: string, pattern: string) {
    const re = new RegExp(pattern.replace(/%/g, '.*'), 'i');
    this._filters.push(x => re.test(String(x[col] ?? '')));
    return this;
  }

  or(_condition: string) {
    // Simplified: ignore OR filters in demo mode
    return this;
  }

  not(col: string, op: string, val: string) {
    if (op === 'in') {
      const ids = val.replace(/[()]/g, '').split(',').map(s => s.trim());
      this._filters.push(x => !ids.includes(String(x[col])));
    }
    return this;
  }

  // ── Ordering / pagination ──────────────────────────────────────────────────
  order(col: string, opts?: { ascending?: boolean }) {
    this._order = { col, asc: opts?.ascending !== false };
    return this;
  }

  limit(n: number) {
    this._limit = n;
    return this;
  }

  range(from: number, to: number) {
    this._offset = from;
    this._limit = to - from + 1;
    return this;
  }

  // ── Terminal ────────────────────────────────────────────────────────────────
  single() {
    this._single = true;
    return Promise.resolve(this._exec());
  }

  // Thenable so routes can `await supabase.from(...).select(...)...`
  then(resolve: (v: any) => any, reject: (e: any) => any) {
    return Promise.resolve(this._exec()).then(resolve, reject);
  }

  // ── Execution ───────────────────────────────────────────────────────────────
  private _applyFilters(items: any[]) {
    return this._filters.reduce((acc, f) => acc.filter(f), [...items]);
  }

  private _exec(): any {
    if (!store[this._table]) store[this._table] = [];
    const tbl = store[this._table];

    switch (this._op) {
      case 'insert': return this._execInsert(tbl);
      case 'update': return this._execUpdate(tbl);
      case 'upsert': return this._execUpsert(tbl);
      case 'delete': return this._execDelete(tbl);
      default:       return this._execSelect(tbl);
    }
  }

  private _execInsert(tbl: any[]) {
    const rows = (Array.isArray(this._payload) ? this._payload : [this._payload]).map(r => ({
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...r,
    }));
    store[this._table].push(...rows);
    if (this._single) return { data: rows[0] ?? null, error: null };
    return { data: rows, error: null };
  }

  private _execUpdate(tbl: any[]) {
    let updated: any = null;
    store[this._table] = tbl.map(x => {
      if (this._applyFilters([x]).length > 0) {
        updated = { ...x, ...this._payload };
        return updated;
      }
      return x;
    });
    if (this._single) {
      return { data: updated, error: updated ? null : { message: 'Not found', code: 'PGRST116' } };
    }
    return { data: updated, error: null };
  }

  private _execUpsert(tbl: any[]) {
    const rows = Array.isArray(this._payload) ? this._payload : [this._payload];
    const conflictCols = (this._upsertConflict ?? 'id').split(',').map(s => s.trim());

    rows.forEach(row => {
      const existingIdx = tbl.findIndex(x =>
        conflictCols.every(col => row[col] !== undefined && x[col] === row[col]),
      );
      if (existingIdx >= 0) {
        store[this._table][existingIdx] = { ...tbl[existingIdx], ...row };
      } else {
        store[this._table].push({ id: crypto.randomUUID(), created_at: new Date().toISOString(), ...row });
      }
    });

    if (this._single) {
      return { data: store[this._table].slice(-1)[0] ?? null, error: null };
    }
    return { data: null, error: null };
  }

  private _execDelete(tbl: any[]) {
    store[this._table] = tbl.filter(x => this._applyFilters([x]).length === 0);
    return { data: null, error: null };
  }

  private _execSelect(tbl: any[]) {
    let result = this._applyFilters(tbl);

    // Sort
    if (this._order) {
      const { col, asc } = this._order;
      result.sort((a, b) => {
        if (a[col] < b[col]) return asc ? -1 : 1;
        if (a[col] > b[col]) return asc ? 1 : -1;
        return 0;
      });
    }

    const totalCount = result.length;

    // Paginate
    result = result.slice(this._offset);
    if (this._limit !== undefined) result = result.slice(0, this._limit);

    // Resolve joins (simulate Supabase foreign-key joins)
    result = result.map(row => this._resolveJoins(row));

    if (this._single) {
      const item = result[0] ?? null;
      return { data: item, error: item ? null : { message: 'Not found', code: 'PGRST116' } };
    }

    return {
      data: result,
      count: this._withCount ? totalCount : undefined,
      error: null,
    };
  }

  /** Attach related rows for tables that use foreign-key joins */
  private _resolveJoins(row: any): any {
    if (this._table === 'match_scores') {
      return { ...row, job: store['job_listings']?.find(j => j.id === row.job_id) ?? null };
    }
    if (this._table === 'applications') {
      return { ...row, job: store['job_listings']?.find(j => j.id === row.job_id) ?? null };
    }
    if (this._table === 'alerts') {
      return { ...row, user: store['profiles']?.find(p => p.id === row.user_id) ?? null };
    }
    return row;
  }
}

// ─── Mock auth ────────────────────────────────────────────────────────────────
const mockAuth = {
  getUser: async (_token?: string) => ({
    data: { user: { id: DEMO_USER_ID, email: DEMO_PROFILE.email } },
    error: null,
  }),
  getSession: async () => ({
    data: {
      session: {
        access_token: 'demo-token',
        user: { id: DEMO_USER_ID, email: DEMO_PROFILE.email },
      },
    },
    error: null,
  }),
  onAuthStateChange: (cb: (event: string, session: any) => void) => {
    setTimeout(() =>
      cb('SIGNED_IN', {
        access_token: 'demo-token',
        user: { id: DEMO_USER_ID, email: DEMO_PROFILE.email },
      }), 0);
    return { data: { subscription: { unsubscribe: () => {} } } };
  },
  signInWithPassword: async (_creds: any) => ({
    data: { user: { id: DEMO_USER_ID, email: DEMO_PROFILE.email }, session: { access_token: 'demo-token' } },
    error: null,
  }),
  signUp: async (_creds: any) => ({
    data: { user: { id: DEMO_USER_ID, email: _creds.email }, session: { access_token: 'demo-token' } },
    error: null,
  }),
  signOut: async () => ({ error: null }),
};

// ─── Exported mock Supabase client ────────────────────────────────────────────
export const mockSupabase = {
  auth: mockAuth,
  from: (table: string) => new MockQueryBuilder(table),
};
