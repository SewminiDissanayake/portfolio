import { useEffect, useRef, useState } from 'react'
import { CONTACT } from '../data/contact'
import { WHATSAPP } from '../data/services'

const base = import.meta.env.BASE_URL

// Full-screen menu opened by the hamburger in the hero.
// Each link has a preview photo that shows on hover (desktop).
const LINKS = [
  { no: '02', label: 'Work', id: 'work', note: 'Weddings · events · shoots', img: 'work/sample-wedding-1.webp' },
  { no: '03', label: 'Aerial', id: 'aerial', note: 'Sri Lanka from above', img: 'work/aerial-01.webp' },
  { no: '04', label: 'Media', id: 'media', note: 'Media Unit · promotions', img: 'media/media-01.webp' },
  { no: '05', label: 'The Lab', id: 'lab', note: 'University projects', img: 'lab/brand-mock-01.webp' },
  { no: '06', label: 'Services', id: 'services', note: 'Packages & booking', img: 'work/photoshoot-01.webp' },
  { no: '07', label: 'Contact', id: 'contact', note: "Let's talk", img: 'work/nature-01.webp' },
  { no: '✦', label: 'My Story', id: 'story', note: 'About Kulara', img: 'photo2-graded.webp' },
]

function useColomboTime() {
  const fmt = () => new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit' })
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 10000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function MenuOverlay({ open, onClose, onStory }) {
  const [hover, setHover] = useState(0)
  const time = useColomboTime()
  const closeRef = useRef(onClose)
  closeRef.current = onClose // keep the latest without re-running the effect below

  // Esc closes, and the page behind can't scroll while the menu is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    addEventListener('keydown', onKey)
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      removeEventListener('keydown', onKey)
      document.body.style.overflow = old
    }
  }, [open])

  const go = (link) => {
    if (link.id === 'story') return onStory()
    onClose()
    // wait one frame so the page can scroll again, then glide to the section
    requestAnimationFrame(() => document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }))
  }

  return (
    <div
      className={`menu-overlay fixed inset-0 z-[72] overflow-y-auto bg-[#1a0e09] text-[#f4ecdf] ${open ? 'is-open' : 'pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_85%_10%,rgba(176,83,42,.22),transparent_70%)]" />

      <div className="relative flex min-h-full flex-col px-6 py-6 md:px-10 md:py-8">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl italic">KR<span className="text-[#e08a5c]">.</span></span>
          <button
            onClick={onClose}
            className="group flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-white/70 hover:text-white"
          >
            CLOSE
            <span className="grid h-14 w-14 place-items-center rounded-full ring-1 ring-white/20 transition group-hover:rotate-90 group-hover:ring-white/60">
              <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6"><path d="M2 2l12 12M14 2L2 14" /></svg>
            </span>
          </button>
        </div>

        <div className="mt-10 grid flex-1 items-center gap-12 md:mt-6 md:grid-cols-[1.3fr_1fr]">
          {/* links */}
          <nav>
            <ul>
              {LINKS.map((l, i) => (
                <li key={l.id} className="menu-item border-b border-white/10" style={{ '--i': i }}>
                  <button
                    onClick={() => go(l)}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    className="group flex w-full items-baseline gap-4 py-3 text-left md:gap-6 md:py-[1.4vh]"
                  >
                    <span className="w-6 font-mono text-[11px] text-white/40">{l.no}</span>
                    <span className={`text-4xl font-extrabold tracking-[-0.03em] transition-all duration-500 md:text-[clamp(2.5rem,6.2vh,3.75rem)] ${hover === i ? 'md:translate-x-3' : ''} group-hover:text-[#e08a5c]`}>
                      {l.label}
                    </span>
                    <span className="ml-auto hidden font-mono text-[10px] tracking-[0.2em] text-white/40 transition group-hover:text-white/80 sm:inline">
                      {l.note.toUpperCase()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* preview + contact (desktop) */}
          <aside className="hidden md:block">
            <div className="relative aspect-[4/5] max-h-[52vh] w-full overflow-hidden rounded-sm ring-1 ring-white/10">
              {LINKS.map((l, i) => (
                <img
                  key={l.id}
                  src={base + l.img}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${hover === i ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
                />
              ))}
              <div className="absolute inset-x-0 top-0 flex justify-between p-3 font-mono text-[10px] tracking-[0.2em] text-white/90">
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e5212b]" /> PREVIEW</span>
                <span>{LINKS[hover].no}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="font-display text-3xl italic">{LINKS[hover].label}</p>
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/70">{LINKS[hover].note.toUpperCase()}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* bottom row */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#25d366] px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.2em] text-[#0b2a17] transition hover:brightness-110"
            >
              💬 WHATSAPP
            </a>
            <a href={`mailto:${CONTACT.email}`} className="font-mono text-[11px] tracking-[0.15em] text-white/70 hover:text-white">
              {CONTACT.email}
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {CONTACT.socials.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer"
                className="rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/70 ring-1 ring-white/15 hover:text-white hover:ring-white/50">
                {s.name.toUpperCase()} ↗
              </a>
            ))}
          </div>
          <p className="w-full font-mono text-[10px] tracking-[0.25em] text-white/40 md:w-auto">
            MATALE, SRI LANKA · {time} LOCAL
          </p>
        </div>
      </div>
    </div>
  )
}
