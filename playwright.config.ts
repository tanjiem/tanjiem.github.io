import { defineConfig } from '@playwright/test';

// Tests run against the built site, served the way the host will serve it.
// Locally they use the installed Chrome; in CI, run `npx playwright install chromium` first.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4322',
    channel: process.env.CI ? undefined : 'chrome',
    reducedMotion: 'reduce',
  },
  webServer: {
    // `npm test` builds first (the pretest script); this only serves dist/
    command: 'npx astro preview --port 4322',
    url: 'http://localhost:4322',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
