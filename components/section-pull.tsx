"use client"

import Image from "next/image"
import { LineReveal, Reveal, Scramble, VelocitySkew } from "@/components/anim"
import { Annotation } from "@/components/annotation"
import { BrainFigure } from "@/components/brain-figure"
import { NeuralHud } from "@/components/neural-hud"

export function SectionPull() {
  return (
    <section id="pull" className="relative overflow-hidden px-5 py-32 md:px-6 md:py-48">
      <Reveal className="hud mb-16 flex items-center gap-3 text-muted-foreground">
        <span className="text-signal">/01</span>
        <Scramble text="HOW GAMES HOOK US" />
        <span className="h-px flex-1 bg-foreground/15" />
      </Reveal>

      {/* Editorial headline with inline collage images */}
      <VelocitySkew className="relative">
        <LineReveal
          className="display max-w-5xl text-foreground"
          lineClassName="text-[9vw] leading-[0.95] md:text-[5.5vw]"
          lines={[
            <>Games are not</>,
            <>
              broken
              <span className="relative mx-3 inline-block h-[1em] w-[1.3em] translate-y-[0.16em] align-baseline">
                <Image
                  src="/collage/controller-cut.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </span>
              — they are
            </>,
            <>
              <span className="text-signal">working</span> exactly
            </>,
            <>as designed.</>,
          ]}
        />
      </VelocitySkew>

      {/* Annotated diagram — the anatomy of the hook */}
      <div className="bg-crosshair relative mt-40 hidden h-[100vh] max-h-[980px] min-h-[680px] md:block">
        <div className="hud absolute left-0 top-0 text-base text-muted-foreground">
          FIG. 01 — ANATOMY OF A HOOK
        </div>
        <div className="hud absolute right-0 top-0 text-base text-muted-foreground">
          THE ADDICTED BRAIN / DOPAMINE LOOP
        </div>

        {/* creative specimen scaffolding — fills the dead space on the edges */}
        <NeuralHud />

        {/* the object being annotated — animated */}
        <BrainFigure className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[40vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2" />

        {/* leader-line callouts that draw on scroll */}
        <Annotation
          className="inset-0"
          index="A1"
          labelClassName="text-lg leading-snug text-foreground"
          label="Each reward fires a dopamine spike — the brain learns to crave the next one."
          path={[
            { x: 43, y: 38 },
            { x: 18, y: 38 },
            { x: 18, y: 16 },
          ]}
        />
        <Annotation
          className="inset-0"
          align="right"
          index="A2"
          labelClassName="text-lg leading-snug text-foreground"
          label="Unpredictable wins keep the loop firing, exactly like a slot machine."
          path={[
            { x: 59, y: 42 },
            { x: 84, y: 42 },
            { x: 84, y: 18 },
          ]}
        />
        <Annotation
          className="inset-0"
          index="A3"
          labelClassName="text-lg leading-snug text-foreground"
          label="No finish line means the brain never gets the 'done' signal."
          path={[
            { x: 44, y: 62 },
            { x: 17, y: 62 },
            { x: 17, y: 86 },
          ]}
        />
        <Annotation
          className="inset-0"
          align="right"
          index="A4"
          labelClassName="text-lg leading-snug text-foreground"
          label="Social streaks tie your mood to the screen, so stopping feels like a loss."
          path={[
            { x: 58, y: 64 },
            { x: 84, y: 64 },
            { x: 84, y: 86 },
          ]}
        />
      </div>

      {/* Three mechanics, technical-spec style */}
      <div className="mt-24 grid gap-px border border-foreground/15 bg-foreground/15 md:grid-cols-3">
        {MECHANICS.map((m, i) => (
          <Reveal
            key={m.title}
            delay={i * 0.08}
            className="group bg-background p-7 transition-colors hover:bg-foreground hover:text-background"
          >
            <div className="hud mb-10 flex items-center justify-between text-muted-foreground group-hover:text-background/60">
              <span>{m.code}</span>
              <span className="text-signal">●</span>
            </div>
            <h3 className="display mb-3 text-2xl">{m.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-background/80">
              {m.body}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 max-w-xl">
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
          None of this means you are weak. It means billion-dollar teams spent
          years studying exactly how to hold your attention — and they are very,
          very good at it.
        </p>
      </Reveal>
    </section>
  )
}

const MECHANICS = [
  {
    code: "MECH_01",
    title: "Variable rewards",
    body: "Unpredictable loot, wins, and drops trigger the same dopamine system as gambling. The 'maybe next time' is the hook.",
  },
  {
    code: "MECH_02",
    title: "No finish line",
    body: "Battle passes, daily quests, and infinite ranks are built so there is always one more reason to log back in.",
  },
  {
    code: "MECH_03",
    title: "Social pressure",
    body: "Teammates, streaks, and guilds turn quitting into letting people down — so you keep showing up.",
  },
]
