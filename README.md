# EarnSignal

An interactive prototype that helps people discover realistic ways to earn
money, weigh the evidence and risk behind each one, compare opportunities
side by side, and track a simple 7-day test plan.

## Prototype disclaimer

**Every opportunity, score, source, and statistic in this project is
illustrative sample data written for this prototype.** Nothing here is
live, verified, scraped, or fetched from a real data source, and nothing
in EarnSignal promises or guarantees any income. Every page carries a
visible "Illustrative sample" / "Illustrative prototype data" label for
this reason. Treat all figures as fictional placeholders that demonstrate
how a real product in this space could present evidence honestly.

## What EarnSignal is

EarnSignal is a Next.js implementation of a Flowstep-designed product
concept: an evidence-first alternative to hype-driven "make money online"
content. Instead of promising outcomes, it shows the evidence for and
against an opportunity, an honest risk picture, and a practical way to
test it cheaply before committing.

## Main features

- **Welcome & Personalisation** — a short onboarding flow (location,
  available time, budget, skills, delivery preference) that saves to
  `localStorage` and feeds a deterministic "Best Match" score
- **Discover** — search, filter (category, difficulty, startup cost),
  and sort (best match, newest, lowest cost, strongest evidence) across 6
  sample opportunities
- **Opportunity Detail** — a 5-tab signal breakdown (Overview, Why now,
  Evidence, How to start, Risks) with a transparent evidence-vs-hype
  section
- **Compare** — a side-by-side comparison of up to 3 saved opportunities,
  responsive between a desktop table and stacked mobile cards
- **Test Plan** — an interactive 7-day checklist per opportunity, with
  notes and reflections per day, isolated per opportunity
- **Progress** — a dashboard summarising one plan's status plus every
  plan you've started, with a factual (non-fabricated) completion summary

## Tech stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- **localStorage** for all persisted state — no backend, no database
- **ESLint 9** (flat config) via `eslint-config-next`
- No authentication, no analytics, no tracking, no external APIs

## Local installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000. To test on a phone over your local network:

```bash
npm run dev -- --hostname 0.0.0.0
```

Then visit `http://<your-computer's-LAN-IP>:3000` from the phone. If you
change which LAN IP you use, add it to `allowedDevOrigins` in
`next.config.mjs` (Next.js blocks unrecognised cross-origin dev requests
by default).

## Production build

```bash
npm run build
npm run start
```

## Linting

```bash
npm run lint
```

## How localStorage is used

Everything EarnSignal remembers lives in the browser's `localStorage` —
there is no server-side database or account system. Keys, all namespaced
under `earnsignal:`:

| Key | What it stores |
|---|---|
| `earnsignal:personalisation` | Your saved onboarding answers |
| `earnsignal:saved-opportunities` | Bookmarked opportunity slugs |
| `earnsignal:compare-list` | Up to 3 opportunity slugs queued for Compare |
| `earnsignal:test-plans` | One entry per opportunity you've started a plan for — completed days, notes, and reflections, keyed by slug so plans never overwrite each other |

Clearing your browser's site data resets everything. Nothing is ever sent
to a server — all reads/writes happen entirely client-side (see
`lib/storage/local-storage.ts`).

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. In [Vercel](https://vercel.com), choose **Add New → Project** and
   import that repository.
3. Framework preset: **Next.js** (auto-detected). No environment
   variables are required — leave that section empty.
4. Deploy. Vercel will run `npm run build` automatically.

No further configuration is needed: there's no database to provision, no
API keys to add, and no auth provider to configure.

## Project structure

```
app/                     Routes (App Router)
  page.tsx                 Welcome
  discover/                Discover
  opportunity/[slug]/      Opportunity Detail
  compare/                 Compare
  test-plan/               Test Plan
  progress/                Progress
components/
  ui/                      Reusable primitives (Button, Card, Badge, Chip, ...)
  layout/                  Sidebar, MobileNav, Topbar, nav config
  welcome/, discover/, opportunity/, compare/, test-plan/, progress/
                           Feature-specific components, one folder per route
lib/
  data/opportunities.ts    The 6 sample opportunities (typed, single source)
  storage/local-storage.ts All localStorage read/write logic
  hooks/                   Shared hooks (saved/compare state, plan resolution)
  scoring.ts               Deterministic Best Match scoring
```

## No live backend or authentication

There is no server, database, or authentication anywhere in this project.
Every "save," "compare," and "test plan" interaction is stored only in
your own browser's `localStorage`. This is a front-end prototype, not a
production SaaS product.
