/* A tiny store holding the app's single Lenis instance.

   App.tsx creates it; anything that needs to drive smooth scrolling reads it
   from here rather than creating a second one. */

import type Lenis from "lenis";

let current: Lenis | null = null;
const listeners = new Set<(lenis: Lenis | null) => void>();

export function setLenis(lenis: Lenis | null) {
  current = lenis;
  listeners.forEach((fn) => fn(lenis));
}

export function getLenis() {
  return current;
}

export function subscribeLenis(fn: (lenis: Lenis | null) => void) {
  listeners.add(fn);
  fn(current);
  return () => {
    listeners.delete(fn);
  };
}
