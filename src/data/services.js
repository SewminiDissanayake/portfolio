// ✏️ Services, prices and add-ons.
// ⚠️ ALL PRICES BELOW ARE SAMPLES — replace them with Kulara's real prices before going live.
// Set price to null to show "Price on request" instead of a number.

// ✏️ Kulara's WhatsApp number: country code + number, no "+", no leading 0 (e.g. 94771234567)
export const WHATSAPP = '94XXXXXXXXX'

export const SERVICES = [
  {
    id: 'wedding',
    name: 'Wedding',
    tagline: 'The whole day, told like a film.',
    image: 'work/sample-wedding-1.webp',
    price: 85000, // ✏️ SAMPLE
    hours: 'Full day',
    delivery: '4–6 weeks',
    includes: ['Photography — full day', '300+ edited photos', 'Highlight film (3–5 min)', 'Online gallery'],
    addons: [
      { id: 'drone', name: 'Drone coverage', price: 15000 }, // ✏️ SAMPLE
      { id: 'album', name: 'Printed album', price: 25000 },
      { id: 'sde', name: 'Same-day edit video', price: 30000 },
      { id: 'second', name: 'Second shooter', price: 20000 },
    ],
  },
  {
    id: 'preshoot',
    name: 'Pre-shoot',
    tagline: 'Before the big day — relaxed and real.',
    image: 'work/sample-wedding-3.webp',
    price: 35000, // ✏️ SAMPLE
    hours: '3–4 hours',
    delivery: '2 weeks',
    includes: ['One location', '80+ edited photos', 'Short reel (30–60 s)'],
    addons: [
      { id: 'drone', name: 'Drone shots', price: 10000 },
      { id: 'location', name: 'Extra location', price: 8000 },
      { id: 'film', name: 'Cinematic film (2 min)', price: 15000 },
    ],
  },
  {
    id: 'event',
    name: 'Events & parties',
    tagline: 'Batch parties, functions, school events.',
    image: 'work/event-01.webp',
    price: 25000, // ✏️ SAMPLE
    hours: 'Up to 5 hours',
    delivery: '1–2 weeks',
    includes: ['Event photography', '150+ edited photos', 'Online gallery'],
    addons: [
      { id: 'video', name: 'Event highlight video', price: 15000 },
      { id: 'reels', name: '3 social media reels', price: 9000 },
      { id: 'drone', name: 'Drone shots', price: 10000 },
    ],
  },
  {
    id: 'promo',
    name: 'Promos & reels',
    tagline: 'Content that sells — for your business.',
    image: 'media/reel-01.webp',
    price: 20000, // ✏️ SAMPLE
    hours: 'Half day',
    delivery: '5–7 days',
    includes: ['Concept + script', '1 promo video (30–60 s)', 'Vertical + square versions'],
    addons: [
      { id: 'reels', name: '3 extra reels', price: 12000 },
      { id: 'photos', name: 'Product photos (20)', price: 8000 },
      { id: 'drone', name: 'Drone shots', price: 10000 },
    ],
  },
  {
    id: 'drone',
    name: 'Drone / aerial',
    tagline: 'Hotels, land, events — from above.',
    image: 'work/aerial-03.webp',
    price: 15000, // ✏️ SAMPLE
    hours: '2 hours',
    delivery: '1 week',
    includes: ['4K aerial video', '20 aerial photos', 'Licensed pilot flight'],
    addons: [
      { id: 'edit', name: 'Edited aerial film', price: 10000 },
      { id: 'location', name: 'Extra location', price: 7000 },
    ],
  },
  {
    id: 'portrait',
    name: 'Photoshoots',
    tagline: 'Portraits, graduation, personal brand.',
    image: 'work/photoshoot-01.webp',
    price: 12000, // ✏️ SAMPLE
    hours: '1–2 hours',
    delivery: '1 week',
    includes: ['One location', '30 edited photos', 'Colour graded'],
    addons: [
      { id: 'outfit', name: 'Extra outfit', price: 3000 },
      { id: 'reel', name: 'Behind-the-scenes reel', price: 5000 },
    ],
  },
]

export const STEPS = [
  { title: 'Chat', text: 'Tell me about your day or your business on WhatsApp.' },
  { title: 'Plan', text: 'We fix the date, places, shot list and the look.' },
  { title: 'Shoot', text: 'I capture it — you just enjoy the moment.' },
  { title: 'Deliver', text: 'Edited photos and films, ready to share.' },
]
