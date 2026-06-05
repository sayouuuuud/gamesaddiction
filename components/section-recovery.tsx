"use client"

import Image from "next/image"
import { LineReveal, Magnetic, Parallax, Reveal, Scramble } from "@/components/anim"
import { cn } from "@/lib/utils"

const steps = [
  { n: "01", title: "Name it without shame", body: "Addiction is a wiring problem, not a moral failing. Honesty is the doorway out." },
  { n: "02", title: "Rebuild the day", body: "Replace play with sleep, movement, food, and people — one small block at a time." },
  { n: "03", title: "Set real friction", body: "Time limits, app blockers, and accountability turn willpower into structure." },
  { n: "04", title: "Reach for support", body: "Therapists, support groups, and loved ones make recovery far more likely to last." },
]

export function SectionRecovery({ panel = false }: { panel?: boolean }) {
  return (
    <section
      id="recovery"
      className={cn(
        "relative overflow-hidden border-t border-foreground/15 px-5 md:px-10 lg:px-16",
        panel
          ? "flex flex-col justify-center py-24 md:h-full md:py-0"
          : "py-32 md:py-48",
      )}
    >
      <Reveal
        className={cn(
          "hud flex items-center gap-3 text-muted-foreground",
          panel ? "mb-10 md:mb-8" : "mb-16",
        )}
      >
        <span className="text-signal">/04</span>
        <Scramble text="THE WAY BACK" />
        <span className="h-px flex-1 bg-foreground/15" />
      </Reveal>

      <div className={cn("grid gap-12 md:grid-cols-[1fr_0.85fr]", panel ? "md:gap-12" : "md:gap-20")}>
        <div className="relative">
          <LineReveal
            className="display text-foreground"
            lineClassName={cn("leading-[0.95]", panel ? "text-[10vw] md:text-[4vw]" : "text-[10vw] md:text-[5vw]")}
            lines={[<>Recovery isn&apos;t</>, <>quitting games.</>, <>It&apos;s <span className="text-signal">reclaiming</span></>, <>yourself.</>]}
          />
          <Reveal className={cn("max-w-md", panel ? "mt-6" : "mt-8")} delay={0.1}>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Thousands have walked this path back to balance. The way out is
              rarely one big decision — it is a series of small, repeated ones.
            </p>
          </Reveal>

          {!panel && (
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
          )}
        </div>

        <div>
          {steps.map((step, i) => (
            <Reveal
              key={step.n}
              delay={i * 0.06}
              className={cn(
                "group flex items-start gap-5 border-t border-foreground/15 last:border-b",
                panel ? "py-4 md:py-3" : "py-6",
              )}
            >
              <span className="hud pt-1 text-signal">{step.n}</span>
              <div>
                <h3 className="display display-geist text-2xl text-foreground">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Reveal className={cn(panel ? "mt-12 md:mt-10" : "mt-28")}>
        <div className={cn("border border-foreground bg-background", panel ? "p-6 md:p-8" : "p-8 md:p-16")}>
          <div className={cn("hud flex items-center justify-between text-muted-foreground", panel ? "mb-5" : "mb-8")}>
            <span>[ START HERE ]</span>
            <span className="text-signal">●</span>
          </div>
          <h3
            className={cn(
              "display display-geist max-w-4xl text-pretty leading-[0.95] text-foreground",
              panel ? "text-[7vw] md:text-[2.6vw]" : "text-[8vw] md:text-[4vw]",
            )}
          >
            If the screen has been winning, today is the day you start winning
            it back.
          </h3>
          <div className={cn("flex flex-col gap-3 sm:flex-row", panel ? "mt-8" : "mt-12")}>
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
