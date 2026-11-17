import { useEffect, useRef, useState } from 'react'
import { MEDIA_UNIT, PROMOTIONS } from '../data/media'
import Magnetic from './Magnetic'

const base = import.meta.env.BASE_URL

// ───────────────────────────── helpers
function useInView(threshold = 0.3) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen]
}

// short numbers: 48000 → 48K, 1200000 → 1.2M
function short(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '')}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e5 ? 0 : 1).replace(/\.0$/, '')}K`
  return String(Math.round(n))
}

// counts from 0 to `to` when `start` turns true; `live` keeps adding slowly afterwards
function useCount(to, start, live = false) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1800)
      setN(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    let id
    if (live) id = setInterval(() => setN((v) => v + Math.ceil(Math.random() * 3)), 2600)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(id)
    }
  }, [to, start, live])
  return n
}

function useTimecode() {
  const [t, setT] = useState(0)
  useEffect(() => {
    const s = performance.now()
    const id = setInterval(() => setT((performance.now() - s) / 1000), 40)
    return () => clearInterval(id)
  }, [])
  return [Math.floor(t / 3600), Math.floor(t / 60) % 60, Math.floor(t) % 60, Math.floor((t % 1) * 25)].map((n) => String(n).padStart(2, '0')).join(':')
}

// a monitor's picture: a muted looping video if there is one, else the photo with a slow zoom
function Picture({ item, kenburns = true, className = '' }) {
  if (item.video) return <video src={`${base}${item.video}`} className={`h-full w-full object-cover ${className}`} autoPlay muted loop playsInline />
  return <img src={`${base}${item.image}`} alt={item.title || item.client} className={`h-full w-full object-cover ${kenburns ? 'kenburns' : ''} ${className}`} />
}

// ───────────────────────────── MEDIA UNIT: broadcast control room
function Stat({ s, start }) {
  const n = useCount(s.value, start, s.live)
  return (
    <div className="border-l border-paper/15 pl-5">
      <p className="text-4xl font-extrabold tracking-[-0.03em] tabular-nums md:text-5xl">
        {short(n)}
        <span className="text-accent">{s.suffix}</span>
      </p>
      <p className="mt-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-paper/50">
        {s.live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e5484d]" />}
        {s.label.toUpperCase()}
        {s.live && <span className="text-[#e5484d]">LIVE</span>}
      </p>
    </div>
  )
}

function ControlRoom() {
  const m = MEDIA_UNIT
  const [program, setProgram] = useState(0) // clip on air
  const [flash, setFlash] = useState(0) // bumps on each cut → restarts the cut animation
  const [auto, setAuto] = useState(true)
  const tc = useTimecode()
  const [statsRef, statsIn] = useInView(0.4)
  const [awardRef, awardIn] = useInView(0.5)

  const cut = (i) => {
    setProgram(i)
    setFlash((f) => f + 1)
  }
  // auto-switch cameras until the visitor takes over
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => cut((program + 1) % m.clips.length), 5000)
    return () => clearInterval(id)
  }, [auto, program, m.clips.length])

  const preview = (program + 1) % m.clips.length
  const onAir = m.clips[program]

  return (
    <div>
      {/* intro */}
      <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="font-mono text-[11px] tracking-[0.3em] text-accent">{m.school.toUpperCase()} · {m.years}</p>
          <h3 className="mt-3 text-4xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-6xl">{m.name}</h3>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/60">
            One of the most followed school media units in Sri Lanka. Kulara leads <span className="text-paper">{m.role.toLowerCase()}</span> — covering every big moment of school life, live.
          </p>
        </div>
        <div className="md:col-span-4 md:text-right">
          <Magnetic strength={0.2}>
            <a href={m.page} target="_blank" rel="noreferrer" className="inline-block rounded-full border border-paper/30 px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] hover:border-accent hover:text-accent">
              VISIT THE PAGE ↗
            </a>
          </Magnetic>
        </div>
      </div>

      {/* monitor wall */}
      <div className="grid gap-3 md:grid-cols-12">
        {/* PROGRAM */}
        <div className="md:col-span-8">
          <div className="relative aspect-video overflow-hidden rounded-sm border-2 border-[#e5484d] bg-black">
            <div key={program} className="absolute inset-0 cut-in">
              <Picture item={onAir} />
            </div>
            <span key={`f${flash}`} className="cut-flash pointer-events-none absolute inset-0 bg-white" />
            {/* overlays */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-sm bg-[#e5484d] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> ON AIR
            </div>
            <span className="absolute right-4 top-4 font-mono text-[11px] tracking-[0.2em] text-white/85 tabular-nums">{tc}</span>
            {/* lower third */}
            <div key={`lt${program}`} className="lower-third absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div className="border-l-4 border-accent bg-black/55 px-4 py-2 backdrop-blur">
                <p className="font-mono text-[9px] tracking-[0.3em] text-white/60">CAM {String(program + 1).padStart(2, '0')} · {m.name.toUpperCase()}</p>
                <p className="text-lg font-extrabold text-white md:text-2xl">{onAir.title}</p>
              </div>
              <span className="hidden font-mono text-[9px] tracking-[0.25em] text-white/60 md:block">PGM</span>
            </div>
          </div>
        </div>

        {/* PREVIEW + small monitors */}
        <div className="grid grid-cols-3 content-between gap-3 md:col-span-4 md:grid-cols-2">
          {m.clips.map((c, i) => (
            <button
              key={c.title}
              onClick={() => {
                setAuto(false)
                cut(i)
              }}
              className={`group relative aspect-video overflow-hidden rounded-sm border bg-black text-left transition-colors ${
                i === program ? 'border-[#e5484d]' : i === preview ? 'border-[#3ecf6a]' : 'border-paper/15 hover:border-paper/50'
              }`}
              aria-label={`Cut to ${c.title}`}
            >
              <Picture item={c} kenburns={false} className="opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute left-1.5 top-1.5 font-mono text-[8px] tracking-[0.15em] text-white/85">CAM {i + 1}</span>
              {i === program && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#e5484d]" />}
              {i === preview && i !== program && <span className="absolute right-1.5 top-1.5 font-mono text-[7px] text-[#3ecf6a]">PVW</span>}
            </button>
          ))}
        </div>
      </div>

      {/* switcher panel */}
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-sm border border-paper/10 bg-black/30 p-3">
        <span className="mr-2 font-mono text-[9px] tracking-[0.25em] text-paper/40">SWITCHER</span>
        {m.clips.map((c, i) => (
          <button
            key={c.title}
            onClick={() => {
              setAuto(false)
              cut(i)
            }}
            className={`h-10 w-12 rounded-sm font-mono text-[11px] font-bold transition-all ${
              i === program
                ? 'bg-[#e5484d] text-white shadow-[0_0_14px_rgba(229,72,77,0.7)]'
                : i === preview
                  ? 'bg-[#3ecf6a]/20 text-[#3ecf6a] ring-1 ring-[#3ecf6a]/60'
                  : 'bg-paper/10 text-paper/70 hover:bg-paper/20'
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setAuto((a) => !a)}
          className={`ml-auto rounded-sm px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] ${auto ? 'bg-accent text-white' : 'bg-paper/10 text-paper/70'}`}
        >
          {auto ? '● AUTO' : '○ AUTO'}
        </button>
      </div>

      {/* stats */}
      <div ref={statsRef} className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
        {m.stats.map((s) => (
          <Stat key={s.label} s={s} start={statsIn} />
        ))}
      </div>

      {/* award card, revealed by a spotlight */}
      <div ref={awardRef} className={`award-stage relative mt-16 overflow-hidden rounded-sm border border-paper/10 px-6 py-14 md:px-14 md:py-20 ${awardIn ? 'is-lit' : ''}`}>
        <div className="award-spot pointer-events-none absolute inset-0" />
        <div className="relative grid items-center gap-10 md:grid-cols-12 md:gap-14">
          {/* photo of Kulara with the award (or an empty frame until it is added) */}
          <figure className="award-badge relative mx-auto w-full max-w-sm md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-paper/5 p-2 ring-1 ring-accent/40">
              {m.award.photo ? (
                <img src={`${base}${m.award.photo}`} alt={`Kulara with the ${m.award.title}`} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center border border-dashed border-paper/25 text-center">
                  <div>
                    <div className="text-6xl">🏆</div>
                    <p className="mt-4 font-mono text-[10px] tracking-[0.25em] text-paper/45">AWARD PHOTO</p>
                    <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-paper/30">media.js → award.photo</p>
                  </div>
                </div>
              )}
              {/* corner brackets, like a camera frame */}
              {['left-1 top-1 border-l border-t', 'right-1 top-1 border-r border-t', 'bottom-1 left-1 border-b border-l', 'bottom-1 right-1 border-b border-r'].map((c) => (
                <span key={c} className={`absolute h-6 w-6 border-accent ${c}`} />
              ))}
            </div>
            <figcaption className="mt-3 text-center font-mono text-[9px] tracking-[0.3em] text-paper/40">{m.award.date.toUpperCase()}</figcaption>
          </figure>

          {/* text */}
          <div className="text-center md:col-span-7 md:text-left">
            <p className="award-text flex items-center justify-center gap-3 font-mono text-[11px] tracking-[0.35em] text-accent md:justify-start">
              <span className="text-lg">🏆</span> AWARD · {m.award.date.toUpperCase()}
            </p>
            <h4 className="award-text mt-5 font-display text-4xl italic leading-[1.05] md:text-6xl">{m.award.title}</h4>
            <p className="award-text mt-4 text-sm text-paper/60">{m.award.by}</p>
            {m.award.note && <p className="award-text mx-auto mt-6 max-w-md text-base font-light leading-relaxed text-paper/75 md:mx-0">{m.award.note}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ───────────────────────────── PROMOTIONS: 3D reels wall
function Engagement({ reel, playing }) {
  const views = useCount(reel.views, playing)
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState([])
  useEffect(() => {
    setLikes(Math.round(reel.views * 0.08))
    setComments([])
    const COMMENTS = ['🔥🔥🔥', 'Where is this place?', 'So clean! 😍', 'Need this for my shop', 'Booking now 🙌', 'The colours 👌', 'Who shot this??']
    let k = 0
    const id = setInterval(() => {
      setLikes((l) => l + Math.ceil(Math.random() * 6))
      setComments((c) => [{ id: k, text: COMMENTS[(k + reel.views) % COMMENTS.length] }, ...c].slice(0, 3))
      k++
    }, 1400)
    return () => clearInterval(id)
  }, [reel])
  return (
    <div className="space-y-5">
      <div>
        <p className="font-mono text-[10px] tracking-[0.3em] text-accent">{reel.type.toUpperCase()}</p>
        <h4 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">{reel.client}</h4>
      </div>
      <div className="grid grid-cols-2 gap-4 font-mono">
        <div className="border-l border-paper/15 pl-4">
          <p className="text-2xl font-bold tabular-nums">{short(views)}</p>
          <p className="mt-1 text-[9px] tracking-[0.25em] text-paper/50">👁 VIEWS</p>
        </div>
        <div className="border-l border-paper/15 pl-4">
          <p className="text-2xl font-bold tabular-nums">{short(likes)}</p>
          <p className="mt-1 text-[9px] tracking-[0.25em] text-paper/50">❤ LIKES</p>
        </div>
      </div>
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="comment-pop flex items-center gap-2 text-sm text-paper/80">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-paper/15 text-[10px]">💬</span>
            {c.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ReelsWall() {
  const { reels } = PROMOTIONS
  const [active, setActive] = useState(0)
  const drag = useRef(null)
  const n = reels.length

  const go = (d) => setActive((a) => (a + d + n) % n)
  useEffect(() => {
    const id = setInterval(() => go(1), 6000)
    return () => clearInterval(id)
  }, [active]) // restarts the timer after each change

  const onDown = (e) => (drag.current = e.clientX)
  const onUp = (e) => {
    if (drag.current === null) return
    const dx = e.clientX - drag.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    drag.current = null
  }

  return (
    <div className="grid gap-10 md:grid-cols-12 md:items-center">
      {/* the carousel */}
      <div className="relative h-[560px] touch-pan-y select-none md:col-span-8 md:h-[620px]" style={{ perspective: '1400px' }} onPointerDown={onDown} onPointerUp={onUp}>
        {reels.map((r, i) => {
          let off = i - active
          if (off > n / 2) off -= n
          if (off < -n / 2) off += n
          const abs = Math.abs(off)
          const isActive = off === 0
          return (
            <button
              key={r.client}
              onClick={() => setActive(i)}
              className="absolute left-1/2 top-1/2 w-[230px] transition-all duration-700 ease-out md:w-[260px]"
              style={{
                transform: `translate(-50%, -50%) translateX(${off * 62}%) translateZ(${-abs * 160}px) rotateY(${off * -24}deg) scale(${isActive ? 1 : 0.9})`,
                zIndex: 10 - abs,
                opacity: abs > 2 ? 0 : 1 - abs * 0.25,
                pointerEvents: abs > 2 ? 'none' : 'auto',
              }}
              aria-label={`Show ${r.client} reel`}
            >
              {/* phone frame */}
              <div className="rounded-[2.4rem] bg-[#111] p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
                <div className="relative aspect-[9/19] overflow-hidden rounded-[2rem] bg-black">
                  <Picture item={r} kenburns={isActive} />
                  <span className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
                  {isActive && (
                    <>
                      <div className="absolute inset-x-3 top-9 h-0.5 overflow-hidden rounded bg-white/30">
                        <span key={active} className="reel-progress block h-full bg-white" />
                      </div>
                      <div className="absolute bottom-4 left-3 right-10 text-left text-white">
                        <p className="text-xs font-bold">@kulara.visuals</p>
                        <p className="mt-0.5 text-[11px] text-white/80">{r.client} · {r.type}</p>
                      </div>
                      <div className="absolute bottom-4 right-3 flex flex-col items-center gap-3 text-white">
                        <span className="heart-beat text-lg">❤</span>
                        <span className="text-lg">💬</span>
                        <span className="text-lg">↗</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </button>
          )
        })}
        {/* arrows */}
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-2">
          <button onClick={() => go(-1)} aria-label="Previous reel" className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 hover:border-accent hover:text-accent">←</button>
          <button onClick={() => go(1)} aria-label="Next reel" className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 hover:border-accent hover:text-accent">→</button>
        </div>
      </div>

      {/* live engagement for the reel in the middle */}
      <div className="md:col-span-4">
        <Engagement reel={reels[active]} playing />
      </div>
    </div>
  )
}

function BeforeAfter() {
  const { beforeAfter: ba } = PROMOTIONS
  const [pos, setPos] = useState(50)
  const box = useRef(null)
  const dragging = useRef(false)
  const move = (clientX) => {
    const r = box.current.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }
  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <h4 className="text-2xl font-extrabold tracking-[-0.03em] md:text-3xl">{ba.title}</h4>
        <p className="font-mono text-[10px] tracking-[0.25em] text-paper/50">DRAG ↔</p>
      </div>
      <div
        ref={box}
        className="relative aspect-[16/9] cursor-ew-resize touch-none select-none overflow-hidden rounded-sm"
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          move(e.clientX)
        }}
        onPointerMove={(e) => dragging.current && move(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
      >
        <img src={`${base}${ba.after}`} alt="After edit" className="absolute inset-0 h-full w-full object-cover" draggable="false" />
        <img src={`${base}${ba.before}`} alt="Before edit" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} draggable="false" />
        <span className="absolute left-4 top-4 rounded-sm bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white">RAW</span>
        <span className="absolute right-4 top-4 rounded-sm bg-accent px-2.5 py-1 font-mono text-[10px] tracking-[0.2em] text-white">KULARA'S EDIT</span>
        <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-sm text-black shadow-lg">↔</span>
        </div>
        <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} className="sr-only" aria-label="Before / after position" />
      </div>
    </div>
  )
}

function Promotions() {
  const { clients } = PROMOTIONS
  return (
    <div>
      <div className="mb-6 max-w-2xl">
        <h3 className="text-4xl font-extrabold leading-[0.95] tracking-[-0.03em] md:text-6xl">
          Promos that <em className="font-display font-medium italic text-accent">move people.</em>
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-paper/60">Reels, launch videos and product shoots for local businesses — made to stop the scroll.</p>
      </div>

      <ReelsWall />

      {/* clients strip */}
      <div className="mt-16 overflow-hidden border-y border-paper/10 py-6">
        <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-paper/45">BRANDS I'VE WORKED WITH</p>
        <div className="film-track flex w-max gap-14">
          {[...clients, ...clients, ...clients, ...clients].map((c, i) => (
            <span key={i} className="whitespace-nowrap font-display text-3xl italic text-paper/70">{c}</span>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <BeforeAfter />
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-paper/10 pt-10">
        <p className="text-2xl font-extrabold tracking-[-0.02em] md:text-3xl">Need a promo for your business?</p>
        <Magnetic>
          <a href="#contact" className="inline-block rounded-full bg-accent px-7 py-4 font-mono text-[11px] tracking-[0.2em] text-white hover:bg-paper hover:text-[#120d0b]">
            LET'S TALK →
          </a>
        </Magnetic>
      </div>
    </div>
  )
}

// ───────────────────────────── SECTION
export default function MediaPromo() {
  const [tab, setTab] = useState('media')
  return (
    <section id="media" className="relative bg-[#120d0b] text-paper">
      <div className="px-6 py-24 md:px-12 md:py-32" style={{ '--color-paper': '#f4ecdf' }}>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-paper/70">
              <span className="h-2 w-2 rounded-full bg-accent" /> 04 — MEDIA & PROMOTIONS
            </p>
            <h2 className="mt-5 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-7xl">
              Behind the <em className="font-display font-medium italic text-accent">broadcast.</em>
            </h2>
          </div>
          {/* tabs */}
          <div className="flex rounded-full border border-paper/20 p-1 font-mono text-[11px] tracking-[0.2em]" role="tablist">
            {[
              ['media', '🏫 MEDIA UNIT'],
              ['promo', '💼 CLIENT PROMOTIONS'],
            ].map(([k, label]) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={`rounded-full px-5 py-3 transition-colors ${tab === k ? 'bg-paper text-[#120d0b]' : 'text-paper/70 hover:text-paper'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div key={tab} className="lightbox-in">
          {tab === 'media' ? <ControlRoom /> : <Promotions />}
        </div>
      </div>
    </section>
  )
}
