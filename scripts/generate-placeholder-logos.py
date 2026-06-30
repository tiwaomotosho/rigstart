#!/usr/bin/env python3
"""
Generate placeholder logo PNGs for every unique company in the seed data
(spec §6.2): a 600x300 transparent canvas with the company name centered as a
large gray (#C7CDD9) wordmark, so a human can easily spot-replace it later.

Slugs MUST match slugifyCompany() in src/data/attendees.ts.

Usage:  python scripts/generate-placeholder-logos.py
Drop real logos at public/logos/{slug}.png to override a placeholder.
"""
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# Unique companies, in seed order.
COMPANIES = [
    "Seplat Energy",
    "Shelf Drilling",
    "SLB",
    "Halliburton",
    "Baker Hughes",
]

CANVAS = (600, 300)
H_PADDING = 60  # text never wider than 480px
GRAY = (199, 205, 217, 255)  # #C7CDD9
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "logos"

FONT_CANDIDATES = [
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/Arialbd.ttf",
    "C:/Windows/Fonts/seguisb.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def slugify(company: str) -> str:
    s = company.lower().strip()
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"[^a-z0-9-]", "", s)
    return s


def find_font_path() -> str:
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return path
    raise SystemExit("No bold TrueType font found; edit FONT_CANDIDATES.")


def best_font(draw, text, font_path, max_w, max_h):
    """Largest font size that fits the text within (max_w, max_h)."""
    size = 10
    chosen = ImageFont.truetype(font_path, size)
    while size < 200:
        candidate = ImageFont.truetype(font_path, size + 2)
        box = draw.textbbox((0, 0), text, font=candidate)
        if (box[2] - box[0]) > max_w or (box[3] - box[1]) > max_h:
            break
        size += 2
        chosen = candidate
    return chosen


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    font_path = find_font_path()
    max_w = CANVAS[0] - 2 * H_PADDING
    max_h = CANVAS[1] - 2 * 60

    for company in COMPANIES:
        img = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        font = best_font(draw, company, font_path, max_w, max_h)
        box = draw.textbbox((0, 0), company, font=font)
        w, h = box[2] - box[0], box[3] - box[1]
        x = (CANVAS[0] - w) / 2 - box[0]
        y = (CANVAS[1] - h) / 2 - box[1]
        draw.text((x, y), company, font=font, fill=GRAY)

        out = OUT_DIR / f"{slugify(company)}.png"
        img.save(out, "PNG")
        print(f"  wrote {out.name}")


if __name__ == "__main__":
    main()
