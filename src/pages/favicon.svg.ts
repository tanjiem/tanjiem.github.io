// The favicon: a seed's star on the ground, in the token colours.
import type { APIRoute } from 'astro';
import { readTokens } from '../lib/tokens.mjs';
import { starPath } from '../lib/marks';

export const GET: APIRoute = () => {
  const t = readTokens();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-16 -16 32 32"><rect x="-16" y="-16" width="32" height="32" fill="${t.ground}"/><path d="${starPath(13)}" fill="${t.seed}"/></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
