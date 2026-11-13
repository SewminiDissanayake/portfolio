// Colour themes for the 3D studio. The page colours (text, buttons) live in index.css.
// To try a new look, copy one of these and change the colours.
export const THEMES = {
  cream: {
    label: 'Vintage Cream',
    accent: '#a8462a', // rust (matches the page accent)
    background: '#e9dfcc', // sky/fog colour behind everything
    paper: '#e8dcc6', // studio backdrop paper
    ambient: 1.6, // soft fill light (light themes need more)
    key: '#fff1dc', // main light on him
    keyIntensity: 26,
    rim: '#fff6e6',
    back: '#ffd9a8', // warm pool of light behind him
    backIntensity: 160,
    side: '#e7c9a0', // wash on the left side of the backdrop
    sideIntensity: 120,
    portrait: 'hero-portrait-vintage.webp',
  },
  sage: {
    label: 'Faded Sage',
    accent: '#94681a', // mustard
    background: '#d5d2bd',
    paper: '#d1ceb6',
    ambient: 1.5,
    key: '#fff4df',
    keyIntensity: 26,
    rim: '#ffffff',
    back: '#efe7c6',
    backIntensity: 150,
    side: '#aeb08c',
    sideIntensity: 120,
    portrait: 'hero-portrait-vintage.webp',
  },
}
