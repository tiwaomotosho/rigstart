#!/usr/bin/env python3
"""
Generate cinematic, stylized oil-rig background images for the display.

These are deliberately art-directed silhouette scenes (not stock photos): moody
graded skies, layered rigs with atmospheric depth, a gas-flare glow, water
reflections, vignette and film grain. They look intentional on a big screen and
ship as real .jpg files so the app works offline at the venue.

Output: public/backgrounds/rig-01.jpg ... rig-10.jpg  (1920x1080)
Drop your own photos into public/backgrounds/ and list them in
src/data/backgrounds.ts to use real imagery instead.

Usage:  python scripts/generate-rig-backgrounds.py
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageOps

W, H = 1920, 1080
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "backgrounds"
FLARE = (255, 150, 60)

# (sky_top, horizon_glow, water_base, name)
PALETTES = [
    ((9, 18, 36), (232, 119, 46), (6, 12, 22), "amber-dusk"),
    ((4, 18, 24), (18, 120, 126), (3, 12, 16), "midnight-teal"),
    ((16, 24, 40), (120, 150, 190), (10, 16, 26), "steel-dawn"),
    ((16, 8, 20), (181, 38, 59), (12, 6, 14), "crimson-nightfall"),
    ((14, 28, 46), (240, 168, 48), (8, 16, 26), "golden-hour"),
    ((22, 32, 40), (150, 178, 192), (16, 24, 30), "arctic-fog"),
    ((12, 9, 30), (120, 70, 170), (8, 6, 20), "violet-dusk"),
    ((8, 8, 12), (255, 110, 40), (6, 6, 8), "industrial-ember"),
    ((2, 14, 28), (34, 100, 168), (1, 9, 18), "deep-sea"),
    ((24, 18, 14), (212, 98, 42), (14, 10, 8), "sunset-rust"),
]

RIG_TYPES = ["offshore", "derrick_cluster", "jackup", "drillship", "single_derrick"]


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def vertical_gradient(stops):
    """stops: list of (pos0-1, rgb). Returns W x H RGB image."""
    col = Image.new("RGB", (1, H))
    px = col.load()
    for y in range(H):
        t = y / (H - 1)
        # find surrounding stops
        lo = stops[0]
        hi = stops[-1]
        for i in range(len(stops) - 1):
            if stops[i][0] <= t <= stops[i + 1][0]:
                lo, hi = stops[i], stops[i + 1]
                break
        span = (hi[0] - lo[0]) or 1
        local = (t - lo[0]) / span
        px[0, y] = lerp(lo[1], hi[1], local)
    return col.resize((W, H))


def radial_glow(diameter, color, intensity=1.0):
    """A soft circular glow as an RGBA image that decays fully to transparent at
    the edges (a small bright dot blurred heavily — no square bounding box)."""
    a = Image.new("L", (diameter, diameter), 0)
    ad = ImageDraw.Draw(a)
    r = diameter * 0.14
    c = diameter / 2
    ad.ellipse([c - r, c - r, c + r, c + r], fill=255)
    a = a.filter(ImageFilter.GaussianBlur(diameter * 0.17))
    a = a.point(lambda p: int(min(255, p * intensity)))
    glow = Image.new("RGBA", (diameter, diameter), color + (0,))
    glow.putalpha(a)
    return glow


def paste_glow(scene, glow, cx, cy):
    x = int(cx - glow.width / 2)
    y = int(cy - glow.height / 2)
    scene.alpha_composite(glow, (x, y))


def draw_derrick(d, cx, base_y, height, base_w, color, width=3, crown=True):
    """Tapered lattice drilling derrick, drawn onto RGBA draw `d`."""
    top_w = base_w * 0.32
    top_y = base_y - height
    segments = max(5, int(height / 70))

    def edges(t):  # t 0=base 1=top
        y = base_y - height * t
        w = base_w + (top_w - base_w) * t
        return (cx - w / 2, y), (cx + w / 2, y)

    # legs
    bl, br = edges(0)
    tl, tr = edges(1)
    d.line([bl, tl], fill=color, width=width)
    d.line([br, tr], fill=color, width=width)

    prev_l, prev_r = bl, br
    for s in range(1, segments + 1):
        t = s / segments
        l, r = edges(t)
        d.line([l, r], fill=color, width=max(1, width - 1))  # rung
        d.line([prev_l, r], fill=color, width=max(1, width - 1))  # X
        d.line([prev_r, l], fill=color, width=max(1, width - 1))
        prev_l, prev_r = l, r

    if crown:
        d.rectangle([cx - top_w / 2 - 4, top_y - 14, cx + top_w / 2 + 4, top_y],
                    fill=color)
        d.line([cx, top_y, cx, top_y - 26], fill=color, width=width)


def draw_platform_legs(d, cx, deck_y, water_y, span, n, color, width):
    for i in range(n):
        x = cx - span / 2 + span * (i / (n - 1)) if n > 1 else cx
        sway = (i - (n - 1) / 2) * 10
        d.line([(x, deck_y), (x + sway, water_y + 30)], fill=color, width=width)
    # cross bracing
    for i in range(n - 1):
        x0 = cx - span / 2 + span * (i / (n - 1))
        x1 = cx - span / 2 + span * ((i + 1) / (n - 1))
        d.line([(x0, deck_y + (water_y - deck_y) * 0.55),
                (x1, water_y + 10)], fill=color, width=max(1, width - 2))


def draw_crane(d, x, y, length, color, width):
    d.line([(x, y), (x + length, y - length * 0.5)], fill=color, width=width)
    d.line([(x, y), (x, y - 50)], fill=color, width=width)
    d.line([(x, y - 50), (x + length * 0.9, y - length * 0.5)], fill=color,
           width=max(1, width - 1))


def build_rig_layer(rng, rig_type, color, horizon_y, scale=1.0, x_center=None):
    """Returns an RGBA layer with one rig composition."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx = x_center if x_center is not None else rng.randint(int(W * 0.45), int(W * 0.8))
    water_y = horizon_y
    flare_pt = None

    if rig_type == "offshore" or rig_type == "jackup":
        deck_y = int(horizon_y - 150 * scale)
        deck_w = int(420 * scale)
        d.polygon([(cx - deck_w / 2, deck_y),
                   (cx + deck_w / 2, deck_y),
                   (cx + deck_w / 2, deck_y + int(34 * scale)),
                   (cx - deck_w / 2, deck_y + int(34 * scale))], fill=color)
        legs_bottom = int(H * 0.9) if rig_type == "jackup" else int(horizon_y + 70 * scale)
        draw_platform_legs(d, cx, deck_y + 30, legs_bottom, deck_w * 0.8,
                           4, color, max(3, int(8 * scale)))
        draw_derrick(d, cx - deck_w * 0.18, deck_y, int(300 * scale),
                     int(120 * scale), color, max(2, int(4 * scale)))
        draw_crane(d, cx + deck_w * 0.34, deck_y, int(150 * scale), color,
                   max(2, int(5 * scale)))
        # flare boom
        fx, fy = cx + deck_w * 0.5, deck_y + 10
        tipx, tipy = fx + 150 * scale, fy - 90 * scale
        d.line([(fx, fy), (tipx, tipy)], fill=color, width=max(2, int(5 * scale)))
        flare_pt = (tipx, tipy)

    elif rig_type == "drillship":
        deck_y = int(horizon_y - 40 * scale)
        hull_w = int(620 * scale)
        d.polygon([(cx - hull_w / 2, deck_y),
                   (cx + hull_w / 2, deck_y),
                   (cx + hull_w / 2 - 40, deck_y + int(60 * scale)),
                   (cx - hull_w / 2 + 40, deck_y + int(60 * scale))], fill=color)
        draw_derrick(d, cx, deck_y, int(330 * scale), int(130 * scale),
                     color, max(2, int(4 * scale)))
        draw_crane(d, cx + hull_w * 0.3, deck_y, int(130 * scale), color,
                   max(2, int(4 * scale)))

    elif rig_type == "derrick_cluster":
        for i in range(rng.randint(3, 4)):
            ox = cx + (i - 1) * int(260 * scale) + rng.randint(-30, 30)
            s = scale * rng.uniform(0.7, 1.05)
            draw_derrick(d, ox, int(horizon_y + 8), int(330 * s),
                         int(150 * s), color, max(2, int(4 * s)))
        flare_pt = (cx + int(360 * scale), int(horizon_y - 250 * scale))
        d.line([(cx + int(300 * scale), int(horizon_y)),
                flare_pt], fill=color, width=max(2, int(5 * scale)))

    else:  # single_derrick
        draw_derrick(d, cx, int(horizon_y + 10), int(420 * scale),
                     int(190 * scale), color, max(3, int(5 * scale)))

    return layer, flare_pt


def make_scene(index):
    rng = random.Random(index * 1337 + 7)
    sky_top, glow_col, water_base, name = PALETTES[index % len(PALETTES)]
    rig_type = RIG_TYPES[index % len(RIG_TYPES)]

    horizon_y = int(H * rng.uniform(0.62, 0.72))

    # --- sky ---
    horizon_col = lerp(sky_top, glow_col, 0.5)
    scene = vertical_gradient([
        (0.0, sky_top),
        (0.45, lerp(sky_top, glow_col, 0.18)),
        (horizon_y / H - 0.04, lerp(sky_top, glow_col, 0.5)),
        (horizon_y / H, glow_col),
        (horizon_y / H + 0.001, lerp(water_base, glow_col, 0.35)),
        (1.0, water_base),
    ]).convert("RGBA")

    # --- sun / light source + reflection ---
    sun_x = rng.randint(int(W * 0.3), int(W * 0.7))
    sun = radial_glow(int(W * 0.7), glow_col, 1.15)
    paste_glow(scene, sun, sun_x, horizon_y)
    core = radial_glow(int(W * 0.16), lerp(glow_col, (255, 255, 255), 0.5), 1.4)
    paste_glow(scene, core, sun_x, horizon_y - 6)
    # water reflection streak
    refl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rd = ImageDraw.Draw(refl)
    for i in range(70):
        yy = horizon_y + i * ((H - horizon_y) / 70)
        ww = (10 + i * 2) * rng.uniform(0.8, 1.2)
        a = max(0, int(70 - i * 1.0))
        rd.line([(sun_x - ww, yy), (sun_x + ww, yy)], fill=glow_col + (a,), width=3)
    scene.alpha_composite(refl)

    # --- far haze band ---
    haze = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    hd = ImageDraw.Draw(haze)
    hd.rectangle([0, horizon_y - 60, W, horizon_y + 10],
                 fill=lerp(glow_col, sky_top, 0.4) + (90,))
    scene.alpha_composite(haze.filter(ImageFilter.GaussianBlur(40)))

    # --- distant rigs (atmospheric, blurred, faint) ---
    far_col = lerp(horizon_col, sky_top, 0.2) + (255,)
    for fx in (int(W * rng.uniform(0.08, 0.22)), int(W * rng.uniform(0.78, 0.92))):
        far, _ = build_rig_layer(rng, rng.choice(RIG_TYPES),
                                 far_col[:3], horizon_y, scale=0.5, x_center=fx)
        far = far.filter(ImageFilter.GaussianBlur(2))
        far.putalpha(far.getchannel("A").point(lambda p: int(p * 0.45)))
        scene.alpha_composite(far)

    # --- hero rig (near-black silhouette) ---
    hero, flare_pt = build_rig_layer(rng, rig_type, (3, 5, 9), horizon_y, scale=1.0)
    scene.alpha_composite(hero)

    # --- gas flare glow ---
    if flare_pt:
        paste_glow(scene, radial_glow(220, FLARE, 1.5), *flare_pt)
        paste_glow(scene, radial_glow(70, (255, 220, 170), 1.6), *flare_pt)

    scene = scene.convert("RGB")

    # --- vignette ---
    vig = ImageOps.invert(Image.radial_gradient("L")).resize((W, H))
    vig = vig.point(lambda p: int(55 + p * 0.78))
    scene = ImageChops.multiply(scene, Image.merge("RGB", (vig, vig, vig)))

    # --- film grain ---
    grain = Image.effect_noise((W, H), 22).convert("RGB")
    scene = Image.blend(scene, grain, 0.045)

    # --- subtle top-down darken for text legibility on the left ---
    scrim = Image.new("L", (1, H))
    sp = scrim.load()
    for y in range(H):
        sp[0, y] = int(120 * (y / H) ** 1.6)
    scrim = scrim.resize((W, H))
    black = Image.new("RGB", (W, H), (0, 0, 0))
    scene = Image.composite(black, scene, scrim.point(lambda p: int(p * 0.5)))

    return scene, name


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for i in range(10):
        scene, name = make_scene(i)
        out = OUT_DIR / f"rig-{i + 1:02d}.jpg"
        scene.save(out, "JPEG", quality=86, optimize=True)
        print(f"  wrote {out.name}  ({name}, {RIG_TYPES[i % len(RIG_TYPES)]})")


if __name__ == "__main__":
    main()
