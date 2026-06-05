"use client"

import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { getScrollVelocity } from "@/lib/scroll-velocity"

function LiveClock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hud text-right text-muted-foreground">
      <div className="text-[0.6rem] opacity-60">LOCAL TIME</div>
      <div className="tabular-nums text-foreground">{time ?? "--:--:--"}</div>
    </div>
  )
}

export function HudFrame() {
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const header = headerRef.current
    if (!header) return

    let hidden = false

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        // hide the whole navbar once we leave the hero
        const past = self.scroll() > window.innerHeight * 0.6
        if (past === hidden) return
        hidden = past
        gsap.to(header, {
          autoAlpha: past ? 0 : 1,
          y: past ? -24 : 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        })
      },
    })
    return () => st.kill()
  }, [])

  return (
    <>
      {/* Fixed top bar — hides on scroll, returns at the top */}
      <header
        ref={headerRef}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between p-5 md:p-6"
      >
        <a
          href="#top"
          className="hud pointer-events-auto text-base font-bold tracking-[0.18em] text-foreground"
        >
          RECLAIM<span className="text-signal">®</span>
        </a>

        <div className="pointer-events-auto hidden items-center gap-2 rounded-full border border-foreground/30 px-4 py-1.5 md:flex">
          <span className="size-1.5 rounded-full bg-signal" />
          <span className="hud text-foreground">An Awareness Project</span>
        </div>

        <div className="pointer-events-auto">
          <LiveClock />
        </div>
      </header>

      {/* Fixed bottom marquee — speed + direction react to scroll velocity */}
      <VelocityMarquee />
    </>
  )
}

function VelocityMarquee() {
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const track = trackRef.current
    if (!track) return

    // two identical halves -> animating to -50% is a seamless loop
    const loop = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 24,
      repeat: -1,
    })

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      loop.timeScale(0.4)
      return () => loop.kill()
    }

    // smoothed timeScale: idle drifts left at base speed, scrolling
    // speeds it up, and scrolling up flips its direction.
    let current = 1
    const update = () => {
      const v = getScrollVelocity()
      const factor = gsap.utils.clamp(-7, 7, v / 220)
      const target = factor >= 0 ? 1 + factor : -(1 + Math.abs(factor))
      current += (target - current) * 0.08
      loop.timeScale(current)
    }

    gsap.ticker.add(update)
    return () => {
      gsap.ticker.remove(update)
      loop.kill()
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 border-t border-foreground/15 bg-background/70 backdrop-blur-sm">
      <div className="flex overflow-hidden py-2">
        <div ref={trackRef} className="flex w-max shrink-0 will-change-transform">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>
    </div>
  )
}

function MarqueeContent() {
  const items = [
    "JUST ONE MORE GAME",
    "PLAYTIME ≠ FREE TIME",
    "YOU ARE NOT THE PLAYER — YOU ARE THE PRODUCT",
    "THE GAME NEVER WANTS YOU TO STOP",
    "RECLAIM YOUR HOURS",
  ]
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((t) => (
        <span key={t} className="hud flex items-center text-foreground/70">
          <span className="px-6">{t}</span>
          <span className="text-signal">✦</span>
        </span>
      ))}
    </div>
  )
}
