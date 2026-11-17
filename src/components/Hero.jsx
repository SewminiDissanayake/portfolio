import { useEffect, useRef, useState } from 'react'
import Magnetic from './Magnetic'
import FilmStrip from './FilmStrip'
import AboutPanel from './AboutPanel'

const base = import.meta.env.BASE_URL

// His hero photo (has a RAW and a GRADED version in /public)
const PHOTO = { file: 'photo2', size: 'h-[41vh] md:h-[86vh]' }

// Running camera timecode: HH:MM:SS:FF (25 fps)
function useTimecode() {
  const [t, setT] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => setT((performance.now() - start) / 1000), 40)
    return () => clearInterval(id)
  }, [])
  const parts = [Math.floor(t / 3600), Math.floor(t / 60) % 60, Math.floor(t) % 60, Math.floor((t % 1) * 25)]
  return parts.map((n) => String(n).padStart(2, '0')).join(':')
}

// Thin lens focus rings behind his head, with a distance scale (∞ 10 5 3 2 1m)
function FocusRings() {
  const marks = ['∞', '10', '5', '3', '2', '1.5', '1m']
  return (
    <svg viewBox="-450 -450 900 900" className="lens-spin h-full w-full" fill="none">
      <circle r="230" stroke="currentColor" strokeOpacity="0.25" />
      <circle r="330" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="2 10" />
      <circle r="420" stroke="currentColor" strokeOpacity="0.18" strokeDasharray="520 2120" />
      {/* tick marks on the focus ring */}
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i / 60) * Math.PI * 2
        const long = i % 5 === 0
        const r1 = 330
        const r2 = long ? 350 : 340
        return (
          <line
            key={i}
            x1={Math.cos(a) * r1}
            y1={Math.sin(a) * r1}
            x2={Math.cos(a) * r2}
            y2={Math.sin(a) * r2}
            stroke="currentColor"
            strokeOpacity={long ? 0.5 : 0.25}
          />
        )
      })}
      {/* distance numbers along the top-right of the ring */}
      {marks.map((m, i) => {
        const a = -Math.PI / 2 + (i - 3) * 0.17
        return (
          <text
            key={m}
            x={Math.cos(a) * 375}
            y={Math.sin(a) * 375}
            fill="currentColor"
            fillOpacity="0.55"
            fontSize="14"
            fontFamily="JetBrains Mono, monospace"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {m}
          </text>
        )
      })}
    </svg>
  )
}

// Mouse parallax: writes --mx / --my (-1 … 1) on the section, smoothly
function useParallax() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let tx = 0, ty = 0, x = 0, y = 0, raf
    const onMove = (e) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    const tick = () => {
      x += (tx - x) * 0.06 // ease toward the cursor
      y += (ty - y) * 0.06
      el.style.setProperty('--mx', x.toFixed(4))
      el.style.setProperty('--my', y.toFixed(4))
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])
  return ref
}

// Each layer moves a different amount → depth (far layers move less)
const layer = (px, py) => ({
  transform: `translate3d(calc(var(--mx, 0) * ${px}px), calc(var(--my, 0) * ${py}px), 0)`,
})

export default function Hero({ ready = true }) {
  const sectionRef = useParallax()
  const [graded, setGraded] = useState(true)
  const [wiping, setWiping] = useState(false) // true while the grade line sweeps across
  const toggleGrade = () => {
    setGraded((g) => !g)
    setWiping(true)
    setTimeout(() => setWiping(false), 1000)
  }
  const p = PHOTO
  const [about, setAbout] = useState(false)
  const timecode = useTimecode()

  return (
    <section id="top" ref={sectionRef} className={`${ready ? 'is-ready' : 'is-waiting'} hero-bg relative h-screen min-h-[640px] w-full overflow-hidden text-fg`}>
      {/* film grain */}
      <div className="grain pointer-events-none absolute inset-0 z-30 opacity-[0.08] mix-blend-overlay" />

      {/* lens focus rings behind his head (farthest layer) */}
      <div className="pointer-events-none absolute inset-0" style={layer(-8, -6)}>
        <div className="rings-in absolute left-1/2 top-[36%] aspect-square h-[115vh] -translate-x-1/2 -translate-y-1/2 text-fg md:left-[63%]">
          <FocusRings />
        </div>
      </div>

      {/* huge word behind him */}
      <div className="pointer-events-none absolute inset-0" style={layer(-22, -10)}>
      <h2 className="word-in absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[26vw] font-medium leading-none tracking-tight text-fg/15 md:left-[60%] md:top-[40%] md:text-[19vw]">
        VISUALS
      </h2>
      </div>

      {/* his portrait (nearest layer): RAW underneath, GRADED wipes across on top */}
      <div className="pointer-events-none absolute inset-0" style={layer(14, 8)}>
        <div className={`portrait-in absolute bottom-[53vh] left-1/2 w-max -translate-x-1/2 md:bottom-0 md:left-[63%] ${p.size}`}>
          <img
            src={`${base}${p.file}-raw.webp`}
            alt="Kulara Ramanayake (raw photo)"
            className="h-full w-auto max-w-none object-contain"
          />
          <img
            src={`${base}${p.file}-graded.webp`}
            alt="Kulara Ramanayake (colour graded)"
            className="absolute inset-0 h-full w-auto max-w-none object-contain transition-[clip-path] duration-1000 ease-in-out"
            style={{ clipPath: graded ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' }}
          />
          {/* the "grading line" that sweeps across during the wipe */}
          <span
            className="absolute inset-y-[8%] w-px bg-accent transition-[left,opacity] duration-1000 ease-in-out"
            style={{ left: graded ? '100%' : '0%', opacity: wiping ? 0.9 : 0 }}
          />
        </div>
      </div>

      {/* bottom shade so the text is easy to read */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t md:h-1/2 from-[var(--hero-edge)] to-transparent" />

      {/* top bar: logo + menu */}
      <header className="reveal absolute inset-x-6 top-6 z-20 flex items-center justify-between md:inset-x-10 md:top-8" style={{ "--d": "0.1s" }}>
        <span className="absolute left-20 hidden items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-fg/70 md:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#e5212b]" /> REC {timecode}
        </span>
        <Magnetic>
        <a href="#" data-cursor="HOME" className="grid h-14 w-14 place-items-center rounded-full bg-[var(--hero-edge)]/85 font-display text-xl italic text-fg shadow-lg ring-1 ring-fg/15 backdrop-blur">
          <span>
            KR<span className="text-accent">.</span>
          </span>
        </a>
        </Magnetic>
        <Magnetic>
        <button data-cursor="MENU" className="grid h-14 w-14 place-items-center rounded-full bg-[var(--hero-edge)]/85 shadow-lg ring-1 ring-fg/15 backdrop-blur" aria-label="Menu">
          <span className="flex flex-col gap-1.5">
            <span className="h-[2px] w-5 bg-fg" />
            <span className="h-[2px] w-5 bg-fg" />
            <span className="h-[2px] w-5 bg-fg" />
          </span>
        </button>
        </Magnetic>
      </header>

      {/* name + intro */}
      <div className="absolute bottom-36 left-6 right-6 z-20 md:bottom-32 md:left-12 md:max-w-xl">
        <p className="reveal flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-fg/80" style={{ "--d": "0.3s" }}>
          <span className="h-2 w-2 rounded-full bg-accent" /> HELLO, I'M KULARA RAMANAYAKE
        </p>
        <h1 className="mt-3 text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] md:text-7xl">
          <span className="block overflow-hidden pb-1">
            <span className="line-up block" style={{ "--d": "0.45s" }}>Kulara</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="line-up block" style={{ "--d": "0.6s" }}>
              Ramanayake<span className="text-accent">.</span>
            </span>
          </span>
        </h1>
        <p className="reveal mt-5 text-lg font-light leading-snug text-fg/90 md:text-xl" style={{ "--d": "0.85s" }}>
          I don't just record moments.
          <br />I frame the feeling.
        </p>
        <p className="reveal mt-3 max-w-sm text-sm leading-relaxed text-fg/65" style={{ "--d": "1s" }}>
          Videographer &amp; photographer — weddings, events, aerial and nature, from Sri Lanka.
        </p>
        <div className="reveal mt-7 flex flex-wrap items-center gap-6" style={{ "--d": "1.15s" }}>
          <Magnetic>
          <a href="#work" data-cursor="PLAY" className="flex items-center gap-3 rounded-full bg-fg px-7 py-4 font-mono text-[11px] tracking-[0.2em] text-paper transition-transform hover:scale-105">
            ▶ WATCH SHOWREEL
          </a>
          </Magnetic>
          <Magnetic strength={0.25}>
          <button onClick={() => setAbout(true)} data-cursor="READ" className="border-b border-fg/60 pb-1 font-mono text-[11px] tracking-[0.2em] text-fg/90 hover:border-accent hover:text-accent">
            MY STORY →
          </button>
          </Magnetic>
        </div>
      </div>

      {/* bottom-left: scroll hint */}
      <div className="reveal absolute bottom-16 left-6 z-20 hidden items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-fg/70 md:left-12 md:flex" style={{ "--d": "1.4s" }}>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-fg/40"><span className="animate-bounce">↓</span></span>
        SCROLL TO EXPLORE · SCENE 01
      </div>

      {/* bottom-right: RAW / GRADED toggle */}
      <div className="reveal absolute bottom-16 right-6 z-20 flex flex-col items-end gap-2 md:right-12" style={{ "--d": "1.4s" }}>
        <span className="font-mono text-[10px] tracking-[0.2em] text-fg/70">TAP TO SEE THE GRADE</span>
        <Magnetic strength={0.25}>
        <button
          data-cursor="GRADE"
          onClick={toggleGrade}
          className="flex items-center gap-3 rounded-full border border-fg/40 bg-[var(--hero-edge)]/40 px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] backdrop-blur"
        >
          <span className={graded ? 'text-fg/50' : 'text-fg'}>RAW</span>
          <span className="relative h-4 w-8 rounded-full bg-fg/20">
            <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-accent transition-all duration-300 ${graded ? 'left-[18px]' : 'left-0.5'}`} />
          </span>
          <span className={graded ? 'text-fg' : 'text-fg/50'}>GRADED</span>
        </button>
        </Magnetic>
      </div>
      {/* film strip ticker along the bottom */}
      <FilmStrip />

      {/* "My story" panel (opened by the MY STORY button) */}
      <AboutPanel open={about} onClose={() => setAbout(false)} />
    </section>
  )
}
