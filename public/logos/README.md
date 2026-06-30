# Company logos

One PNG per unique company, named by the slug from `slugifyCompany()` in
`src/data/attendees.ts` (lowercase, spaces → hyphens, non `[a-z0-9-]` stripped).

The files here are **placeholders** (gray wordmarks). To use a real logo, drop a
PNG with the matching slug filename — e.g. `seplat-energy.png` — and it replaces
the placeholder automatically. If a logo file is missing at runtime, the app
falls back to rendering the company name as bold text (no broken-image icon).

Regenerate the placeholders with:

```
python scripts/generate-placeholder-logos.py
```
