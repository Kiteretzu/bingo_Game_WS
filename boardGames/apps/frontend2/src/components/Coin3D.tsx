import type React from "react"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import type * as THREE from "three"

interface Coin3DProps {
  isFlipping: boolean
  side: "heads" | "tails" | null
}

const Coin3D: React.FC<Coin3DProps> = ({ isFlipping, side }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [headsTexture, tailsTexture] = useTexture(["/coin-tails.png", "/coin-heads.png"])

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isFlipping) {
        meshRef.current.rotation.x += delta * 15
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 5) * 0.2
      } else {
        // Adjust rotation based on side, maintaining vertical orientation
        meshRef.current.rotation.x = side === "heads" ? Math.PI / 2 : -Math.PI / 2
        meshRef.current.position.y = 0
      }
    }
  })

  // Initial rotation set to vertical (90 degrees around X-axis)
  return (
    <mesh ref={meshRef} rotation-x={Math.PI / 2}>
      <cylinderGeometry args={[1, 1, 0.1, 50]} />
      <meshStandardMaterial map={headsTexture} attachArray="material" />
      <meshStandardMaterial map={tailsTexture} attachArray="material" />
      <meshStandardMaterial color="#ffd700" attachArray="material" />
    </mesh>
  )
}

export default Coin3D