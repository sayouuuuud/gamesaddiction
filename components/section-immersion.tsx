"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

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

      if (prefersReducedMotion()) {
        // Reduced motion: skip the cinematic clip/scale animation, but STILL
        // step through every annotation as the user scrolls — just with instant
        // swaps instead of tweens, so all four points remain reachable.
        gsap.set(wrap, { clipPath: "inset(0% round 0px)" })
        gsap.set(sceneEls, { autoAlpha: 0, y: 0 })
        gsap.set(sceneEls[0], { autoAlpha: 1 })

        let activeIdx = 0
        const apply = (idx: number) => {
          if (idx === activeIdx) return
          gsap.set(sceneEls, { autoAlpha: 0 })
          gsap.set(sceneEls[idx], { autoAlpha: 1 })
          if (stateRef.current) stateRef.current.textContent = states[idx]
          activeIdx = idx
        }

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const idx = Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length))
            apply(idx)
            if (meterRef.current) meterRef.current.style.transform = `scaleX(${0.04 + self.progress * 0.96})`
          },
        })
        return
      }

      // start: a small, dim, desaturated frame floating in the dark
      gsap.set(wrap, { clipPath: "inset(15% 22% 15% 22% round 16px)" })
      gsap.set(video, {
        scale: 1.22,
        filter: "brightness(0.42) saturate(0.5) contrast(1.06)",
      })
      gsap.set(sceneEls, { autoAlpha: 0, y: 24 })

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      })

      // the footage opens up and engulfs the viewport — the "sinking in".
      // kept short (2 units) so the first annotation lands almost immediately
      tl.to(wrap, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 2 }, 0)
        .to(
          video,
          {
            scale: 1.04,
            filter: "brightness(1) saturate(1.18) contrast(1.08)",
            duration: 2,
          },
          0,
        )

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
      const startAt = 2 // right after the clip finishes opening
      const seg = 5 // scroll "distance" each note owns
      const fadeOut = 0.8
      sceneEls.forEach((el, i) => {
        const at = startAt + i * seg
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
          at,
        )
        // every note except the last clears just before the next arrives
        if (i < sceneEls.length - 1) {
          tl.to(el, { autoAlpha: 0, y: -24, duration: fadeOut, ease: "power2.in" }, at + seg - fadeOut)
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
      className="relative h-[520vh] bg-[oklch(0.035_0.012_280)] text-[oklch(0.93_0.004_280)]"
      aria-label="Inside the loop — immersive footage"
    >
      <div ref={stageRef} className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        {/* the footage — opens from a framed clip to full-bleed */}
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
        <div className="pointer-events-none absolute inset-x-0 bottom-[16%] flex justify-center px-6 md:bottom-[20%]">
          <div className="relative h-[7em] w-full max-w-2xl md:h-[6em]">
            {scenes.map((s, i) => (
              <div
                key={i}
                data-scene
                className="absolute inset-0 flex items-start gap-4"
              >
                {/* index marker, drawn like the brain-figure callouts */}
                <span className="hud flex shrink-0 items-center gap-2 text-signal">
                  <span className="h-2 w-2 rounded-full bg-signal" />
                  {s.k}
                </span>
                <span className="flex-1 border-l border-signal/40 pl-4">
                  <span className="display block text-xl leading-tight md:text-2xl">{s.title}</span>
                  <span className="mt-1 block text-pretty text-sm leading-relaxed text-[oklch(0.93_0.004_280)]/75 md:text-base">
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
