#!/usr/bin/env python3
"""
Generate placeholder logo PNGs for every unique company in public/attendees.csv.
Light wordmarks (near-white) on a transparent canvas, sized to sit directly on
the dark cinematic background. Slugs match slugifyCompany() in
src/data/attendees.ts.

Usage:  python scripts/generate-placeholder-logos.py
Drop a real logo at public/logos/{slug}.png to override a placeholder.
"""
import csv
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "public" / "attendees.csv"
OUT_DIR = ROOT / "public" / "logos"

CANVAS = (760, 220)
H_PADDING = 40
TEXT = (236, 240, 248, 235)  # near-white, slightly soft

FONT_CANDIDATES = [
    "C:/Windows/Fonts/seguisb.ttf",  # Segoe UI Semibold
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/Arialbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def slugify(company: str) -> str:
    s = company.lower().strip()
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"[^a-z0-9-]", "", s)
    return s


def unique_companies():
    seen = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            c = (row.get("company") or "").strip()
            if c and c not in seen:
                seen.append(c)
    return seen


def find_font_path() -> str:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return path
    raise SystemExit("No bold TrueType font found; edit FONT_CANDIDATES.")


def best_font(draw, text, font_path, max_w, max_h):
    size = 10
    chosen = ImageFont.truetype(font_path, size)
    while size < 160:
        candidate = ImageFont.truetype(font_path, size + 2)
        box = draw.textbbox((0, 0), text, font=candidate)
        if (box[2] - box[0]) > max_w or (box[3] - box[1]) > max_h:
            break
        size += 2
        chosen = candidate
    return chosen


SEPLAT_RED = (225, 37, 27, 255)
SEPLAT_GREEN = (95, 176, 48, 255)


def render_seplat(font_path):
    """Brand-coloured Seplat wordmark: red 'Seplat' + green 'energy' beneath."""
    img = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    main_font = best_font(d, "Seplat", font_path, CANVAS[0] - 2 * H_PADDING, 130)
    sub_font = ImageFont.truetype(font_path, int(main_font.size * 0.48))

    mb = d.textbbox((0, 0), "Seplat", font=main_font)
    mw, mh = mb[2] - mb[0], mb[3] - mb[1]
    sb = d.textbbox((0, 0), "energy", font=sub_font)
    sw, sh = sb[2] - sb[0], sb[3] - sb[1]

    total_h = mh + int(sh * 0.55) + sh
    top = (CANVAS[1] - total_h) / 2
    mx = (CANVAS[0] - mw) / 2 - mb[0]
    d.text((mx, top - mb[1]), "Seplat", font=main_font, fill=SEPLAT_RED)
    # 'energy' tucked under the right half of the wordmark, like the real logo
    sx = (CANVAS[0] + mw) / 2 - sw - sb[0]
    sy = top + mh + int(sh * 0.55)
    d.text((sx, sy - sb[1]), "energy", font=sub_font, fill=SEPLAT_GREEN)

    img.save(OUT_DIR / "seplat.png", "PNG")
    print("  wrote seplat.png (brand colours)")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    font_path = find_font_path()
    max_w = CANVAS[0] - 2 * H_PADDING
    max_h = CANVAS[1] - 2 * 40

    for company in unique_companies():
        if slugify(company) == "seplat":
            render_seplat(font_path)
            continue
        text = company.upper()
        img = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        font = best_font(draw, text, font_path, max_w, max_h)
        box = draw.textbbox((0, 0), text, font=font)
        w, h = box[2] - box[0], box[3] - box[1]
        x = (CANVAS[0] - w) / 2 - box[0]
        y = (CANVAS[1] - h) / 2 - box[1]
        # letter-spacing for a more "logo" feel
        draw.text((x, y), text, font=font, fill=TEXT)

        out = OUT_DIR / f"{slugify(company)}.png"
        img.save(out, "PNG")
        print(f"  wrote {out.name}")


if __name__ == "__main__":
    main()
