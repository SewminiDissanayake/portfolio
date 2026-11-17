// A quiet text ticker along the bottom of the hero.
// The list is repeated so the loop has no gap.
const ITEMS = ['WEDDINGS', 'PRE-SHOOTS', 'EVENTS', 'PHOTOSHOOTS', 'AERIAL', 'NATURE']

export default function FilmStrip() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="group absolute inset-x-0 bottom-0 z-20 h-10 overflow-hidden border-t border-fg/15">
      <div className="film-track flex h-full w-max items-center group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {row.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-10 px-10 font-mono text-[10px] tracking-[0.4em] text-fg/50">
                {item}
                <span className="h-1 w-1 rounded-full bg-accent/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
