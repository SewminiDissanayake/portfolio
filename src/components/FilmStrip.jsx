// A film strip that scrolls forever along the bottom of the hero.
// The list is repeated twice so the loop has no gap.
const ITEMS = ['WEDDINGS', 'EVENTS', 'AERIAL / DRONE', 'NATURE', 'SHORT FILMS', 'SOCIAL MEDIA', 'COLOUR GRADING']

export default function FilmStrip() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div className="film-strip group absolute inset-x-0 bottom-0 z-20 h-11 overflow-hidden bg-fg text-paper">
      <div className="film-track flex h-full w-max items-center group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {row.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-6 px-6 font-mono text-[11px] tracking-[0.3em]">
                {item}
                <span className="text-accent">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
