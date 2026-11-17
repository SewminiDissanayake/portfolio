import { useEffect, useRef } from 'react'

const base = import.meta.env.BASE_URL

// Full-screen viewer: arrows / swipe to move, Esc or ✕ to close.
export default function Lightbox({ items, index, onClose, onChange }) {
  const item = items[index]
  const startX = useRef(null)

  const prev = () => onChange((index - 1 + items.length) % items.length)
  const next = () => onChange((index + 1) % items.length)

  // keyboard controls + stop the page behind from scrolling
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = old
    }
  })

  // swipe on phones
  const onPointerDown = (e) => (startX.current = e.clientX)
  const onPointerUp = (e) => {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 50) (dx > 0 ? prev : next)()
    startX.current = null
  }

  return (
    <div
      className="lightbox-in fixed inset-0 z-[80] flex flex-col bg-[#0b0504] text-paper"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-6 py-5 font-mono text-[11px] tracking-[0.25em] md:px-10">
        <span className="text-paper/60">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <button onClick={onClose} className="rounded-full border border-paper/30 px-4 py-2 hover:border-accent hover:text-accent">
          CLOSE ✕
        </button>
      </div>

      {/* the photo / video */}
      <div
        className="relative flex flex-1 touch-pan-y select-none items-center justify-center px-4 md:px-24"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {item.preview ? (
          <video key={item.id} src={`${base}${item.preview}`} className="lightbox-media max-h-[72vh] max-w-full" controls autoPlay playsInline />
        ) : (
          <img key={item.id} src={`${base}${item.image}`} alt={item.title} className="lightbox-media max-h-[78vh] max-w-full object-contain shadow-2xl" draggable="false" />
        )}

        <button onClick={prev} aria-label="Previous" className="absolute left-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-paper/30 text-xl hover:border-accent hover:text-accent md:left-8 md:grid">
          ←
        </button>
        <button onClick={next} aria-label="Next" className="absolute right-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-paper/30 text-xl hover:border-accent hover:text-accent md:right-8 md:grid">
          →
        </button>
      </div>

      {/* info */}
      <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-8 pt-5 md:px-10">
        <div>
          <p className="font-mono text-[10px] tracking-[0.3em] text-accent">{item.category.toUpperCase()}</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] md:text-4xl">{item.title}</h3>
        </div>
        <p className="font-mono text-[11px] tracking-[0.2em] text-paper/60">
          {item.location.toUpperCase()} · {item.year} · {item.role.toUpperCase()}
        </p>
      </div>
    </div>
  )
}
