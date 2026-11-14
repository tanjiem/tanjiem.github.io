// Geometry shared by every mark, so the map, legend, index and
// constellations all draw the same star and the same diamond.

/** A four-point star of radius r, centred on 0,0. */
export function starPath(r: number) {
  const a = +(r * 0.16).toFixed(2);
  return `M0 ${-r} Q ${a} ${-a} ${r} 0 Q ${a} ${a} 0 ${r} Q ${-a} ${a} ${-r} 0 Q ${-a} ${-a} 0 ${-r}Z`;
}

/** A diamond whose points sit r from the centre. */
export function diamondPath(r: number) {
  return `M0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z`;
}

type Pt = { x: number; y: number };

/**
 * A gentle curve from a to b that starts and stops short of both marks,
 * so lines touch the lights without running through them.
 */
export function curveBetween(a: Pt, b: Pt, gapA: number, gapB: number, bend = 0.14) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const s = { x: a.x + ux * gapA, y: a.y + uy * gapA };
  const e = { x: b.x - ux * gapB, y: b.y - uy * gapB };
  const mx = (s.x + e.x) / 2 - uy * len * bend;
  const my = (s.y + e.y) / 2 + ux * len * bend;
  const f = (n: number) => +n.toFixed(1);
  return `M${f(s.x)} ${f(s.y)} Q ${f(mx)} ${f(my)} ${f(e.x)} ${f(e.y)}`;
}
