// The one piece of client code: the readout beside the map.
import { test, expect } from '@playwright/test';
import { mapLights, watchErrors, open } from './helpers';

test.use({ viewport: { width: 1280, height: 900 } });

test('a first click chooses a light, a second click opens it', async ({ page }) => {
  const errors = watchErrors(page);
  await open(page, '/');
  const light = page.locator('a.light[data-light="seed-01"]');
  await light.click();
  await expect(page).toHaveURL('/');
  await expect(page.locator('[data-chosen] h2')).toHaveText('The Incubator Evaluation');
  await expect(light).toHaveClass(/is-chosen/);
  await light.click();
  await expect(page).toHaveURL('/seeds/01/');
  expect(errors).toEqual([]);
});

test('every light has a readout that names it and links where the light links', async ({ page }) => {
  await open(page, '/');
  for (const l of await mapLights(page)) {
    await page.locator(`a.light[data-light="${l.key}"]`).click();
    const chosen = page.locator('[data-chosen]');
    await expect(chosen).toBeVisible();
    const title = (await chosen.locator('h2').textContent())!.trim();
    expect(l.aria, `${l.key} readout title`).toContain(title);
    await expect(chosen.locator('a.open')).toHaveAttribute('href', l.href);
    // the typed label finishes as the full label, no cursor left behind
    await expect(chosen.locator('[data-type]')).not.toHaveText(/_$/);
  }
});

test('choosing by pointer announces the readout once, without the link text', async ({ page }) => {
  await open(page, '/');
  await page.locator('a.light[data-light="entry-02"]').click();
  const said = await page.locator('[data-announce]').textContent();
  expect(said).toContain('Do model judges agree with people?');
  expect(said).not.toContain('->');
});

test('reaching a light by keyboard chooses it silently, and Enter opens it', async ({ page }) => {
  await open(page, '/');
  const light = page.locator('a.light[data-light="seed-02"]');
  await light.focus();
  await expect(page.locator('[data-chosen] h2')).toHaveText('MotionAge in PyHealth');
  // the link's own label is read on focus, so the live region stays quiet
  await expect(page.locator('[data-announce]')).toHaveText('');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/seeds/02/');
});

test('Escape and a click on empty sky both return to the opening text', async ({ page }) => {
  await open(page, '/');
  const intro = page.locator('[data-intro]');
  await page.locator('a.light[data-light="seed-01"]').click();
  await expect(intro).toHaveClass(/visually-hidden/);
  await page.keyboard.press('Escape');
  await expect(intro).not.toHaveClass(/visually-hidden/);
  await expect(page.locator('[data-chosen]')).toBeHidden();

  await page.locator('a.light[data-light="seed-01"]').click();
  await page.locator('[data-map] > svg').click({ position: { x: 5, y: 5 } });
  await expect(intro).not.toHaveClass(/visually-hidden/);
  await expect(page.locator('a.light.is-chosen')).toHaveCount(0);
});

test('the opening heading stays in the page for screen readers while a light is chosen', async ({ page }) => {
  await open(page, '/');
  await page.locator('a.light[data-light="seed-01"]').click();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('I plant small AI systems');
});

test('pointing at an index row lights its mark on the map', async ({ page }) => {
  await open(page, '/');
  await page.locator('.index a[data-for="entry-04"]').hover();
  await expect(page.locator('a.light[data-light="entry-04"]')).toHaveClass(/is-chosen/);
  await page.mouse.move(0, 0);
  await expect(page.locator('a.light.is-chosen')).toHaveCount(0);
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });
  test('a tap opens the light straight away', async ({ page }) => {
    await open(page, '/');
    await page.locator('a.light[data-light="seed-01"]').tap();
    await expect(page).toHaveURL('/seeds/01/');
  });
});
