import { chromium, type Browser, type Page } from 'playwright';
import { supabase } from '../lib/supabase.js';
import type { JobSource, RemoteType } from '../types/index.js';

export interface ScrapedJob {
  external_id: string;
  source: JobSource;
  title: string;
  company?: string;
  location?: string;
  remote_type?: RemoteType;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  description?: string;
  requirements?: string[];
  url: string;
}

export abstract class BaseScraper {
  abstract name: JobSource;
  abstract scrape(page: Page): Promise<ScrapedJob[]>;

  async run(): Promise<number> {
    let browser: Browser | null = null;
    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({ 'Accept-Language': 'pl-PL,pl;q=0.9' });

      const jobs = await this.scrape(page);
      return await this.saveJobs(jobs);
    } finally {
      await browser?.close();
    }
  }

  protected async saveJobs(jobs: ScrapedJob[]): Promise<number> {
    if (jobs.length === 0) return 0;

    const { error } = await supabase
      .from('job_listings')
      .upsert(
        jobs.map(j => ({
          ...j,
          currency: j.currency ?? 'PLN',
          requirements: j.requirements ?? [],
          is_active: true,
          scraped_at: new Date().toISOString(),
        })),
        { onConflict: 'external_id', ignoreDuplicates: false },
      );

    if (error) {
      console.error(`[${this.name}] Save error:`, error.message);
      return 0;
    }
    return jobs.length;
  }
}
