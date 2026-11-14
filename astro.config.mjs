// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { SITE_URL } from './site.config.mjs';

const font = (file, weight = 400, style = 'normal') => ({
  src: [`./src/assets/fonts/${file}.woff2`],
  weight,
  style,
});

export default defineConfig({
  site: SITE_URL,
  // only needed when the host serves the site under a sub-path
  base: process.env.BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/404') })],
  // Self-hosted, open-licence (OFL), latin subset. To change a face, swap the
  // file here; the CSS variable names stay the same.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Courier Prime',
      cssVariable: '--font-typewriter',
      fallbacks: ['Courier New', 'monospace'],
      options: {
        variants: [
          font('courier-prime-latin-400-normal'),
          font('courier-prime-latin-400-italic', 400, 'italic'),
          font('courier-prime-latin-700-normal', 700),
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'VT323',
      cssVariable: '--font-terminal',
      fallbacks: ['monospace'],
      options: { variants: [font('vt323-latin-400-normal')] },
    },
    {
      provider: fontProviders.local(),
      name: 'Major Mono Display',
      cssVariable: '--font-display',
      fallbacks: ['monospace'],
      options: { variants: [font('major-mono-display-latin-400-normal')] },
    },
  ],
});
