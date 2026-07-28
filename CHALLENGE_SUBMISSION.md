# EarnSignal — Challenge Submission

## One-sentence description

EarnSignal helps people discover realistic ways to earn money, weigh the
evidence and risk behind each one, compare opportunities side by side, and
track a simple 7-day plan to test one before committing further.

## Project description

Most "make money online" content sells hype instead of evidence: inflated
income claims, no risk disclosure, and no practical next step beyond
"just start." EarnSignal is the opposite by design. Every opportunity
carries a transparent signal score, a breakdown of what's actually
supported by evidence versus what's unproven, an honest risk and
competition picture, and — instead of a purchase button — a cheap, 7-day
way to test the idea for real before spending meaningful time or money.

### Problem

People exploring side income ideas are flooded with unverifiable claims,
survivorship bias, and no way to tell a genuinely promising opportunity
from a saturated or misleading one. There's rarely a next step smaller
than "quit your job and commit."

### Solution

EarnSignal reframes the decision around evidence and testing:

- A transparent **signal score** with a visible breakdown (buyer demand,
  problem urgency, ease of testing, competition, evidence quality)
- An explicit **evidence-vs-hype** section for every opportunity —
  what's actually supported, and what isn't proven
- A **Best Match** score computed from what the person actually said
  about their budget, skills, time, and location — not a generic ranking
- A **7-day test plan** as the primary call to action, not a purchase or
  sign-up — with per-day notes and reflections that persist locally
- A **Progress dashboard** that only ever reports back what the person
  themselves entered, with no fabricated or AI-generated conclusions

### Main user journey

1. Land on the Welcome screen, optionally personalise (location, time,
   budget, skills, delivery preference) or skip straight to browsing
2. Discover opportunities — search, filter, and sort by best match,
   newest, lowest cost, or strongest evidence
3. Open a Signal Detail page — read the Overview, Why now, Evidence, How
   to start, and Risks tabs
4. Save opportunities and/or add up to 3 to Compare
5. Build a 7-day Test Plan for the strongest candidate
6. Complete days, log notes and reflections as you actually test it
7. Check Progress — status, timeline, and (on completion) a factual
   summary of what was logged, with no guaranteed-outcome claims

## Links

- **Flowstep prototype:** _[link to be added]_
- **Live deployment (Vercel):** _[link to be added]_
- **Social post:** _[link to be added]_

## Technologies used

Next.js (App Router), React, TypeScript, Tailwind CSS v4, and
`localStorage` for all persisted state. No backend, database,
authentication, analytics, or external APIs.

## Features expanded beyond the static Flowstep prototype

The original Flowstep prototype was 8 static, non-interactive screens.
This build makes every one of them fully functional, and adds several
things the static screens couldn't show at all:

- Real search, multi-filter combination, and 4 sort modes on Discover
- A genuine, deterministic Best Match algorithm driven by saved
  personalisation answers (the static prototype only showed a fixed
  number)
- Working Save and Compare with a real 3-item limit and clear feedback
  when it's reached
- Fully keyboard-accessible tabs on the Signal Detail page
- A real 7-day interactive checklist with per-day notes and reflections,
  isolated per opportunity, all persisted in `localStorage`
- A Progress dashboard — not present as a working page in the static
  prototype — that aggregates every started plan, links each timeline day
  back to its exact spot in the Test Plan, and surfaces saved
  opportunities that don't have a plan yet
- Honest, deliberate rewording anywhere the original design implied live
  or automatically-researched data ("Illustrative sample" instead of
  fabricated "Updated 2 hours ago"-style timestamps)
- Full responsive behaviour from 390px phones through 1440px desktops

**The Flowstep design and its exported React/Tailwind code were the
visual foundation for this entire build.** Layout, spacing, typography,
card treatment, borders, and the dark/lime colour identity were preserved
throughout; the work here was making that design fully interactive with
real state, real navigation, and real (if illustrative) data.

## Prototype / sample-data disclaimer

All opportunities, scores, evidence sources, and statistics are
illustrative sample data written for this prototype. Nothing is fetched
from a real data source, and nothing in EarnSignal is a guarantee of
income. This disclaimer is also shown throughout the live product itself.

## Suggested screenshots to submit

1. Welcome screen (desktop, showing the hero + decorative signal cards)
2. Discover with a couple of filters active and results showing
3. Signal Detail page on the Evidence tab
4. Compare with 2–3 opportunities selected (desktop table view)
5. Test Plan mid-progress (a few days checked, one with notes visible)
6. Progress dashboard for a completed plan, showing the completion card
7. Any one of the above at a phone width (390×844), to show the
   responsive layout

## Suggested 30–45 second walkthrough sequence

1. **(0–5s)** Welcome screen — say what EarnSignal is in one sentence
2. **(5–12s)** Quickly answer 2–3 Personalisation questions, tap "Build
   my opportunity feed"
3. **(12–20s)** On Discover, apply one filter and switch the sort to
   "Best match" — point out the score and evidence badge
4. **(20–28s)** Open one opportunity, flip through the Evidence tab to
   show the evidence-vs-hype breakdown
5. **(28–36s)** Tap "Build my test plan," check off a day, add a quick
   note
6. **(36–45s)** Tap "View Progress" to land on the dashboard — show the
   percentage and timeline, end on the "Illustrative sample" disclaimer
