/**
 * Tiny shared store for the smoothed scroll velocity (px/sec).
 * Populated once by SmoothScroll and read by velocity-reactive
 * components (skew on scroll, the reactive marquee, etc.) so we
 * only ever track velocity from a single source of truth.
 */
let velocity = 0

export function setScrollVelocity(v: number) {
  velocity = v
}

export function getScrollVelocity() {
  return velocity
}
