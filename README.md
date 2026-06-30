# RIGSTART — Energy Leaders Forum display

A full-screen, cinematic "company hero roll" for a live event. Built for PC and
large external displays (fixed 1920×1080 canvas, uniformly scaled and
letterboxed). Not a website: no scrolling, no chrome, keyboard-driven.

## Stack

Bun · TanStack Start · Vite · Tailwind v4 · Framer Motion — deployed to Vercel
(`bun run build` emits the `.vercel/output/` Build Output API directly).

## Run

```bash
bun install
bun run dev        # http://localhost:3000
bun run build      # production build (Vercel-ready)
```

Navigate with **→ / Spacebar** (next) and **←** (previous). Manual only — nothing
auto-advances.

## Editing the data (the whole point)

Attendees are loaded at runtime from [`public/attendees.csv`](public/attendees.csv)
with columns `company,name,title`. Edit the CSV and refresh the browser — no
rebuild needed. People are grouped by company in first-appearance order; a
company with more than 6 people splits across multiple slides automatically.

## Logos

Per-company PNGs live in [`public/logos/`](public/logos/), named by company slug
(e.g. `atlas-offshore-drilling.png`). Shipped files are light-wordmark placeholders;
drop in a real light/transparent PNG to replace one. Missing logo → the slide
still shows the company name. Regenerate placeholders (reads the CSV):

```bash
python scripts/generate-placeholder-logos.py
```

## Rig backgrounds

A different cinematic rig backdrop is assigned per company and cross-fades on
change. Files are in `public/backgrounds/`, listed in
[`src/data/backgrounds.ts`](src/data/backgrounds.ts). Replace them with your own
photos (1920×1080) and update that list, or regenerate the stylized set:

```bash
python scripts/generate-rig-backgrounds.py
```

## Customizing the event

Brand and event title are constants at the top of
[`src/routes/index.tsx`](src/routes/index.tsx).
