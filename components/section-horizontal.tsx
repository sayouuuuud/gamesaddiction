"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { SectionToll } from "@/components/section-toll"
import { SectionRecovery } from "@/components/section-recovery"

/**
 * After the immersive footage opens up and engulfs the viewer, the journey
 * turns sideways: THE REAL COST and THE WAY BACK become full-screen panels
 * that slide in from the right as you keep scrolling. The vertical scroll
 * wheel is mapped onto a pinned horizontal track, so the page literally moves
 * across instead of down.
 *
 * On phones (and for reduced-motion users) the whole trick is dropped — the
 * two sections simply stack and scroll vertically like normal.
 */
export function SectionHorizontal() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const mm = gsap.matchMedia()

      // Desktop / tablet only: pin the section and translate the track left by
      // exactly the overflow width, so the second panel arrives from the right.
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + (track.scrollWidth - window.innerWidth),
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        return () => {
          tween.scrollTrigger?.kill()
          tween.kill()
          gsap.set(track, { clearProps: "transform" })
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      aria-label="The real cost and the way back"
      className="relative w-full md:h-svh md:overflow-hidden"
    >
      <div
        ref={trackRef}
        className="flex w-full flex-col md:h-svh md:w-max md:flex-row md:flex-nowrap"
      >
        <div
          data-panel
          className="w-full md:h-svh md:w-screen md:shrink-0 md:overflow-hidden"
        >
          <SectionToll panel />
        </div>
        <div
          data-panel
          className="w-full md:h-svh md:w-screen md:shrink-0 md:overflow-hidden"
        >
          <SectionRecovery panel />
        </div>
      </div>
    </section>
  )
}
