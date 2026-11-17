import { useEffect, useRef, useState } from 'react'
import { LAB, LAB_TYPES, STUDY } from '../data/lab'
import Magnetic from './Magnetic'

const base = import.meta.env.BASE_URL
const TYPE_LABEL = { rebranding: 'REBRANDING', film: 'SHORT FILM', videography: 'VIDEOGRAPHY', animation: 'ANIMATION' }

function youtubeEmbed(url) {
  const m = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&autoplay=1` : null
}

function useInView() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen]
}

// ───────────────────────────── cards
function Tag({ p }) {
  return <span className="font-mono text-[9px] tracking-[0.2em] text-fg/50">🎓 {p.module.toUpperCase()}</span>
}

function Card({ p, i, onOpen }) {
  const [ref, seen] = useInView()
  const wide = p.type === 'rebranding' || p.type === 'videography'
  return (
    <article
      ref={ref}
      className={`transition-all duration-1000 ease-out ${wide ? 'md:col-span-2' : ''} ${seen ? 'opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ transitionDelay: `${(i % 3) * 100}ms` }}
    >
      <button onClick={onOpen} className="group block w-full text-left" aria-label={`Open ${p.title}`}>
        {p.type === 'rebranding' ? <BrandPreview p={p} /> : <MediaPreview p={p} />}
        <div className="mt-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-accent">{TYPE_LABEL[p.type]} · {p.year}</p>
          <h3 className="mt-1.5 text-2xl font-extrabold leading-tight tracking-[-0.03em] transition-colors group-hover:text-accent">{p.title}</h3>
          <p className="mt-2 flex flex-wrap gap-x-3">
            <Tag p={p} />
            {p.runtime && <span className="font-mono text-[9px] tracking-[0.2em] text-fg/40">· {p.runtime.toUpperCase()}</span>}
          </p>
        </div>
      </button>
    </article>
  )
}

// film poster / video thumbnail / animation still
function MediaPreview({ p }) {
  const shape = p.type === 'film' ? 'aspect-[2/3]' : p.type === 'animation' ? 'aspect-square' : 'aspect-video'
  return (
    <div className={`relative overflow-hidden rounded-sm bg-fg/10 shadow-[0_20px_40px_-25px_rgba(42,18,10,0.6)] ${shape}`}>
      {p.loop ? (
        <video src={`${base}${p.loop}`} className="h-full w-full object-cover" autoPlay muted loop playsInline />
      ) : (
        <img
          src={`${base}${p.image}`}
          alt={p.title}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05] ${p.type === 'animation' ? 'lab-float' : ''}`}
        />
      )}
      {/* play button for films & videos */}
      {(p.type === 'film' || p.type === 'videography') && (
        <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center rounded-full bg-paper/90 text-lg text-fg opacity-0 shadow-xl transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
          ▶
        </span>
      )}
      {p.type === 'film' && (
        <span className="absolute left-3 top-3 rounded-sm bg-black/50 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-white backdrop-blur">● NOW SHOWING</span>
      )}
    </div>
  )
}

// rebranding: old → new logo with the colour palette underneath
function BrandPreview({ p }) {
  const b = p.brand
  return (
    <div className="overflow-hidden rounded-sm bg-paper shadow-[0_20px_40px_-25px_rgba(42,18,10,0.6)] ring-1 ring-fg/10">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3 md:gap-4 md:p-4">
        <div className="relative aspect-square overflow-hidden rounded-sm">
          <img src={`${base}${b.before}`} alt={`${p.title} — old logo`} loading="lazy" className="h-full w-full object-cover grayscale-[40%] transition duration-700 group-hover:grayscale-0" />
          <span className="absolute left-2 top-2 rounded-sm bg-black/50 px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-white">BEFORE</span>
        </div>
        <span className="font-mono text-xl text-accent transition-transform duration-500 group-hover:translate-x-1">→</span>
        <div className="relative aspect-square overflow-hidden rounded-sm">
          <img src={`${base}${b.after}`} alt={`${p.title} — new logo`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          <span className="absolute left-2 top-2 rounded-sm bg-accent px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-white">AFTER</span>
        </div>
      </div>
      <div className="flex h-12">
        {b.colors.map((c) => (
          <span key={c.hex} className="flex flex-1 items-end p-1.5 font-mono text-[8px] tracking-[0.1em] transition-[flex] duration-500 hover:flex-[2]" style={{ background: c.hex, color: lum(c.hex) > 0.6 ? '#2a120a' : '#f4ecdf' }}>
            {c.hex}
          </span>
        ))}
      </div>
    </div>
  )
}

// brightness of a hex colour (0–1), to pick readable text
function lum(hex) {
  const n = parseInt(hex.slice(1), 16)
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
}

// ───────────────────────────── viewer
function LogoCompare({ b, title }) {
  const [pos, setPos] = useState(50)
  const box = useRef(null)
  const drag = useRef(false)
  const move = (x) => {
    const r = box.current.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)))
  }
  return (
    <div
      ref={box}
      className="relative aspect-square w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-sm"
      onPointerDown={(e) => {
        drag.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        move(e.clientX)
      }}
      onPointerMove={(e) => drag.current && move(e.clientX)}
      onPointerUp={() => (drag.current = false)}
    >
      <img src={`${base}${b.after}`} alt={`${title} — new logo`} className="absolute inset-0 h-full w-full object-cover" draggable="false" />
      <img src={`${base}${b.before}`} alt={`${title} — old logo`} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable="false" />
      <span className="absolute left-3 top-3 rounded-sm bg-black/60 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-white">BEFORE</span>
      <span className="absolute right-3 top-3 rounded-sm bg-accent px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-white">AFTER</span>
      <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-sm text-black shadow-lg">↔</span>
      </div>
    </div>
  )
}

function Viewer({ p, onClose, onNext }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = old
    }
  }, [onClose])
  const yt = youtubeEmbed(p.video)

  return (
    <div className="lightbox-in fixed inset-0 z-[70] overflow-y-auto bg-[#120806] text-paper" role="dialog" aria-modal="true" aria-label={p.title}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-paper/10 bg-[#120806]/90 px-6 py-4 font-mono text-[11px] tracking-[0.25em] backdrop-blur md:px-12">
        <span className="text-paper/60">
          <span className="text-accent">●</span> THE LAB · {TYPE_LABEL[p.type]}
        </span>
        <button onClick={onClose} className="rounded-full border border-paper/30 px-4 py-2 hover:border-accent hover:text-accent">CLOSE ✕</button>
      </div>

      <div key={p.id} className="px-6 py-12 md:px-12 md:py-16">
        {/* title block */}
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-mono text-[11px] tracking-[0.3em] text-accent">🎓 {p.module.toUpperCase()}</p>
            <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-7xl">
              {p.title}
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-paper/75">{p.summary}</p>
          </div>
          <dl className="grid grid-cols-3 gap-4 font-mono text-[10px] tracking-[0.2em] md:col-span-4">
            <div><dt className="text-paper/45">ROLE</dt><dd className="mt-1">{p.role.toUpperCase()}</dd></div>
            <div><dt className="text-paper/45">YEAR</dt><dd className="mt-1">{p.year}</dd></div>
            {p.runtime && <div><dt className="text-paper/45">LENGTH</dt><dd className="mt-1">{p.runtime.toUpperCase()}</dd></div>}
          </dl>
        </div>

        {/* body */}
        {p.type === 'rebranding' ? (
          <div className="mt-12 space-y-10">
            <div className="grid gap-8 md:grid-cols-12">
              <div className="md:col-span-6">
                <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-paper/50">LOGO · DRAG TO COMPARE</p>
                <LogoCompare b={p.brand} title={p.title} />
              </div>
              <div className="space-y-8 md:col-span-6">
                <div>
                  <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-paper/50">COLOUR PALETTE</p>
                  <div className="grid grid-cols-2 gap-3">
                    {p.brand.colors.map((c) => (
                      <div key={c.hex} className="overflow-hidden rounded-sm ring-1 ring-paper/10">
                        <div className="h-24" style={{ background: c.hex }} />
                        <div className="flex justify-between bg-paper/5 px-3 py-2 font-mono text-[10px] tracking-[0.15em]">
                          <span>{c.name.toUpperCase()}</span>
                          <span className="text-paper/50">{c.hex}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-paper/50">TYPOGRAPHY</p>
                  {p.brand.fonts.map((f, i) => (
                    <p key={f} className={`border-b border-paper/10 py-3 ${i === 0 ? 'text-3xl font-extrabold' : 'font-display text-3xl italic'}`}>
                      {f} <span className="ml-2 font-mono text-[10px] not-italic tracking-[0.2em] text-paper/40">Aa Bb 123</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.3em] text-paper/50">MOCKUPS</p>
              <div className="grid gap-4 md:grid-cols-3">
                {p.brand.mockups.map((m, i) => (
                  <img key={m} src={`${base}${m}`} alt={`${p.title} — mockup ${i + 1}`} loading="lazy" className={`w-full rounded-sm object-cover ${i === 0 ? 'md:col-span-2 md:row-span-2 md:h-full' : 'aspect-[16/11]'}`} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12">
            <div className={`mx-auto overflow-hidden rounded-sm bg-black ${p.type === 'animation' && !p.video ? 'aspect-square max-w-xl' : 'aspect-video'}`}>
              {yt ? (
                <iframe src={yt} title={p.title} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
              ) : p.video ? (
                <video src={`${base}${p.video}`} className="h-full w-full" controls autoPlay playsInline />
              ) : p.loop ? (
                <video src={`${base}${p.loop}`} className="h-full w-full object-cover" autoPlay muted loop playsInline />
              ) : (
                <div className="relative h-full w-full">
                  <img src={`${base}${p.image}`} alt={p.title} className="h-full w-full object-contain opacity-60" />
                  <span className="absolute inset-0 grid place-items-center font-mono text-[11px] tracking-[0.3em] text-paper/80">▶ FILM LINK COMING SOON</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <button onClick={onNext} className="group flex w-full items-center justify-between border-t border-paper/10 px-6 py-12 text-left md:px-12">
        <span>
          <span className="block font-mono text-[10px] tracking-[0.3em] text-paper/50">NEXT PROJECT</span>
          <span className="mt-2 block text-3xl font-extrabold tracking-[-0.03em] transition-colors group-hover:text-accent md:text-5xl">Keep exploring →</span>
        </span>
      </button>
    </div>
  )
}

// ───────────────────────────── section
export default function Lab() {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)
  const shown = filter === 'all' ? LAB : LAB.filter((p) => p.type === filter)
  const count = (k) => (k === 'all' ? LAB.length : LAB.filter((p) => p.type === k).length)

  return (
    <section id="lab" className="lab-grid relative bg-paper px-6 py-24 text-fg md:px-12 md:py-32">
      <div className="mb-12 grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-fg/70">
            <span className="h-2 w-2 rounded-full bg-accent" /> 05 — THE LAB
          </p>
          <h2 className="mt-5 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Still learning, <em className="font-display font-medium italic text-accent">always making.</em>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-fg/65">
            Rebrands, short films, video and animation from my degree — the place where I try new things before taking them to clients.
          </p>
        </div>
        {/* currently studying badge */}
        <div className="md:col-span-4 md:justify-self-end">
          <div className="inline-flex items-center gap-3 rounded-full border border-fg/15 bg-paper/80 px-5 py-3 backdrop-blur">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3ecf6a] opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#3ecf6a]" />
            </span>
            <span className="font-mono text-[10px] leading-relaxed tracking-[0.2em]">
              CURRENTLY STUDYING
              <span className="block text-fg/55">{STUDY.degree.toUpperCase()} · {STUDY.year.toUpperCase()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="mb-12 flex flex-wrap gap-2" role="tablist" aria-label="Filter lab projects">
        {LAB_TYPES.map((t) => (
          <Magnetic key={t.key} strength={0.2}>
            <button
              role="tab"
              aria-selected={filter === t.key}
              onClick={() => setFilter(t.key)}
              className={`rounded-full border px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] transition-colors duration-300 ${
                filter === t.key ? 'border-fg bg-fg text-paper' : 'border-fg/20 bg-paper/60 text-fg/70 hover:border-fg/60 hover:text-fg'
              }`}
            >
              {t.label.toUpperCase()} <span className={filter === t.key ? 'text-accent' : 'text-fg/40'}>{String(count(t.key)).padStart(2, '0')}</span>
            </button>
          </Magnetic>
        ))}
      </div>

      <div key={filter} className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-4">
        {shown.map((p, i) => (
          <Card key={p.id} p={p} i={i} onOpen={() => setOpen(i)} />
        ))}
        {/* "still learning" tile at the end */}
        <div className="flex min-h-[260px] flex-col justify-between rounded-sm border border-dashed border-fg/25 p-6 md:col-span-2">
          <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-fg/50">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> IN PROGRESS
          </p>
          <div>
            <p className="font-display text-4xl italic leading-tight md:text-5xl">Next experiment loading…</p>
            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-fg/10">
              <span className="lab-loading block h-full w-1/3 rounded-full bg-accent" />
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-fg/50">{STUDY.degree.toUpperCase()} · {STUDY.year.toUpperCase()}</p>
          </div>
        </div>
      </div>

      {open !== null && <Viewer p={shown[open]} onClose={() => setOpen(null)} onNext={() => setOpen((open + 1) % shown.length)} />}
    </section>
  )
}
