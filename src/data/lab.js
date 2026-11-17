// ✏️ "The Lab" — Kulara's university / personal projects.
// Images go in /public/lab/. Replace the placeholders with the real work.
//
// type     → 'rebranding' | 'film' | 'videography' | 'animation'
// image    → poster (films), thumbnail (videos), still (animation)
// video    → a YouTube link, or an .mp4 in /public/lab/ (optional)
// loop     → animation only: a short muted .mp4 that loops on the card (optional)
// brand    → rebranding only: old/new logo, colours, fonts and mockups

export const STUDY = {
  degree: 'BA in Creative Multimedia', // ✏️ exact degree name
  university: 'University name', // ✏️
  year: 'Year 2', // ✏️ current year
}

export const LAB_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'rebranding', label: 'Rebranding' },
  { key: 'film', label: 'Short films' },
  { key: 'videography', label: 'Videography' },
  { key: 'animation', label: 'Animation' },
]

export const LAB = [
  {
    id: 'ceylon-brew',
    type: 'rebranding',
    title: 'Ceylon Brew — Rebrand',
    year: 2026,
    module: 'Year 2 · Brand Identity', // ✏️
    role: 'Brand designer',
    summary: 'A tired café logo turned into a calm, premium identity inspired by hill-country tea estates. (Sample project: replace.)',
    image: 'lab/brand-new.webp',
    brand: {
      before: 'lab/brand-old.webp',
      after: 'lab/brand-new.webp',
      colors: [
        { name: 'Estate Green', hex: '#1F3A2E' },
        { name: 'Tea Gold', hex: '#E8BE78' },
        { name: 'Clay', hex: '#C45C3C' },
        { name: 'Milk', hex: '#F4ECDF' },
      ],
      fonts: ['Inter Extra Bold', 'Cormorant Garamond'],
      mockups: ['lab/brand-mock-01.webp', 'lab/brand-mock-02.webp', 'lab/brand-mock-03.webp'],
    },
  },
  {
    id: 'the-last-bus',
    type: 'film',
    title: 'The Last Bus',
    year: 2026,
    module: 'Year 2 · Short Film', // ✏️
    role: 'Director & editor',
    runtime: '8 min',
    summary: 'A night-time short about two strangers waiting for a bus that may never come. (Sample: replace.)',
    image: 'lab/film-01.webp',
    video: null, // e.g. 'https://youtu.be/xxxxxxxxxxx'
  },
  {
    id: 'paper-boats',
    type: 'film',
    title: 'Paper Boats',
    year: 2025,
    module: 'Year 1 · Narrative Film',
    role: 'Cinematographer',
    runtime: '5 min',
    summary: 'A childhood memory told through rain, gutters and paper boats. (Sample: replace.)',
    image: 'lab/film-02.webp',
    video: null,
  },
  {
    id: 'campus-doc',
    type: 'videography',
    title: 'Campus Documentary',
    year: 2026,
    module: 'Year 2 · Documentary',
    role: 'Camera & edit',
    runtime: '4 min',
    summary: 'One day on campus, from the first lecture to the last bus home. (Sample: replace.)',
    image: 'lab/video-01.webp',
    video: null,
  },
  {
    id: '2d-loop',
    type: 'animation',
    title: '2D Character Loop',
    year: 2026,
    module: 'Year 2 · Animation',
    role: 'Animator',
    summary: 'A looping walk cycle with hand-drawn timing. (Sample: replace.)',
    image: 'lab/anim-01.webp',
    loop: null, // e.g. 'lab/walk-cycle.mp4'
    video: null,
  },
  {
    id: 'motion-titles',
    type: 'animation',
    title: 'Motion Titles',
    year: 2025,
    module: 'Year 1 · Motion Graphics',
    role: 'Motion designer',
    summary: 'Kinetic title sequence for a student film festival. (Sample: replace.)',
    image: 'lab/anim-02.webp',
    loop: null,
    video: null,
  },
  {
    id: 'music-video',
    type: 'videography',
    title: 'Music Video',
    year: 2025,
    module: 'Year 1 · Video Production',
    role: 'Director of photography',
    runtime: '3 min',
    summary: 'A performance video lit with just two lights and a lot of haze. (Sample: replace.)',
    image: 'lab/video-02.webp',
    video: null,
  },
]
