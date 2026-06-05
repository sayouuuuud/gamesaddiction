"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"

/**
 * Creative "specimen diagram" scaffolding for the brain figure (FIG. 01).
 * Mirrors the HUD framing used on the hero controller, but themed around the
 * neural reward loop — it fills the dead space on the edges with a live
 * dopamine oscilloscope, a vertical specimen spine, and a craving meter.
 * Everything fades up on scroll; the readouts animate continuously.
 */
export function NeuralHud({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      gsap.from(el.querySelectorAll("[data-neural-aux]"), {
        autoAlpha: 0,
        y: 16,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 80%" },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden>
      {/* Far-left vertical spine label */}
      <div
        data-neural-aux
        className="hud absolute left-0 top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-muted-foreground lg:block"
        style={{ transform: "translateY(-50%) rotate(-90deg)", transformOrigin: "left center" }}
      >
        SPECIMEN 002 — NEURAL REWARD MAP
      </div>

      {/* Bottom-left: live dopamine oscilloscope */}
      <div data-neural-aux className="absolute bottom-0 left-0 w-60 border-l border-foreground/20 pl-3">
        <div className="hud mb-2 flex items-center gap-1.5 text-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-signal" />
          NEURAL ACTIVITY
        </div>

        <div className="relative h-14 w-full overflow-hidden border border-foreground/15 bg-foreground/[0.02]">
          {/* baseline */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-foreground/10" />
          {/* scrolling waveform (doubled so the loop is seamless) */}
          <svg
            className="absolute inset-y-0 left-0 h-full w-[200%] text-signal"
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
            style={{ animation: "eeg-scroll 3.2s linear infinite" }}
          >
            <path
              d={`${EEG} ${EEG_SHIFTED}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <div className="mt-2">
          {[
            ["REWARD CYCLE", "0.8s"],
            ["CRAVING INDEX", "0.91"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="hud flex items-center justify-between border-t border-foreground/10 py-1 text-muted-foreground"
            >
              <span>{k}</span>
              <span className="text-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: craving / dopamine readout with a live sweep bar */}
      <div data-neural-aux className="absolute right-0 top-1/2 hidden w-44 -translate-y-1/2 text-right lg:block">
        <div className="hud text-muted-foreground">DOPAMINE</div>
        <div className="hud mt-1 text-signal">● SPIKING</div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full origin-left rounded-full bg-signal"
            style={{ animation: "reward-sweep 2.6s ease-out infinite" }}
          />
        </div>
        <div className="hud mt-2 leading-relaxed text-muted-foreground">
          PREDICTED NEXT REWARD IN T−00:42
        </div>
      </div>
    </div>
  )
}

// A jagged "spike then settle" EEG pattern across a 100-wide segment.
const EEG =
  "M 0 20 L 10 20 L 14 8 L 18 32 L 22 20 L 38 20 L 42 14 L 46 26 L 50 20 L 66 20 L 70 4 L 74 36 L 78 20 L 100 20"
// The same pattern shifted +100 so the doubled path tiles seamlessly.
const EEG_SHIFTED =
  "L 110 20 L 114 8 L 118 32 L 122 20 L 138 20 L 142 14 L 146 26 L 150 20 L 166 20 L 170 4 L 174 36 L 178 20 L 200 20"
