import type { Page } from 'playwright';
import { BaseScraper, type ScrapedJob } from './base.js';

export class OlxScraper extends BaseScraper {
  name = 'olx' as const;

  async scrape(page: Page): Promise<ScrapedJob[]> {
    // TODO: implement OLX Praca scraping
    // OLX Praca: https://www.olx.pl/praca/
    console.log('[olx] Scraper not yet fully implemented – skipping');
    return [];
  }
}
