import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CoinsIcon } from "lucide-react";

const CoinToss: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTossing, setIsTossing] = useState(false);
    const [result, setResult] = useState<"heads" | "tails" | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const meshRef = useRef<THREE.Mesh | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    // Set up the Three.js scene
    const setupScene = () => {
        if (!canvasRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);

        // Camera
        const camera = new THREE.PerspectiveCamera(
            75,
            canvasRef.current.width / canvasRef.current.height,
            0.1,
            1000
        );
        camera.position.set(0, 0, 5);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
        });
        renderer.setSize(400, 400);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);                           
        scene.add(pointLight);

        // Coin geometry and materials
        const geometry = new THREE.CylinderGeometry(1, 1, 0.1, 100, 1, true);

        // Only use colors for the sides of the coin
        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xc0c0c0 }), // Side material (edge)
            new THREE.MeshStandardMaterial({ color: 0x4CAF50 }), // Top material (heads)
            new THREE.MeshStandardMaterial({ color: 0xFF5722 }), // Bottom material (tails)
        ];

        const mesh = new THREE.Mesh(geometry, materials);
        scene.add(mesh);

        // Store references
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
        meshRef.current = mesh;

        // Animation loop
        const animate = () => {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    };

    // Initialize the scene when the dialog opens
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setupScene();
            }, 0);

            return () => {
                clearTimeout(timer);
                rendererRef.current?.dispose();
            };
        }
    }, [isOpen]);

    // Handle coin toss animation
    const tossCoin = () => {
        if (!isTossing && meshRef.current) {
            setIsTossing(true);
            const tossStartTime = Date.now();
            const coinResult: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
            const maxHeight = 3;
            const animationDuration = 2000;

            const randomRotations = Math.floor(Math.random() * 3) + 2;
            const targetRotationX =
                randomRotations * 2 * Math.PI + (coinResult === "heads" ? Math.PI / 2 : -Math.PI / 2);

            const animateLanding = () => {
                const elapsedTime = Date.now() - tossStartTime;
                const t = elapsedTime / animationDuration;

                if (elapsedTime < animationDuration) {
                    const verticalPosition = 4 * maxHeight * t * (1 - t);
                    if (meshRef.current) {
                        meshRef.current.position.y = verticalPosition;
                        meshRef.current.rotation.y += 0.003;
                        meshRef.current.rotation.x += 0.301;
                    }

                    requestAnimationFrame(animateLanding);
                } else {
                    setIsTossing(false);
                    setResult(coinResult);
                    if (meshRef.current) {
                        meshRef.current.position.y = 0;
                        meshRef.current.rotation.x = targetRotationX % (2 * Math.PI);
                    }
                }
            };

            animateLanding();
        }
    };

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
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="w-[400px] h-[400px]"
                ></canvas>
                <div className="w-full flex justify-center mt-4">
                    <Button
                        onClick={tossCoin}
                        disabled={isTossing}
                        className="w-full max-w-xs"
                    >
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
    );
};

export default CoinToss;