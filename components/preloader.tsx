"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(false)

  useGSAP(
    () => {
      const root = rootRef.current
      const bar = barRef.current
      const count = countRef.current
      if (!root || !bar || !count) return

      // lock scroll while loading
      const html = document.documentElement
      const prevOverflow = html.style.overflow
      html.style.overflow = "hidden"

      // wait for the hero artwork (and the rest of the page assets) to be ready
      const assetsReady = new Promise<void>((resolve) => {
        const heroSrc = "/collage/hero-hand-clean.png"
        const img = new Image()
        let settled = false
        const finish = () => {
          if (settled) return
          settled = true
          resolve()
        }
        img.onload = finish
        img.onerror = finish
        img.src = heroSrc
        if (img.complete) finish()
        // also wait for the window load event so fonts/other art settle
        if (document.readyState === "complete") {
          finish()
        } else {
          window.addEventListener("load", finish, { once: true })
        }
      })

      const progress = { value: 0 }
      let assetsDone = false
      assetsReady.then(() => {
        assetsDone = true
      })

      const tl = gsap.timeline({
        onComplete: () => {
          html.style.overflow = prevOverflow
          setDone(true)
          ScrollTrigger.refresh()
        },
      })

      // crawl to 90% over a brisk, eased curve
      tl.to(progress, {
        value: 90,
        duration: 1.5,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.round(progress.value)
          count.textContent = String(v).padStart(3, "0")
          gsap.set(bar, { scaleX: progress.value / 100 })
        },
      })

      // hold at 90% until the hero image has actually loaded
      tl.add(() => {
        if (!assetsDone) {
          tl.pause()
          assetsReady.then(() => tl.resume())
        }
      })

      // finish the last 10% once assets are confirmed ready
      tl.to(progress, {
        value: 100,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          const v = Math.round(progress.value)
          count.textContent = String(v).padStart(3, "0")
          gsap.set(bar, { scaleX: progress.value / 100 })
        },
      })

      // hold a beat, then wipe the curtain up
      tl.to(root.querySelectorAll("[data-pre-fade]"), {
        autoAlpha: 0,
        y: -16,
        duration: 0.5,
        ease: "power2.in",
        stagger: 0.06,
      })
      tl.to(
        root,
        {
          yPercent: -100,
          duration: 0.9,
          ease: "expo.inOut",
        },
        "-=0.1",
      )

      return () => {
        html.style.overflow = prevOverflow
      }
    },
    { scope: rootRef },
  )

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-background p-5 md:p-6"
      aria-hidden
    >
      {/* top row */}
      <div className="flex items-start justify-between" data-pre-fade>
        <span className="hud text-base font-bold tracking-[0.18em] text-foreground">
          RECLAIM<span className="text-signal">®</span>
        </span>
        <span className="hud text-right text-foreground/60">
          {"LOADING\u2026"}
          <br />
          AN AWARENESS PROJECT
        </span>
      </div>

      {/* center counter */}
      <div className="flex items-end justify-between gap-4" data-pre-fade>
        <span
          ref={countRef}
          className="font-mono text-[18vw] font-bold leading-[0.8] tracking-tighter text-foreground md:text-[12vw]"
        >
          000
        </span>
        <span className="hud mb-3 hidden text-foreground/50 md:block">FIG. 00 — ANATOMY OF THE HOOK</span>
      </div>

      {/* progress bar */}
      <div className="flex flex-col gap-3" data-pre-fade>
        <div className="h-px w-full overflow-hidden bg-foreground/15">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-signal"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="hud text-foreground/50">PLAYTIME {"\u2260"} FREE TIME</span>
          <span className="hud text-foreground/50">RECLAIM YOUR HOURS</span>
        </div>
      </div>
    </div>
  )
}
