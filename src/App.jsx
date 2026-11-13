import { useEffect, useState } from 'react'
import StudioScene from './components/StudioScene'
import { ColorWheels, Timeline } from './components/EditorHUD'
import { THEMES } from './themes'

// Running camera timecode: HH:MM:SS:FF (25 fps)
function useTimecode() {
  const [t, setT] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => setT((performance.now() - start) / 1000), 40)
    return () => clearInterval(id)
  }, [])
  const parts = [Math.floor(t / 3600), Math.floor(t / 60) % 60, Math.floor(t) % 60, Math.floor((t % 1) * 25)]
  return { seconds: t, text: parts.map((n) => String(n).padStart(2, '0')).join(':') }
}

function Corner({ className }) {
  return <span className={`absolute h-10 w-10 border-accent/50 ${className}`} />
}

export default function App() {
  const [theme, setTheme] = useState('cream')
  // tell the CSS which theme is active (changes all page colours)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  const { seconds, text: timecode } = useTimecode()

  return (
    <section className="relative h-screen w-full overflow-hidden bg-paper text-fg">
      {/* 3D studio */}
      <div className="absolute inset-0">
        <StudioScene themeName={theme} />
      </div>

      {/* cinematic vignette + film grain */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--vignette)_100%)]" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />

      {/* editor overlays */}
      <ColorWheels />
      <Timeline seconds={seconds} />

      {/* viewfinder frame (accent) */}
      <div className="pointer-events-none absolute inset-5 md:inset-8">
        <Corner className="left-0 top-0 border-l border-t" />
        <Corner className="right-0 top-0 border-r border-t" />
        <Corner className="bottom-0 left-0 border-b border-l" />
        <Corner className="bottom-0 right-0 border-b border-r" />
      </div>

      {/* top HUD */}
      <div className="pointer-events-none absolute left-10 right-10 top-10 flex justify-between font-mono text-[11px] tracking-[0.2em] text-fg/60 md:left-14 md:right-14 md:top-14">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#b3261e]" />
          REC <span className="text-accent">{timecode}</span>
        </span>
        <span className="hidden sm:block">4K · 25FPS · ISO 400 · <span className="text-accent">f/2.8</span></span>
      </div>

      {/* name + tagline */}
      <div className="pointer-events-none absolute bottom-44 left-10 right-10 md:bottom-32 md:left-14">
        <p className="flex items-center gap-3 font-mono text-[11px] tracking-[0.35em] text-accent">
          <span className="h-px w-10 bg-accent/70" />
          SCENE 01 / THE STUDIO
        </p>
        <h1 className="mt-4 font-display text-6xl font-medium leading-[0.95] tracking-tight text-fg md:text-8xl">
          His <em className="italic text-accent">Name</em>
        </h1>
        <p className="mt-5 max-w-md text-sm font-light tracking-wide text-fg/70 md:text-base">
          Videographer &amp; Photographer
          <span className="mx-2 text-amber">—</span>
          Weddings · Events · Aerial · Nature
        </p>
      </div>

      {/* theme switch: Cream / Sage (we'll decide the final one with him) */}
      <div className="absolute left-1/2 top-24 z-10 flex -translate-x-1/2 gap-1 border border-fg/20 bg-paper/70 p-1 font-mono text-[10px] tracking-widest backdrop-blur md:top-10">
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`px-3 py-1.5 transition-colors ${theme === key ? 'bg-accent text-paper' : 'text-fg/70 hover:text-accent'}`}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* call-to-action buttons */}
      <div className="absolute bottom-12 left-10 right-10 flex flex-wrap gap-3 md:left-14">
        <a
          href="#work"
          className="flex items-center gap-3 bg-accent px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-paper transition-colors duration-300 hover:bg-fg"
        >
          <span className="text-[9px]">▶</span> WATCH SHOWREEL
        </a>
        <a
          href="#contact"
          className="border border-accent/40 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-fg/80 transition-colors duration-300 hover:border-accent hover:text-accent"
        >
          BOOK A SHOOT
        </a>
      </div>
    </section>
  )
}
