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
      // NOTE: this is a scroll-DRIVEN effect (it only moves when the user
      // scrolls, nothing auto-animates), so we intentionally run it even when
      // the OS "reduce motion" setting is on. Mobile still falls back to a
      // normal vertical stack via the (min-width: 768px) gate below.
      mm.add("(min-width: 768px)", () => {
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
      className="relative w-full bg-[oklch(0.035_0.012_280)] md:h-svh md:overflow-hidden"
    >
      <div
        ref={trackRef}
        className="flex w-full flex-col md:h-svh md:w-max md:flex-row md:flex-nowrap"
      >
        {/* BRIDGE — desktop only. A dark beat that continues straight out of the
            full-bleed footage, so the sideways journey *starts from the video*.
            As you scroll it slides away to the left and THE REAL COST arrives
            from the right. Hidden on mobile, where the sections just stack. */}
        <div
          data-panel
          className="fx-grain relative hidden md:flex md:h-svh md:w-screen md:shrink-0 md:flex-col md:items-center md:justify-center md:overflow-hidden md:bg-[oklch(0.035_0.012_280)] md:text-[oklch(0.93_0.004_280)]"
        >
          <div className="fx-vignette pointer-events-none absolute inset-0" />
          <span className="hud text-[oklch(0.93_0.004_280)]/60">/02·5 — END OF FOOTAGE</span>
          <h2 className="display mt-5 max-w-3xl text-balance px-6 text-center text-5xl leading-[0.95] lg:text-7xl">
            You&apos;ve felt the pull.
            <br />
            Now count the <span className="text-signal">cost.</span>
          </h2>
          <span className="hud mt-8 flex items-center gap-3 text-[oklch(0.93_0.004_280)]/70">
            SCROLL
            <span className="inline-block h-px w-12 bg-signal" aria-hidden="true" />
            <span className="text-signal" aria-hidden="true">
              →
            </span>
          </span>
        </div>

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
