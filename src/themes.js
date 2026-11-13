// Colour themes for the 3D studio. The page colours (text, buttons) live in index.css.
// To try a new look, copy one of these and change the colours.
export const THEMES = {
  cream: {
    label: 'Vintage Cream',
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
  sepia: {
    label: 'Sepia Film',
    background: '#d6bf9a',
    paper: '#d2b991',
    ambient: 1.3,
    key: '#ffe2bb',
    keyIntensity: 28,
    rim: '#fff0d6',
    back: '#f4c27e',
    backIntensity: 180,
    side: '#a8744a',
    sideIntensity: 120,
    portrait: 'hero-portrait-vintage.webp',
  },
  sage: {
    label: 'Faded Sage',
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
  teal: {
    label: 'Teal & Orange',
    background: '#071317',
    paper: '#12211f',
    ambient: 0.15,
    key: '#ffc999',
    keyIntensity: 32,
    rim: '#3fd0d4',
    back: '#1d8f97',
    backIntensity: 420,
    side: '#0f5f68',
    sideIntensity: 320,
    portrait: 'hero-portrait.webp',
  },
}
