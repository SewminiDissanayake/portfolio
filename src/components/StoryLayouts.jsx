// Poster-style layouts for an event story.
// Each layout gets: work, photos (array of paths), open(i) → opens photo i full screen.
import { useEffect, useRef, useState } from 'react'

const base = import.meta.env.BASE_URL

// fades in when scrolled into view
function useInView() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen]
}

function Photo({ src, alt, onClick, className = '', imgClass = '', style, delay = 0 }) {
  const [ref, seen] = useInView()
  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{ ...style, transitionDelay: `${delay}ms` }}
      className={`group relative block overflow-hidden transition-[opacity,transform] duration-1000 ease-out ${seen ? 'opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
      aria-label={`View ${alt} full screen`}
    >
      <img src={`${base}${src}`} alt={alt} loading="lazy" decoding="async" className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${imgClass}`} />
    </button>
  )
}

const pick = (photos, i) => photos[i % photos.length] // reuse photos if the event has only a few

// ─────────────────────────────────────────────────────────── 1. MAGAZINE
export function MagazineLayout({ work, photos, open }) {
  const alt = (i) => `${work.title} — photo ${(i % photos.length) + 1}`
  const rest = photos.slice(4)
  return (
    <div>
      {/* cover: full-bleed photo with the title printed over it */}
      <div className="relative h-[88vh] min-h-[520px] w-full overflow-hidden">
        <Photo src={pick(photos, 0)} alt={alt(0)} onClick={() => open(0)} className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-x-6 bottom-10 md:inset-x-12 md:bottom-14">
          <p className="font-mono text-[11px] tracking-[0.35em] text-paper/80">
            {work.category.toUpperCase()} · ISSUE {String(work.year).slice(2)}
          </p>
          <h2 className="mt-3 text-6xl font-extrabold leading-[0.88] tracking-[-0.05em] text-paper md:text-[9rem]">
            {work.title}
            <span className="text-accent">.</span>
          </h2>
        </div>
        <span className="pointer-events-none absolute right-6 top-6 font-display text-7xl italic text-paper/80 md:right-12 md:text-9xl">
          {String(photos.length).padStart(2, '0')}
        </span>
      </div>

      {/* asymmetric spread: tall photo + quote + wide photo */}
      <div className="grid gap-6 px-6 py-16 md:grid-cols-12 md:gap-10 md:px-12 md:py-24">
        <Photo src={pick(photos, 1)} alt={alt(1)} onClick={() => open(1 % photos.length)} className="aspect-[3/4] md:col-span-5 md:mt-24" />
        <div className="flex flex-col gap-10 md:col-span-7">
          <blockquote className="font-display text-3xl italic leading-tight text-paper md:text-5xl">
            <span className="text-accent">“</span>
            {work.story}
            <span className="text-accent">”</span>
          </blockquote>
          <dl className="grid grid-cols-3 gap-4 border-y border-paper/15 py-5 font-mono text-[10px] tracking-[0.2em]">
            <div><dt className="text-paper/45">PLACE</dt><dd className="mt-1">{work.location.toUpperCase()}</dd></div>
            <div><dt className="text-paper/45">YEAR</dt><dd className="mt-1">{work.year}</dd></div>
            <div><dt className="text-paper/45">ROLE</dt><dd className="mt-1">{work.role.toUpperCase()}</dd></div>
          </dl>
          <Photo src={pick(photos, 2)} alt={alt(2)} onClick={() => open(2 % photos.length)} className="aspect-[16/10]" delay={150} />
        </div>
      </div>

      {/* big closing photo with a side caption */}
      {photos.length > 3 && (
        <div className="grid gap-6 px-6 pb-16 md:grid-cols-12 md:items-end md:gap-10 md:px-12 md:pb-24">
          <Photo src={photos[3]} alt={alt(3)} onClick={() => open(3)} className="aspect-[16/9] md:col-span-9" />
          <p className="font-mono text-[10px] leading-relaxed tracking-[0.25em] text-paper/55 md:col-span-3">
            FRAME 04 —<br />
            {work.location.toUpperCase()}
            <br />
            {work.year}
          </p>
        </div>
      )}

      {/* any extra photos: simple two-column grid */}
      {rest.length > 0 && (
        <div className="grid gap-6 px-6 pb-16 md:grid-cols-2 md:px-12">
          {rest.map((p, i) => (
            <Photo key={p} src={p} alt={alt(i + 4)} onClick={() => open(i + 4)} className="aspect-[4/5]" delay={(i % 2) * 120} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────── 2. COLLAGE
// polaroid-style prints, scattered with a slight tilt and a strip of tape
const SPOTS = [
  { left: '4%', top: '6%', w: '38%', rot: -5 },
  { left: '46%', top: '0%', w: '30%', rot: 4 },
  { left: '70%', top: '30%', w: '27%', rot: -3 },
  { left: '30%', top: '44%', w: '36%', rot: 2.5 },
  { left: '2%', top: '58%', w: '26%', rot: 6 },
  { left: '68%', top: '66%', w: '28%', rot: -6 },
]

function Polaroid({ src, alt, onClick, rot, caption, delay }) {
  const [ref, seen] = useInView()
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group block w-full bg-[#f6efe4] p-2.5 pb-10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] transition-all duration-700 ease-out hover:z-20 hover:!rotate-0 hover:scale-[1.04] md:p-3 md:pb-14 ${seen ? 'opacity-100' : 'opacity-0'}`}
      style={{ transform: `rotate(${rot}deg) ${seen ? '' : 'translateY(30px)'}`, transitionDelay: `${delay}ms` }}
      aria-label={`View ${alt} full screen`}
    >
      {/* tape */}
      <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-3deg] bg-[#e8dcc4]/80 shadow-sm" />
      <img src={`${base}${src}`} alt={alt} loading="lazy" className="aspect-square w-full object-cover" />
      <span className="absolute bottom-3 left-0 right-0 text-center font-display text-lg italic text-[#2a120a] md:bottom-4 md:text-xl">{caption}</span>
    </button>
  )
}

export function CollageLayout({ work, photos, open }) {
  const items = photos.slice(0, SPOTS.length)
  const captions = [work.location, String(work.year), 'the moment', 'golden hour', 'together', 'the end']
  return (
    <div className="px-6 py-14 md:px-12 md:py-20">
      {/* poster heading */}
      <div className="text-center">
        <p className="font-mono text-[11px] tracking-[0.4em] text-accent">— {work.category.toUpperCase()} —</p>
        <h2 className="mx-auto mt-4 max-w-4xl font-display text-6xl italic leading-[0.95] text-paper md:text-8xl">{work.title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-paper/70">{work.story}</p>
      </div>

      {/* desktop: scattered prints on a board */}
      <div className="relative mx-auto mt-16 hidden max-w-6xl md:block" style={{ aspectRatio: items.length > 4 ? '16 / 11' : '16 / 8.5' }}>
        {items.map((p, i) => (
          <div key={p + i} className="absolute" style={{ left: SPOTS[i].left, top: SPOTS[i].top, width: SPOTS[i].w, zIndex: i }}>
            <Polaroid src={p} alt={`${work.title} — photo ${i + 1}`} onClick={() => open(i)} rot={SPOTS[i].rot} caption={captions[i]} delay={i * 120} />
          </div>
        ))}
      </div>

      {/* phone: a neat stack of slightly tilted prints */}
      <div className="mt-12 space-y-10 md:hidden">
        {items.map((p, i) => (
          <div key={p + i} className="relative mx-auto w-[85%]">
            <Polaroid src={p} alt={`${work.title} — photo ${i + 1}`} onClick={() => open(i)} rot={i % 2 ? 3 : -3} caption={captions[i]} delay={0} />
          </div>
        ))}
      </div>

      {photos.length > SPOTS.length && (
        <p className="mt-10 text-center font-mono text-[10px] tracking-[0.3em] text-paper/50">+ {photos.length - SPOTS.length} MORE — TAP ANY PRINT TO BROWSE ALL</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────── 3. FILM STRIP
export function FilmLayout({ work, photos, open }) {
  const strip = useRef(null)
  const scrollBy = (dir) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.7, behavior: 'smooth' })
  return (
    <div className="py-14 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6 px-6 md:px-12">
        <div>
          <p className="font-mono text-[11px] tracking-[0.35em] text-accent">● REEL 01 · {work.category.toUpperCase()}</p>
          <h2 className="mt-4 text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] text-paper md:text-8xl">
            {work.title}
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed text-paper/70">{work.story}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scrollBy(-1)} aria-label="Scroll left" className="grid h-12 w-12 place-items-center rounded-full border border-paper/30 hover:border-accent hover:text-accent">←</button>
          <button onClick={() => scrollBy(1)} aria-label="Scroll right" className="grid h-12 w-12 place-items-center rounded-full border border-paper/30 hover:border-accent hover:text-accent">→</button>
        </div>
      </div>

      {/* the film: sprocket holes top and bottom, frames scroll sideways */}
      <div className="film-reel mt-12 bg-black py-7">
        <div ref={strip} className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 [scrollbar-width:none] md:px-12">
          {photos.map((p, i) => (
            <div key={p + i} className="shrink-0 snap-center">
              <button onClick={() => open(i)} className="group block h-[55vh] min-h-[300px] overflow-hidden" aria-label={`View ${work.title} — photo ${i + 1}`}>
                <img src={`${base}${p}`} alt={`${work.title} — photo ${i + 1}`} loading="lazy" className="h-full w-auto max-w-none object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </button>
              <p className="mt-2 font-mono text-[10px] tracking-[0.3em] text-[#e0a85a]">
                {String(i + 1).padStart(2, '0')}A ▸ KR-{work.year}
              </p>
            </div>
          ))}
        </div>
      </div>

      <dl className="mt-10 grid grid-cols-3 gap-4 px-6 font-mono text-[10px] tracking-[0.2em] md:max-w-2xl md:px-12">
        <div><dt className="text-paper/45">PLACE</dt><dd className="mt-1">{work.location.toUpperCase()}</dd></div>
        <div><dt className="text-paper/45">YEAR</dt><dd className="mt-1">{work.year}</dd></div>
        <div><dt className="text-paper/45">ROLE</dt><dd className="mt-1">{work.role.toUpperCase()}</dd></div>
      </dl>
    </div>
  )
}

export const LAYOUTS = { magazine: MagazineLayout, collage: CollageLayout, film: FilmLayout }
