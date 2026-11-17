import { useEffect, useRef, useState } from 'react'
import { SERVICES, STEPS, WHATSAPP } from '../data/services'
import Magnetic from './Magnetic'

const base = import.meta.env.BASE_URL
const lkr = (n) => `LKR ${Math.round(n).toLocaleString('en-LK')}`

// number that glides to its new value
function useGlide(target) {
  const [v, setV] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    let raf
    const start = performance.now()
    const a = from.current
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 600)
      const val = a + (target - a) * (1 - Math.pow(1 - p, 3))
      setV(val)
      from.current = val
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return v
}

function useInView() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen]
}

export default function Services() {
  const [active, setActive] = useState(0)
  const [extras, setExtras] = useState({}) // { serviceId: Set of addon ids }
  const s = SERVICES[active]
  const picked = extras[s.id] || new Set()

  const toggle = (id) =>
    setExtras((e) => {
      const next = new Set(e[s.id] || [])
      next.has(id) ? next.delete(id) : next.add(id)
      return { ...e, [s.id]: next }
    })

  const addonTotal = s.addons.filter((a) => picked.has(a.id)).reduce((t, a) => t + (a.price || 0), 0)
  const hasPrice = s.price != null
  const total = useGlide(hasPrice ? s.price + addonTotal : 0)

  // WhatsApp message with everything they picked
  const chosen = s.addons.filter((a) => picked.has(a.id)).map((a) => a.name)
  const msg = [
    `Hi Kulara! I saw your portfolio 👋`,
    `I'm interested in: *${s.name}*`,
    chosen.length ? `Add-ons: ${chosen.join(', ')}` : null,
    hasPrice ? `Estimate on the site: ${lkr(s.price + addonTotal)}` : null,
    `Date: `,
    `Location: `,
  ]
    .filter(Boolean)
    .join('\n')
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`

  const [stepsRef, stepsIn] = useInView()
  const detailRef = useRef(null)
  // on phones the details are below the list, so scroll to them after a pick
  const pick = (i) => {
    setActive(i)
    if (window.innerWidth < 768) setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <section id="services" className="relative overflow-hidden bg-[#2a120a] text-paper">
      <div className="px-6 py-24 md:px-12 md:py-32" style={{ '--color-paper': '#f4ecdf', '--color-accent': '#e0864e' }}>
        {/* heading */}
        <div className="mb-14 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-paper/70">
              <span className="h-2 w-2 rounded-full bg-accent" /> 06 — OUR SERVICES
            </p>
            <h2 className="mt-5 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-7xl">
              What I can <em className="font-display font-medium italic text-accent">shoot for you.</em>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-paper/60 md:col-span-4 md:justify-self-end">
            Pick a service, add what you need, and send it straight to my WhatsApp — I'll reply with a plan.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          {/* service list */}
          <ol className="md:col-span-4" role="tablist" aria-label="Services">
            {SERVICES.map((sv, i) => (
              <li key={sv.id} className="border-b border-paper/10 first:border-t">
                <button
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => pick(i)}
                  className={`group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors ${i === active ? 'text-paper' : 'text-paper/45 hover:text-paper/80'}`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-2xl font-extrabold tracking-[-0.03em] md:text-3xl">{sv.name}</span>
                  </span>
                  <span className={`text-xl transition-transform duration-300 ${i === active ? 'translate-x-0 text-accent' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>→</span>
                </button>
              </li>
            ))}
          </ol>

          {/* details + package builder */}
          <div key={s.id} ref={detailRef} className="lightbox-in grid scroll-mt-6 gap-8 md:col-span-8 lg:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm lg:aspect-auto">
              <img src={`${base}${s.image}`} alt={s.name} className="kenburns h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-display text-3xl italic leading-tight text-white md:text-4xl">{s.tagline}</p>
              </div>
            </div>

            <div className="flex flex-col">
              <dl className="grid grid-cols-2 gap-4 border-b border-paper/10 pb-5 font-mono text-[10px] tracking-[0.2em]">
                <div><dt className="text-paper/45">COVERAGE</dt><dd className="mt-1">{s.hours.toUpperCase()}</dd></div>
                <div><dt className="text-paper/45">DELIVERY</dt><dd className="mt-1">{s.delivery.toUpperCase()}</dd></div>
              </dl>

              <p className="mt-6 font-mono text-[10px] tracking-[0.3em] text-paper/50">INCLUDED</p>
              <ul className="mt-3 space-y-2">
                {s.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-3 text-sm text-paper/85">
                    <span className="mt-0.5 text-accent">✓</span> {inc}
                  </li>
                ))}
              </ul>

              <p className="mt-7 font-mono text-[10px] tracking-[0.3em] text-paper/50">ADD-ONS · TAP TO ADD</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.addons.map((a) => {
                  const on = picked.has(a.id)
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggle(a.id)}
                      aria-pressed={on}
                      className={`rounded-full border px-4 py-2 text-xs transition-all duration-300 ${on ? 'border-accent bg-accent text-[#2a120a]' : 'border-paper/25 text-paper/80 hover:border-paper/60'}`}
                    >
                      {on ? '✓ ' : '+ '}
                      {a.name}
                      {hasPrice && a.price != null && <span className={on ? 'ml-1.5 opacity-70' : 'ml-1.5 text-paper/45'}>{(a.price / 1000).toFixed(0)}K</span>}
                    </button>
                  )
                })}
              </div>

              {/* estimate */}
              <div className="mt-auto pt-8">
                <div className="rounded-sm border border-paper/15 bg-black/20 p-5">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-paper/50">{hasPrice ? 'YOUR ESTIMATE · FROM' : 'PRICE'}</p>
                  <p className="mt-2 text-4xl font-extrabold tracking-[-0.03em] tabular-nums md:text-5xl">{hasPrice ? lkr(total) : 'On request'}</p>
                  <p className="mt-2 text-xs text-paper/45">Final price depends on date, location and travel.</p>
                  <Magnetic strength={0.15} className="mt-5 block w-full">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-3 rounded-full bg-[#25d366] px-6 py-4 font-mono text-[11px] font-bold tracking-[0.2em] text-[#06210f] transition-transform hover:scale-[1.02]"
                    >
                      💬 BOOK ON WHATSAPP
                    </a>
                  </Magnetic>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* how it works */}
        <div ref={stepsRef} className="mt-24">
          <p className="font-mono text-[11px] tracking-[0.3em] text-paper/50">HOW IT WORKS</p>
          <div className="relative mt-8 grid gap-8 md:grid-cols-4">
            {/* line that draws across */}
            <span className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-paper/10 md:block" />
            <span className={`pointer-events-none absolute left-0 top-5 hidden h-px bg-accent transition-[width] duration-[1600ms] ease-out md:block ${stepsIn ? 'w-full' : 'w-0'}`} />
            {STEPS.map((st, i) => (
              <div
                key={st.title}
                className={`relative transition-all duration-700 ${stepsIn ? 'opacity-100' : 'translate-y-6 opacity-0'}`}
                style={{ transitionDelay: `${300 + i * 300}ms` }}
              >
                <span className="relative grid h-10 w-10 place-items-center rounded-full border border-accent bg-[#2a120a] font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.03em]">{st.title}</h3>
                <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-paper/60">{st.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
