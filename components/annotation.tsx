"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"

/**
 * A technical "annotation": an HUD label connected to a point on the page
 * by an L-shaped SVG leader line that draws itself when scrolled into view.
 * Mirrors the engineering-blueprint callouts on sutera.ch.
 */

type Point = { x: number; y: number }

export function Annotation({
  label,
  index,
  align = "left",
  className,
  style,
  labelClassName,
  // path is a list of points (in % of the wrapper) the leader line travels through
  path,
}: {
  label: ReactNode
  index?: string
  align?: "left" | "right"
  className?: string
  style?: React.CSSProperties
  labelClassName?: string
  path: Point[]
}) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const line = el.querySelector<SVGPathElement>("[data-anno-line]")
      const dot = el.querySelector<SVGCircleElement>("[data-anno-dot]")
      const box = el.querySelector<HTMLElement>("[data-anno-box]")

      if (line) {
        const len = line.getTotalLength()
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "power2.inOut",
          scrollTrigger: { trigger: el, start: "top 78%", end: "top 30%", scrub: 0.8 },
        })
      }
      if (dot) {
        gsap.from(dot, {
          scale: 0,
          transformOrigin: "center",
          ease: "back.out(2)",
          scrollTrigger: { trigger: el, start: "top 60%" },
        })
        // continuous pulse once revealed
        gsap.to(dot, {
          scale: 1.8,
          transformOrigin: "center",
          opacity: 0.4,
          duration: 1.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 0.6,
        })
      }
      if (box) {
        gsap.from(box, {
          autoAlpha: 0,
          y: 10,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 55%" },
        })
      }
    },
    { scope: root },
  )

  const d = path
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ")
  const start = path[0]
  const end = path[path.length - 1]

  return (
    <div ref={root} className={`pointer-events-none absolute ${className ?? ""}`} style={style}>
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          data-anno-line
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
          className="text-foreground/40"
        />
      </svg>
      {/* node marker at the connection point */}
      <svg
        className="absolute overflow-visible"
        style={{ left: `${start.x}%`, top: `${start.y}%`, width: 1, height: 1 }}
        aria-hidden
      >
        <g transform="translate(0,0)">
          <rect x={-5} y={-5} width={10} height={10} fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
          <circle data-anno-dot cx={0} cy={0} r={2.4} fill="currentColor" className="text-signal" />
        </g>
      </svg>
      {/* label box */}
      <div
        data-anno-box
        className={`absolute max-w-[260px] ${align === "right" ? "-translate-x-full text-right" : ""}`}
        style={{ left: `${end.x}%`, top: `${end.y}%`, transform: `translateY(-50%) ${align === "right" ? "translateX(-8px)" : "translateX(8px)"}` }}
      >
        <div className={`flex items-center gap-2 ${align === "right" ? "justify-end" : ""}`}>
          {index ? <span className="hud text-base text-signal">{index}</span> : null}
        </div>
        <p className={labelClassName ?? "hud leading-relaxed text-muted-foreground"}>{label}</p>
      </div>
    </div>
  )
}
