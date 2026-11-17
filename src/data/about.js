// ✏️ Kulara's "About me" — shown in the card on the hero and the story panel it opens.
// Lines marked ✏️ are samples or guesses: replace them with the real details.

export const ABOUT = {
  photo: 'photo1-graded.webp', // a photo in /public
  bio: [
    "Kulara here — a videographer and photographer from Sri Lanka. I started behind the camera at my school media unit, filming sports meets, prize givings and every big moment in between.",
    'Today I shoot weddings, events, promos and the island from above — and I still study creative multimedia, because there is always a new way to tell a story.', // ✏️
  ],

  // small facts on the hero card + panel
  facts: [
    { value: '2×', label: 'Award winner' },
    { value: '150+', label: 'Events covered' }, // ✏️
    { value: '✓', label: 'Advanced Diploma' },
    { value: 'BA', label: 'In progress' },
  ],

  // journey timeline (oldest first). status: 'done' | 'award' | 'now'
  journey: [
    { year: '2022', title: 'Joined the Media Unit', text: 'Buddhist College, Matale — photography & videography.', status: 'done' }, // ✏️ year
    { year: '2024', title: 'Advanced Diploma in Creative Multimedia', text: 'Completed successfully. Institute name here.', status: 'done' }, // ✏️
    { year: '2025', title: 'Photography award', text: 'Award name and organiser here.', status: 'award' }, // ✏️
    { year: '2026', title: 'Most Popular Facebook Page', text: 'Thrimalee Social Media Awards Ceremony 2026.', status: 'award' },
    { year: 'NOW', title: 'BA in Creative Multimedia', text: 'Year 2 — still learning, always making.', status: 'now', progress: 0.5 }, // ✏️ progress 0–1
  ],

  awards: [
    { title: 'The Most Popular Facebook Page', by: 'Thrimalee Social Media Awards 2026', photo: 'media/award.webp' },
    { title: 'Photography award', by: 'Award name & year here', photo: null }, // ✏️ add the photo when you have it
  ],

  tools: ['Premiere Pro', 'DaVinci Resolve', 'Lightroom', 'Photoshop', 'After Effects', 'Drone pilot', 'Colour grading'], // ✏️
}
