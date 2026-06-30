# Company logos

One PNG per unique company in `public/attendees.csv`, named by the slug from
`slugifyCompany()` (lowercase, spaces → hyphens, non `[a-z0-9-]` stripped) —
e.g. `Atlas Offshore Drilling` → `atlas-offshore-drilling.png`.

The shipped files are **placeholders**: light wordmarks for the dark theme. Drop
a real logo (ideally a light/white PNG with transparent background) at the
matching slug filename to replace one. If a logo is missing at runtime the slide
still shows the company name as the headline — nothing breaks.

Regenerate placeholders (reads the CSV) with:

```
python scripts/generate-placeholder-logos.py
```
