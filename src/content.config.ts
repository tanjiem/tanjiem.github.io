import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
  The world's rules, enforced here so pages cannot disagree.

  - A seed is growing, not yet planted, or bearing.
  - An entry is written or unwritten, and is about exactly one seed.
  - A seed may grow out of one other seed.
  - Which entries a seed has, and which seeds grow out of it, are never
    written down twice: src/lib/world.ts derives them from these files.
*/

// Map positions are in the map's own space: 760 wide by 640 tall.
const position = z.object({
  x: z.number().min(0).max(760),
  y: z.number().min(0).max(640),
  // where the label sits relative to the light
  label: z.enum(['above', 'below', 'left', 'right']).default('right'),
});

const seeds = defineCollection({
  loader: glob({ base: './src/content/seeds', pattern: '*.md' }),
  schema: z.object({
    number: z.number().int().positive(),
    title: z.string(),
    state: z.enum(['growing', 'not yet planted', 'bearing']),
    // the one-sentence question under the title
    question: z.string(),
    growsOutOf: reference('seeds').optional(),
    map: position,
    // what the readout on the map says when this light is chosen
    readout: z.string(),
    // one ring per result. value stays empty until the result exists.
    rings: z
      .array(z.object({ label: z.string(), value: z.string().optional() }))
      .default([]),
    // from planted to results published
    growth: z.array(z.object({ step: z.string(), done: z.boolean().default(false), date: z.string().optional() })),
    where: z
      .object({ builtWith: z.string(), code: z.string(), runningAt: z.string() })
      .optional(),
    // only for a seed not yet planted: the ranked ideas, once they exist
    shortlist: z.array(z.string()).optional(),
    description: z.string(),
  }),
});

const entries = defineCollection({
  loader: glob({ base: './src/content/entries', pattern: '*.{md,mdx}' }),
  schema: z.object({
    number: z.number().int().positive(),
    title: z.string(),
    // a shorter name for the map, if the title is too long to sit there
    mapLabel: z.string().optional(),
    state: z.enum(['written', 'unwritten']),
    about: reference('seeds'),
    date: z.string().optional(),
    principle: z.object({ number: z.number().int(), text: z.string() }).optional(),
    map: position,
    readout: z.string(),
    description: z.string(),
  }),
});

export const collections = { seeds, entries };
