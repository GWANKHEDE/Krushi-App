/**
 * useInView — lightweight IntersectionObserver hook
 *
 * Returns [ref, isInView]. Disconnects after first trigger (once=true)
 * so the observer doesn't keep running — no memory leaks.
 *
 * rootMargin: '0px 0px -40px 0px' means "trigger 40px before the
 * element fully enters the viewport" — feels snappier, matches iOS
 * where content starts animating just as you reach it.
 */
import { useEffect, useRef, useState } from 'react'

interface Options {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: Options = {}
): [React.RefObject<T>, boolean] {
  const {
    threshold  = 0.12,
    rootMargin = '0px 0px -40px 0px',
    once       = true,
  } = options

  const ref    = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip if already visible on first paint (e.g. top of page)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView]
}
