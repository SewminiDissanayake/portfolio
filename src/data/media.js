// ✏️ Media Unit + client promotions content.
// Images go in /public/media/. Replace the placeholders with Kulara's real work.
// `video` (optional) = an .mp4 in /public/media/ (muted clips play on the monitors / phones)

export const MEDIA_UNIT = {
  name: 'Buddhist College Media Unit', // ✏️ exact name
  school: 'Buddhist College, Matale',
  role: 'Photography & Videography', // ✏️ Kulara's role
  years: '2022 — 2026', // ✏️
  page: 'https://facebook.com/', // ✏️ link to the Facebook page

  // impact numbers (count up when scrolled into view). `live: true` keeps ticking up slowly.
  stats: [
    { label: 'Followers', value: 48000, suffix: '+', live: true }, // ✏️
    { label: 'Monthly reach', value: 1200000, suffix: '+' }, // ✏️
    { label: 'Events covered', value: 150, suffix: '+' }, // ✏️
    { label: 'Videos produced', value: 320, suffix: '' }, // ✏️
  ],

  award: {
    title: 'The Most Popular Facebook Page',
    by: 'Sumathi Social Media Awards Ceremony 2026', // ✏️ check the exact name
    date: 'October 2026',
    // ✏️ photo of Kulara with the award: put it in /public/media/ and write e.g. 'media/award.webp'
    photo: 'media/award.webp',
    // ✏️ optional: one or two sentences about the award
    note: 'The page Kulara shoots and edits for was named the most popular Facebook page of the year — a win built on hundreds of photos, videos and live moments.',
  },

  // clips on the broadcast monitor wall (CAM 1, CAM 2, …)
  clips: [
    { title: 'Annual Sports Meet', image: 'media/media-01.webp', video: null },
    { title: 'Prize Giving 2026', image: 'media/media-02.webp', video: null },
    { title: 'Vesak Celebration', image: 'media/media-03.webp', video: null },
    { title: 'Annual Concert', image: 'media/media-04.webp', video: null },
    { title: 'Western Band Display', image: 'media/media-05.webp', video: null },
    { title: 'Principal Interview', image: 'media/media-06.webp', video: null },
  ],
}

export const PROMOTIONS = {
  // vertical reels shown on the 3D phone wall
  reels: [
    { client: 'Café — Kandy', type: 'Instagram reel', views: 84000, image: 'media/reel-01.webp', video: null }, // ✏️
    { client: 'Bridal Salon', type: 'Promo reel', views: 52000, image: 'media/reel-02.webp', video: null },
    { client: 'Fitness Studio', type: 'Opening video', views: 31000, image: 'media/reel-03.webp', video: null },
    { client: 'Clothing Boutique', type: 'Product reel', views: 67000, image: 'media/reel-04.webp', video: null },
    { client: 'Restaurant', type: 'Menu launch', views: 45000, image: 'media/reel-05.webp', video: null },
  ],

  // names in the "worked with" strip
  clients: ['Café Kandy', 'Bridal Salon', 'Fitness Studio', 'Boutique Matale', 'Spice Restaurant', 'Hill Hotel'], // ✏️

  // before / after edit slider
  beforeAfter: {
    title: 'Product shoot — raw vs. final edit',
    before: 'media/promo-before.webp',
    after: 'media/promo-after.webp',
  },
}
