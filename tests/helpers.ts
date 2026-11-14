import type { Page } from '@playwright/test';

/** Every page in the sitemap, as a path, so new seeds and entries are tested automatically. */
export async function allPaths(page: Page): Promise<string[]> {
  const res = await page.request.get('/sitemap-0.xml');
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

/** The lights on the home map: key, link, and the name it is announced with. */
export async function mapLights(page: Page) {
  return page.$$eval('[data-map] a.light', (as) =>
    as.map((a) => ({
      key: a.getAttribute('data-light')!,
      href: a.getAttribute('href')!,
      aria: a.getAttribute('aria-label')!,
    })),
  );
}

/** Collects page errors and console errors for a test to assert on. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return errors;
}
