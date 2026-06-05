"use client"

import Image from "next/image"
import { LineReveal, Magnetic, Parallax, Reveal, Scramble } from "@/components/anim"

const steps = [
  { n: "01", title: "Name it without shame", body: "Addiction is a wiring problem, not a moral failing. Honesty is the doorway out." },
  { n: "02", title: "Rebuild the day", body: "Replace play with sleep, movement, food, and people — one small block at a time." },
  { n: "03", title: "Set real friction", body: "Time limits, app blockers, and accountability turn willpower into structure." },
  { n: "04", title: "Reach for support", body: "Therapists, support groups, and loved ones make recovery far more likely to last." },
]

export function SectionRecovery() {
  return (
    <section
      id="recovery"
      className="relative overflow-hidden border-t border-foreground/15 px-5 py-32 md:px-6 md:py-48"
    >
      <Reveal className="hud mb-16 flex items-center gap-3 text-muted-foreground">
        <span className="text-signal">/04</span>
        <Scramble text="THE WAY BACK" />
        <span className="h-px flex-1 bg-foreground/15" />
      </Reveal>

      <div className="grid gap-12 md:grid-cols-[1fr_0.85fr] md:gap-20">
        <div className="relative">
          <LineReveal
            className="display text-foreground"
            lineClassName="text-[10vw] leading-[0.95] md:text-[5vw]"
            lines={[<>Recovery isn&apos;t</>, <>quitting games.</>, <>It&apos;s <span className="text-signal">reclaiming</span></>, <>yourself.</>]}
          />
          <Reveal className="mt-8 max-w-md" delay={0.1}>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Thousands have walked this path back to balance. The way out is
              rarely one big decision — it is a series of small, repeated ones.
            </p>
          </Reveal>

          <Parallax
            distance={50}
            className="pointer-events-none absolute -bottom-16 right-0 hidden w-[20vw] max-w-[220px] md:block"
          >
            <Image
              src="/collage/sprout-cut.png"
              alt="A small green sprout growing"
              width={440}
              height={440}
              className="h-auto w-full"
            />
          </Parallax>
        </div>

        <div>
          {steps.map((step, i) => (
            <Reveal
              key={step.n}
              delay={i * 0.06}
              className="group flex items-start gap-5 border-t border-foreground/15 py-6 last:border-b"
            >
              <span className="hud pt-1 text-signal">{step.n}</span>
              <div>
                <h3 className="display text-2xl text-foreground">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Reveal className="mt-28">
        <div className="border border-foreground bg-background p-8 md:p-16">
          <div className="hud mb-8 flex items-center justify-between text-muted-foreground">
            <span>[ START HERE ]</span>
            <span className="text-signal">●</span>
          </div>
          <h3 className="display max-w-4xl text-pretty text-[8vw] leading-[0.95] text-foreground md:text-[4vw]">
            If the screen has been winning, today is the day you start winning
            it back.
          </h3>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.5}>
              <a
                href="#top"
                className="group inline-flex items-center justify-between gap-6 bg-foreground px-7 py-4 text-background transition-colors hover:bg-signal"
              >
                <span className="hud">FIND SUPPORT NOW</span>
                <span aria-hidden>→</span>
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a
                href="#signs"
                className="inline-flex items-center justify-between gap-6 border border-foreground px-7 py-4 text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                <span className="hud">TAKE THE SELF-CHECK</span>
                <span aria-hidden>↑</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
