"use client"

import { Counter, LineReveal, Reveal, Scramble, VelocitySkew } from "@/components/anim"
import { HourglassFigure } from "@/components/hourglass-figure"

const stats = [
  { to: 3, decimals: 0, suffix: "%", label: "of gamers worldwide meet the WHO criteria for gaming disorder." },
  { to: 8.5, decimals: 1, suffix: "h", label: "average daily play among those who later sought help for compulsive gaming." },
  { to: 2, decimals: 0, suffix: "×", label: "higher rates of anxiety and depression among those with disordered gaming." },
  { to: 90, decimals: 0, suffix: "%", label: "recover meaningfully with the right support, boundaries, and time." },
]

export function SectionToll() {
  return (
    <section
      id="toll"
      className="relative overflow-hidden border-t border-foreground/15 bg-foreground px-5 py-32 text-background md:px-6 md:py-48"
    >
      <Reveal className="hud mb-16 flex items-center gap-3 text-background/50">
        <span className="text-signal">/03</span>
        <Scramble text="THE REAL COST" />
        <span className="h-px flex-1 bg-background/20" />
      </Reveal>

      <div className="grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16">
        <LineReveal
          className="display"
          lineClassName="text-[11vw] leading-[0.92] md:text-[6vw]"
          lines={[<>The numbers</>, <>behind the</>, <span className="text-signal" key="s">silence.</span>]}
        />
        <HourglassFigure className="mx-auto w-[58vw] max-w-[300px] md:w-[24vw]" />
      </div>

      <div className="mt-20 grid gap-px border border-background/20 bg-background/20 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="bg-foreground p-7 lg:p-8">
            <Counter
              to={s.to}
              decimals={s.decimals}
              suffix={s.suffix}
              className="display block text-6xl tabular-nums lg:text-7xl"
            />
            <p className="mt-5 text-sm leading-relaxed text-background/70">{s.label}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="hud mt-8 max-w-xl text-background/40">
          Figures are illustrative, drawn from public health discussion on gaming
          disorder. They are not a diagnosis.
        </p>
      </Reveal>
    </section>
  )
}
