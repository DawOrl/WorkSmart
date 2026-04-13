import type { Page } from 'playwright';
import { BaseScraper, type ScrapedJob } from './base.js';

export class JustJoinScraper extends BaseScraper {
  name = 'justjoin' as const;

  async scrape(page: Page): Promise<ScrapedJob[]> {
    // JustJoin.it has a public API
    await page.goto('https://api.justjoin.it/v2/user-panel/offers?perPage=100&sortBy=published&sortOrder=DESC', {
      waitUntil: 'networkidle',
    });

    const text = await page.locator('pre, body').textContent() ?? '{}';
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return [];
    }

    const offers = data?.data ?? [];
    return offers.map((offer: any): ScrapedJob => ({
      external_id: `justjoin_${offer.slug ?? offer.id}`,
      source: 'justjoin',
      title: offer.title ?? '',
      company: offer.companyName ?? '',
      location: offer.city ?? offer.workplaceType,
      remote_type: offer.workplaceType === 'remote' ? 'remote'
        : offer.workplaceType === 'hybrid' ? 'hybrid' : 'office',
      salary_min: offer.salary?.from ?? undefined,
      salary_max: offer.salary?.to ?? undefined,
      currency: offer.salary?.currency ?? 'PLN',
      description: offer.body ?? '',
      requirements: offer.requiredSkills?.map((s: any) => s.name) ?? [],
      url: `https://justjoin.it/offers/${offer.slug ?? offer.id}`,
    }));
  }
}
