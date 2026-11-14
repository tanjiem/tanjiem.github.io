// Every page at every width: no sideways scroll, résumé one click away,
// one h1, a title and a description, and motion only when it is allowed.
import { test, expect } from '@playwright/test';
import { allPaths } from './helpers';

const widths = [390, 768, 1024, 1280, 1440, 1920];

for (const width of widths) {
  test(`every page holds together at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of await allPaths(page)) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `${path} scrolls sideways`).toBeLessThanOrEqual(0);
      // résumé reachable in one click from the top bar, at any width
      await expect(page.locator('.topbar a[href$="resume.pdf"]:visible').first(), path).toBeVisible();
      await expect(page.locator('h1'), path).toHaveCount(1);
    }
  });
}

test('every page has a title, a description and a share image', async ({ page }) => {
  for (const path of await allPaths(page)) {
    await page.goto(path);
    expect((await page.title()).length, path).toBeGreaterThan(5);
    await expect(page.locator('meta[name="description"]'), path).toHaveAttribute('content', /.{20,}/);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    const res = await page.request.get(new URL(og!).pathname);
    expect(res.status(), `${path} share image`).toBe(200);
  }
});

test.describe('motion', () => {
  const animated = () =>
    [...document.querySelectorAll('.twinkle, .glow, .ring.filled')]
      .filter((e) => getComputedStyle(e).animationName !== 'none').length;

  test('stops entirely under reduced motion', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(animated)).toBe(0);
  });

  test.describe('when motion is allowed', () => {
    test.use({ reducedMotion: 'no-preference' });
    test('the background stars and growing seeds move', async ({ page }) => {
      await page.goto('/');
      expect(await page.evaluate(animated)).toBeGreaterThan(0);
    });
  });
});
