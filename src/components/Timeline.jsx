import { useEffect, useRef, useState } from 'react'

// Editing-timeline dock fixed to the bottom of the page.
// Every section is a "clip" on the V1 track; the red playhead follows the scroll.
// Click a clip to jump, drag on the track to scrub, ▶ plays the page like a video.

const CLIPS = [
  { id: 'top',      label: 'INTRO',    short: 'IN',  color: '#c9a27a' },
  { id: 'work',     label: 'WORK',     short: 'WK',  color: '#d07a4c' },
  { id: 'aerial',   label: 'AERIAL',   short: 'AE',  color: '#9db58c' },
  { id: 'media',    label: 'MEDIA',    short: 'MD',  color: '#d9574a' },
  { id: 'lab',      label: 'THE LAB',  short: 'LB',  color: '#7f9fb8' },
  { id: 'services', label: 'SERVICES', short: 'SV',  color: '#dbb76f' },
  { id: 'contact',  label: 'CONTACT',  short: 'CT',  color: '#5fae7a' },
]

const RUNTIME = 180 // the whole page pretends to be a 3-minute film
const FPS = 25
const WAVE = Array.from({ length: 140 }, (_, i) =>
  0.25 + 0.75 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11) + Math.sin(i * 1.7) * 0.25))

function timecode(p) {
  const f = Math.floor(p * RUNTIME * FPS)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(f / (FPS * 3600)))}:${pad(Math.floor(f / (FPS * 60)) % 60)}:${pad(Math.floor(f / FPS) % 60)}:${pad(f % FPS)}`
}

export default function Timeline() {
  const [clips, setClips] = useState([])     // [{...clip, start, size}] as fractions of the page
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const [playing, setPlaying] = useState(false)
  const progress = useRef(0)
  const dock = useRef(null)
  const track = useRef(null)
  const lane = useRef(null)
  const tc = useRef(null)
  const playingRef = useRef(false)

  // Measure where each section sits on the page (re-measure as images load / window resizes).
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - innerHeight
      if (max <= 0) return
      const found = CLIPS.map((c) => ({ ...c, el: document.getElementById(c.id) })).filter((c) => c.el)
      setClips(found.map((c, i) => {
        const top = Math.max(0, c.el.offsetTop)
        const next = found[i + 1] ? found[i + 1].el.offsetTop : max + innerHeight
        const start = Math.min(1, top / max)
        const end = Math.min(1, Math.min(next, max + innerHeight) / max)
        return { id: c.id, label: c.label, short: c.short, color: c.color, start, size: Math.max(0.02, end - start) }
      }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => ro.disconnect()
  }, [])

  // Follow the scroll: move the playhead, update the timecode, show/hide the dock.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
      progress.current = p
      dock.current?.style.setProperty('--p', p)
      if (tc.current) tc.current.textContent = timecode(p)
      const nearEnd = scrollY > max - 140
      setVisible(scrollY > innerHeight * 0.6 && !nearEnd)
      const mid = (scrollY + innerHeight * 0.4) / Math.max(1, max)
      let a = 0
      clips.forEach((c, i) => { if (mid >= c.start) a = i })
      setActive(a)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [clips])

  // ▶ play: scroll the page slowly like playback. Any wheel/touch/key from the visitor stops it.
  useEffect(() => {
    playingRef.current = playing
    if (!playing) return
    let raf = 0, last = performance.now()
    const step = (now) => {
      const dt = Math.min(64, now - last); last = now
      const max = document.documentElement.scrollHeight - innerHeight
      if (scrollY >= max - 2) { setPlaying(false); return }
      scrollBy(0, dt * 0.12) // ~120px per second
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const stop = () => setPlaying(false)
    addEventListener('wheel', stop, { passive: true })
    addEventListener('touchstart', stop, { passive: true })
    addEventListener('keydown', stop)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('wheel', stop); removeEventListener('touchstart', stop); removeEventListener('keydown', stop)
    }
  }, [playing])

  // Scrub: press and drag anywhere on the track.
  const scrubTo = (clientX) => {
    const r = lane.current.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    scrollTo({ top: p * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' })
  }
  const onPointerDown = (e) => {
    setPlaying(false)
    e.currentTarget.setPointerCapture(e.pointerId)
    scrubTo(e.clientX)
  }
  const onPointerMove = (e) => { if (e.buttons === 1) scrubTo(e.clientX) }

  const jump = (id) => {
    setPlaying(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      ref={dock}
      className={`timeline-dock fixed inset-x-0 bottom-0 z-[60] px-2 pb-2 transition-all duration-500 md:px-4 md:pb-3 ${visible || playing ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'}`}
      style={{ '--p': 0 }}
      aria-label="Page timeline"
    >
      <div className="mx-auto flex max-w-[1180px] items-stretch gap-2 rounded-xl border border-white/10 bg-[#141010]/90 p-1.5 text-[#f4ecdf] shadow-[0_20px_60px_-20px_rgba(0,0,0,.7)] backdrop-blur-md md:gap-3 md:p-2">
        {/* transport */}
        <div className="flex shrink-0 items-center gap-2 pl-1 md:gap-3 md:pl-2">
          <button
            onClick={() => setPlaying((v) => !v)}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#f4ecdf] text-[#141010] transition hover:scale-105"
            aria-label={playing ? 'Pause' : 'Play the page'}
            title={playing ? 'Pause' : 'Play the page'}
          >
            {playing
              ? <svg width="10" height="12" viewBox="0 0 10 12"><rect width="3" height="12" fill="currentColor" /><rect x="7" width="3" height="12" fill="currentColor" /></svg>
              : <svg width="10" height="12" viewBox="0 0 10 12"><path d="M0 0l10 6-10 6z" fill="currentColor" /></svg>}
          </button>
          <div className="hidden flex-col leading-none sm:flex">
            <span ref={tc} className="font-mono text-[13px] tabular-nums tracking-wider text-[#ff5a4a]">00:00:00:00</span>
            <span className="mt-1 font-mono text-[9px] tracking-[0.25em] text-white/40">KULARA_PORTFOLIO.prproj</span>
          </div>
        </div>

        {/* tracks */}
        <div
          ref={track}
          className="relative min-w-0 flex-1 cursor-ew-resize touch-none select-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
        >
          {/* V1 — sections as clips */}
          <div className="relative flex h-6 items-stretch gap-[2px] md:h-7">
            <span className="mr-1 hidden w-6 shrink-0 items-center font-mono text-[9px] text-white/40 md:flex">V1</span>
            <div ref={lane} className="relative flex-1">
              {clips.map((c, i) => (
                <button
                  key={c.id}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => jump(c.id)}
                  className={`absolute inset-y-0 overflow-hidden rounded-[3px] border px-1.5 text-left font-mono text-[9px] font-semibold tracking-wider text-[#141010] transition md:text-[10px] ${i === active ? 'border-white/90 brightness-110' : 'border-black/30 opacity-75 hover:opacity-100'}`}
                  style={{ left: `${c.start * 100}%`, width: `calc(${c.size * 100}% - 2px)`, background: c.color }}
                  title={`Jump to ${c.label}`}
                >
                  <span className="hidden truncate sm:inline">{c.label}</span>
                  <span className="sm:hidden">{c.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* A1 — decorative waveform, lit up to the playhead */}
          <div className="mt-1 flex h-4 items-center md:h-5">
            <span className="mr-1 hidden w-6 shrink-0 font-mono text-[9px] text-white/40 md:block">A1</span>
            <div className="relative h-full flex-1 overflow-hidden rounded-[3px] bg-white/[0.04]">
              <Wave className="text-white/20" />
              <div className="absolute inset-0" style={{ clipPath: 'inset(0 calc((1 - var(--p)) * 100%) 0 0)' }}>
                <Wave className="text-[#9db58c]" />
              </div>
            </div>
          </div>

          {/* playhead */}
          <div className="pointer-events-none absolute inset-y-[-4px] left-0 right-0 md:left-7">
            <div className="absolute inset-y-0 w-px bg-[#ff5a4a]" style={{ left: 'calc(var(--p) * 100%)' }}>
              <span className="absolute -left-[5px] -top-[3px] h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-[#ff5a4a]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Wave({ className }) {
  return (
    <div className={`absolute inset-0 flex items-center gap-[1px] ${className}`}>
      {WAVE.map((h, i) => (
        <span key={i} className="flex-1 rounded-full bg-current" style={{ height: `${h * 100}%` }} />
      ))}
    </div>
  )
}
