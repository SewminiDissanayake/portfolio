import { useEffect, useRef } from 'react'

// Wrap any button/link: when the mouse comes close, it is pulled toward the cursor
// like a magnet, and springs back when the mouse leaves.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transition = 'transform 0.15s ease-out'
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    }
    const onLeave = () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.4)' // springy return
      el.style.transform = 'translate(0, 0)'
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])

  return (
    <span ref={ref} className={`inline-block p-3 -m-3 ${className}`}>
      {children}
    </span>
  )
}
