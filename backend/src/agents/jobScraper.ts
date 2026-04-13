import { JustJoinScraper } from '../scrapers/justjoin.js';
import { PracujScraper } from '../scrapers/pracuj.js';
import { NoFluffJobsScraper } from '../scrapers/nofluffjobs.js';
import { RocketJobsScraper } from '../scrapers/rocketjobs.js';
import { OlxScraper } from '../scrapers/olx.js';

/** Run all scrapers and return total number of new jobs saved */
export async function runAllScrapers(): Promise<number> {
  const scrapers = [
    new JustJoinScraper(),
    new PracujScraper(),
    new NoFluffJobsScraper(),
    new RocketJobsScraper(),
    new OlxScraper(),
  ];

  let total = 0;

  for (const scraper of scrapers) {
    try {
      console.log(`[scraper] Starting ${scraper.name}...`);
      const count = await scraper.run();
      console.log(`[scraper] ${scraper.name} saved ${count} new jobs`);
      total += count;
    } catch (err) {
      console.error(`[scraper] ${scraper.name} failed:`, err);
    }
  }

  console.log(`[scraper] Total new jobs saved: ${total}`);
  return total;
}
