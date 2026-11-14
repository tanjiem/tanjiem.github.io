# Open items for Tanjie

Everything here is yours to decide or supply. The site builds and every
automated check passes; these are the things code should not decide for you.

## Before it goes live

- [ ] **Résumé.** Put the file at `public/resume.pdf`. Every page links to it, and today that link leads nowhere.
- [ ] **Contact.** Fill in `email`, `github` and `linkedin` in `site.config.mjs`. Empty values show as `[YOUR EMAIL]` and similar.
- [ ] **Going live.** The code is in the public repo `tanjiem/tanjiem.github.io`, and nothing is published yet. When you are ready:
  1. Pages is already set to publish from "GitHub Actions" (GitHub turns Pages on by itself for a repo with this name and won't let it be switched off; the workflow below is what keeps it unpublished).
  2. In Settings > Secrets and variables > Actions > Variables, add `LIVE` with the value `true`.
  3. Push anything, or run the workflow from the Actions tab. The site appears at https://tanjiem.github.io/.
- [ ] **Later, private with GitHub Pro.** After upgrading, switch the repo to private in Settings. Pages keeps working and nothing in the code changes. Everything pushed while the repo was public stays public in any clones or forks made before the switch.
- [ ] **Blanks.** Decide whether the site launches with visible blanks. `npm run check` lists every blank, page by page. At last count: seed 02 is all blanks, seed 01 has four, entry 01 has six, and the about page has your voice paragraph, photo, year and two principles.
- [ ] **Entry 01** is drawn as *written* (filled diamond) but is still mostly blanks and undated. Finish it before launch, or mark it `state: unwritten`.
- [ ] **Seed 01 disagrees with itself.** The map readout says the method is frozen and the judges are being checked, but the growth record leaves "method frozen" unticked. Make them agree.

## Wording to confirm

The brief treats mock wording as placeholder. Confirm or rewrite every sentence that ships, especially:

- the home intro, which uses "project" ("which is what I call a project"). The vocabulary rule keeps that word out of interface copy; this is your prose, so it stays until you say otherwise.
- "my projects are seeds" on the about page, for the same reason.
- "that I finish this term", and every fact in "The record".
- the map readouts for each seed and entry (in each file's `readout`).
- lines the builder wrote in your voice: the unwritten-entry text ("This entry is promised but not written yet." and "What it will cover:"), the 404 page, the page descriptions used by search engines and share cards, and the legend line "a bigger star has more entries".

## Taste: departures from the mocks to approve or reverse

- **Links take the colour of where they lead.** Gold to a seed, teal to an entry, purple for everything else. The mocks made every link teal. Change in `tokens.css`: `--link`, `--link-seed`, `--link-entry`.
- **A seed's rings are all purple**, told apart by number. The mocks cycled purple, gold and teal. Change in `tokens.css`: `--ring-1` to `--ring-4`.
- **Seed numbers in the home index are gold.** The mocks used purple.
- **The corner way-home control** shows only its little constellation between 1440px and 1760px wide, so it never covers text. The words appear from 1760px. Narrower than 1440px, the foot link does the job.
- **The keyboard focus outline is teal** everywhere except on the map, where it takes the light's own colour.
- **Index titles are lowercased** on the home page, so "MotionAge in PyHealth" reads "motionage in pyhealth". Remove `text-transform: lowercase` in `src/pages/index.astro` to keep capitals.
- **"Notebook 03 will name it"** from the Seed 03 mock is not shown. Entry 03 is about Seed 01, and the rule is that an entry connects only to its own seed. Restoring it needs a new rule ("an entry can name a seed").
- **A bearing seed has no mark of its own yet.** It draws as a filled star, the same as growing, so the legend would show two identical keys. Decide its mark before any seed reaches bearing.
- **Halos** (the soft circles around planted seeds) are atmosphere and are not in the legend.

## Domain and email, after you buy the domain

For GitHub Pages: add `public/CNAME` containing your domain, change `SITE_URL`
in `.github/workflows/deploy.yml` to `https://your-domain`, remove any
`BASE_PATH` variable, and enter the DNS records from GitHub's "Managing a custom
domain for your GitHub Pages site" docs (verify them there on the day; don't
copy them from memory). Email on your domain needs a mail service (many hosts and
registrars offer free forwarding); its records come from that service's docs.
Then set `SITE_URL` to the new address. No other code changes.
