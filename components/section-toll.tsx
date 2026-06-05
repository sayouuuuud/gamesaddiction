"use client"

import { Counter, LineReveal, Reveal, Scramble } from "@/components/anim"
import { HourglassFigure } from "@/components/hourglass-figure"
import { cn } from "@/lib/utils"

const stats = [
  { to: 3, decimals: 0, suffix: "%", label: "of gamers worldwide meet the WHO criteria for gaming disorder." },
  { to: 8.5, decimals: 1, suffix: "h", label: "average daily play among those who later sought help for compulsive gaming." },
  { to: 2, decimals: 0, suffix: "×", label: "higher rates of anxiety and depression among those with disordered gaming." },
  { to: 90, decimals: 0, suffix: "%", label: "recover meaningfully with the right support, boundaries, and time." },
]

export function SectionToll({ panel = false }: { panel?: boolean }) {
  return (
    <section
      id="toll"
      className={cn(
        "relative overflow-hidden border-t border-foreground/15 bg-foreground px-5 text-background md:px-10 lg:px-16",
        // panel mode: fit the content to a single viewport so it can ride the
        // horizontal track without clipping. plain mode: tall vertical section.
        panel
          ? "flex flex-col justify-center py-24 md:h-full md:py-0"
          : "py-32 md:py-48",
      )}
    >
      <Reveal
        className={cn(
          "hud flex items-center gap-3 text-background/50",
          panel ? "mb-10 md:mb-8" : "mb-16",
        )}
      >
        <span className="text-signal">/03</span>
        <Scramble text="THE REAL COST" />
        <span className="h-px flex-1 bg-background/20" />
      </Reveal>

      <div className="grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16">
        <LineReveal
          className="display"
          lineClassName={cn(
            "leading-[0.92]",
            panel ? "text-[11vw] md:text-[5vw]" : "text-[11vw] md:text-[6vw]",
          )}
          lines={[<>The numbers</>, <>behind the</>, <span className="text-signal" key="s">silence.</span>]}
        />
        <HourglassFigure
          className={cn(
            "mx-auto",
            panel ? "w-[50vw] max-w-[220px] md:w-[18vw]" : "w-[58vw] max-w-[300px] md:w-[24vw]",
          )}
        />
      </div>

      <div
        className={cn(
          "grid gap-px border border-background/20 bg-background/20 sm:grid-cols-2 lg:grid-cols-4",
          panel ? "mt-12 md:mt-10" : "mt-20",
        )}
      >
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className={cn("bg-foreground", panel ? "p-6 lg:p-7" : "p-7 lg:p-8")}>
            <Counter
              to={s.to}
              decimals={s.decimals}
              suffix={s.suffix}
              className={cn(
                "display block tabular-nums",
                panel ? "text-5xl lg:text-6xl" : "text-6xl lg:text-7xl",
              )}
            />
            <p className="mt-5 text-sm leading-relaxed text-background/70">{s.label}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className={cn("hud max-w-xl text-background/40", panel ? "mt-6" : "mt-8")}>
          Figures are illustrative, drawn from public health discussion on gaming
          disorder. They are not a diagnosis.
        </p>
      </Reveal>
    </section>
  )
}
