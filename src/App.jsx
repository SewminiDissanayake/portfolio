import { useState } from 'react'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Cursor from './components/Cursor'

// The page is built from sections. Next: Work, About, Contact.
export default function App() {
  const [ready, setReady] = useState(false) // true once the shutter intro has opened
  return (
    <main>
      <Intro onDone={() => setReady(true)} />
      <Cursor />
      <Hero ready={ready} />
    </main>
  )
}
