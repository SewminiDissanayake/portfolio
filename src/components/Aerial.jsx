import { useEffect, useMemo, useState } from 'react'
import { WORKS } from '../data/works'
import { MAP, OUTLINE, toXY } from '../data/sriLanka'
import EventStory from './EventStory'
import Magnetic from './Magnetic'

const base = import.meta.env.BASE_URL

// Aerial projects that have GPS coordinates become pins on the map (north → south)
const FLIGHTS = WORKS.filter((w) => w.category === 'Aerial' && w.gps).sort((a, b) => b.gps[0] - a.gps[0])

const fmt = (n, pos, neg) => `${pos && n >= 0 ? pos : neg} ${Math.abs(n).toFixed(4)}°`

// a tiny top-down quadcopter, drawn around (0,0)
function Drone() {
  return (
    <g>
      {[[-9, -9], [9, -9], [-9, 9], [9, 9]].map(([x, y], i) => (
        <g key={i}>
          <line x1="0" y1="0" x2={x} y2={y} stroke="currentColor" strokeWidth="2" />
          <circle cx={x} cy={y} r="5.5" fill="none" stroke="currentColor" strokeWidth="1" className="rotor" />
        </g>
      ))}
      <rect x="-4" y="-5" width="8" height="10" rx="2" fill="currentColor" />
      <circle cx="0" cy="-6.5" r="1.4" fill="#e5484d" />
    </g>
  )
}

export default function Aerial() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true) // auto-cycle until the visitor picks a pin
  const [story, setStory] = useState(null)

  const points = useMemo(() => FLIGHTS.map((f) => toXY(f.gps[0], f.gps[1])), [])
  // the flight path through every pin, back to the start
  const route = useMemo(() => (points.length ? `M${points.map((p) => p.join(',')).join(' L')} Z` : ''), [points])

  useEffect(() => {
    if (!auto || FLIGHTS.length < 2) return
    const id = setInterval(() => setActive((a) => (a + 1) % FLIGHTS.length), 4000)
    return () => clearInterval(id)
  }, [auto])

  if (!FLIGHTS.length) return null
  const f = FLIGHTS[active]
  const [ax, ay] = points[active]
  const choose = (i) => {
    setAuto(false)
    setActive(i)
  }

  // lat/lng grid lines for the "chart" look
  const lats = [6, 7, 8, 9]
  const lngs = [80, 81]

  return (
    <section id="aerial" className="relative overflow-hidden bg-[radial-gradient(ellipse_80%_70%_at_70%_40%,#f1f4ea_0%,#dfe6d6_55%,#cdd7c2_100%)]">
      {/* this section's own green palette: "paper" = text colour here, "accent" = forest green */}
      <div className="relative px-6 py-24 text-paper md:px-12 md:py-32" style={{ '--color-paper': '#1f2d22', '--color-accent': '#4f7a4f' }}>
      {/* faint contour lines in the background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:repeating-radial-gradient(circle_at_70%_45%,transparent_0_22px,#4f7a4f_23px,transparent_24px)]" />

      <div className="relative grid gap-14 md:grid-cols-12 md:gap-10">
        {/* ── left: text, flight list, telemetry, preview */}
        <div className="md:col-span-5">
          <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-paper/70">
            <span className="h-2 w-2 rounded-full bg-accent" /> 03 — FROM ABOVE
          </p>
          <h2 className="mt-5 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-7xl">
            The island, <em className="font-display font-medium italic text-accent">from above.</em>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/60">
            Drone flights across Sri Lanka — pick a point on the map to see what the camera saw.
          </p>

          {/* flight log */}
          <ol className="mt-10 divide-y divide-paper/10 border-y border-paper/10">
            {FLIGHTS.map((fl, i) => (
              <li key={fl.id}>
                <button
                  onClick={() => choose(i)}
                  className={`flex w-full items-center justify-between gap-4 py-4 text-left font-mono text-[11px] tracking-[0.2em] transition-colors ${i === active ? 'text-accent' : 'text-paper/60 hover:text-paper'}`}
                >
                  <span>
                    <span className="mr-3 text-paper/35">FL-{String(i + 1).padStart(2, '0')}</span>
                    {fl.location.toUpperCase()}
                  </span>
                  <span className="text-paper/35">{fl.altitude ? `${fl.altitude} M` : ''} {i === active ? '◉' : '○'}</span>
                </button>
              </li>
            ))}
          </ol>

          {/* preview card for the active flight */}
          <div key={f.id} className="lightbox-in mt-8 overflow-hidden border border-paper/15 bg-white/60 shadow-[0_20px_40px_-20px_rgba(31,45,34,0.4)]">
            <div className="relative aspect-[16/10]">
              <img src={`${base}${f.image}`} alt={f.title} className="h-full w-full object-cover" />
              {/* drone camera HUD over the photo */}
              <div className="pointer-events-none absolute inset-3 font-mono text-[9px] tracking-[0.2em] text-white/85">
                <span className="absolute left-0 top-0 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e5484d]" /> REC · 4K
                </span>
                <span className="absolute right-0 top-0">ALT {f.altitude ?? '—'}M</span>
                <span className="absolute bottom-0 left-0">{fmt(f.gps[0], 'N', 'S')} · {fmt(f.gps[1], 'E', 'W')}</span>
                <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 border border-white/60" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-mono text-[9px] tracking-[0.3em] text-accent">{f.location.toUpperCase()} · {f.year}</p>
                <h3 className="mt-1 text-xl font-extrabold tracking-[-0.02em]">{f.title}</h3>
              </div>
              <Magnetic strength={0.2}>
                <button onClick={() => setStory(active)} className="whitespace-nowrap rounded-full bg-paper px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#f1f4ea] hover:bg-accent">
                  OPEN STORY →
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* ── right: the map */}
        <div className="relative md:col-span-7">
          <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} className="mx-auto h-auto w-full max-w-[520px] text-paper" role="img" aria-label="Map of Sri Lanka with drone flight locations">
            {/* lat / lng grid */}
            {lats.map((lat) => {
              const y = toXY(lat, 80)[1]
              return (
                <g key={lat}>
                  <line x1="0" x2={MAP.width} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 6" />
                  <text x="4" y={y - 4} fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="JetBrains Mono, monospace">{lat}°N</text>
                </g>
              )
            })}
            {lngs.map((lng) => {
              const x = toXY(7, lng)[0]
              return (
                <g key={lng}>
                  <line y1="0" y2={MAP.height} x1={x} x2={x} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="2 6" />
                  <text x={x + 4} y={MAP.height - 6} fill="currentColor" fillOpacity="0.35" fontSize="9" fontFamily="JetBrains Mono, monospace">{lng}°E</text>
                </g>
              )
            })}

            {/* the island: a soft glow, then the outline */}
            <path d={OUTLINE} fill="var(--color-accent)" fillOpacity="0.14" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" />
            <path d={OUTLINE} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="8" />

            {/* flight path + the drone flying along it */}
            {points.length > 1 && (
              <>
                <path d={route} fill="none" stroke="var(--color-accent)" strokeWidth="1.2" strokeDasharray="4 6" className="flight-dash" />
                <g className="text-paper">
                  <Drone />
                  <animateMotion dur={`${FLIGHTS.length * 5}s`} repeatCount="indefinite" rotate="auto" path={route} />
                </g>
              </>
            )}

            {/* pins */}
            {points.map(([x, y], i) => (
              <g key={FLIGHTS[i].id} onClick={() => choose(i)} className="cursor-pointer" role="button" aria-label={`Flight over ${FLIGHTS[i].location}`}>
                <circle cx={x} cy={y} r="16" fill="transparent" />
                {i === active && <circle cx={x} cy={y} r="7" fill="none" stroke="var(--color-accent)" className="pin-pulse" />}
                <circle cx={x} cy={y} r="4.5" fill={i === active ? 'var(--color-accent)' : 'currentColor'} />
                <text x={x + 10} y={y + 3.5} fill="currentColor" fillOpacity={i === active ? 1 : 0.6} fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5">
                  {FLIGHTS[i].location.toUpperCase()}
                </text>
              </g>
            ))}

            {/* crosshair on the active pin */}
            <g className="transition-transform duration-700 ease-out" style={{ transform: `translate(${ax}px, ${ay}px)` }}>
              <line x1="-22" x2="-10" y1="0" y2="0" stroke="var(--color-accent)" />
              <line x1="10" x2="22" y1="0" y2="0" stroke="var(--color-accent)" />
              <line y1="-22" y2="-10" x1="0" x2="0" stroke="var(--color-accent)" />
              <line y1="10" y2="22" x1="0" x2="0" stroke="var(--color-accent)" />
            </g>
          </svg>

          {/* telemetry strip under the map */}
          <div className="mx-auto mt-6 grid max-w-[520px] grid-cols-3 gap-4 border-t border-paper/15 pt-4 font-mono text-[10px] tracking-[0.2em]">
            <div><p className="text-paper/40">LAT</p><p className="mt-1">{fmt(f.gps[0], 'N', 'S')}</p></div>
            <div><p className="text-paper/40">LNG</p><p className="mt-1">{fmt(f.gps[1], 'E', 'W')}</p></div>
            <div><p className="text-paper/40">FLIGHTS</p><p className="mt-1">{String(FLIGHTS.length).padStart(2, '0')}</p></div>
          </div>
        </div>
      </div>

      </div>

      {story !== null && (
        <EventStory work={FLIGHTS[story]} onClose={() => setStory(null)} onNext={() => setStory((story + 1) % FLIGHTS.length)} />
      )}
    </section>
  )
}
