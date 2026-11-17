import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import MirrorlessCamera from './MirrorlessCamera'

// A 3D camera in the middle, categories placed around it like a mode dial.
// The camera turns to "look at" a category. Picking one spins it 360° and locks on.
//
// props: categories ['Weddings', …], counts { Weddings: 3, … }, active, onPick(category)

// where each chip sits on the ring (angle in degrees, 0 = right, 90 = down)
function ringAngles(n) {
  return Array.from({ length: n }, (_, i) => -90 + (360 / n) * i)
}

// turn a screen angle into a camera rotation that points the lens that way
function aimFor(deg, extraSpin = 0) {
  const a = (deg * Math.PI) / 180
  return { y: Math.cos(a) * 0.95 + extraSpin, x: Math.sin(a) * 0.55 }
}

export default function CameraDial({ categories, counts, active, onPick }) {
  const angles = useMemo(() => ringAngles(categories.length), [categories.length])
  const [focus, setFocus] = useState(Math.max(0, categories.indexOf(active))) // chip the camera looks at
  const [spins, setSpins] = useState(0) // full turns added when a category is picked
  const [userHover, setUserHover] = useState(false)
  const wrap = useRef(null)
  const [visible, setVisible] = useState(false)
  const [small, setSmall] = useState(() => window.matchMedia('(max-width: 640px)').matches)

  // phones: pull the chips closer to the centre so they fit the screen
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const on = () => setSmall(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // only run the 3D scene while the dial is on screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  // idle: the camera slowly scans from category to category
  useEffect(() => {
    if (userHover || active !== 'All') return
    const id = setInterval(() => setFocus((f) => (f + 1) % categories.length), 2200)
    return () => clearInterval(id)
  }, [userHover, active, categories.length])

  // when a category is picked from outside, look at it
  useEffect(() => {
    const i = categories.indexOf(active)
    if (i >= 0) setFocus(i)
  }, [active, categories])

  const pick = (i) => {
    setFocus(i)
    setSpins((s) => s + 1) // one dramatic 360° turn
    onPick(categories[i])
  }

  const aim = aimFor(angles[focus], spins * Math.PI * 2)
  const focusedName = categories[focus]

  return (
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[700px]">
      {/* dial rings */}
      <svg viewBox="-100 -100 200 200" className="lens-spin pointer-events-none absolute inset-[9%] text-fg" fill="none">
        <circle r="96" stroke="currentColor" strokeOpacity="0.15" />
        <circle r="80" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="1 4" />
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i / 72) * Math.PI * 2
          const r2 = i % 6 === 0 ? 90 : 93
          return <line key={i} x1={Math.cos(a) * 96} y1={Math.sin(a) * 96} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke="currentColor" strokeOpacity="0.3" />
        })}
      </svg>

      {/* pointer line from the centre to the focused chip */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[33%] origin-left bg-gradient-to-r from-transparent via-accent/60 to-accent transition-transform duration-700 ease-out"
        style={{ transform: `rotate(${angles[focus]}deg)` }}
      />

      {/* the 3D camera */}
      <div className="absolute inset-[22%]">
        {visible && (
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 32 }} gl={{ alpha: true }}>
            <ambientLight intensity={1.1} />
            <directionalLight position={[2, 3, 4]} intensity={3} color="#fff1dc" />
            <directionalLight position={[-3, -1, -2]} intensity={1.2} color="#e7b98a" />
            <Suspense fallback={null}>
              <MirrorlessCamera accent="#b0532a" aim={aim} position={[0.08, 0, 0]} scale={1.15} showOnMobile light={false} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* centre read-out */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[17%] text-center font-mono text-[10px] tracking-[0.3em] text-fg/60">
        <span className="text-accent">●</span> MODE · {(active === 'All' ? focusedName : active).toUpperCase()}
      </div>

      {/* category chips around the ring */}
      {categories.map((c, i) => {
        const a = (angles[i] * Math.PI) / 180
        const x = 50 + Math.cos(a) * (small ? 30 : 37)
        const y = 50 + Math.sin(a) * 45
        const isActive = active === c
        const isFocus = focus === i
        return (
          <button
            key={c}
            onClick={() => pick(i)}
            onMouseEnter={() => {
              setUserHover(true)
              setFocus(i)
            }}
            onMouseLeave={() => setUserHover(false)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-2 font-mono text-[9px] tracking-[0.2em] backdrop-blur transition-all duration-300 md:px-5 md:py-3 md:text-[11px] ${
              isActive
                ? 'scale-110 border-fg bg-fg text-paper shadow-lg'
                : isFocus
                  ? 'scale-105 border-accent bg-paper/90 text-accent'
                  : 'border-fg/20 bg-paper/70 text-fg/70 hover:text-fg'
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-pressed={isActive}
          >
            <span className="mr-1.5 hidden text-fg/40 sm:inline">{String(i + 1).padStart(2, '0')}</span>
            {c.toUpperCase()}
            <span className={`ml-1.5 ${isActive ? 'text-accent' : 'text-fg/40'}`}>{String(counts[c] || 0).padStart(2, '0')}</span>
          </button>
        )
      })}
    </div>
  )
}
