"use client"

import Image from "next/image"
import { LineReveal, MediaReveal, Parallax, Reveal, Scramble, VelocitySkew } from "@/components/anim"

const signs = [
  { n: "S01", title: "Losing track of time", body: "Sessions meant to be an hour stretch into the early morning, again and again." },
  { n: "S02", title: "Neglecting what matters", body: "Relationships, school, or work slip because the game keeps taking priority." },
  { n: "S03", title: "Needing more", body: "It takes longer sessions or bigger wins to feel the same satisfaction you used to." },
  { n: "S04", title: "Hiding the habit", body: "Downplaying how much you play, or feeling defensive when someone asks about it." },
  { n: "S05", title: "Mood tied to play", body: "Irritable, anxious, or empty when you cannot play or are forced to stop." },
  { n: "S06", title: "Costs adding up", body: "Spending on skins, passes, or microtransactions beyond what you can afford." },
]

export function SectionSigns() {
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

      <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
        <div>
          <VelocitySkew>
            <LineReveal
              className="display text-foreground"
              lineClassName="text-[10vw] leading-[0.95] md:text-[5vw]"
              lines={[<>When does</>, <>a hobby become</>, <>a <span className="text-signal">hold?</span></>]}
            />
          </VelocitySkew>
          <Reveal className="mt-8 max-w-md" delay={0.1}>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              No single sign means addiction. But if several feel familiar — for
              you or someone you love — it may be worth a closer look.
            </p>
          </Reveal>
        </div>

        <Parallax distance={60} className="relative hidden md:block">
          <MediaReveal className="rounded-md">
            <Image
              src="/collage/screen-face.png"
              alt="A young person's face lit only by the glow of a screen in the dark"
              width={600}
              height={750}
              className="h-auto w-full grayscale"
            />
          </MediaReveal>
          <div className="hud absolute -bottom-3 left-3 bg-background px-2 py-1 text-muted-foreground">
            FIG. 02 — THE BLUE-LIGHT TRANCE
          </div>
        </Parallax>
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
