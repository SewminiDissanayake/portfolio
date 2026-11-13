import { useEffect, useState } from 'react'

// Video-editor style overlays: floating tool chips, colour wheels, timeline

// ---------- Floating tool chips around him ----------
const TOOLS = [
  { name: 'Premiere Pro', pos: 'left-[47%] top-[20%]', delay: '0s' },
  { name: 'After Effects', pos: 'left-[38%] top-[32%]', delay: '1.2s' },
  { name: 'DaVinci Resolve', pos: 'left-[79%] top-[52%]', delay: '0.6s' },
  { name: 'Lightroom', pos: 'left-[45%] top-[50%]', delay: '1.8s' },
  { name: 'Photoshop', pos: 'left-[70%] top-[72%]', delay: '0.9s' },
]

export function ToolChips() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {TOOLS.map((t) => (
        <span
          key={t.name}
          style={{ animationDelay: t.delay }}
          className={`float-chip absolute ${t.pos} flex items-center gap-2 border border-gold/30 bg-ink/50 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-ivory/80 backdrop-blur-md`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {t.name.toUpperCase()}
        </span>
      ))}
    </div>
  )
}

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
        <div className="relative h-full w-full rounded-full bg-ink/90">
          <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 bg-ivory/10" />
          <span className="absolute left-1/2 top-1/2 h-full w-px -translate-y-1/2 bg-ivory/10" />
          <span
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-ivory shadow-[0_0_0_2px_rgba(11,9,8,0.9)] transition-transform duration-700"
            style={{ transform: `translate(calc(-50% + ${offset[0]}px), calc(-50% + ${offset[1]}px))` }}
          />
        </div>
      </div>
      <span className="font-mono text-[9px] tracking-[0.2em] text-ivory/50">{label}</span>
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
    <div className="pointer-events-none absolute right-14 top-28 hidden border border-gold/20 bg-ink/40 p-4 backdrop-blur-md lg:block">
      <p className="mb-3 font-mono text-[9px] tracking-[0.3em] text-gold">COLOUR GRADE · {look.name}</p>
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
  { name: 'V2', clips: [[8, 18, 'bg-bronze/70', 'TITLE'], [52, 22, 'bg-bronze/70', 'DRONE']] },
  { name: 'V1', clips: [[0, 30, 'bg-gold/70', 'WEDDING'], [31, 24, 'bg-gold/50', 'EVENT'], [56, 44, 'bg-gold/70', 'NATURE']] },
  { name: 'A1', clips: [[0, 100, 'bg-burgundy/80', '']], audio: true },
]

export function Timeline({ seconds }) {
  const loop = 12 // playhead loops every 12 seconds
  const progress = ((seconds % loop) / loop) * 100

  return (
    <div className="pointer-events-none absolute bottom-12 right-14 hidden w-[480px] border border-gold/20 bg-ink/50 p-3 backdrop-blur-md lg:block">
      <div className="mb-2 flex justify-between font-mono text-[9px] tracking-[0.25em] text-ivory/50">
        <span className="text-gold">SEQUENCE · SHOWREEL_2026</span>
        <span>25 FPS</span>
      </div>
      <div className="relative space-y-1">
        {TRACKS.map((track) => (
          <div key={track.name} className="flex items-center gap-2">
            <span className="w-5 font-mono text-[9px] text-ivory/40">{track.name}</span>
            <div className="relative h-5 flex-1 bg-ivory/5">
              {track.clips.map(([start, width, color, label]) => (
                <div
                  key={start}
                  className={`absolute top-0 flex h-full items-center overflow-hidden border-r border-ink px-1.5 ${color}`}
                  style={{ left: `${start}%`, width: `${width}%` }}
                >
                  {track.audio ? (
                    <div className="flex h-full w-full items-center gap-[2px]">
                      {Array.from({ length: 70 }).map((_, i) => (
                        <span
                          key={i}
                          className="w-[2px] bg-ivory/50"
                          style={{ height: `${25 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)) * 70}%` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="truncate font-mono text-[8px] tracking-widest text-ink">{label}</span>
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
