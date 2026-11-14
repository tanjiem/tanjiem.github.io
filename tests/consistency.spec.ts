// The map, index, ledger, legend and pages are all generated from the same
// content files. These tests catch any two of them disagreeing.
import { test, expect } from '@playwright/test';
import { mapLights } from './helpers';

test('the index lists exactly the lights on the map, with the same links', async ({ page }) => {
  await page.goto('/');
  const lights = await mapLights(page);
  const rows = await page.$$eval('.index a[data-for]', (as) =>
    as.map((a) => ({ key: a.getAttribute('data-for')!, href: a.getAttribute('href')! })),
  );
  expect(rows.map((r) => r.key).sort()).toEqual(lights.map((l) => l.key).sort());
  for (const r of rows) expect(r.href, r.key).toBe(lights.find((l) => l.key === r.key)!.href);
});

test('every light has exactly one readout prepared for it', async ({ page }) => {
  await page.goto('/');
  const keys = (await mapLights(page)).map((l) => l.key).sort();
  const templates = await page.$$eval('template[data-for]', (ts) => ts.map((t) => t.getAttribute('data-for')!));
  expect(templates.sort()).toEqual(keys);
});

test('the legend lists each kind of mark that is on the map, and no others', async ({ page }) => {
  await page.goto('/');
  const legend = (await page.locator('.legend').innerText()).toLowerCase();
  const states = await page.$$eval('[data-map] a.light', (as) => as.map((a) => a.getAttribute('aria-label')!));
  const has = (s: string) => states.some((a) => a.includes(s));
  for (const [state, line] of [
    [', growing', 'seed, growing'],
    [', not yet planted', 'seed, not yet planted'],
    [', bearing', 'seed, bearing'],
    [', written,', 'entry, written'],
    [', unwritten,', 'entry, unwritten'],
  ]) {
    expect(legend.includes(line), line).toBe(has(state));
  }
});

test('the ledger, each entry page and each seed page agree on which seed an entry is about', async ({ page }) => {
  await page.goto('/notebook/');
  const rows = await page.$$eval('.ledger a', (as) =>
    as.map((a) => ({ href: a.getAttribute('href')!, seed: a.querySelector('.seed')!.textContent!.trim() })),
  );
  expect(rows.length).toBeGreaterThan(0);
  for (const r of rows) {
    const n = r.seed.replace('seed ', '');
    await page.goto(r.href);
    await expect(page.locator('a.about')).toHaveAttribute('href', `/seeds/${n}/`);
    // and the seed lists this entry among its connected lights
    await page.goto(`/seeds/${n}/`);
    await expect(page.locator(`.connected a[href="${r.href}"]`)).toHaveCount(1);
  }
});

test('each notebook filter shows only entries about that seed', async ({ page }) => {
  await page.goto('/notebook/');
  const filters = await page.$$eval('.filter a', (as) => as.map((a) => a.getAttribute('href')!).filter((h) => h.includes('/seed/')));
  for (const f of filters) {
    const n = f.match(/seed\/(\d+)/)![1];
    await page.goto(f);
    const seeds = await page.$$eval('.ledger .seed', (s) => s.map((x) => x.textContent!.trim()));
    expect(seeds.length, f).toBeGreaterThan(0);
    expect(new Set(seeds), f).toEqual(new Set([`seed ${n}`]));
  }
});
