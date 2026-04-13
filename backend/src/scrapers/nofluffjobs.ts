import type { Page } from 'playwright';
import { BaseScraper, type ScrapedJob } from './base.js';

export class NoFluffJobsScraper extends BaseScraper {
  name = 'nofluffjobs' as const;

  async scrape(page: Page): Promise<ScrapedJob[]> {
    // TODO: implement NoFluffJobs scraping
    // NoFluffJobs has a public postings endpoint: https://nofluffjobs.com/api/posting
    console.log('[nofluffjobs] Scraper not yet fully implemented – skipping');
    return [];
  }
}
