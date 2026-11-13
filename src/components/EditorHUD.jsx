import { useEffect, useState } from 'react'

// Video-editor style overlays: colour wheels and an editing timeline

// ---------- Colour wheels (shadows / midtones / highlights) ----------
// Grade "looks" the wheels cycle through: [x, y] offsets of each dot
const GRADES = [
  { name: 'NATURAL', dots: [[-2, 2], [0, 0], [2, -2]] },
  { name: 'WARM GOLD', dots: [[-6, 8], [5, -4], [9, -7]] },
  { name: 'CINEMATIC', dots: [[-10, 4], [-2, 3], [10, -3]] },
  { name: 'MOODY', dots: [[-7, 10], [3, 5], [6, -9]] },
]

function Wheel({ label, offset }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-14 w-14 rounded-full p-[2px] [background:conic-gradient(from_90deg,#8a2233,#c9a45c,#6b7a3a,#2f5f6b,#3a3f8c,#7a2d6b,#8a2233)] opacity-80">
        <div className="relative h-full w-full rounded-full bg-paper/90">
          <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 bg-fg/10" />
          <span className="absolute left-1/2 top-1/2 h-full w-px -translate-y-1/2 bg-fg/10" />
          <span
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-fg shadow-[0_0_0_2px_var(--color-paper)] transition-transform duration-700"
            style={{ transform: `translate(calc(-50% + ${offset[0]}px), calc(-50% + ${offset[1]}px))` }}
          />
        </div>
      </div>
      <span className="font-mono text-[9px] tracking-[0.2em] text-fg/50">{label}</span>
    </div>
  )
}

export function ColorWheels() {
  // switch to the next look every 3 seconds
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % GRADES.length), 3000)
    return () => clearInterval(id)
  }, [])
  const look = GRADES[i]
  const g = look.dots
  return (
    <div className="pointer-events-none absolute right-14 top-28 hidden border border-accent/20 bg-paper/40 p-4 backdrop-blur-md lg:block">
      <p className="mb-3 font-mono text-[9px] tracking-[0.3em] text-accent">COLOUR GRADE · {look.name}</p>
      <div className="flex gap-4">
        <Wheel label="SHADOWS" offset={g[0]} />
        <Wheel label="MIDTONES" offset={g[1]} />
        <Wheel label="HIGHLIGHTS" offset={g[2]} />
      </div>
    </div>
  )
}

// ---------- Editing timeline with a moving playhead ----------
// clips: [start %, width %, colour class, label]
const TRACKS = [
  { name: 'V2', clips: [[8, 18, 'bg-amber/70', 'TITLE'], [52, 22, 'bg-amber/70', 'DRONE']] },
  { name: 'V1', clips: [[0, 30, 'bg-accent/70', 'WEDDING'], [31, 24, 'bg-accent/50', 'EVENT'], [56, 44, 'bg-accent/70', 'NATURE']] },
  { name: 'A1', clips: [[0, 100, 'bg-teal/80', '']], audio: true },
]

export function Timeline({ seconds }) {
  const loop = 12 // playhead loops every 12 seconds
  const progress = ((seconds % loop) / loop) * 100

  return (
    <div className="pointer-events-none absolute bottom-12 right-14 hidden w-[480px] border border-accent/20 bg-paper/50 p-3 backdrop-blur-md lg:block">
      <div className="mb-2 flex justify-between font-mono text-[9px] tracking-[0.25em] text-fg/50">
        <span className="text-accent">SEQUENCE · SHOWREEL_2026</span>
        <span>25 FPS</span>
      </div>
      <div className="relative space-y-1">
        {TRACKS.map((track) => (
          <div key={track.name} className="flex items-center gap-2">
            <span className="w-5 font-mono text-[9px] text-fg/40">{track.name}</span>
            <div className="relative h-5 flex-1 bg-fg/5">
              {track.clips.map(([start, width, color, label]) => (
                <div
                  key={start}
                  className={`absolute top-0 flex h-full items-center overflow-hidden border-r border-paper px-1.5 ${color}`}
                  style={{ left: `${start}%`, width: `${width}%` }}
                >
                  {track.audio ? (
                    <div className="flex h-full w-full items-center gap-[2px]">
                      {Array.from({ length: 70 }).map((_, i) => (
                        <span
                          key={i}
                          className="w-[2px] bg-fg/50"
                          style={{ height: `${25 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)) * 70}%` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="truncate font-mono text-[8px] tracking-widest text-paper">{label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* playhead */}
        <div className="absolute -top-1 bottom-0 left-7 right-0">
          <div className="absolute -top-1 bottom-0 w-px bg-[#e5484d]" style={{ left: `${progress}%` }}>
            <span className="absolute -left-[4px] -top-1 h-2 w-[9px] bg-[#e5484d] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
