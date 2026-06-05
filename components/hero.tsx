"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { Float } from "@/components/anim"

// leader-line callouts pointing at parts of the controller (% of the stage)
const ANNOTATIONS = [
  {
    index: "01",
    label: "THE GRIP — shaped to feel natural in your hands within seconds.",
    align: "left" as const,
    path: [
      { x: 46, y: 27 },
      { x: 20, y: 27 },
      { x: 20, y: 15 },
    ],
  },
  {
    index: "02",
    label: "THE CUE — a glowing reward signal your brain is trained to chase.",
    align: "right" as const,
    path: [
      { x: 55, y: 29 },
      { x: 81, y: 29 },
      { x: 81, y: 17 },
    ],
  },
  {
    index: "03",
    label: "THE LOOP — every input nudges you toward just one more session.",
    align: "left" as const,
    path: [
      { x: 45, y: 45 },
      { x: 20, y: 45 },
      { x: 20, y: 61 },
    ],
  },
  {
    index: "04",
    label: "THE COST — the roots are what it quietly takes: hours, sleep, focus.",
    align: "right" as const,
    path: [
      { x: 53, y: 64 },
      { x: 81, y: 64 },
      { x: 81, y: 78 },
    ],
  },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // --- intro timeline ---
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
      tl.from("[data-hero-line]", { yPercent: 120, duration: 1.15, stagger: 0.12 })
        .from("[data-hero-img]", { autoAlpha: 0, duration: 1.5, ease: "power2.out" }, 0.15)
        .from(
          "[data-hero-float]",
          {
            autoAlpha: 0,
            y: 40,
            scale: 0.82,
            rotate: (i) => (i % 2 ? 5 : -5),
            filter: "blur(10px)",
            duration: 1,
            stagger: 0.16,
            ease: "power3.out",
          },
          0.7,
        )
        .from("[data-hero-meta]", { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.1 }, 0.6)

      // each window drifts on its own idle loop (independent phase)
      gsap.utils.toArray<HTMLElement>("[data-hero-float]").forEach((win, i) => {
        gsap.to(win, {
          y: i % 2 ? 14 : -14,
          rotate: i % 2 ? -1.5 : 1.5,
          duration: 4 + i,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.4 * i,
        })
        gsap.to(win.querySelector("[data-blink]"), {
          opacity: 0.25,
          duration: 0.9,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        })
      })

      // prep annotation lines (dash hidden, labels + dots hidden)
      gsap.utils.toArray<SVGPathElement>("[data-anno-line]").forEach((line) => {
        const len = line.getTotalLength()
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
      })
      gsap.set("[data-anno-box]", { autoAlpha: 0, y: 8 })
      gsap.set("[data-anno-dot]", { scale: 0, transformOrigin: "center" })
      gsap.set("[data-anno-aux]", { autoAlpha: 0, y: 10 })

      // --- scroll: keep controller fully visible, fade the headline, draw annotations ---
      const mm = gsap.matchMedia()
      mm.add("(min-width: 768px)", () => {
        const st = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=300%",
            scrub: 1,
            pin: "[data-hero-stage]",
            pinSpacing: true,
          },
        })

        // phase 1 — clear the stage, ease controller to center (NO crop)
        // NOTE: the windows + meta are introduced with gsap.from(autoAlpha:0),
        // so their live opacity is 0 when this timeline is built. Using fromTo
        // with explicit start values + immediateRender:false stops ScrollTrigger
        // from recording that transient 0 as the start and locking them hidden.
        st.to("[data-hero-headline]", { yPercent: -22, autoAlpha: 0, ease: "none" }, 0)
          .fromTo(
            "[data-hero-meta]",
            { autoAlpha: 1, y: 0 },
            { autoAlpha: 0, y: -24, ease: "none", immediateRender: false },
            0,
          )
          .fromTo(
            "[data-hero-float='a']",
            { autoAlpha: 1, yPercent: 0 },
            { autoAlpha: 0, yPercent: -120, ease: "none", immediateRender: false, overwrite: "auto" },
            0,
          )
          .fromTo(
            "[data-hero-float='b']",
            { autoAlpha: 1, yPercent: 0 },
            { autoAlpha: 0, yPercent: -150, ease: "none", immediateRender: false, overwrite: "auto" },
            0,
          )
          .fromTo(
            "[data-hero-float='c']",
            { autoAlpha: 1, yPercent: 0 },
            { autoAlpha: 0, yPercent: -130, ease: "none", immediateRender: false, overwrite: "auto" },
            0,
          )
          .to("[data-hero-img]", { scale: 1.04, yPercent: -2, ease: "none" }, 0)
          .to("[data-hero-diagram-label]", { autoAlpha: 1, ease: "none" }, 0.2)

        // reveal the diagram scaffolding (fills the dead space on the edges)
        st.to("[data-anno-aux]", { autoAlpha: 1, y: 0, ease: "power2.out", stagger: 0.12 }, 0.3)

        // phase 2 — reveal each annotation ONE BY ONE as the user keeps scrolling.
        // Each leader line draws, its dot pops, then its label fades in, before
        // the next index begins — so the diagram builds up sequentially.
        const lines = gsap.utils.toArray<SVGPathElement>("[data-anno-line]")
        const dots = gsap.utils.toArray<SVGCircleElement>("[data-anno-dot]")
        const boxes = gsap.utils.toArray<HTMLElement>("[data-anno-box]")
        const begin = 0.6
        const step = 0.6
        lines.forEach((line, i) => {
          const at = begin + i * step
          st.to(line, { strokeDashoffset: 0, ease: "none", duration: 0.32 }, at)
            .to(dots[i], { scale: 1, ease: "back.out(2)", duration: 0.22 }, at + 0.04)
            .to(boxes[i], { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.3 }, at + 0.12)
        })
      })

      // pulse the connection dots continuously
      gsap.to("[data-anno-dot]", {
        scale: 1.7,
        opacity: 0.5,
        transformOrigin: "center",
        duration: 1.1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1,
      })

      // --- pointer parallax: controller tilts for depth ---
      const stage = root.current?.querySelector<HTMLElement>("[data-hero-stage]")
      const img = root.current?.querySelector<HTMLElement>("[data-hero-img-inner]")
      const wins = gsap.utils.toArray<HTMLElement>("[data-hero-float]")
      const onMove = (e: PointerEvent) => {
        if (!stage) return
        const r = stage.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height
        if (img) gsap.to(img, { rotateY: dx * 12, rotateX: -dy * 9, duration: 0.6, ease: "power2.out" })
        wins.forEach((win, i) => {
          const depth = (i + 1) * 16
          gsap.to(win, { x: -dx * depth, y: -dy * depth, duration: 0.8, ease: "power2.out", overwrite: "auto" })
        })
      }
      stage?.addEventListener("pointermove", onMove)
      return () => stage?.removeEventListener("pointermove", onMove)
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" className="relative bg-crosshair">
      <div
        data-hero-stage
        className="relative flex min-h-svh flex-col justify-between overflow-hidden px-5 pb-16 pt-24 md:px-6"
      >
        {/* diagram label that appears during the annotation phase */}
        <div
          data-hero-diagram-label
          className="hud pointer-events-none absolute left-5 top-20 z-30 text-muted-foreground opacity-0 md:left-6"
        >
          FIG. 00 — ANATOMY OF THE HOOK
        </div>

        {/* Headline — full-width, sits BEHIND the render so the controller cleanly occludes the middle letters */}
        <div data-hero-headline className="relative z-0">
          <h1 className="display-hero text-foreground">
            {["GAMING", "ADDICTION,"].map((word) => (
              <span key={word} className="block overflow-hidden">
                <span data-hero-line className="block text-[17vw] leading-[0.82] md:text-[13.5vw] lg:text-[12.5vw]">
                  {word}
                </span>
              </span>
            ))}
            <span className="block overflow-hidden">
              <span data-hero-line className="block text-[17vw] leading-[0.82] md:text-[13.5vw] lg:text-[12.5vw]">
                BY <span className="text-signal">DESIGN.</span>
              </span>
            </span>
          </h1>
        </div>

        {/* Floating controller render — centered, occludes the middle of the headline.
            The centering wrapper is NOT animated so GSAP transforms on the inner
            element never clobber the -translate centering. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[86vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 md:w-[52vw]">
          <div data-hero-img style={{ perspective: "1200px" }}>
            <Float amplitude={16} duration={6}>
              <div data-hero-img-inner style={{ transformStyle: "preserve-3d" }}>
                <Image
                  src="/collage/hero-hand-clean.png"
                  alt="A hand gripping a game controller whose cables turn into tangled roots, fusing flesh and technology"
                  width={1024}
                  height={1024}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </Float>
          </div>
        </div>

        {/* Annotation overlay — leader lines that draw on scroll (desktop) */}
        <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {ANNOTATIONS.map((a) => (
              <path
                key={a.index}
                data-anno-line
                d={a.path.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
                className="text-foreground/45"
              />
            ))}
          </svg>

          {ANNOTATIONS.map((a) => {
            const start = a.path[0]
            const end = a.path[a.path.length - 1]
            return (
              <div key={a.index}>
                <svg
                  className="absolute overflow-visible"
                  style={{ left: `${start.x}%`, top: `${start.y}%`, width: 1, height: 1 }}
                  aria-hidden
                >
                  <rect x={-5} y={-5} width={10} height={10} fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
                  <circle data-anno-dot cx={0} cy={0} r={2.6} fill="currentColor" className="text-signal" />
                </svg>
                <div
                  data-anno-box
                  className={`absolute max-w-[230px] ${a.align === "right" ? "-translate-x-full text-right" : ""}`}
                  style={{
                    left: `${end.x}%`,
                    top: `${end.y}%`,
                    transform: `translateY(-50%) ${a.align === "right" ? "translateX(-10px)" : "translateX(10px)"}`,
                  }}
                >
                  <span className="hud text-signal">{a.index}</span>
                  <p className="hud mt-1 leading-relaxed text-foreground">{a.label}</p>
                </div>
              </div>
            )
          })}

          {/* Diagram scaffolding — fills the dead space on the edges and
              reinforces the "specimen diagram" framing. Revealed on scroll. */}
          <div
            data-anno-aux
            className="hud absolute left-6 top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-muted-foreground"
            style={{ transformOrigin: "left center" }}
          >
            SPECIMEN 001 — REWARD ARCHITECTURE
          </div>

          <div data-anno-aux className="absolute bottom-14 left-6 w-52 border-l border-foreground/20 pl-3">
            <div className="hud mb-2 flex items-center gap-1.5 text-foreground">
              <span className="size-1.5 rounded-full bg-signal" />
              DIAGNOSTIC
            </div>
            {[
              ["DOPAMINE", "ELEVATED"],
              ["SESSION AVG", "3.2 HRS"],
              ["EXIT FRICTION", "HIGH"],
            ].map(([k, v]) => (
              <div key={k} className="hud flex items-center justify-between border-t border-foreground/10 py-1 text-muted-foreground">
                <span>{k}</span>
                <span className="text-foreground">{v}</span>
              </div>
            ))}
          </div>

          <div data-anno-aux className="absolute right-6 top-12 text-right">
            <div className="hud text-muted-foreground">SCAN STATUS</div>
            <div className="hud mt-1 text-signal">● ACTIVE</div>
            <div className="hud mt-0.5 text-muted-foreground">4 / 4 NODES MAPPED</div>
          </div>
        </div>

        {/* Floating mac-style window cards */}
        <FloatWindow
          dataKey="a"
          className="left-[4%] top-[28%] hidden w-56 md:block"
          title="REWARD_LOOP.exe"
          body="Variable rewards fire dopamine on an unpredictable schedule — the same mechanic as a slot machine."
        />
        <FloatWindow
          dataKey="b"
          className="right-[4%] top-[52%] hidden w-56 md:block"
          title="SESSION_LOG"
          body={`"Just one more match." Three hours later, the controller is still in your hands.`}
        />
        <FloatWindow
          dataKey="c"
          className="right-[4%] top-[13%] hidden w-56 md:block"
          title="ENGAGEMENT_METRICS"
          stat="8.5"
          statUnit="HRS / WEEK"
          meter={71}
          caption="Average gaming time per player worldwide — and climbing every year."
        />

        {/* Bottom meta row */}
        <div className="relative z-20 mt-auto flex flex-col items-start justify-between gap-8 pt-10 md:flex-row md:items-end">
          <div data-hero-meta className="max-w-xs">
            <div className="hud mb-3 text-muted-foreground">[ WHAT THIS IS ]</div>
            <ol>
              {[
                "01 / HOW GAMES HOOK US",
                "02 / THE WARNING SIGNS",
                "03 / THE REAL COST",
                "04 / THE WAY BACK",
              ].map((t) => (
                <li key={t} className="hud mt-2 border-t border-foreground/15 pt-2 text-foreground">
                  {t}
                </li>
              ))}
            </ol>
          </div>

          <div data-hero-meta className="w-full max-w-xs rounded-md border border-foreground/20 bg-card/80 p-4 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="hud text-foreground">A NOTE BEFORE YOU SCROLL</span>
              <span className="hud text-muted-foreground">/01</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Loving games is not a disorder. This is about the moment play stops being a choice — and what it takes to take that choice back.
            </p>
          </div>
        </div>

        {/* scroll cue */}
        <div data-hero-meta className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
          <span className="hud text-muted-foreground">SCROLL ↓</span>
        </div>
      </div>

    </section>
  )
}


function FloatWindow({
  dataKey,
  title,
  body,
  stat,
  statUnit,
  caption,
  meter,
  className,
}: {
  dataKey: string
  title: string
  body?: string
  stat?: string
  statUnit?: string
  caption?: string
  meter?: number
  className?: string
}) {
  return (
    <div data-hero-float={dataKey} className={`absolute z-30 will-change-transform ${className ?? ""}`}>
      <div className="overflow-hidden rounded-md border border-foreground/25 bg-popover shadow-xl ring-1 ring-foreground/5">
        <div className="flex items-center justify-between border-b border-foreground/15 bg-secondary px-2 py-1">
          <span className="flex items-center gap-1.5">
            <span data-blink className="size-1.5 rounded-full bg-signal" />
            <span className="hud text-foreground">{title}</span>
          </span>
          <span className="flex size-3 items-center justify-center border border-foreground/40 text-[8px] leading-none text-foreground/60">
            ×
          </span>
        </div>

        {body ? <p className="px-3 py-2 text-xs leading-relaxed text-muted-foreground">{body}</p> : null}

        {stat ? (
          <div className="px-3 py-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="display text-3xl leading-none text-foreground">{stat}</span>
              {statUnit ? <span className="hud text-muted-foreground">{statUnit}</span> : null}
            </div>
            {typeof meter === "number" ? (
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
                <div className="h-full rounded-full bg-signal" style={{ width: `${Math.max(0, Math.min(100, meter))}%` }} />
              </div>
            ) : null}
            {caption ? <p className="hud mt-2 leading-relaxed text-muted-foreground">{caption}</p> : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
