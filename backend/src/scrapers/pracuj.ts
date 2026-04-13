import type { Page } from 'playwright';
import { BaseScraper, type ScrapedJob } from './base.js';

export class PracujScraper extends BaseScraper {
  name = 'pracuj' as const;

  async scrape(page: Page): Promise<ScrapedJob[]> {
    // TODO: implement Pracuj.pl scraping
    // Pracuj.pl requires a different approach – use their search page with Playwright
    // Example: https://www.pracuj.pl/praca?sc=0
    console.log('[pracuj] Scraper not yet fully implemented – skipping');
    return [];
  }
}
