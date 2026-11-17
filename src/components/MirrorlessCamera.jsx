import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Rounded rectangle shape, extruded with a bevel → soft, product-like edges
function roundedBox(width, height, depth, radius) {
  const s = new THREE.Shape()
  const x = -width / 2
  const y = -height / 2
  s.moveTo(x + radius, y)
  s.lineTo(x + width - radius, y)
  s.quadraticCurveTo(x + width, y, x + width, y + radius)
  s.lineTo(x + width, y + height - radius)
  s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  s.lineTo(x + radius, y + height)
  s.quadraticCurveTo(x, y + height, x, y + height - radius)
  s.lineTo(x, y + radius)
  s.quadraticCurveTo(x, y, x + radius, y)
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: depth - 0.04,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 4,
    curveSegments: 12,
  })
  geo.center()
  return geo
}

// Viewfinder "hump" on top: a trapezoid
function hump() {
  const s = new THREE.Shape()
  s.moveTo(-0.22, 0)
  s.lineTo(0.22, 0)
  s.lineTo(0.14, 0.17)
  s.lineTo(-0.14, 0.17)
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.26, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3 })
  geo.center()
  return geo
}

// A modern mirrorless camera (generic design, no brand), turning 360°.
// The lens points toward the viewer (+Z); turning around Y shows every side.
// Props:
//   aim      → optional { x, y } rotation to turn toward (used by the category dial).
//              Without it, the camera just keeps spinning 360°.
//   position → where it sits; showOnMobile → also render on phones
export default function MirrorlessCamera({ accent, aim = null, position = POS, scale = 1.05, showOnMobile = false, light = true }) {
  const group = useRef()
  const { size } = useThree()
  const isMobile = size.width < 768

  const bodyGeo = useMemo(() => roundedBox(1.0, 0.62, 0.34, 0.08), [])
  const gripGeo = useMemo(() => roundedBox(0.26, 0.6, 0.26, 0.1), [])
  const humpGeo = useMemo(() => hump(), [])
  const target = useMemo(() => new THREE.Object3D(), [])

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const g = group.current
    if (aim) {
      // turn smoothly toward the aimed direction (ease-out)
      const k = 1 - Math.pow(0.02, delta)
      g.rotation.y += (aim.y - g.rotation.y) * k
      g.rotation.x += (aim.x - g.rotation.x) * k
    } else {
      g.rotation.y = t * 0.45 - 0.5 // full turn ≈ 14 s
      g.rotation.x = 0.12 // tilted slightly toward the viewer
    }
    g.position.y = position[1] + Math.sin(t * 1.1) * 0.04 // gentle float
  })

  if (isMobile && !showOnMobile) return null

  const matte = { color: '#1c1b1a', roughness: 0.65, metalness: 0.15 }
  const rubber = { color: '#141312', roughness: 0.95 }
  const metal = { color: '#a7a29b', roughness: 0.25, metalness: 1 }
  const alongZ = [Math.PI / 2, 0, 0] // cylinder lying along Z (pointing at viewer)

  return (
    <>
      {/* soft key light just for the camera */}
      {light && (
        <>
          <primitive object={target} position={position} />
          <spotLight target={target} position={[-0.5, 4.5, 4.5]} color="#fff4e6" intensity={90} angle={0.4} penumbra={1} />
        </>
      )}

      <group ref={group} position={position} scale={scale}>
        {/* body */}
        <mesh geometry={bodyGeo} castShadow>
          <meshStandardMaterial {...matte} />
        </mesh>
        {/* hand grip (right side, sticks out to the front) */}
        <mesh geometry={gripGeo} position={[0.37, -0.01, 0.1]} castShadow>
          <meshStandardMaterial {...rubber} />
        </mesh>
        {/* viewfinder hump */}
        <mesh geometry={humpGeo} position={[-0.08, 0.39, -0.02]}>
          <meshStandardMaterial {...matte} />
        </mesh>
        {/* hot shoe */}
        <mesh position={[-0.08, 0.49, -0.02]}>
          <boxGeometry args={[0.16, 0.02, 0.14]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        {/* shutter button + dials */}
        <mesh position={[0.37, 0.33, 0.12]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 24]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0.25, 0.34, -0.02]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 32]} />
          <meshStandardMaterial {...matte} />
        </mesh>
        <mesh position={[-0.36, 0.34, -0.02]}>
          <cylinderGeometry args={[0.075, 0.075, 0.05, 32]} />
          <meshStandardMaterial {...matte} />
        </mesh>
        {/* back screen */}
        <mesh position={[-0.05, -0.02, -0.176]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.62, 0.42]} />
          <meshStandardMaterial color="#0d1214" roughness={0.15} metalness={0.4} />
        </mesh>

        {/* lens: mount → barrel → rings → glass */}
        <group position={[-0.08, -0.02, 0.17]}>
          <mesh position={[0, 0, 0.025]} rotation={alongZ}>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 64]} />
            <meshStandardMaterial {...metal} />
          </mesh>
          <mesh position={[0, 0, 0.3]} rotation={alongZ} castShadow>
            <cylinderGeometry args={[0.235, 0.24, 0.5, 64]} />
            <meshStandardMaterial {...matte} />
          </mesh>
          {/* zoom ring and focus ring (rubber) */}
          <mesh position={[0, 0, 0.2]} rotation={alongZ}>
            <cylinderGeometry args={[0.25, 0.25, 0.14, 64]} />
            <meshStandardMaterial {...rubber} />
          </mesh>
          <mesh position={[0, 0, 0.42]} rotation={alongZ}>
            <cylinderGeometry args={[0.245, 0.245, 0.1, 64]} />
            <meshStandardMaterial {...rubber} />
          </mesh>
          {/* thin accent ring (theme colour) */}
          <mesh position={[0, 0, 0.52]} rotation={alongZ}>
            <cylinderGeometry args={[0.242, 0.242, 0.015, 64]} />
            <meshStandardMaterial color={accent} roughness={0.35} />
          </mesh>
          {/* front glass */}
          <mesh position={[0, 0, 0.552]} rotation={alongZ}>
            <cylinderGeometry args={[0.2, 0.2, 0.01, 64]} />
            <meshPhysicalMaterial color="#141a28" metalness={0.4} roughness={0.04} clearcoat={1} />
          </mesh>
        </group>
      </group>
    </>
  )
}

const POS = [-2.15, 2.2, 0.6] // upper-left, lined up above his name
