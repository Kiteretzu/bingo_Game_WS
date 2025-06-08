
import type React from "react"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CoinsIcon } from "lucide-react"

export const CoinToss: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isTossing, setIsTossing] = useState(false)
    const [result, setResult] = useState<"heads" | "tails" | null>(null)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const meshRef = useRef<THREE.Mesh | null>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const animationFrameRef = useRef<number>()
    const animationStateRef = useRef({
        rotationSpeed: new THREE.Vector3(0, 0, 0),
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        phase: "idle" as "idle" | "tossing" | "falling" | "landing" | "bouncing",
        bounceCount: 0,
    })

    // Set up the Three.js scene with improved lighting and materials
    const setupScene = () => {
        if (!canvasRef.current) return

        // Scene with gradient background
        const scene = new THREE.Scene()
        const gradientTexture = new THREE.CanvasTexture(createGradientBackground())
        scene.background = gradientTexture

        // Camera with improved perspective
        const camera = new THREE.PerspectiveCamera(75, canvasRef.current.width / canvasRef.current.height, 0.1, 1000)
        camera.position.set(0, 2, 6)
        camera.lookAt(0, 0, 0)

        // Renderer with improved settings
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true,
        })
        renderer.setSize(400, 400)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        // Enhanced lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(5, 5, 5)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        const pointLight = new THREE.PointLight(0xffd700, 0.6)
        pointLight.position.set(-3, 3, 2)
        scene.add(pointLight)

        // Ground plane with shadow receiving
        const groundGeometry = new THREE.PlaneGeometry(10, 10)
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a5568,
            roughness: 0.8,
            metalness: 0.2,
        })
        const ground = new THREE.Mesh(groundGeometry, groundMaterial)
        ground.rotation.x = -Math.PI / 2
        ground.position.y = -0.5
        ground.receiveShadow = true
        scene.add(ground)

        // Improved coin geometry and materials
        const geometry = new THREE.CylinderGeometry(1, 1, 0.1, 100, 1, true)
        const materials = [
            new THREE.MeshStandardMaterial({
                color: 0xc0c0c0,
                metalness: 0.9,
                roughness: 0.2,
                envMapIntensity: 1,
            }),
            new THREE.MeshStandardMaterial({
                color: 0xffd700,
                metalness: 0.9,
                roughness: 0.1,
                envMapIntensity: 1,
            }),
            new THREE.MeshStandardMaterial({
                color: 0xffd700,
                metalness: 0.9,
                roughness: 0.1,
                envMapIntensity: 1,
            }),
        ]

        const mesh = new THREE.Mesh(geometry, materials)
        mesh.castShadow = true
        mesh.receiveShadow = true
        scene.add(mesh)

        // Enhanced coin face textures
        const createTextTexture = (text: string) => {
            const canvas = document.createElement("canvas")
            canvas.width = 512
            canvas.height = 512
            const context = canvas.getContext("2d")!

            // Create gradient background
            const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256)
            gradient.addColorStop(0, "#FFD700")
            gradient.addColorStop(1, "#B8860B")
            context.fillStyle = gradient
            context.fillRect(0, 0, 512, 512)

            // Add text with shadow
            context.shadowColor = "rgba(0, 0, 0, 0.5)"
            context.shadowBlur = 10
            context.font = "Bold 160px Arial"
            context.fillStyle = "#FFF8DC"
            context.textAlign = "center"
            context.textBaseline = "middle"
            context.fillText(text, 256, 256)

            // Add detail ring
            context.strokeStyle = "#DAA520"
            context.lineWidth = 20
            context.beginPath()
            context.arc(256, 256, 220, 0, Math.PI * 2)
            context.stroke()

            return new THREE.CanvasTexture(canvas)
        }

        materials[1].map = createTextTexture("H")
        materials[2].map = createTextTexture("T")

        // Store references
        sceneRef.current = scene
        cameraRef.current = camera
        rendererRef.current = renderer
        meshRef.current = mesh

        // Initial coin position
        mesh.rotation.x = Math.PI / 2
    }

    // Create gradient background
    const createGradientBackground = () => {
        const canvas = document.createElement("canvas")
        canvas.width = 2
        canvas.height = 400
        const context = canvas.getContext("2d")!
        const gradient = context.createLinearGradient(0, 0, 0, 400)
        gradient.addColorStop(0, "#2C5282")
        gradient.addColorStop(1, "#1A365D")
        context.fillStyle = gradient
        context.fillRect(0, 0, 2, 400)
        return canvas
    }

    // Enhanced animation loop with physics
    const animate = () => {
        if (!meshRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return

        const mesh = meshRef.current
        const state = animationStateRef.current

        if (state.phase !== "idle") {
            // Update rotation with air resistance
            mesh.rotation.x += state.rotationSpeed.x
            mesh.rotation.y += state.rotationSpeed.y
            mesh.rotation.z += state.rotationSpeed.z

            // Apply air resistance to rotation
            state.rotationSpeed.multiplyScalar(0.98)

            // Update position with physics
            state.position.add(state.velocity)
            mesh.position.copy(state.position)

            // Apply gravity with air resistance
            state.velocity.y -= 0.015
            state.velocity.multiplyScalar(0.98)

            // Handle different phases
            switch (state.phase) {
                case "tossing":
                    if (state.velocity.y < 0) {
                        state.phase = "falling"
                    }
                    break
                case "falling":
                    if (state.position.y <= 0) {
                        state.phase = "bouncing"
                        state.position.y = 0

                        // Add bounce effect
                        if (state.bounceCount < 2) {
                            state.velocity.y = Math.abs(state.velocity.y) * 0.4
                            state.bounceCount++
                        } else {
                            state.phase = "landing"
                            state.velocity.set(0, 0, 0)
                        }
                    }
                    break
                case "bouncing":
                    if (state.position.y <= 0) {
                        if (state.bounceCount < 2) {
                            state.velocity.y = Math.abs(state.velocity.y) * 0.4
                            state.bounceCount++
                        } else {
                            state.phase = "landing"
                            state.velocity.set(0, 0, 0)
                        }
                    }
                    break
                case "landing":
                    // Smooth landing animation
                    state.rotationSpeed.multiplyScalar(0.8)
                    mesh.rotation.x = THREE.MathUtils.lerp(
                        mesh.rotation.x,
                        result === "heads" ? Math.PI / 2 : -Math.PI / 2,
                        0.2
                    )
                    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, 0, 0.2)

                    if (state.rotationSpeed.length() < 0.001) {
                        state.phase = "idle"
                        setIsTossing(false)
                    }
                    break
            }
        }

        // Add subtle idle animation
        if (state.phase === "idle" && !isTossing) {
            mesh.rotation.y += 0.005
            mesh.position.y = Math.sin(Date.now() * 0.002) * 0.05
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current)
        animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Initialize scene
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setupScene()
                animationFrameRef.current = requestAnimationFrame(animate)
            }, 0)

            return () => {
                clearTimeout(timer)
                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current)
                }
                rendererRef.current?.dispose()
            }
        }
    }, [isOpen])

    // Enhanced coin toss animation
    const tossCoin = () => {
        if (!isTossing && meshRef.current) {
            setIsTossing(true)
            const coinResult: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails"
            setResult(coinResult)

            const state = animationStateRef.current
            state.bounceCount = 0
            state.position.set(0, 0, 0)
            meshRef.current.position.copy(state.position)

            // Random initial rotation for variety
            meshRef.current.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            )

            // Enhanced physics parameters
            state.velocity.set(
                (Math.random() - 0.5) * 0.1, // Slight x movement
                0.35, // Consistent upward velocity
                (Math.random() - 0.5) * 0.1  // Slight z movement
            )

            // Random rotation speed with bias towards the result
            const flips = 4 + Math.random() * 2
            state.rotationSpeed.set(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                flips * Math.PI * 2 / 60
            )

            state.phase = "tossing"
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <CoinsIcon className="w-4 h-4" />
                    Flip a Coin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle className="text-center">Coin Toss</DialogTitle>
                </DialogHeader>
                <canvas ref={canvasRef} width={400} height={400} className="w-[400px] h-[400px]"></canvas>
                <div className="w-full flex justify-center mt-4">
                    <Button onClick={tossCoin} disabled={isTossing} className="w-full max-w-xs">
                        {isTossing ? "Tossing..." : "Toss Coin"}
                    </Button>
                </div>
                {result && (
                    <div className="mt-4 text-center">
                        <p className="text-xl font-bold">Result: {result.toUpperCase()}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}