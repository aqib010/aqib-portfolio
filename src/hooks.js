import { useEffect, useRef, useState } from 'react'

export const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches

export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.12 })
    document.querySelectorAll('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el) })
    return () => io.disconnect()
  }, [])
}

export function useTyping(words) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (reduced()) { setText(words[0]); return }
    let ri = 0, ci = 0, del = false, id
    const tick = () => {
      const w = words[ri]; setText(w.slice(0, ci))
      if (!del && ci < w.length) { ci++; id = setTimeout(tick, 80) }
      else if (!del) { del = true; id = setTimeout(tick, 1300) }
      else if (ci > 0) { ci--; id = setTimeout(tick, 38) }
      else { del = false; ri = (ri + 1) % words.length; id = setTimeout(tick, 250) }
    }
    tick(); return () => clearTimeout(id)
  }, [])
  return text
}

export function useScrollPct() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const f = () => { const h = document.documentElement; setP(h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) }
    addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f)
  }, [])
  return p
}

export function useActiveSection(ids) {
  const [a, setA] = useState(ids[0])
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setA(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' })
    ids.forEach(id => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])
  return a
}

export function useCountUp(target) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const s = performance.now()
      const f = now => { const p = Math.min((now - s) / 1400, 1); setN(Math.round(target * (1 - (1 - p) ** 3))); if (p < 1) requestAnimationFrame(f) }
      requestAnimationFrame(f)
    }, { threshold: 0.5 })
    ref.current && io.observe(ref.current); return () => io.disconnect()
  }, [])
  return [ref, n]
}
