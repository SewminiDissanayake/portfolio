import { useState } from 'react'
import { CONTACT } from '../data/contact'
import { SERVICES, WHATSAPP } from '../data/services'
import Magnetic from './Magnetic'

// ───────────────────────────── contact
function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [form, setForm] = useState({ name: '', email: '', service: SERVICES[0].name, date: '', message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    // no Formspree yet → open the visitor's email app with everything filled in
    if (!CONTACT.formspreeId) {
      const body = `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\nDate: ${form.date}\n\n${form.message}`
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Booking enquiry — ${form.service}`)}&body=${encodeURIComponent(body)}`
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${CONTACT.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="lightbox-in flex h-full flex-col justify-center rounded-sm border border-paper/15 p-10 text-center">
        <p className="text-5xl">📩</p>
        <p className="mt-5 font-display text-4xl italic">Message sent.</p>
        <p className="mt-3 text-sm text-paper/60">Thank you — I'll get back to you within a day.</p>
      </div>
    )
  }

  const field = 'w-full border-b border-paper/25 bg-transparent py-3 text-base text-paper placeholder:text-paper/35 focus:border-accent focus:outline-none'
  const label = 'font-mono text-[10px] tracking-[0.25em] text-paper/50'

  return (
    <form onSubmit={submit} className="grid gap-7 sm:grid-cols-2">
      <label className="block">
        <span className={label}>YOUR NAME</span>
        <input required value={form.name} onChange={set('name')} className={field} placeholder="Nadeesha" />
      </label>
      <label className="block">
        <span className={label}>EMAIL</span>
        <input required type="email" value={form.email} onChange={set('email')} className={field} placeholder="you@email.com" />
      </label>
      <label className="block">
        <span className={label}>SERVICE</span>
        <select value={form.service} onChange={set('service')} className={`${field} cursor-pointer [&>option]:bg-[#1a0e09]`}>
          {SERVICES.map((s) => (
            <option key={s.id}>{s.name}</option>
          ))}
          <option>Something else</option>
        </select>
      </label>
      <label className="block">
        <span className={label}>DATE (IF YOU HAVE ONE)</span>
        <input type="date" value={form.date} onChange={set('date')} className={`${field} [color-scheme:dark]`} />
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>TELL ME ABOUT IT</span>
        <textarea required rows={4} value={form.message} onChange={set('message')} className={`${field} resize-none`} placeholder="Where, how many people, the mood you want…" />
      </label>
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <Magnetic>
          <button disabled={status === 'sending'} className="rounded-full bg-paper px-8 py-4 font-mono text-[11px] tracking-[0.2em] text-[#1a0e09] transition-colors hover:bg-accent hover:text-white disabled:opacity-60">
            {status === 'sending' ? 'SENDING…' : 'SEND MESSAGE →'}
          </button>
        </Magnetic>
        {status === 'error' && <span className="text-sm text-[#ff8a7a]">Couldn't send — please try WhatsApp instead.</span>}
      </div>
    </form>
  )
}

export default function Contact() {
  const year = new Date().getFullYear()
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const nav = [
    ['Work', '#work'],
    ['Aerial', '#aerial'],
    ['Media', '#media'],
    ['Lab', '#lab'],
    ['Services', '#services'],
  ]

  return (
    <>
      <section id="contact" className="relative overflow-hidden bg-[#1a0e09] text-paper">
        <div className="px-6 py-24 md:px-12 md:py-32" style={{ '--color-paper': '#f4ecdf', '--color-accent': '#e0864e' }}>
          {/* glow */}
          <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(224,134,78,0.18),transparent_65%)]" />

          <p className="relative flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] text-paper/70">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#3ecf6a]" /> 07 — AVAILABLE FOR BOOKINGS
          </p>
          <h2 className="relative mt-6 text-6xl font-extrabold leading-[0.9] tracking-[-0.05em] md:text-[8.5rem]">
            Let's make
            <br />
            <em className="font-display font-medium italic text-accent">something</em> real.
          </h2>

          <div className="relative mt-16 grid gap-14 md:grid-cols-12 md:gap-16">
            {/* quick contact */}
            <div className="space-y-8 md:col-span-5">
              <Magnetic strength={0.15} className="block">
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Kulara! I saw your portfolio 👋")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex w-full items-center justify-between gap-4 rounded-full bg-[#25d366] py-3 pl-7 pr-3 text-[#06210f] transition-transform hover:scale-[1.02]"
                >
                  <span className="font-mono text-[12px] font-bold tracking-[0.2em]">💬 CHAT ON WHATSAPP</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#06210f] text-white transition-transform group-hover:rotate-[-45deg]">→</span>
                </a>
              </Magnetic>

              <dl className="space-y-5 border-t border-paper/10 pt-8 !mt-10">
                {[
                  ['EMAIL', <a key="e" href={`mailto:${CONTACT.email}`} className="hover:text-accent">{CONTACT.email}</a>],
                  ['PHONE', CONTACT.phone],
                  ['BASED IN', CONTACT.location],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] tracking-[0.25em] text-paper/45">{k}</dt>
                    <dd className="mt-1 text-xl font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap gap-2 border-t border-paper/10 pt-8">
                {CONTACT.socials.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="rounded-full border border-paper/25 px-4 py-2 font-mono text-[10px] tracking-[0.2em] hover:border-accent hover:text-accent">
                    {s.name.toUpperCase()} ↗
                  </a>
                ))}
              </div>
            </div>

            {/* form */}
            <div className="md:col-span-7">
              <p className="mb-8 font-mono text-[11px] tracking-[0.3em] text-paper/50">OR SEND A MESSAGE</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── footer */}
      <footer className="relative overflow-hidden bg-[#120906] px-6 pb-8 pt-16 text-[#f4ecdf] md:px-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <nav className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] tracking-[0.25em]">
            {nav.map(([l, h]) => (
              <a key={h} href={h} className="text-[#f4ecdf]/60 hover:text-[#e0864e]">{l.toUpperCase()}</a>
            ))}
          </nav>
          <Magnetic>
            <button onClick={toTop} className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-[#f4ecdf]/70 hover:text-[#e0864e]" aria-label="Back to top">
              BACK TO TOP <span className="grid h-10 w-10 place-items-center rounded-full border border-current">↑</span>
            </button>
          </Magnetic>
        </div>

        {/* giant name */}
        <p className="mt-14 select-none whitespace-nowrap text-[10.3vw] font-extrabold leading-[0.85] tracking-[-0.06em] text-[#f4ecdf]/[0.07]">
          Kulara Ramanayake
        </p>

        <div className="mt-6 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[10px] tracking-[0.2em] text-[#f4ecdf]/45">
          <span>© {year} KULARA RAMANAYAKE · ALL RIGHTS RESERVED</span>
          <span>VIDEOGRAPHY · PHOTOGRAPHY · SRI LANKA</span>
        </div>
      </footer>
    </>
  )
}
