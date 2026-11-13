import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// A cinema camera built from simple 3D shapes, slowly turning 360°.
// The lens points along +X; turning around Y shows every side.
export default function CinemaCamera({ accent }) {
  const group = useRef()
  const { size } = useThree()
  const isMobile = size.width < 768

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.rotation.y = t * 0.5 // one full turn ≈ 12.5 seconds
    group.current.position.y = 2.3 + Math.sin(t * 1.2) * 0.05 // gentle float
  })

  // its own soft light so it is visible on the left side of the studio
  const target = useMemo(() => new THREE.Object3D(), [])

  if (isMobile) return null // keep phones clean and fast

  const body = { color: '#2a2724', roughness: 0.45, metalness: 0.3 }
  const dark = { color: '#161514', roughness: 0.6 }
  const metal = { color: '#9a958f', roughness: 0.25, metalness: 1 }
  const rubber = { color: '#2e2b28', roughness: 0.95 }
  const alongX = [0, 0, Math.PI / 2] // rotate a cylinder so it lies along X

  return (
    <>
      <primitive object={target} position={[-1.75, 2.3, 0.6]} />
      <spotLight target={target} position={[-0.5, 4.5, 4]} color="#fff3e2" intensity={80} angle={0.45} penumbra={1} />

      <group ref={group} position={[-1.75, 2.3, 0.6]} scale={0.78}>
        {/* body */}
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.6, 0.5]} />
          <meshStandardMaterial {...body} />
        </mesh>
        {/* side panels */}
        <mesh position={[0, 0, 0.255]}>
          <boxGeometry args={[0.55, 0.36, 0.02]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, 0, -0.255]}>
          <boxGeometry args={[0.55, 0.36, 0.02]} />
          <meshStandardMaterial {...dark} />
        </mesh>

        {/* lens */}
        <mesh position={[0.5, 0, 0]} rotation={alongX}>
          <cylinderGeometry args={[0.22, 0.22, 0.1, 48]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0.77, 0, 0]} rotation={alongX} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.45, 48]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0.7, 0, 0]} rotation={alongX}>
          <cylinderGeometry args={[0.215, 0.215, 0.12, 48]} />
          <meshStandardMaterial {...rubber} />
        </mesh>
        <mesh position={[0.92, 0, 0]} rotation={alongX}>
          <cylinderGeometry args={[0.205, 0.205, 0.03, 48]} />
          <meshStandardMaterial color={accent} roughness={0.4} />
        </mesh>
        {/* lens hood */}
        <mesh position={[1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.29, 0.21, 0.16, 48, 1, true]} />
          <meshStandardMaterial {...dark} side={THREE.DoubleSide} />
        </mesh>
        {/* glass */}
        <mesh position={[0.995, 0, 0]} rotation={alongX}>
          <cylinderGeometry args={[0.17, 0.17, 0.01, 48]} />
          <meshPhysicalMaterial color="#1a2030" metalness={0.3} roughness={0.05} clearcoat={1} />
        </mesh>

        {/* top handle */}
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[0.62, 0.05, 0.08]} />
          <meshStandardMaterial {...body} />
        </mesh>
        <mesh position={[-0.22, 0.37, 0]}>
          <boxGeometry args={[0.05, 0.15, 0.05]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0.22, 0.37, 0]}>
          <boxGeometry args={[0.05, 0.15, 0.05]} />
          <meshStandardMaterial {...metal} />
        </mesh>

        {/* side monitor */}
        <group position={[-0.1, 0.12, 0.38]} rotation={[0, 0.5, 0]}>
          <mesh>
            <boxGeometry args={[0.42, 0.28, 0.04]} />
            <meshStandardMaterial {...dark} />
          </mesh>
          <mesh position={[0, 0, 0.021]}>
            <planeGeometry args={[0.36, 0.22]} />
            <meshBasicMaterial color={accent} transparent opacity={0.55} />
          </mesh>
        </group>

        {/* viewfinder */}
        <mesh position={[-0.6, 0.2, -0.18]} rotation={alongX}>
          <cylinderGeometry args={[0.06, 0.07, 0.32, 24]} />
          <meshStandardMaterial {...rubber} />
        </mesh>

        {/* rods underneath */}
        <mesh position={[0.2, -0.36, 0.1]} rotation={alongX}>
          <cylinderGeometry args={[0.025, 0.025, 1.1, 16]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0.2, -0.36, -0.1]} rotation={alongX}>
          <cylinderGeometry args={[0.025, 0.025, 1.1, 16]} />
          <meshStandardMaterial {...metal} />
        </mesh>

        {/* red REC light */}
        <mesh position={[0.4, 0.24, 0.26]}>
          <sphereGeometry args={[0.025, 16, 16]} />
          <meshBasicMaterial color="#e5212b" />
        </mesh>
      </group>
    </>
  )
}
