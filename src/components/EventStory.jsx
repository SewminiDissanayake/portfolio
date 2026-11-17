import { useEffect, useRef, useState } from 'react'
import Lightbox from './Lightbox'
import { LAYOUTS } from './StoryLayouts'

const base = import.meta.env.BASE_URL

// If an event doesn't choose a layout, use one that suits its category
const DEFAULT_LAYOUT = { 'Pre-shoots': 'album', Photoshoots: 'magazine', Weddings: 'album', Events: 'collage', Aerial: 'film', Nature: 'magazine' }

// Turn a YouTube link into an embed link (returns null for other links)
function youtubeEmbed(url) {
  const m = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` : null
}

// Full-screen "poster" for one event. The look comes from StoryLayouts.jsx.
export default function EventStory({ work, onClose, onNext }) {
  const [photoIndex, setPhotoIndex] = useState(null)
  const scroller = useRef(null)
  const photos = work.photos?.length ? work.photos : [work.image]
  const yt = youtubeEmbed(work.video)
  const Layout = LAYOUTS[work.layout] || LAYOUTS[DEFAULT_LAYOUT[work.category]] || LAYOUTS.magazine

  // Esc closes; lock the page behind; start at the top for each event
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && photoIndex === null && onClose()
    window.addEventListener('keydown', onKey)
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = old
    }
  }, [photoIndex, onClose])
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [work.id])

  // items for the single-photo viewer
  const lightboxItems = photos.map((p, i) => ({ ...work, id: `${work.id}-${i}`, image: p, preview: null }))

  return (
    <div ref={scroller} className="lightbox-in fixed inset-0 z-[70] overflow-y-auto bg-[#120806] text-paper" role="dialog" aria-modal="true" aria-label={work.title}>
      {/* sticky top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-paper/10 bg-[#120806]/90 px-6 py-4 font-mono text-[11px] tracking-[0.25em] backdrop-blur md:px-12">
        <span className="text-paper/60">
          <span className="text-accent">●</span> {work.category.toUpperCase()} · {photos.length} PHOTOS{work.video ? ' · FILM' : ''}
        </span>
        <button onClick={onClose} className="rounded-full border border-paper/30 px-4 py-2 hover:border-accent hover:text-accent">
          CLOSE ✕
        </button>
      </div>

      {/* the poster layout */}
      <Layout key={work.id} work={work} photos={photos} open={setPhotoIndex} />

      {/* film (YouTube or mp4) */}
      {work.video && (
        <div className="px-4 pb-16 md:px-12">
          <p className="mb-4 font-mono text-[11px] tracking-[0.3em] text-accent">▶ THE FILM</p>
          <div className="aspect-video w-full overflow-hidden bg-black">
            {yt ? (
              <iframe src={yt} title={`${work.title} — film`} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            ) : (
              <video src={`${base}${work.video}`} className="h-full w-full" controls playsInline preload="metadata" />
            )}
          </div>
        </div>
      )}

      {/* next event */}
      <button onClick={onNext} className="group flex w-full items-center justify-between border-t border-paper/10 px-6 py-12 text-left md:px-12 md:py-16">
        <span>
          <span className="block font-mono text-[10px] tracking-[0.3em] text-paper/50">NEXT STORY</span>
          <span className="mt-2 block text-3xl font-extrabold tracking-[-0.03em] transition-colors group-hover:text-accent md:text-5xl">Keep watching →</span>
        </span>
      </button>

      {photoIndex !== null && <Lightbox items={lightboxItems} index={photoIndex} onClose={() => setPhotoIndex(null)} onChange={setPhotoIndex} />}
    </div>
  )
}
