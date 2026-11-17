// ✏️ Kulara's selected work — one entry = one event / project.
//
//   image   → the cover photo shown on the card
//   photos  → the event's gallery (shown big when the card is opened)
//   video   → optional: a YouTube link, or an .mp4 in /public/work/
//   preview → optional: a short muted .mp4 that plays when you hover the card
//   story   → 1–3 sentences about the event
//   layout  → optional poster style: 'album' | 'magazine' | 'collage' | 'film'
//   text    → optional: extra paragraphs for the album layout, e.g. ['First…', 'Second…']
//             (if layout is left out: Weddings→album, Events→collage, Aerial→film, Nature→magazine)
//
// Photos go in /public/work/. Export them ~2400px on the long side,
// WebP or JPG at 85–90% quality (not from WhatsApp — it ruins quality).
// Categories must be one of: Weddings, Pre-shoots, Events, Photoshoots, Aerial, Nature

export const CATEGORIES = ['All', 'Weddings', 'Pre-shoots', 'Events', 'Photoshoots', 'Aerial', 'Nature']

export const WORKS = [
  {
    id: 'wedding-01',
    title: 'The Kandy Wedding',
    category: 'Weddings',
    location: 'Kandy',
    year: 2026,
    role: 'Shot & edited',
    image: 'work/sample-wedding-1.webp', // SAMPLE (Unsplash) — replace with Kulara's
    preview: null, // e.g. 'work/wedding-01-clip.mp4'
    layout: 'album', // try 'album', 'magazine', 'collage' or 'film'
    video: null, // e.g. 'https://youtu.be/xxxxxxxx'
    story: 'An autumn lakeside wedding — soft light, slow moments and a lot of laughter. (Sample text: replace with the real story.)',
    photos: [
      // SAMPLE photos (Unsplash) — replace with Kulara's before going live
      'work/sample-wedding-1.webp',
      'work/sample-wedding-2.webp',
      'work/sample-wedding-3.webp',
      'work/sample-wedding-4.webp',
    ],
  },
  {
    id: 'event-01',
    title: 'Batch Party Night',
    category: 'Events',
    location: 'Matale',
    year: 2026,
    role: 'Event coverage',
    image: 'work/event-01.webp',
    preview: null,
    video: null, // e.g. 'https://youtu.be/xxxxxxxx'
    story: 'Placeholder story — replace with a few words about this event: who it was for, the mood, and what Kulara did.',
    photos: [
      'work/event-01-01.webp',
      'work/event-01-02.webp',
      'work/event-01-03.webp',
      'work/event-01-04.webp',
      'work/event-01-05.webp',
    ],
  },
  {
    id: 'aerial-01',
    title: 'Above the Hills',
    category: 'Aerial',
    location: 'Knuckles Range',
    year: 2025,
    role: 'Drone pilot & edit',
    image: 'work/aerial-01.webp',
    preview: null,
    video: null, // e.g. 'https://youtu.be/xxxxxxxx'
    story: 'Placeholder story — replace with a few words about this event: who it was for, the mood, and what Kulara did.',
    photos: [
      'work/aerial-01-01.webp',
      'work/aerial-01-02.webp',
      'work/aerial-01-03.webp',
      'work/aerial-01-04.webp',
      'work/aerial-01-05.webp',
    ],
  },
  {
    id: 'nature-01',
    title: 'Morning Mist',
    category: 'Nature',
    location: 'Riverston',
    year: 2025,
    role: 'Photography',
    image: 'work/nature-01.webp',
    preview: null,
    video: null, // e.g. 'https://youtu.be/xxxxxxxx'
    story: 'Placeholder story — replace with a few words about this event: who it was for, the mood, and what Kulara did.',
    photos: [
      'work/nature-01-01.webp',
      'work/nature-01-02.webp',
      'work/nature-01-03.webp',
      'work/nature-01-04.webp',
      'work/nature-01-05.webp',
    ],
  },
  {
    id: 'wedding-02',
    title: 'Golden Hour Vows',
    category: 'Weddings',
    location: 'Colombo',
    year: 2025,
    role: 'Photography',
    image: 'work/sample-wedding-3.webp', // SAMPLE
    preview: null,
    layout: 'collage', // try 'album', 'magazine', 'collage' or 'film'
    video: null, // e.g. 'https://youtu.be/xxxxxxxx'
    story: 'Placeholder story — replace with a few words about this event: who it was for, the mood, and what Kulara did.',
    photos: [
      // SAMPLE photos (Unsplash) — replace with Kulara's before going live
      'work/sample-wedding-1.webp',
      'work/sample-wedding-2.webp',
      'work/sample-wedding-3.webp',
      'work/sample-wedding-4.webp',
    ],
  },
  {
    id: 'event-02',
    title: 'Media Unit — Annual Event',
    category: 'Events',
    location: 'Buddhist College, Matale',
    year: 2026,
    role: 'Media Unit coverage',
    image: 'work/event-02.webp',
    preview: null,
    video: null, // e.g. 'https://youtu.be/xxxxxxxx'
    story: 'Placeholder story — replace with a few words about this event: who it was for, the mood, and what Kulara did.',
    photos: [
      'work/event-02-01.webp',
      'work/event-02-02.webp',
      'work/event-02-03.webp',
      'work/event-02-04.webp',
      'work/event-02-05.webp',
    ],
  },
  {
    id: 'aerial-02',
    title: 'Coastline',
    category: 'Aerial',
    location: 'Southern coast',
    year: 2025,
    role: 'Drone pilot',
    image: 'work/aerial-02.webp',
    preview: null,
    video: null, // e.g. 'https://youtu.be/xxxxxxxx'
    story: 'Placeholder story — replace with a few words about this event: who it was for, the mood, and what Kulara did.',
    photos: [
      'work/aerial-02-01.webp',
      'work/aerial-02-02.webp',
      'work/aerial-02-03.webp',
      'work/aerial-02-04.webp',
      'work/aerial-02-05.webp',
    ],
  },
  {
    id: 'nature-02',
    title: 'Quiet Forest',
    category: 'Nature',
    location: 'Sinharaja',
    year: 2024,
    role: 'Photography',
    image: 'work/nature-02.webp',
    preview: null,
    video: null, // e.g. 'https://youtu.be/xxxxxxxx'
    story: 'Placeholder story — replace with a few words about this event: who it was for, the mood, and what Kulara did.',
    photos: [
      'work/nature-02-01.webp',
      'work/nature-02-02.webp',
      'work/nature-02-03.webp',
      'work/nature-02-04.webp',
      'work/nature-02-05.webp',
    ],
  },
  {
    id: 'wedding-03',
    title: 'A Homecoming',
    category: 'Weddings',
    location: 'Kurunegala',
    year: 2024,
    role: 'Wedding film',
    image: 'work/sample-wedding-4.webp', // SAMPLE
    preview: null,
    layout: 'film', // try 'album', 'magazine', 'collage' or 'film'
    video: null, // e.g. 'https://youtu.be/xxxxxxxx'
    story: 'Placeholder story — replace with a few words about this event: who it was for, the mood, and what Kulara did.',
    photos: [
      // SAMPLE photos (Unsplash) — replace with Kulara's before going live
      'work/sample-wedding-1.webp',
      'work/sample-wedding-2.webp',
      'work/sample-wedding-3.webp',
      'work/sample-wedding-4.webp',
    ],
  },
  {
    id: 'preshoot-01',
    title: 'Before the Big Day',
    category: 'Pre-shoots',
    location: 'Nuwara Eliya',
    year: 2026,
    role: 'Pre-shoot photography',
    image: 'work/sample-wedding-3.webp', // SAMPLE
    preview: null,
    layout: 'album',
    video: null,
    story: 'A misty hill-country morning with the couple, weeks before the wedding. (Sample text: replace with the real story.)',
    photos: [
      // SAMPLE photos (Unsplash) — replace with Kulara's before going live
      'work/sample-wedding-3.webp',
      'work/sample-wedding-1.webp',
      'work/sample-wedding-4.webp',
      'work/sample-wedding-2.webp',
    ],
  },
  {
    id: 'photoshoot-01',
    title: 'Studio Portraits',
    category: 'Photoshoots',
    location: 'Matale',
    year: 2026,
    role: 'Portrait session',
    image: 'work/photoshoot-01.webp',
    preview: null,
    layout: 'magazine',
    video: null,
    story: 'Placeholder story — replace with a few words about this shoot.',
    photos: [
      'work/photoshoot-01-01.webp',
      'work/photoshoot-01-02.webp',
      'work/photoshoot-01-03.webp',
      'work/photoshoot-01-04.webp',
    ],
  },
]
