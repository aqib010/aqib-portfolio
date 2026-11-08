import { useEffect, useRef } from 'react'
import { reduced } from './hooks'

export default function Cursor() {
  const cu = useRef(), rg = useRef()
  useEffect(() => {
    if (reduced()) return
    let m = { x: -99, y: -99 }, r = { x: -99, y: -99 }, raf
    const mv = e => { m = { x: e.clientX, y: e.clientY }; cu.current.style.transform = `translate(${m.x}px,${m.y}px)` }
    const over = e => rg.current.classList.toggle('big', !!e.target.closest('a,.card'))
    addEventListener('mousemove', mv); addEventListener('mouseover', over)
    const loop = () => { r.x += (m.x - r.x) * .16; r.y += (m.y - r.y) * .16; rg.current.style.transform = `translate(${r.x}px,${r.y}px)`; raf = requestAnimationFrame(loop) }
    loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', mv); removeEventListener('mouseover', over) }
  }, [])
  return <><div id="cur" ref={cu} /><div id="ring" ref={rg} /></>
}
