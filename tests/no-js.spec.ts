// With JavaScript off, the map is still a set of real links and the site still works.
import { test, expect } from '@playwright/test';
import { allPaths, mapLights } from './helpers';

test.use({ javaScriptEnabled: false });

test('every light on the map links to a page that exists and names the same thing', async ({ page }) => {
  await page.goto('/');
  const lights = await mapLights(page);
  expect(lights.length).toBeGreaterThan(0);
  for (const l of lights) {
    const res = await page.goto(l.href);
    expect(res?.status(), l.href).toBe(200);
    const h1 = (await page.locator('h1').textContent())!.trim();
    expect(l.aria, `${l.key} vs its page`).toContain(h1);
  }
});

test('the home page shows the opening text and no readout', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('[data-chosen]')).toBeHidden();
});

test('no page except the map ships a script', async ({ page }) => {
  for (const path of await allPaths(page)) {
    const html = await (await page.request.get(path)).text();
    const scripts = (html.match(/<script\b/g) ?? []).length;
    expect(scripts, path).toBe(path === '/' ? 1 : 0);
  }
});

test.describe('phone menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('opens, marks where you are, and shuts, all without JavaScript', async ({ page }) => {
    await page.goto('/notebook/');
    const menu = page.locator('#menu');
    await expect(menu).toBeHidden();
    await page.getByRole('button', { name: 'Open the menu' }).click();
    await expect(menu).toBeVisible();
    await expect(menu.locator('a[aria-current]')).toHaveText('notebook');
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });
});
