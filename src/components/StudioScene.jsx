import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { THEMES } from '../themes'

// Where he stands: right side on desktop, centre on phones
function useSubjectX() {
  const { size } = useThree()
  return size.width < 768 ? 0 : 1.3
}

// The subject: his cut-out photo standing in the studio, lit by our 3D lights
function Portrait({ file }) {
  const texture = useLoader(THREE.TextureLoader, `${import.meta.env.BASE_URL}${file}`)
  texture.colorSpace = THREE.SRGBColorSpace
  const x = useSubjectX()

  // shadow that respects the transparent parts of the photo
  const depthMaterial = useMemo(
    () => new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: texture, alphaTest: 0.5 }),
    [texture]
  )

  const height = 3.4
  const width = height * (texture.image.width / texture.image.height) // keep the photo's shape
  return (
    <mesh position={[x, height / 2 - 0.25, 0]} castShadow customDepthMaterial={depthMaterial}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.02} roughness={0.85} />
    </mesh>
  )
}

// Key light that follows the cursor (the hidden "you are the light" effect)
function KeyLight({ theme }) {
  const light = useRef()
  const target = useMemo(() => new THREE.Object3D(), [])
  const goal = useMemo(() => new THREE.Vector3(), [])
  const x = useSubjectX()

  useFrame((state) => {
    target.position.set(x, 1.6, 0)
    goal.set(x + state.pointer.x * 5, 2.2 + state.pointer.y * 2.5, 3)
    light.current.position.lerp(goal, 0.06) // smooth movement
  })

  return (
    <>
      <primitive object={target} />
      <spotLight
        ref={light}
        target={target}
        position={[3, 3, 3]}
        color={theme.key}
        intensity={theme.keyIntensity}
        angle={0.38}
        penumbra={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
    </>
  )
}

// Lights on the backdrop: one behind him, one washing the left side
function BackdropLights({ theme }) {
  const back = useMemo(() => new THREE.Object3D(), [])
  const side = useMemo(() => new THREE.Object3D(), [])
  const rim = useMemo(() => new THREE.Object3D(), [])
  return (
    <>
      <primitive object={back} position={[1.3, 2.2, -6]} />
      <spotLight target={back} position={[1.3, 0.6, -1.5]} color={theme.back} intensity={theme.backIntensity} angle={0.9} penumbra={1} />
      <primitive object={side} position={[-3, 2.5, -6]} />
      <spotLight target={side} position={[-2, 0.5, -1]} color={theme.side} intensity={theme.sideIntensity} angle={0.9} penumbra={1} />
      <primitive object={rim} position={[1.3, 1.6, 0]} />
      <spotLight target={rim} position={[-1.5, 3.5, -3]} color={theme.rim} intensity={24} angle={0.5} penumbra={1} />
    </>
  )
}

function Studio({ theme }) {
  const paper = { color: theme.paper, roughness: 1, side: THREE.DoubleSide }
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

export default function StudioScene({ themeName = 'cream' }) {
  const theme = THEMES[themeName]
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.7, 7], fov: 35 }}
      onCreated={({ camera }) => camera.lookAt(0, 1.4, 0)} // aim the camera at him
    >
      <color attach="background" args={[theme.background]} />
      <ambientLight intensity={theme.ambient} />
      <Studio theme={theme} />
      <Suspense fallback={null}>
        <Portrait file={theme.portrait} />
      </Suspense>
      <KeyLight theme={theme} />
      <BackdropLights theme={theme} />
    </Canvas>
  )
}
