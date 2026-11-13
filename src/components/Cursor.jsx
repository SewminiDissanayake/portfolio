import { useEffect, useRef, useState } from 'react'

// Camera viewfinder cursor: four focus brackets that follow the mouse.
// Over a link/button it opens up and shows a label (from data-cursor="PLAY" etc).
// Desktop only (devices with a real mouse).
export default function Cursor() {
  const ref = useRef(null)
  const [label, setLabel] = useState('')
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)

  useEffect(() => {
    if (!enabled) return
    document.body.classList.add('has-cursor')
    let tx = -100, ty = -100, x = -100, y = -100, raf

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
    }
    const onOver = (e) => {
      const target = e.target.closest('[data-cursor], a, button')
      setLabel(target ? target.getAttribute('data-cursor') || 'OPEN' : '')
    }
    const tick = () => {
      x += (tx - x) * 0.22 // follows smoothly, with a little lag
      y += (ty - y) * 0.22
      if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    raf = requestAnimationFrame(tick)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null
  const active = label !== ''
  const size = active ? 76 : 30

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference">
      <div
        className="relative -translate-x-1/2 -translate-y-1/2 text-white transition-[width,height] duration-300 ease-out"
        style={{ width: size, height: size }}
      >
        {/* four focus brackets */}
        <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-current" />
        <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-current" />
        <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-current" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-current" />
        {/* centre: a dot, or the label */}
        <span className="absolute inset-0 grid place-items-center font-mono text-[9px] tracking-[0.2em]">
          {active ? label : <span className="h-1 w-1 rounded-full bg-current" />}
        </span>
      </div>
    </div>
  )
}
