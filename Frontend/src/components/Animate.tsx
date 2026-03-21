/**
 * Animate.tsx — iOS-style scroll-triggered animation primitives
 *
 * All built on IntersectionObserver + CSS transitions.
 * Zero external dependencies — no Framer Motion, no GSAP.
 * Fully respects prefers-reduced-motion via CSS.
 *
 * iOS animation principles used:
 *  • Spring easing: cubic-bezier(0.34, 1.56, 0.64, 1)  ← overshoot bounce
 *  • Decelerate:    cubic-bezier(0.22, 1,    0.36, 1)  ← fast-start, ease-out
 *  • Translate only (Y or X) — never rotateZ without purpose
 *  • Short durations: 480–680ms (iOS is snappy, not sluggish)
 *  • Stagger: 60–90ms per child (noticeable but not slow)
 *  • Scale from 0.94 not 0 — subtle, professional
 */

import { useEffect, useState, useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'

// iOS easing curves
const EASE_DECEL  = 'cubic-bezier(0.22, 1, 0.36, 1)'    // fast start → soft stop
const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)' // slight overshoot

interface Base {
  children: React.ReactNode
  className?: string
  delay?: number    // ms — stagger offset from parent
  duration?: number // ms
  threshold?: number
}

/* ─── FadeUp ─────────────────────────────────────────────────────────────
   The workhorse iOS entrance: fade + gentle rise.
   Used for section titles, paragraphs, CTA blocks.
────────────────────────────────────────────────────────────────────────── */
export function FadeUp({
  children, className, delay = 0, duration = 560, threshold = 0.12
}: Base) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold })
  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateY(0px)' : 'translateY(24px)',
        transition: [
          `opacity   ${duration}ms ${EASE_DECEL} ${delay}ms`,
          `transform ${duration}ms ${EASE_DECEL} ${delay}ms`,
        ].join(', '),
      }}
    >
      {children}
    </div>
  )
}

/* ─── SlideIn ────────────────────────────────────────────────────────────
   Horizontal entrance. Use for two-column layouts (left/right pairs).
────────────────────────────────────────────────────────────────────────── */
export function SlideIn({
  children, className, delay = 0, duration = 620, threshold = 0.12,
  direction = 'left',
}: Base & { direction?: 'left' | 'right' }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold })
  const dx = direction === 'left' ? '-32px' : '32px'
  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{
        opacity:   inView ? 1 : 0,
        transform: inView ? 'translateX(0px)' : `translateX(${dx})`,
        transition: [
          `opacity   ${duration}ms ${EASE_DECEL} ${delay}ms`,
          `transform ${duration}ms ${EASE_DECEL} ${delay}ms`,
        ].join(', '),
      }}
    >
      {children}
    </div>
  )
}

/* ─── ScaleIn ────────────────────────────────────────────────────────────
   Spring-in scale for cards and media. The slight overshoot gives the
   exact "pop" feel Apple uses for app icons and modals.
────────────────────────────────────────────────────────────────────────── */
export function ScaleIn({
  children, className, delay = 0, duration = 520, threshold = 0.12
}: Base) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold })
  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{
        opacity:   inView ? 1 : 0,
        transform: inView ? 'scale(1)' : 'scale(0.94)',
        transition: [
          `opacity   ${duration}ms ${EASE_DECEL}  ${delay}ms`,
          `transform ${duration}ms ${EASE_SPRING} ${delay}ms`,
        ].join(', '),
      }}
    >
      {children}
    </div>
  )
}

/* ─── StaggerList ────────────────────────────────────────────────────────
   Wraps a grid/list so children cascade in one-by-one.
   Each child gets an increasing delay based on its index × stagger.
────────────────────────────────────────────────────────────────────────── */
export function StaggerList({
  children, className, stagger = 70, duration = 520, threshold = 0.10,
}: Base & { stagger?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold })
  const kids = Array.isArray(children) ? children : [children]
  return (
    <div ref={ref} className={cn(className)}>
      {kids.map((child, i) => (
        <div
          key={i}
          className="will-change-transform"
          style={{
            opacity:   inView ? 1 : 0,
            transform: inView ? 'translateY(0px)' : 'translateY(20px)',
            transition: [
              `opacity   ${duration}ms ${EASE_DECEL} ${i * stagger}ms`,
              `transform ${duration}ms ${EASE_DECEL} ${i * stagger}ms`,
            ].join(', '),
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

/* ─── CountUp ────────────────────────────────────────────────────────────
   Animates a number from 0 → end when it scrolls into view.
   Uses ease-out cubic for a natural deceleration feel.
────────────────────────────────────────────────────────────────────────── */
export function CountUp({
  end, suffix = '', duration = 1600, delay = 0, className,
}: {
  end: number
  suffix?: string
  duration?: number
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [, inView] = useInView<HTMLDivElement>({ threshold: 0.5 })
  // Use a separate observer on the span itself
  const [triggered, setTriggered] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect() } },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!triggered) return
    let raf: number
    let startTs: number | null = null
    const tick = (ts: number) => {
      if (!startTs) startTs = ts
      const elapsed = ts - startTs - delay
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return }
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setCount(Math.round(eased * end))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [triggered, end, duration, delay])

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}
