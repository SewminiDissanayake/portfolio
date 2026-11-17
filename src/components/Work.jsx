import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, WORKS } from '../data/works'
import EventStory from './EventStory'
import Magnetic from './Magnetic'
import CameraDial from './CameraDial'

const base = import.meta.env.BASE_URL

// Fades a card in when it scrolls into view
function useInView() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen]
}

function WorkCard({ work, index, onOpen }) {
  const [ref, seen] = useInView()
  const video = useRef(null)

  // hover-to-play preview (only if the project has a clip)
  const play = () => video.current?.play().catch(() => {})
  const stop = () => {
    if (!video.current) return
    video.current.pause()
    video.current.currentTime = 0
  }

  return (
    <article
      ref={ref}
      className={`mb-8 break-inside-avoid transition-all duration-1000 ease-out md:mb-10 ${
        seen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      style={{ transitionDelay: `${(index % 2) * 120}ms` }}
    >
      <button
        onClick={onOpen}
        onMouseEnter={play}
        onMouseLeave={stop}
        className="group relative block w-full overflow-hidden rounded-sm text-left"
        aria-label={`Open ${work.title}`}
      >
        <img
          src={`${base}${work.image}`}
          alt={work.title}
          loading="lazy"
          className="w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        {work.preview && (
          <video
            ref={video}
            src={`${base}${work.preview}`}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {/* hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140906]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute right-5 top-5 grid h-14 w-14 scale-75 place-items-center rounded-full bg-paper font-mono text-[10px] tracking-[0.15em] text-fg opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
          {work.preview ? '▶' : 'OPEN'}
        </span>
      </button>

      {/* caption */}
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-accent">
            {String(index + 1).padStart(2, '0')} — {work.category.toUpperCase()}
          </p>
          <h3 className="mt-1.5 text-2xl font-extrabold tracking-[-0.03em]">{work.title}</h3>
        </div>
        <p className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-fg/50">
          {work.location.toUpperCase()} · {work.year}
          <span className="mt-1 block text-right text-fg/35">{work.photos?.length || 1} PHOTOS{work.video ? ' · FILM' : ''}</span>
        </p>
      </div>
    </article>
  )
}

export default function Work() {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(null) // index of the event story that is open
  const gridRef = useRef(null)

  const shown = filter === 'All' ? WORKS : WORKS.filter((w) => w.category === filter)
  const count = (c) => (c === 'All' ? WORKS.length : WORKS.filter((w) => w.category === c).length)

  return (
    <section id="work" className="relative bg-paper px-6 py-24 text-fg md:px-12 md:py-32">
      {/* header */}
      <div className="mb-6 grid gap-8 md:mb-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-fg/70">
            <span className="h-2 w-2 rounded-full bg-accent" /> 02 — SELECTED WORK
          </p>
          <h2 className="mt-5 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Moments, <em className="font-display font-medium italic text-accent">framed.</em>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-fg/65 md:text-right">
          Turn the dial — pick a mode. Weddings, events, the island from above, portraits and the quiet in between.
        </p>
      </div>

      {/* camera mode dial: pick a category */}
      <CameraDial
        categories={CATEGORIES.filter((c) => c !== 'All')}
        counts={Object.fromEntries(CATEGORIES.map((c) => [c, count(c)]))}
        active={filter}
        onPick={(c) => {
          setFilter(c)
          setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 900)
        }}
      />

      {/* what is showing + a way back to everything */}
      <div ref={gridRef} className="mb-10 mt-6 flex scroll-mt-8 flex-wrap items-end justify-between gap-4 border-b border-fg/15 pb-5 md:mb-14">
        <h3 className="text-3xl font-extrabold tracking-[-0.03em] md:text-5xl">
          {filter === 'All' ? 'All stories' : filter}
          <span className="ml-3 font-mono text-sm font-normal tracking-[0.2em] text-accent">{String(shown.length).padStart(2, '0')}</span>
        </h3>
        {filter !== 'All' && (
          <Magnetic strength={0.2}>
            <button onClick={() => setFilter('All')} className="rounded-full border border-fg/25 px-5 py-2.5 font-mono text-[11px] tracking-[0.2em] text-fg/70 hover:border-fg hover:text-fg">
              ← SHOW ALL
            </button>
          </Magnetic>
        )}
      </div>

      {/* masonry grid (the key makes the cards animate in again after a filter change) */}
      <div key={filter} className="columns-1 gap-8 md:columns-2 md:gap-10">
        {shown.map((w, i) => (
          <WorkCard key={w.id} work={w} index={i} onOpen={() => setOpen(i)} />
        ))}
      </div>

      {open !== null && (
        <EventStory work={shown[open]} onClose={() => setOpen(null)} onNext={() => setOpen((open + 1) % shown.length)} />
      )}
    </section>
  )
}
