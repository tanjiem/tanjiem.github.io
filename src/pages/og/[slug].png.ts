// Share images, drawn at build time from the same content as the pages.
import type { APIRoute, GetStaticPaths } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import { join } from 'node:path';
import { getWorld, pad, seedRadius } from '../../lib/world';
import { starPath, diamondPath } from '../../lib/marks';
import { readTokens } from '../../lib/tokens.mjs';

const T = readTokens();

// resolved from the project root: the built chunk lives elsewhere
const fontDir = join(process.cwd(), 'src/assets/og-fonts/');
const fontFiles = ['CourierPrime-Bold.ttf', 'CourierPrime-Regular.ttf', 'VT323-Regular.ttf', 'MajorMonoDisplay-Regular.ttf'].map((f) => fontDir + f);

type Card = { label: string; title: string; mark: 'seed' | 'seed-hollow' | 'entry' | 'entry-hollow' | 'map' };

export const getStaticPaths: GetStaticPaths = async () => {
  const { seeds, entries } = await getWorld();
  const cards: Record<string, Card> = {
    home: { label: 'START HERE', title: 'I plant small AI systems, then write down honestly how they grow.', mark: 'map' },
    notebook: { label: 'NOTEBOOK', title: 'What I wrote down while the seeds grew.', mark: 'entry' },
    about: { label: 'ABOUT THE GARDENER', title: "I'm Tanjie. I used to teach. Now I build AI systems and check whether they work.", mark: 'map' },
  };
  for (const s of seeds) {
    cards[`seed-${pad(s.data.number)}`] = {
      label: `SEED ${pad(s.data.number)} · ${s.data.state.toUpperCase()}`,
      title: s.data.title,
      mark: s.data.state === 'not yet planted' ? 'seed-hollow' : 'seed',
    };
  }
  for (const e of entries) {
    cards[`notebook-${pad(e.data.number)}`] = {
      label: `NOTEBOOK ${pad(e.data.number)}${e.data.state === 'unwritten' ? ' · UNWRITTEN' : ''}`,
      title: e.data.title,
      mark: e.data.state === 'written' ? 'entry' : 'entry-hollow',
    };
  }
  return Object.entries(cards).map(([slug, card]) => ({ params: { slug }, props: { card } }));
};

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(text: string, max: number) {
  const lines: string[] = [];
  let line = '';
  for (const w of text.split(' ')) {
    if ((line + ' ' + w).trim().length > max) { lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

async function markSvg(mark: Card['mark']) {
  const C = { gold: T.seed, teal: T.entry, ground: T.ground, text: T.text };
  if (mark === 'seed') return `<circle r="70" fill="${C.gold}" fill-opacity="0.12"/><path d="${starPath(56)}" fill="${C.gold}"/>`;
  if (mark === 'seed-hollow') return `<path d="${starPath(56)}" fill="${C.ground}" stroke="${C.gold}" stroke-width="3" stroke-dasharray="8 8"/>`;
  if (mark === 'entry') return `<path d="${diamondPath(40)}" fill="${C.teal}"/>`;
  if (mark === 'entry-hollow') return `<path d="${diamondPath(40)}" fill="none" stroke="${C.teal}" stroke-width="3"/>`;
  // the whole map, small
  const { seeds, entries, entriesOf, seedOf } = await getWorld();
  const k = 0.34;
  const p = (pt: { x: number; y: number }) => [(pt.x - 380) * k, (pt.y - 320) * k];
  let out = '';
  for (const e of entries) {
    const [x1, y1] = p(seedOf(e).data.map); const [x2, y2] = p(e.data.map);
    out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.text}" stroke-opacity="0.45" stroke-width="1.5"/>`;
  }
  for (const s of seeds) {
    const [x, y] = p(s.data.map);
    const r = seedRadius(entriesOf(s).length) * 0.8;
    out += s.data.state === 'not yet planted'
      ? `<path transform="translate(${x} ${y})" d="${starPath(r)}" fill="${C.ground}" stroke="${C.gold}" stroke-width="2" stroke-dasharray="4 4"/>`
      : `<path transform="translate(${x} ${y})" d="${starPath(r)}" fill="${C.gold}"/>`;
  }
  for (const e of entries) {
    const [x, y] = p(e.data.map);
    out += e.data.state === 'written'
      ? `<path transform="translate(${x} ${y})" d="${diamondPath(8)}" fill="${C.teal}"/>`
      : `<path transform="translate(${x} ${y})" d="${diamondPath(8)}" fill="${C.ground}" stroke="${C.teal}" stroke-width="2"/>`;
  }
  return out;
}

export const GET: APIRoute = async ({ props }) => {
  const card = props.card as Card;
  // leave room on the right for the mark, wider when it is the whole map
  const lines = wrap(card.title, card.mark === 'map' ? 22 : 26);
  const size = lines.length > 3 ? 46 : 56;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${T.ground}"/>
  <line x1="72" y1="560" x2="1128" y2="560" stroke="${T.rule}" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="72" y="104" font-family="Major Mono Display" font-size="34" fill="${T.accent}">tanjie mcmeans</text>
  <text x="72" y="210" font-family="VT323" font-size="40" fill="${T.accent}" letter-spacing="2">&gt; ${esc(card.label)}</text>
  ${lines.map((l, i) => `<text x="72" y="${290 + i * size * 1.2}" font-family="Courier Prime" font-weight="700" font-size="${size}" fill="${T.text}">${esc(l)}</text>`).join('\n  ')}
  <text x="72" y="604" font-family="VT323" font-size="30" fill="${T['text-quiet']}" letter-spacing="1">SEEDS · NOTEBOOK · RESUME.PDF</text>
  <g transform="translate(${card.mark === 'map' ? 1015 : 1000} 330)">${await markSvg(card.mark)}</g>
</svg>`;
  const png = new Resvg(svg, { font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Courier Prime' } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
