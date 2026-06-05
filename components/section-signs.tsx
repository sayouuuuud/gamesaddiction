"use client"

import { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { MediaReveal, Reveal, Scramble } from "@/components/anim"

const steps = [
  {
    heading: (
      <>
        When does
        <br />a hobby become
        <br />a <span className="text-signal">hold?</span>
      </>
    ),
    body: "No single sign means addiction. But if several feel familiar — for you or someone you love — it may be worth a closer look.",
    fig: "FIG. 02 — THE BLUE-LIGHT TRANCE",
  },
  {
    heading: (
      <>
        It always
        <br />starts the
        <br />
        <span className="text-signal">same way</span>
      </>
    ),
    body: "“Just one more match.” One more level, one more reward — and the night quietly disappears without you noticing.",
    fig: "FIG. 02.1 — ONE MORE MATCH",
  },
  {
    heading: (
      <>
        Until the
        <br />game starts
        <br />
        <span className="text-signal">keeping you</span>
      </>
    ),
    body: "Sleep, focus, and the people around you slowly become small trades you barely remember agreeing to.",
    fig: "FIG. 02.2 — THE QUIET COST",
  },
]

const signs = [
  { n: "S01", title: "Losing track of time", body: "Sessions meant to be an hour stretch into the early morning, again and again." },
  { n: "S02", title: "Neglecting what matters", body: "Relationships, school, or work slip because the game keeps taking priority." },
  { n: "S03", title: "Needing more", body: "It takes longer sessions or bigger wins to feel the same satisfaction you used to." },
  { n: "S04", title: "Hiding the habit", body: "Downplaying how much you play, or feeling defensive when someone asks about it." },
  { n: "S05", title: "Mood tied to play", body: "Irritable, anxious, or empty when you cannot play or are forced to stop." },
  { n: "S06", title: "Costs adding up", body: "Spending on skins, passes, or microtransactions beyond what you can afford." },
]

export function SectionSigns() {
  const pinRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = pinRef.current
      if (!el) return

      const mm = gsap.matchMedia()

      // Pinned, scroll-driven story — desktop only.
      mm.add("(min-width: 768px)", () => {
        const track = el.querySelector<HTMLElement>("[data-track]")
        const capTrack = el.querySelector<HTMLElement>("[data-cap-track]")
        const count = el.querySelectorAll("[data-panel]").length
        if (!track) return

        // Each track holds `count` stacked, equal-height panels. Sliding it up
        // by (count-1)/count of its own height scrolls from the first step to
        // the last — a real vertical scroll of the text, nothing fades in.
        const move = -100 * ((count - 1) / count)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            // One viewport of scroll per step transition. No snap, so the text
            // glides freely with the scroll like a normal long page; the image
            // stays pinned through every step and only releases (scrolls away
            // with the whole section) once the last step is reached.
            end: () => "+=" + window.innerHeight * (count - 1),
            pin: true,
            scrub: 0.6,
          },
        })

        tl.to(track, { yPercent: move, ease: "none" }, 0)
        if (capTrack) tl.to(capTrack, { yPercent: move, ease: "none" }, 0)
      })

      return () => mm.revert()
    },
    { scope: pinRef },
  )

  return (
    <section
      id="signs"
      className="relative overflow-hidden border-t border-foreground/15 px-5 py-32 md:px-6 md:py-48"
    >
      <Reveal className="hud mb-16 flex items-center gap-3 text-muted-foreground">
        <span className="text-signal">/02</span>
        <Scramble text="THE WARNING SIGNS" />
        <span className="h-px flex-1 bg-foreground/15" />
      </Reveal>

      <div
        ref={pinRef}
        className="grid gap-12 md:min-h-[78vh] md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-20"
      >
        {/* Left: text steps that scroll vertically inside a clipped window */}
        <div className="md:h-[22em] md:overflow-hidden">
          <div data-track className="md:flex md:flex-col">
            {steps.map((step, i) => (
              <div
                key={i}
                data-panel
                className="flex flex-col justify-center md:h-[22em] [&:not(:first-child)]:mt-20 md:[&:not(:first-child)]:mt-0"
              >
                <h2 className="display text-balance text-[10vw] leading-[0.95] text-foreground md:text-[5vw]">
                  {step.heading}
                </h2>
                <p className="mt-8 max-w-md text-pretty leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image stays put while the caption scrolls in sync */}
        <div className="relative hidden md:block">
          <MediaReveal className="rounded-md">
            <Image
              src="/collage/screen-face.png"
              alt="A young person's face lit only by the glow of a screen in the dark"
              width={600}
              height={750}
              className="h-auto w-full grayscale"
            />
          </MediaReveal>
          <div className="absolute -bottom-3 left-3 h-6 overflow-hidden">
            <div data-cap-track className="flex flex-col">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="hud flex h-6 items-center whitespace-nowrap bg-background px-2 text-muted-foreground"
                >
                  {step.fig}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Signs as a technical checklist grid */}
      <div className="mt-24 grid gap-px border border-foreground/15 bg-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
        {signs.map((s, i) => (
          <Reveal
            key={s.n}
            delay={(i % 3) * 0.06}
            className="group bg-background p-7 transition-colors hover:bg-foreground hover:text-background"
          >
            <div className="hud mb-8 flex items-center justify-between text-muted-foreground group-hover:text-background/60">
              <span>{s.n}</span>
              <span className="flex size-4 items-center justify-center border border-current text-[0.6rem] text-signal">
                ✕
              </span>
            </div>
            <h3 className="display mb-2 text-xl">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-background/80">
              {s.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
