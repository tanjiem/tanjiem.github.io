# Design system

Small on purpose. Consistency was the complaint about earlier versions, so the
rules are written down here and enforced in code where possible.

## Tokens

All in `src/styles/tokens.css`. Each is one line.

- **Colour.** Ground `--ground`, raised ground `--ground-raised`, rules `--rule` and `--rule-strong`, three inks `--text`, `--text-soft`, `--text-quiet`.
- **Meaning.** Purple `--accent` is the site's own colour. Gold `--seed` means a seed. Teal `--entry` means an entry. Links take the colour of where they lead: `--link-seed`, `--link-entry`, and `--link` (purple) for everything else. A seed's rings are all purple and told apart by number. Roles such as `--link`, `--focus`, `--margin-ink`, `--line-about`, `--line-grows` and `--ring-1..4` point at those; repoint a role in the tokens file, never in a component.
- **Faces.** `--face-body` (typewriter: Courier Prime), `--face-label` (terminal: VT323), `--face-name` (display: Major Mono Display, used for the name only). The font files are set in `astro.config.mjs`; swap a file there and the variable stays the same.
- **Sizes, space, lines, motion.** Also in the tokens file.

## Type roles

| Face | Used for |
| --- | --- |
| Typewriter | body, titles, index rows, margin notes |
| Terminal | labels, navigation, section heads, legend, captions, foot links |
| Display | the name in the top bar and share images, nothing else |

## Components

| Component | File |
| --- | --- |
| Top bar (with phone menu) | `src/components/TopBar.astro` |
| Readout | `src/components/Readout.astro` |
| Star map | `src/components/StarMap.astro` |
| Light (mark) | `src/components/MarkShape.astro`, `Mark.astro` |
| Ledger row | `src/components/Ledger.astro` |
| Growth record | `src/components/GrowthRecord.astro` |
| Pattern | `src/components/Pattern.astro` |
| Margin note | `src/components/Margin.astro` |

Supporting pieces: `Legend`, `Constellation` (the small "you are here" maps), `ConnectedLights`, `FootNav`, `Contact`, `Kept`.

## Marks and lines

| Mark | Meaning |
| --- | --- |
| filled four-point star | seed, growing |
| dashed outline star | seed, not yet planted |
| filled star (to be decided) | seed, bearing |
| filled diamond | entry, written |
| outline diamond | entry, unwritten |
| circle around a light | the light you are on, or the light you chose |

| Line | Meaning |
| --- | --- |
| solid, pale | this entry is about this seed |
| dashed, gold | this seed grows out of that seed |

A seed's star is drawn bigger the more entries it has, the way an atlas sizes a star by brightness. The legend says so.

## Shape rules

No rounded cards, no pill buttons, no drop shadows, no gradient washes, no hero with two buttons, no three-card feature rows, no icon libraries, no emoji. Structure comes from dashed rules, type and space. The one raised block (`Kept`, the frozen rules) is flat, square and uses `--ground-raised`.

## Motion

Background stars twinkle slowly, a growing seed's glow breathes, the readout label types itself in, and a ring draws itself when its result arrives. All of it stops under `prefers-reduced-motion`. Nothing moves that you are trying to read.
