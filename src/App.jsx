import { useState } from 'react'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Work from './components/Work'
import Aerial from './components/Aerial'

// The page is built from sections. Next: About, Contact.
export default function App() {
  const [ready, setReady] = useState(false) // true once the shutter intro has opened
  return (
    <main>
      <Intro onDone={() => setReady(true)} />
      <Hero ready={ready} />
      <Work />
      <Aerial />
    </main>
  )
}
