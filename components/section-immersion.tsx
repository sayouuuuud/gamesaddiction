"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Each scene of the footage gets its own annotation — like the callouts on the
 * brain figure. As the frame changes, the previous note clears and the next
 * one is drawn in its place.
 */
const scenes = [
  {
    k: "A1",
    title: "Dopamine spike",
    line: (
      <>
        Every win fires a dopamine hit — the brain is trained to chase the next one.
      </>
    ),
  },
  {
    k: "A2",
    title: "Time collapses",
    line: (
      <>
        Focus narrows to the screen and <span className="text-signal">minutes feel like seconds</span>.
      </>
    ),
  },
  {
    k: "A3",
    title: "Signals muted",
    line: <>Hunger, fatigue and messages are suppressed and pushed into the background.</>,
  },
  {
    k: "A4",
    title: "Room dissolves",
    line: <>You disengage from real life — it stays paused while the loop keeps running.</>,
  },
]

/** Subject state changes as the loop tightens its grip. */
const states = ["PRESENT", "ABSORBED", "DISSOCIATED", "DEPLETED"]

export function SectionImmersion() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // live HUD readouts, written directly to the DOM for 60fps without re-renders
  const tcRef = useRef<HTMLSpanElement>(null)
  const stateRef = useRef<HTMLSpanElement>(null)
  const meterRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const wrap = wrapRef.current
      const video = videoRef.current
      const sceneEls = gsap.utils.toArray<HTMLElement>("[data-scene]")
      if (!section || !wrap || !video) return

      // EVERYONE gets the framed-clip → full-bleed "step inside" reveal. When
      // the user prefers reduced motion we only soften the heavy parallax zoom
      // on the footage itself (the part most likely to cause discomfort) — the
      // small-window intro, the flanking copy and the A1→A4 annotations all
      // still play, so the experience the user asked for is never skipped.
      const rm = prefersReducedMotion()
      const startScale = rm ? 1.12 : 1.32
      const endScale = rm ? 1 : 1.04

      // START: a small framed clip floating in the dark, dead-center, with the
      // explainer copy flanking it left + right. Only the middle of the footage
      // shows through the tight clip window, so it reads as a small screen.
      gsap.set(wrap, { clipPath: "inset(24% 34% 24% 34% round 14px)" })
      gsap.set(video, {
        scale: startScale,
        filter: "brightness(0.46) saturate(0.5) contrast(1.06)",
      })
      gsap.set("[data-intro]", { autoAlpha: 1 })
      gsap.set("[data-side='left']", { xPercent: 0 })
      gsap.set("[data-side='right']", { xPercent: 0 })
      gsap.set(sceneEls, { autoAlpha: 0, y: 28 })

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      })

      // HOLD: once the section is pinned, the small framed clip + the flanking
      // copy stay perfectly still for a good stretch of scroll. This guarantees
      // the viewer actually registers the "small video in the middle, text on
      // each side" state before anything starts moving.
      const hold = 4
      tl.to({}, { duration: hold })

      // the footage opens up and engulfs the viewport — the "sinking in".
      // the flanking copy slides away + fades as you cross the threshold into
      // the frame. starts only AFTER the hold, so the grow is a deliberate act.
      const openAt = hold
      const openDur = 11
      // smooth, eased reveal so the frame glides open and *settles* into
      // full-bleed instead of snapping. power3.inOut = gentle start, steady
      // middle, soft landing — the cinematic "step inside / sink in" feel.
      tl.to(
        wrap,
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: openDur, ease: "power3.inOut" },
        openAt,
      )
        .to(
          video,
          {
            scale: endScale,
            filter: "brightness(1) saturate(1.18) contrast(1.08)",
            duration: openDur,
            ease: "power3.inOut",
          },
          openAt,
        )
        // copy clears early and softly as the frame begins to open
        .to("[data-side='left']", { autoAlpha: 0, xPercent: -45, duration: openDur * 0.4, ease: "power2.inOut" }, openAt)
        .to("[data-side='right']", { autoAlpha: 0, xPercent: 45, duration: openDur * 0.4, ease: "power2.inOut" }, openAt)
        .to("[data-intro-hint]", { autoAlpha: 0, duration: openDur * 0.25, ease: "power2.in" }, openAt)

      const fmt = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = Math.floor(s % 60)
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      }
      const setState = (i: number) => {
        if (stateRef.current && stateRef.current.textContent !== states[i]) {
          stateRef.current.textContent = states[i]
        }
      }

      // Annotations are baked directly INTO the scrubbed timeline so they stay
      // perfectly in sync with Lenis smooth scroll. The four notes are spread
      // evenly across the whole scroll, each getting a generous dwell so a
      // normal-speed scroll still lands on every one. Each note draws in, holds,
      // then clears as the next takes its place.
      const startAt = openAt + openDur // right after the clip finishes opening
      const seg = 5 // scroll "distance" each note owns
      const fadeOut = 0.8
      sceneEls.forEach((el, i) => {
        const at = startAt + i * seg
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
          at,
        )
        // every note except the last clears just before the next arrives
        if (i < sceneEls.length - 1) {
          tl.to(el, { autoAlpha: 0, y: -28, duration: fadeOut, ease: "power2.in" }, at + seg - fadeOut)
        }
        // sync the SUBJECT STATE label with the active note (forwards + reverse)
        tl.call(() => setState(i), [], at)
      })
      // hold the final note on screen through the tail of the section
      tl.to({}, { duration: seg }, startAt + sceneEls.length * seg)

      const st = tl.scrollTrigger

      // ticker only drives the live readouts (meter + footage timecode)
      const tick = () => {
        const p = st ? st.progress : 0
        if (meterRef.current) meterRef.current.style.transform = `scaleX(${0.04 + p * 0.96})`
        if (tcRef.current && video.readyState >= 1) {
          tcRef.current.textContent = fmt(video.currentTime)
        }
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="immersion"
      className="relative h-[820vh] bg-[oklch(0.035_0.012_280)] text-[oklch(0.93_0.004_280)]"
      aria-label="Inside the loop — immersive footage"
    >
      <div ref={stageRef} className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* the footage — opens from a small framed clip to full-bleed */}
        <div ref={wrapRef} className="fx-grain absolute inset-0 h-full w-full overflow-hidden">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/video/addiction.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          {/* cinematic depth overlays */}
          <div className="fx-vignette pointer-events-none absolute inset-0" />
          <div className="fx-scanlines pointer-events-none absolute inset-0 opacity-30" />
        </div>

        {/* INTRO copy flanking the small frame — fades + slides off as you enter */}
        <div
          data-intro
          data-side="left"
          className="pointer-events-none absolute left-0 top-1/2 hidden w-[30%] max-w-xs -translate-y-1/2 px-6 text-left md:block lg:px-10"
        >
          <span className="hud text-signal">/02·5 — FIELD FOOTAGE</span>
          <h3 className="display mt-3 text-balance text-2xl leading-[0.95] text-[oklch(0.93_0.004_280)] lg:text-3xl">
            Press play on a real session.
          </h3>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-[oklch(0.93_0.004_280)]/65">
            What you&apos;re watching isn&apos;t staged — it&apos;s the same loop running in
            millions of dark rooms right now, lit only by a screen.
          </p>
        </div>

        <div
          data-intro
          data-side="right"
          className="pointer-events-none absolute right-0 top-1/2 hidden w-[30%] max-w-xs -translate-y-1/2 px-6 text-right md:block lg:px-10"
        >
          <span className="hud text-[oklch(0.93_0.004_280)]/60">SUBJECT // ENGAGED</span>
          <h3 className="display mt-3 text-balance text-2xl leading-[0.95] text-[oklch(0.93_0.004_280)] lg:text-3xl">
            Scroll to step inside.
          </h3>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-[oklch(0.93_0.004_280)]/65">
            Keep scrolling and the frame opens up around you. You stop watching from
            the outside — and drop into the loop itself.
          </p>
        </div>

        {/* scroll hint, centered under the small frame on every screen size */}
        <div
          data-intro
          data-intro-hint
          className="pointer-events-none absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-2 md:bottom-[16%]"
        >
          <span className="hud text-[oklch(0.93_0.004_280)]/70">SCROLL TO ENTER</span>
          <span className="block h-8 w-px animate-pulse bg-signal" aria-hidden="true" />
        </div>

        {/* top HUD bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-6">
          <div className="hud flex items-center gap-3 text-[oklch(0.93_0.004_280)]/70">
            <span className="text-signal">/02·5</span>
            <span>FIELD FOOTAGE — INSIDE THE LOOP</span>
          </div>
          <div className="hud flex items-center gap-2 text-[oklch(0.93_0.004_280)]/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
            <span>REC</span>
            <span ref={tcRef} className="tabular-nums text-signal">
              00:00
            </span>
          </div>
        </div>

        {/* per-frame annotation — one note at a time, swapped as the scene changes */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[12%] flex justify-center px-6 md:bottom-[16%]">
          <div className="relative h-[12em] w-full max-w-3xl md:h-[10em]">
            {scenes.map((s, i) => (
              <div
                key={i}
                data-scene
                className="absolute inset-0 flex items-start gap-4 md:gap-6"
              >
                {/* index marker, drawn like the brain-figure callouts */}
                <span className="hud flex shrink-0 items-center gap-2 text-base text-signal md:text-lg">
                  <span className="h-2.5 w-2.5 rounded-full bg-signal" />
                  {s.k}
                </span>
                <span className="flex-1 border-l-2 border-signal/40 pl-5 md:pl-6">
                  <span className="display block text-3xl leading-[0.95] text-balance md:text-5xl lg:text-6xl">
                    {s.title}
                  </span>
                  <span className="mt-3 block text-pretty text-base leading-relaxed text-[oklch(0.93_0.004_280)]/80 md:text-xl">
                    {s.line}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom HUD: subject state + pull meter */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-6">
          <div className="hud mb-2 flex items-center justify-between text-[oklch(0.93_0.004_280)]/60">
            <span className="flex items-center gap-2">
              SUBJECT STATE
              <span ref={stateRef} className="text-signal">
                PRESENT
              </span>
            </span>
            <span>DEPTH OF PULL</span>
          </div>
          <div className="h-px w-full overflow-hidden bg-[oklch(0.93_0.004_280)]/15">
            <span
              ref={meterRef}
              className="block h-full w-full origin-left scale-x-[0.04] bg-signal"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
