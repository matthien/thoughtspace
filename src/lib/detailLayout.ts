export const CARD_W = 140;
export const CARD_H = 210;
export const POSTER_W = 320;
export const POSTER_H = 480;
export const ROW_GAP = 64;
export const TEXT_W = 360;
export const COLUMN_GAP = 8;
export const NAV_ROW_H = 26;

export const ZOOM_SCALE = POSTER_W / CARD_W; // 320/140, same as POSTER_H/CARD_H

// Fixed screen-space layout for the detail content, matching the Figma
// "details" frame: a centered block of [poster | gap | text], with a
// nav row underneath. The poster's on-screen rect doubles as the zoom
// target for the camera animation, so canvas and detail line up exactly.
export function getDetailLayout(viewportW: number, viewportH: number) {
  const contentW = POSTER_W + ROW_GAP + TEXT_W;
  const contentH = POSTER_H + COLUMN_GAP + NAV_ROW_H;
  const left = viewportW / 2 - contentW / 2;
  const top = viewportH / 2 - contentH / 2;

  return {
    posterLeft: left,
    posterTop: top,
    textLeft: left + POSTER_W + ROW_GAP,
    textTop: top,
    textWidth: TEXT_W,
    navTop: top + POSTER_H + COLUMN_GAP,
    navRight: viewportW - (left + contentW),
  };
}

// Camera transform (translate + scale) applied to the pannable world so
// that the given card's canvas position/size lands exactly on the
// detail poster rect.
export function computeZoomTransform(
  cardX: number,
  cardY: number,
  viewportW: number,
  viewportH: number
) {
  const { posterLeft, posterTop } = getDetailLayout(viewportW, viewportH);
  return {
    x: posterLeft - cardX * ZOOM_SCALE,
    y: posterTop - cardY * ZOOM_SCALE,
    scale: ZOOM_SCALE,
  };
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Deceleration-only half of the same curve family — right for motion
// that's already underway when it starts (e.g. a flick release).
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Drives a single rAF loop from 0 to 1 (eased), calling onFrame each tick
// and onDone once it completes. Returns a cancel function.
export function animateValue(
  duration: number,
  onFrame: (eased: number) => void,
  onDone: () => void,
  easing: (t: number) => number = easeInOutCubic
): () => void {
  const start = performance.now();
  let raf = 0;
  let cancelled = false;

  function tick(now: number) {
    if (cancelled) return;
    const raw = Math.min((now - start) / duration, 1);
    onFrame(easing(raw));
    if (raw < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      onDone();
    }
  }

  raf = requestAnimationFrame(tick);
  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
  };
}

const MAX_ROTATION_DEG = 4;

// Deterministic per-card "randomness" derived from the entry id, so the
// tilt is stable across server/client renders instead of using Math.random().
export function rotationFor(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const unit = (hash % 1000) / 1000; // -1..1
  return unit * MAX_ROTATION_DEG;
}
