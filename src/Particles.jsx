import { useEffect, useRef } from 'react'
import { reduced } from './hooks'

export default function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, x = cv.getContext('2d'), d = Math.min(devicePixelRatio || 1, 2)
    let W, H, raf, m = { x: -999, y: -999 }
    const rs = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; x.setTransform(d, 0, 0, d, 0, 0) }
    rs(); addEventListener('resize', rs)
    const mv = e => { m = { x: e.clientX, y: e.clientY } }; addEventListener('mousemove', mv)
    const P = Array.from({ length: Math.min(60, innerWidth / 18) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .6, vy: (Math.random() - .5) * .6 }))
    const draw = () => {
      x.clearRect(0, 0, W, H); const b = cv.getBoundingClientRect(), mx = m.x - b.left, my = m.y - b.top
      x.fillStyle = x.strokeStyle = '#ff2d3d'
      P.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1
        const dx = p.x - mx, dy = p.y - my, dm = Math.hypot(dx, dy) || 1
        if (dm < 130) { p.x += dx / dm * 1.5; p.y += dy / dm * 1.5 }
        x.globalAlpha = .7; x.beginPath(); x.arc(p.x, p.y, 2, 0, 6.28); x.fill()
        for (let j = i + 1; j < P.length; j++) {
          const q = P[j], s = Math.hypot(p.x - q.x, p.y - q.y)
          if (s < 110) { x.globalAlpha = (1 - s / 110) * .3; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke() }
        }
      })
      raf = requestAnimationFrame(draw)
    }
    if (!reduced()) draw()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', rs); removeEventListener('mousemove', mv) }
  }, [])
  return <canvas id="net" ref={ref} />
}
