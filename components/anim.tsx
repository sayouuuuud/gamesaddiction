"use client"

import {
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { getScrollVelocity } from "@/lib/scroll-velocity"
import { cn } from "@/lib/utils"

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

/* ---------------- Reveal: fade + rise a block on scroll ---------------- */

export function Reveal({
  children,
  className,
  as: Tag = "div",
  y = 30,
  delay = 0,
  stagger,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  y?: number
  delay?: number
  stagger?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const targets = stagger ? Array.from(el.children) : el
      gsap.from(targets, {
        y,
        autoAlpha: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 85%" },
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/* ---------------- LineReveal: masked lines rise into view ---------------- */

export function LineReveal({
  lines,
  className,
  lineClassName,
  start = "top 82%",
  stagger = 0.12,
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  start?: string
  stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const inner = el.querySelectorAll<HTMLElement>("[data-line-inner]")
      gsap.from(inner, {
        yPercent: 115,
        duration: 1.05,
        ease: "power4.out",
        stagger,
        scrollTrigger: { trigger: el, start },
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <span data-line-inner className={cn("block", lineClassName)}>
            {line}
          </span>
        </span>
      ))}
    </div>
  )
}

/* --------- VelocitySkew: subtly skews + stretches with scroll speed --------- */
/* The signature "Lusion" feel — content leans into the direction you scroll
   and snaps back to rest the moment you stop. */

export function VelocitySkew({
  children,
  className,
  as: Tag = "div",
  max = 7,
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  /** maximum skew angle (deg) at top scroll speed */
  max?: number
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return

      const skewTo = gsap.quickTo(el, "skewY", { duration: 0.5, ease: "power3" })
      const scaleTo = gsap.quickTo(el, "scaleY", { duration: 0.5, ease: "power3" })

      const update = () => {
        const v = getScrollVelocity()
        skewTo(gsap.utils.clamp(-max, max, v / -260))
        scaleTo(1 + Math.min(Math.abs(v) / 9000, 0.05))
      }

      gsap.ticker.add(update)
      return () => gsap.ticker.remove(update)
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  )
}

/* ---------- MediaReveal: clip-path wipe + slow zoom as media enters ---------- */

export function MediaReveal({
  children,
  className,
  as: Tag = "div",
  start = "top 85%",
}: {
  children: ReactNode
  className?: string
  as?: ElementType
  start?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const inner = el.querySelector<HTMLElement>("[data-media-inner]") ?? el

      gsap.set(el, { clipPath: "inset(0% 0% 100% 0%)" })
      gsap.set(inner, { scale: 1.18 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start },
      })
      tl.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out" })
        .to(inner, { scale: 1, duration: 1.4, ease: "power3.out" }, 0)
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={cn("overflow-hidden", className)}>
      <div data-media-inner className="h-full w-full">
        {children}
      </div>
    </Tag>
  )
}

/* ---------------- Parallax: scrub element along Y on scroll ---------------- */

export function Parallax({
  children,
  className,
  distance = 90,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  distance?: number
  as?: ElementType
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      gsap.fromTo(
        el,
        { y: -distance },
        {
          y: distance,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      )
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/* ---------------- Counter: count up when in view ---------------- */

export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [text, setText] = useState(`${prefix}${(0).toFixed(decimals)}${suffix}`)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const obj = { v: 0 }
      gsap.to(obj, {
        v: to,
        duration: 2,
        ease: "power2.out",
        onUpdate: () =>
          setText(`${prefix}${obj.v.toFixed(decimals)}${suffix}`),
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      })
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}

/* ---------------- Float: gentle idle floating loop ---------------- */

export function Float({
  children,
  className,
  amplitude = 14,
  duration = 5,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
  as?: ElementType
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      gsap.to(el, {
        y: amplitude,
        duration,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/* ---------------- Scramble: decode text on scroll into view ---------------- */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*+="

export function Scramble({
  text,
  className,
  as: Tag = "span",
  duration = 1.1,
  start = "top 88%",
}: {
  text: string
  className?: string
  as?: ElementType
  duration?: number
  start?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const [out, setOut] = useState(text)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const state = { p: 0 }
      const final = text
      gsap.to(state, {
        p: 1,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start, once: true },
        onUpdate: () => {
          const reveal = Math.floor(final.length * state.p)
          let s = ""
          for (let i = 0; i < final.length; i++) {
            if (i < reveal || final[i] === " ") s += final[i]
            else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          }
          setOut(s)
        },
        onComplete: () => setOut(final),
      })
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className}>
      {out}
    </Tag>
  )
}

/* ---------------- Magnetic: element eases toward the cursor ---------------- */

export function Magnetic({
  children,
  className,
  strength = 0.4,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  strength?: number
  as?: ElementType
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const x = e.clientX - (r.left + r.width / 2)
        const y = e.clientY - (r.top + r.height / 2)
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "power3.out" })
      }
      const onLeave = () =>
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" })
      el.addEventListener("pointermove", onMove)
      el.addEventListener("pointerleave", onLeave)
      return () => {
        el.removeEventListener("pointermove", onMove)
        el.removeEventListener("pointerleave", onLeave)
      }
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={cn("inline-block", className)}>
      {children}
    </Tag>
  )
}
