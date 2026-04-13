import type { Page } from 'playwright';
import { BaseScraper, type ScrapedJob } from './base.js';

export class RocketJobsScraper extends BaseScraper {
  name = 'rocketjobs' as const;

  async scrape(page: Page): Promise<ScrapedJob[]> {
    // TODO: implement RocketJobs scraping
    console.log('[rocketjobs] Scraper not yet fully implemented – skipping');
    return [];
  }
}
