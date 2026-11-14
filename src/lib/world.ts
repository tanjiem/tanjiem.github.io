import { getCollection, type CollectionEntry } from 'astro:content';

export type Seed = CollectionEntry<'seeds'>;
export type Entry = CollectionEntry<'entries'>;

/** 1 -> "01" */
export const pad = (n: number) => String(n).padStart(2, '0');

/** Prefix a site path with the deploy base, so a sub-path host needs no code change. */
export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

export const seedHref = (s: Seed) => url(`/seeds/${pad(s.data.number)}/`);
export const entryHref = (e: Entry) => url(`/notebook/${pad(e.data.number)}/`);

export const seedName = (s: Seed) => `seed ${pad(s.data.number)}`;
export const entryName = (e: Entry) => `notebook ${pad(e.data.number)}`;

/** A star's size on the map counts its entries, the way an atlas sizes a star by brightness. */
export const seedRadius = (entryCount: number) => Math.min(12 + 5.5 * Math.sqrt(entryCount), 32);

/** "01, 02 and 03" */
export const listNumbers = (ns: number[]) => {
  const p = ns.map(pad);
  return p.length < 2 ? p.join('') : `${p.slice(0, -1).join(', ')} and ${p.at(-1)}`;
};

let cached: Awaited<ReturnType<typeof build>> | undefined;

export async function getWorld() {
  cached ??= await build();
  return cached;
}

async function build() {
  const seeds = (await getCollection('seeds')).sort((a, b) => a.data.number - b.data.number);
  const entries = (await getCollection('entries')).sort((a, b) => a.data.number - b.data.number);

  const seedById = new Map(seeds.map((s) => [s.id, s]));

  // Enforce the rules of the world at build time.
  const fail = (msg: string) => {
    throw new Error(`[seed notebook] ${msg}`);
  };
  const unique = (label: string, ns: number[]) => {
    const dup = ns.find((n, i) => ns.indexOf(n) !== i);
    if (dup !== undefined) fail(`two ${label} share the number ${dup}`);
  };
  unique('seeds', seeds.map((s) => s.data.number));
  unique('entries', entries.map((e) => e.data.number));
  for (const e of entries) {
    if (!seedById.has(e.data.about.id)) fail(`entry ${e.id} is about "${e.data.about.id}", which is not a seed`);
  }
  for (const s of seeds) {
    const parent = s.data.growsOutOf?.id;
    if (parent && !seedById.has(parent)) fail(`seed ${s.id} grows out of "${parent}", which is not a seed`);
    if (parent === s.id) fail(`seed ${s.id} cannot grow out of itself`);
    for (const r of s.data.rings) {
      if (r.value !== undefined && r.value.trim() === '') fail(`seed ${s.id} has an empty ring value; leave it out instead`);
    }
  }

  const entriesOf = (s: Seed) => entries.filter((e) => e.data.about.id === s.id);
  const seedOf = (e: Entry) => seedById.get(e.data.about.id)!;
  const parentOf = (s: Seed) => (s.data.growsOutOf ? seedById.get(s.data.growsOutOf.id) : undefined);
  const childrenOf = (s: Seed) => seeds.filter((c) => c.data.growsOutOf?.id === s.id);

  const nextSeed = (s: Seed) => seeds[(seeds.indexOf(s) + 1) % seeds.length];
  const nextEntry = (e: Entry) => entries[entries.indexOf(e) + 1];
  const prevEntry = (e: Entry) => entries[entries.indexOf(e) - 1];

  return { seeds, entries, entriesOf, seedOf, parentOf, childrenOf, nextSeed, nextEntry, prevEntry };
}

export type World = Awaited<ReturnType<typeof getWorld>>;
