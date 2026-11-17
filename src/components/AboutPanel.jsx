import { useEffect, useRef, useState } from 'react'
import { ABOUT } from '../data/about'
import { WHATSAPP } from '../data/services'

const base = import.meta.env.BASE_URL

// The small "About me" card that sits on the hero. Clicking it opens the panel.
export function AboutCard({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="hero-about-card reveal group absolute left-12 top-28 z-20 items-center gap-5 rounded-full border border-fg/15 bg-paper/55 py-2 pl-2 pr-5 text-left shadow-[0_15px_30px_-20px_rgba(42,18,10,0.6)] backdrop-blur-md transition-colors hover:border-accent/60"
      style={{ '--d': '1.3s' }}
      aria-label="Open About me"
    >
      <span className="h-11 w-11 overflow-hidden rounded-full bg-fg/10 ring-2 ring-accent/50">
        <img src={`${base}${ABOUT.awards[0].photo}`} alt="" className="h-full w-full object-cover object-top" />
      </span>
      {ABOUT.facts.map((f, i) => (
        <span key={f.label} className={`flex items-baseline gap-1.5 ${i > 0 ? 'border-l border-fg/15 pl-5' : ''}`}>
          <span className="text-lg font-extrabold tracking-[-0.02em]">{f.value}</span>
          <span className="font-mono text-[9px] tracking-[0.18em] text-fg/60">{f.label.toUpperCase()}</span>
        </span>
      ))}
      <span className="ml-1 grid h-8 w-8 place-items-center rounded-full bg-fg text-xs text-paper transition-transform group-hover:translate-x-1">→</span>
    </button>
  )
}

// timeline row that appears when scrolled into view (inside the panel)
function Milestone({ m, i, root }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { root: root.current, threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [root])
  const dot =
    m.status === 'award' ? 'bg-accent text-white' : m.status === 'now' ? 'bg-[#3ecf6a] text-white' : 'bg-fg text-paper'
  return (
    <li ref={ref} className={`relative pb-9 pl-12 transition-all duration-700 ${seen ? 'opacity-100' : 'translate-x-4 opacity-0'}`} style={{ transitionDelay: `${i * 80}ms` }}>
      <span className={`absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full text-[11px] ${dot}`}>
        {m.status === 'award' ? '🏆' : m.status === 'now' ? '●' : '✓'}
      </span>
      <p className="font-mono text-[10px] tracking-[0.3em] text-accent">{m.year}</p>
      <h4 className="mt-1 text-xl font-extrabold leading-tight tracking-[-0.02em]">{m.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-fg/65">{m.text}</p>
      {m.progress != null && (
        <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-fg/10">
          <span className="block h-full rounded-full bg-[#3ecf6a] transition-[width] delay-300 duration-[1400ms] ease-out" style={{ width: seen ? `${m.progress * 100}%` : '0%' }} />
        </div>
      )}
    </li>
  )
}

// Slide-in "My story" panel
export default function AboutPanel({ open, onClose }) {
  const scroller = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    scroller.current?.scrollTo({ top: 0 })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = old
    }
  }, [open])

  const go = (hash) => {
    onClose()
    setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 350)
  }

  return (
    <div className={`fixed inset-0 z-[75] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* backdrop */}
      <div onClick={onClose} className={`absolute inset-0 bg-[#1a0c07]/50 backdrop-blur-sm transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`} />

      {/* panel */}
      <aside
        ref={scroller}
        role="dialog"
        aria-modal="true"
        aria-label="About Kulara"
        className={`absolute inset-y-0 right-0 w-full max-w-2xl overflow-y-auto bg-paper text-fg shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-fg/10 bg-paper/90 px-6 py-4 font-mono text-[11px] tracking-[0.25em] backdrop-blur md:px-10">
          <span className="text-fg/60"><span className="text-accent">●</span> 07 — ABOUT ME</span>
          <button onClick={onClose} className="rounded-full border border-fg/25 px-4 py-2 hover:border-accent hover:text-accent">CLOSE ✕</button>
        </div>

        {/* header: photo + intro */}
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_70%_30%,#fbf5ec,#e6d6bc)] px-6 pt-10 md:px-10">
          <div className="grid items-end gap-6 sm:grid-cols-[1fr_auto]">
            <div className="pb-10">
              <h2 className="text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] md:text-6xl">
                Hi, I'm <span className="font-display font-medium italic text-accent">Kulara.</span>
              </h2>
              <p className="mt-4 font-mono text-[10px] tracking-[0.25em] text-fg/60">VIDEOGRAPHER · PHOTOGRAPHER · EDITOR</p>
            </div>
            <img src={`${base}${ABOUT.photo}`} alt="Kulara Ramanayake" className="mx-auto h-72 w-auto object-contain sm:h-80" />
          </div>
        </div>

        <div className="space-y-14 px-6 py-12 md:px-10">
          {/* bio */}
          <div className="space-y-4 text-lg font-light leading-relaxed text-fg/85">
            {ABOUT.bio.map((t, i) => (
              <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-accent' : ''}>{t}</p>
            ))}
          </div>

          {/* facts */}
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-fg/10 sm:grid-cols-4">
            {ABOUT.facts.map((f) => (
              <div key={f.label} className="bg-paper p-4">
                <p className="text-3xl font-extrabold tracking-[-0.03em]">{f.value}</p>
                <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-fg/55">{f.label.toUpperCase()}</p>
              </div>
            ))}
          </div>

          {/* journey */}
          <div>
            <p className="mb-6 font-mono text-[11px] tracking-[0.3em] text-fg/55">THE JOURNEY</p>
            <ol className="relative">
              <span className="absolute bottom-10 left-4 top-2 w-px bg-fg/15" />
              {ABOUT.journey.map((m, i) => (
                <Milestone key={m.title} m={m} i={i} root={scroller} />
              ))}
            </ol>
          </div>

          {/* awards */}
          <div>
            <p className="mb-5 font-mono text-[11px] tracking-[0.3em] text-fg/55">AWARDS</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {ABOUT.awards.map((a) => (
                <div key={a.title} className="overflow-hidden rounded-sm bg-[#120d0b] text-[#f4ecdf]">
                  <div className="aspect-[4/3] overflow-hidden">
                    {a.photo ? (
                      <img src={`${base}${a.photo}`} alt={a.title} className="h-full w-full object-cover object-top" />
                    ) : (
                      <div className="grid h-full place-items-center border-b border-dashed border-white/15 text-5xl">🏆</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-display text-2xl italic leading-tight">{a.title}</p>
                    <p className="mt-1 text-xs text-white/55">{a.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* tools */}
          <div>
            <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-fg/55">TOOLS & SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {ABOUT.tools.map((t) => (
                <span key={t} className="rounded-full border border-fg/20 px-4 py-2 text-sm">{t}</span>
              ))}
            </div>
          </div>

          {/* call to action */}
          <div className="flex flex-wrap gap-3 border-t border-fg/10 pt-8">
            <button onClick={() => go('#services')} className="rounded-full bg-fg px-6 py-3.5 font-mono text-[11px] tracking-[0.2em] text-paper hover:bg-accent">SEE SERVICES →</button>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="rounded-full bg-[#25d366] px-6 py-3.5 font-mono text-[11px] font-bold tracking-[0.2em] text-[#06210f]">💬 WHATSAPP</a>
            <button onClick={() => go('#work')} className="rounded-full border border-fg/25 px-6 py-3.5 font-mono text-[11px] tracking-[0.2em] hover:border-accent hover:text-accent">VIEW WORK</button>
          </div>
        </div>
      </aside>
    </div>
  )
}
