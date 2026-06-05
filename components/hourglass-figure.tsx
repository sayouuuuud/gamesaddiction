"use client"

import Image from "next/image"
import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"

export function HourglassFigure({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // glow breathes
      gsap.to("[data-hg-glow]", {
        opacity: 0.85,
        scale: 1.12,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
      // hourglass floats + tilts
      gsap.to("[data-hg-img]", {
        y: -14,
        rotate: 1.5,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
      // embers rise and fade, each on its own loop
      gsap.utils.toArray<HTMLElement>("[data-ember]").forEach((e, i) => {
        gsap.set(e, { opacity: 0 })
        gsap.to(e, {
          y: -90 - i * 8,
          opacity: 0,
          keyframes: [
            { opacity: 0, duration: 0 },
            { opacity: 0.9, duration: 0.4 },
            { opacity: 0, duration: 0.6 },
          ],
          duration: 3 + (i % 4),
          ease: "none",
          repeat: -1,
          delay: i * 0.5,
        })
      })
      // slow scroll parallax drift
      gsap.to("[data-hg-img]", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={`relative ${className ?? ""}`}>
      {/* pulsing radial glow */}
      <div
        data-hg-glow
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-signal) 55%, transparent) 0%, transparent 65%)",
        }}
      />
      {/* rising embers */}
      <div aria-hidden className="absolute inset-x-0 bottom-1/3 z-10 mx-auto h-1/2 w-1/3">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            data-ember
            className="absolute bottom-0 size-1 rounded-full bg-signal"
            style={{ left: `${8 + (i * 9) % 84}%` }}
          />
        ))}
      </div>

      <div
        data-hg-img
        className="will-change-transform"
        style={{
          maskImage:
            "radial-gradient(ellipse 62% 70% at 50% 48%, #000 55%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 62% 70% at 50% 48%, #000 55%, transparent 82%)",
        }}
      >
        <Image
          src="/collage/hourglass-dark.png"
          alt="An hourglass with glowing embers draining like sand — time slipping away"
          width={1024}
          height={1024}
          className="h-auto w-full mix-blend-screen"
        />
      </div>
    </div>
  )
}
