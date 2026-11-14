# Seed Notebook

Tanjie McMeans's personal site. Astro, static output, plain CSS, no tracking.

```sh
npm install
npm run dev        # local site at http://localhost:4321
npm run build      # builds to dist/
npm run check      # vocabulary, script, link and contrast checks on dist/
```

## Adding a seed

Make one file in `src/content/seeds/`, for example `04-my-next-seed.md`:

```yaml
---
number: 4
title: My next seed
state: growing                 # growing | not yet planted | bearing
question: One sentence the seed asks?
growsOutOf: 01-the-incubator-evaluation   # optional: another seed's file name
map: { x: 420, y: 560, label: right }     # map is 760 x 640; label above|below|left|right
readout: What the map's readout says when this light is chosen.
rings:                         # one per result; add value only when the result exists
  - label: what ring 1 records
  - label: what ring 2 records
    value: "0.71"
growth:
  - { step: planted, done: true, date: "3 March 2027" }
  - { step: results published }
where: { builtWith: "...", code: "https://...", runningAt: "https://..." }
description: One or two sentences for search results and share cards.
---

## The question
...
## What I committed to first
...
## What happened
...
## What broke
...
## What it cost
...
```

The map, the index, the seed page, the share image, the sitemap and every
"connected lights" list update from that one file.

## Adding a notebook entry

Make one file in `src/content/entries/`. Use `.mdx` if you want margin notes.

```yaml
---
number: 5
title: The full title
mapLabel: A shorter name for the map    # optional
state: unwritten                        # written | unwritten
about: 02-motionage-in-pyhealth         # the seed's file name
date: "12 April 2027"                   # for written entries
principle: { number: 2, text: The principle, set apart at the top. }   # optional
map: { x: 700, y: 120, label: below }
readout: What the readout says about it.
description: For search results and share cards.
---
```

In an `.mdx` entry:

```mdx
<Margin note="a second thought, beside the paragraph it argues with">

The paragraph.

</Margin>

<Kept title="The rules I froze">

1. A rule

</Kept>
```

## Changing the look

- Colours, sizes, spacing, lines: `src/styles/tokens.css`, one line each.
- Fonts: `astro.config.mjs`. Swap a `.woff2` file in `src/assets/fonts/` and its name there.
  Share images use the `.ttf` copies in `src/assets/og-fonts/`.
- Rules for words and shapes: `VOCABULARY.md` and `DESIGN.md`.

## Your details

`site.config.mjs` holds the site address, your email, GitHub, LinkedIn and the
résumé path. An empty value shows as a visible blank on the site.

Put your résumé at `public/resume.pdf`.

## Deploying

GitHub Pages, through `.github/workflows/deploy.yml`. See `OPEN-ITEMS.md` for the one-time setup.

## The address

`SITE_URL` (an environment variable, or the fallback in `site.config.mjs`) is
the only place the host name appears. Moving to your own domain means changing
that one value; no other code changes.

## Fonts and licences

Courier Prime, VT323 and Major Mono Display, all SIL Open Font License 1.1.
Licence texts are in `src/assets/fonts/`.
