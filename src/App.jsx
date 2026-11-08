import { useEffect, useRef, useState } from 'react'

const GH = 'https://github.com/aqib010'
const projects = [
  ['FEATURED · AI', 'AI Voice Support Agent', 'Voice-driven customer-support assistant powered by Groq LLMs.', ['Python', 'Groq', 'Voice AI']],
  ['BACKEND', 'Task Manager REST API', 'CRUD backend with clean endpoints and validation.', ['FastAPI', 'REST']],
  ['ML', 'Churn Prediction', 'Predicts customer churn, served through a Flask app.', ['scikit-learn', 'Flask']],
  ['NLP', 'Resume / JD Matcher', 'Scores how well a resume fits a job description.', ['Python', 'NLP']],
  ['ML · ITSM', 'Support Ticket Classifier', 'Auto-categorises tickets, informed by real ITSM experience.', ['Python', 'ML']],
  ['AI', 'Python Chatbot', 'Conversational bot using NLTK and the Anthropic API.', ['NLTK', 'Anthropic API']],
]
const matrix = [
  ['Languages', ['Python', 'SQL', 'JavaScript', 'HTML / CSS']],
  ['Backend & ML', ['FastAPI', 'Flask', 'scikit-learn', 'NLTK']],
  ['Testing & Tools', ['Manual Testing', 'Git & GitHub', 'Jira', 'ServiceNow', 'Zendesk']],
]
const roles = ['Python Developer', 'AI / ML Builder', 'QA & SDET Candidate']
const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches

function Typing() {
  const [txt, setTxt] = useState('')
  useEffect(() => {
    if (reduced()) return setTxt(roles[0])
    let ri = 0, ci = 0, del = false, id
    const tick = () => {
      const w = roles[ri]
      setTxt(w.slice(0, ci))
      let ms = 80
      if (!del && ci < w.length) ci++
      else if (!del) { del = true; ms = 1300 }
      else if (ci > 0) { ci--; ms = 38 }
      else { del = false; ri = (ri + 1) % roles.length; ms = 250 }
      id = setTimeout(tick, ms)
    }
    tick()
    return () => clearTimeout(id)
  }, [])
  return <div className="role">{txt}</div>
}

function Counter({ n, label }) {
  const ref = useRef(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const s = performance.now()
      const f = now => {
        const p = Math.min((now - s) / 1400, 1)
        setV(Math.round(n * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(f)
      }
      requestAnimationFrame(f)
    }, { threshold: 0.5 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [n])
  return <div ref={ref}><b>{v}</b><span>{label}</span></div>
}

function Cursor() {
  const dot = useRef(null), ring = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const m = { x: -99, y: -99 }, r = { x: -99, y: -99 }
    let raf
    const mv = e => { m.x = e.clientX; m.y = e.clientY; dot.current.style.transform = `translate(${m.x}px,${m.y}px)` }
    const over = e => ring.current.classList.toggle('big', !!e.target.closest('a,.card'))
    const loop = () => {
      r.x += (m.x - r.x) * 0.16; r.y += (m.y - r.y) * 0.16
      ring.current.style.transform = `translate(${r.x}px,${r.y}px)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('mousemove', mv); addEventListener('mouseover', over); loop()
    return () => { removeEventListener('mousemove', mv); removeEventListener('mouseover', over); cancelAnimationFrame(raf) }
  }, [])
  return <><div id="cur" ref={dot} /><div id="ring" ref={ring} /></>
}

function Particles() {
  const cv = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const c = cv.current, x = c.getContext('2d'), d = Math.min(devicePixelRatio || 1, 2)
    let W, H, raf, mx = -999, my = -999
    const rs = () => { W = c.clientWidth; H = c.clientHeight; c.width = W * d; c.height = H * d; x.setTransform(d, 0, 0, d, 0, 0) }
    rs()
    const P = Array.from({ length: Math.min(60, innerWidth / 18) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 }))
    const mv = e => { const b = c.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top }
    const draw = () => {
      x.clearRect(0, 0, W, H); x.fillStyle = x.strokeStyle = '#ff2d3d'
      P.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        const dx = p.x - mx, dy = p.y - my, dm = Math.hypot(dx, dy) || 1
        if (dm < 130) { p.x += dx / dm * 1.5; p.y += dy / dm * 1.5 }
        x.globalAlpha = 0.7; x.beginPath(); x.arc(p.x, p.y, 2, 0, 6.28); x.fill()
        for (let j = i + 1; j < P.length; j++) {
          const s = Math.hypot(p.x - P[j].x, p.y - P[j].y)
          if (s < 110) { x.globalAlpha = (1 - s / 110) * 0.3; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(P[j].x, P[j].y); x.stroke() }
        }
      })
      raf = requestAnimationFrame(draw)
    }
    addEventListener('resize', rs); addEventListener('mousemove', mv); draw()
    return () => { removeEventListener('resize', rs); removeEventListener('mousemove', mv); cancelAnimationFrame(raf) }
  }, [])
  return <canvas id="net" ref={cv} />
}

function Dock() {
  const [on, setOn] = useState('home')
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setOn(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    document.querySelectorAll('header[id],section[id]').forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [])
  return (
    <nav className="dock">
      {[['home', 'Home'], ['about', 'About'], ['deploy', 'Work'], ['matrix', 'Stack'], ['contact', 'Contact']].map(([id, l]) =>
        <a key={id} href={`#${id}`} className={on === id ? 'on' : ''}>{l}</a>)}
    </nav>
  )
}

export default function App() {
  useEffect(() => {
    const bar = document.getElementById('bar')
    const sc = () => { const h = document.documentElement; bar.style.height = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%' }
    addEventListener('scroll', sc, { passive: true })
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.12 })
    document.querySelectorAll('.rv').forEach((e, i) => { e.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(e) })
    return () => { removeEventListener('scroll', sc); io.disconnect() }
  }, [])
  const spot = e => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px')
    e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px')
  }
  return (
    <>
      <div id="bar" /><Cursor />
      <div className="wrap">
        <header className="hero" id="home">
          <h1 className="big-t rv">Portfolio</h1>
          <p className="hi rv">Hello, I’m <b>Aqib Malik</b></p>
          <Typing />
          <div className="row rv">
            <div>
              <div className="stats">
                <Counter n={7} label="Projects" /><Counter n={12} label="Tools & skills" /><Counter n={2025} label="BCA · AI & ML" />
              </div>
              <a className="btn f" href="#deploy">Explore projects</a><a className="btn" href="#contact">Get in touch</a>
            </div>
          </div>
        </header>

        <section id="about">
          <span className="lbl rv">// About</span>
          <h2 className="rv">Background &amp; Philosophy</h2>
          <p className="lead rv">I studied AI &amp; ML for my BCA, then spent time on the front line of customer support — handling US clients, process compliance and stakeholder management. Now I turn that user-first mindset into Python software and quality testing.</p>
          <div className="pill rv">
            <div><b>Logic first</b><span>Break a problem down before writing code.</span></div>
            <div><b>User-first quality</b><span>I’ve seen what breaking software feels like for real users.</span></div>
            <div><b>Learning in public</b><span>Every project goes to GitHub with a README.</span></div>
          </div>
        </section>

        <section id="deploy">
          <span className="lbl rv">// Work</span>
          <h2 className="rv">Flagship Deployments</h2>
          <p className="lead rv">Hands-on projects across backend, machine learning and AI.</p>
          <div className="deploy">
            {projects.map(([k, t, d, tags]) => (
              <a key={t} className="card rv" href={GH} target="_blank" rel="noreferrer" onMouseMove={spot}>
                <em>{k}</em><h3>{t}</h3><p>{d}</p>{tags.map(g => <span className="tag" key={g}>{g}</span>)}
              </a>
            ))}
          </div>
        </section>

        <section id="matrix">
          <span className="lbl rv">// Stack</span>
          <h2 className="rv">The Systems Matrix</h2>
          <div className="matrix">
            {matrix.map(([h, tags]) => (
              <div className="card rv" key={h} onMouseMove={spot}><h3>{h}</h3>{tags.map(g => <span className="tag" key={g}>{g}</span>)}</div>
            ))}
          </div>
        </section>
      </div>

      <section className="cta" id="contact">
        <Particles />
        <div className="wrap">
          <span className="lbl">// Contact</span>
          <h2>Let’s Build Something Extraordinary.</h2>
          <p>Open to software developer (Python/AI/ML) and SDET roles.</p>
          <div className="reach"><a href="mailto:aqibmalik7242@gmail.com"><span>Email</span>aqibmalik7242@gmail.com</a><a href="tel:+918899293324"><span>Phone</span>+91 88992 93324</a><a href={GH} target="_blank" rel="noreferrer"><span>GitHub</span>github.com/aqib010</a></div>
        </div>
      </section>
      <footer>© 2026 Aqib Malik</footer>
      <Dock />
    </>
  )
}
