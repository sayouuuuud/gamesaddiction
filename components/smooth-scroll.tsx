"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { setScrollVelocity } from "@/lib/scroll-velocity"

/**
 * Lenis smooth scroll, driven by GSAP's ticker so that ScrollTrigger
 * stays perfectly in sync with the smoothed scroll position.
 * This is what gives the site its "heavy", high-end inertia feel.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    // NOTE: when `lerp` is set, Lenis uses it and IGNORES `duration`/`easing`.
    // `lerp` is the real "weight" control here: lower = heavier / more drag.
    const lenis = new Lenis({
      lerp: 0.04,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1,
    })

    lenis.on("scroll", ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // single source of truth for scroll velocity (px/sec), shared with
    // the skew-on-scroll + reactive marquee components.
    const velTrigger = ScrollTrigger.create({
      onUpdate: (self) => setScrollVelocity(self.getVelocity()),
    })

    return () => {
      gsap.ticker.remove(tick)
      velTrigger.kill()
      setScrollVelocity(0)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
