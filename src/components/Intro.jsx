import { useEffect, useRef, useState } from 'react'

// Camera-aperture intro: blades open while a counter runs 0 → 100,
// then a circular "shutter" opens and reveals the page.
// Shows once per visit (sessionStorage), and is skipped for reduced-motion users.

function Aperture({ open }) {
  // `open` 0 → 1 : size of the hole in the middle
  const R = 100 // outer radius
  const r = 12 + open * 70 // hole radius
  const blades = 6
  const twist = 0.55 + (1 - open) * 0.5 // blades twist more when closed
  const pts = Array.from({ length: blades }, (_, i) => {
    const a = (i / blades) * Math.PI * 2
    return { a, x: Math.cos(a) * r, y: Math.sin(a) * r }
  })
  return (
    <svg viewBox="-110 -110 220 220" className="h-56 w-56 md:h-72 md:w-72">
      <defs>
        <clipPath id="lens">
          <circle r={R} />
        </clipPath>
      </defs>
      <circle r={R + 6} fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <g clipPath="url(#lens)" style={{ transform: `rotate(${open * 60}deg)` }}>
        {pts.map((p, i) => {
          const n = pts[(i + 1) % blades]
          const o1 = { x: Math.cos(p.a + twist) * R * 1.4, y: Math.sin(p.a + twist) * R * 1.4 }
          const o2 = { x: Math.cos(n.a + twist) * R * 1.4, y: Math.sin(n.a + twist) * R * 1.4 }
          return (
            <polygon
              key={i}
              points={`${p.x},${p.y} ${n.x},${n.y} ${o2.x},${o2.y} ${o1.x},${o1.y}`}
              fill="currentColor"
              fillOpacity={0.16 + (i % 2) * 0.06}
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="0.6"
            />
          )
        })}
      </g>
    </svg>
  )
}

export default function Intro({ onDone }) {
  const [count, setCount] = useState(0)
  const [hole, setHole] = useState(0) // shutter hole radius in % (0 → 150)
  const [show, setShow] = useState(() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
      return sessionStorage.getItem('kr-intro-seen') !== '1'
    } catch {
      return true
    }
  })
  const doneRef = useRef(onDone)

  useEffect(() => {
    if (!show) {
      doneRef.current()
      return
    }
    let raf
    const start = performance.now()
    const COUNT_MS = 1700 // counter 0 → 100
    const OPEN_MS = 900 // shutter opening
    const tick = (now) => {
      const t = now - start
      const c = Math.min(1, t / COUNT_MS)
      setCount(Math.round((1 - Math.pow(1 - c, 3)) * 100)) // ease-out
      if (t > COUNT_MS) {
        const o = Math.min(1, (t - COUNT_MS) / OPEN_MS)
        setHole(Math.pow(o, 2) * 150) // ease-in
        if (o === 1) {
          try {
            sessionStorage.setItem('kr-intro-seen', '1')
          } catch {
            /* storage not available: fine */
          }
          setShow(false)
          doneRef.current()
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [show])

  if (!show) return null

  // a transparent circle in the middle that grows = the shutter opening
  const mask = `radial-gradient(circle at 50% 50%, transparent ${hole}%, black ${hole + 0.5}%)`

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-fg text-paper"
      style={{ WebkitMaskImage: mask, maskImage: mask }}
    >
      <Aperture open={count / 100} />
      <div className="mt-8 font-mono text-[11px] tracking-[0.35em] text-paper/70">KULARA RAMANAYAKE</div>
      <div className="mt-3 font-display text-6xl italic tabular-nums md:text-7xl">
        {String(count).padStart(3, '0')}
        <span className="text-accent">%</span>
      </div>
      <div className="mt-3 font-mono text-[10px] tracking-[0.3em] text-paper/50">FOCUSING · SCENE 01</div>
    </div>
  )
}
