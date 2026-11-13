import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Lighting presets: where the key light goes, and how strong the rim light is
export const PRESETS = {
  FREE: null, // key light follows the cursor
  REMBRANDT: { key: [4, 3.5, 3], rim: 0.6 },
  BUTTERFLY: { key: [1.3, 4.5, 3.5], rim: 0.3 },
  SPLIT: { key: [5, 1.8, 0.6], rim: 0.2 },
  RIM: { key: [1.3, 2.5, -4], rim: 2.5 },
}

const SUBJECT = [1.3, 1.6, 0] // where the lights aim (his upper body)

// The subject: his cut-out photo standing in the studio, lit by our 3D lights
function Portrait() {
  const texture = useLoader(THREE.TextureLoader, `${import.meta.env.BASE_URL}hero-portrait.webp`)
  texture.colorSpace = THREE.SRGBColorSpace
  const { size } = useThree()
  const isMobile = size.width < 768

  // shadow that respects the transparent parts of the photo
  const depthMaterial = useMemo(
    () => new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: texture, alphaTest: 0.5 }),
    [texture]
  )

  const height = 3.4
  const width = height * (755 / 1036) // keep the photo's aspect ratio
  return (
    <mesh
      position={[isMobile ? 0 : 1.3, height / 2 - 0.25, 0]}
      castShadow
      customDepthMaterial={depthMaterial}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.02} roughness={0.85} />
    </mesh>
  )
}

// Key light + a visible softbox panel that moves with it
function KeyLight({ preset }) {
  const light = useRef()
  const softbox = useRef()
  const target = useMemo(() => new THREE.Object3D(), [])
  const goal = useMemo(() => new THREE.Vector3(), [])

  const { size } = useThree()
  const cx = size.width < 768 ? 0 : 1.3 // on phones he stands in the centre

  useFrame((state) => {
    target.position.set(cx, SUBJECT[1], SUBJECT[2]) // aim at him
    const p = PRESETS[preset]
    if (p) goal.set(...p.key)
    else goal.set(cx + state.pointer.x * 5, 2.2 + state.pointer.y * 2.5, 3) // follow cursor

    light.current.position.lerp(goal, 0.06) // smooth movement
    softbox.current.position.copy(light.current.position)
    softbox.current.lookAt(...SUBJECT)
  })

  return (
    <>
      <primitive object={target} position={SUBJECT} />
      <spotLight
        ref={light}
        target={target}
        position={[3, 3, 3]}
        color="#ffe7c7"
        intensity={32}
        angle={0.38}
        penumbra={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <mesh ref={softbox} visible={false}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial color="#f5efe6" side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

// Rim light from behind: separates the subject from the background
function RimLight({ preset }) {
  const light = useRef()
  const target = useMemo(() => new THREE.Object3D(), [])
  useFrame(() => {
    const strength = PRESETS[preset]?.rim ?? 0.6
    light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, strength * 40, 0.05)
  })
  return (
    <>
      <primitive object={target} position={SUBJECT} />
      <spotLight ref={light} target={target} position={[-1.5, 3.5, -3]} color="#e8c48a" intensity={20} angle={0.5} penumbra={1} />
    </>
  )
}

// Background light: a warm pool of light on the backdrop behind the subject
function BackgroundLight() {
  const target = useMemo(() => new THREE.Object3D(), [])
  const leftTarget = useMemo(() => new THREE.Object3D(), [])
  return (
    <>
      <primitive object={target} position={[1.3, 2.2, -6]} />
      <spotLight target={target} position={[1.3, 0.6, -1.5]} color="#b07a3c" intensity={200} angle={0.9} penumbra={1} />
      {/* burgundy wash on the left, so the empty side has depth */}
      <primitive object={leftTarget} position={[-3, 2.5, -6]} />
      <spotLight target={leftTarget} position={[-2, 0.5, -1]} color="#8a2233" intensity={220} angle={0.9} penumbra={1} />
    </>
  )
}

function Studio() {
  const paper = { color: '#1d1815', roughness: 1, side: THREE.DoubleSide }
  return (
    <>
      {/* floor (stops where the curve starts) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 6]} receiveShadow>
        <planeGeometry args={[30, 18]} />
        <meshStandardMaterial {...paper} />
      </mesh>
      {/* curved "cyclorama" corner, like a real photo studio backdrop */}
      <mesh position={[0, 3, -3]} rotation={[0, 0, Math.PI / 2]} receiveShadow>
        <cylinderGeometry args={[3, 3, 30, 48, 1, true, Math.PI, Math.PI / 2]} />
        <meshStandardMaterial {...paper} />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 8, -6]} receiveShadow>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial {...paper} />
      </mesh>
    </>
  )
}

export default function StudioScene({ preset }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.7, 7], fov: 35 }}
      onCreated={({ camera }) => camera.lookAt(0, 1.4, 0)} // aim the camera at the lens
    >
      <color attach="background" args={['#0b0a09']} />
      <ambientLight intensity={0.15} />
      <Studio />
      <Suspense fallback={null}>
        <Portrait />
      </Suspense>
      <KeyLight preset={preset} />
      <RimLight preset={preset} />
      <BackgroundLight />
    </Canvas>
  )
}
