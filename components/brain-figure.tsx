"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"

export function BrainFigure({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // glow breathes faster (like neural firing)
      gsap.to("[data-brain-glow]", {
        opacity: 0.7,
        scale: 1.15,
        duration: 1.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
      // brain floats + subtle 3D sway
      gsap.to("[data-brain-img]", {
        y: -16,
        rotate: 2,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
      // scroll: gentle scale-in as it enters
      gsap.from("[data-brain-img]", {
        scale: 0.8,
        autoAlpha: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 40%", scrub: 1 },
      })
      // firing synapse pings around the brain
      gsap.utils.toArray<HTMLElement>("[data-synapse]").forEach((s, i) => {
        gsap.set(s, { scale: 0, opacity: 0 })
        gsap.to(s, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(3)",
          yoyo: true,
          repeat: -1,
          repeatDelay: 1.6,
          delay: i * 0.4,
        })
      })
    },
    { scope: root },
  )

  const synapses = [
    { top: "22%", left: "30%" },
    { top: "34%", left: "68%" },
    { top: "58%", left: "24%" },
    { top: "64%", left: "72%" },
    { top: "46%", left: "50%" },
  ]

  return (
    <div ref={root} className={`relative ${className ?? ""}`}>
      <div
        data-brain-glow
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 size-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-signal) 45%, transparent) 0%, transparent 68%)",
        }}
      />
      <div data-brain-img className="will-change-transform">
        <Image
          src="/collage/object-brain-cut.png"
          alt="A brain woven from black cables with small glowing circuit nodes"
          width={900}
          height={900}
          className="h-auto w-full mix-blend-multiply"
        />
        {synapses.map((p, i) => (
          <span
            key={i}
            data-synapse
            aria-hidden
            className="absolute size-2 rounded-full bg-signal shadow-[0_0_12px_2px_var(--color-signal)]"
            style={{ top: p.top, left: p.left }}
          />
        ))}
      </div>
    </div>
  )
}
