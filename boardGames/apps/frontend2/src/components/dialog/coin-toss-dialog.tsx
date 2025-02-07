import { useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Coin3D from "../Coin3D"

const CoinTossDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [coinSide, setCoinSide] = useState<"heads" | "tails" | null>(null)
  const [userChoice, setUserChoice] = useState<"first" | "second" | null>(null)

  const startCoinToss = () => {
    setIsFlipping(true)
    setUserChoice(null)
    setTimeout(() => {
      setIsFlipping(false)
      setCoinSide(Math.random() < 0.5 ? "heads" : "tails")
    }, 2000)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Button onClick={() => setIsOpen(true)}>Open Coin Toss</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-800 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">3D Coin Toss</DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Toss a 3D coin to decide who goes first
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-64 h-64 mb-6">
              <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Suspense fallback={null}>
                  <Coin3D isFlipping={isFlipping} side={coinSide} />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} />
              </Canvas>
            </div>
            {!isFlipping && !coinSide && (
              <Button onClick={startCoinToss} className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white">
                Toss Coin
              </Button>
            )}
            {coinSide && !isFlipping && !userChoice && (
              <p className="mt-4 text-xl font-semibold">The coin landed on {coinSide}!</p>
            )}
          </div>
          {coinSide && !isFlipping && !userChoice && (
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => setUserChoice("first")}
                disabled={isFlipping}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Go First
              </Button>
              <Button
                onClick={() => setUserChoice("second")}
                disabled={isFlipping}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go Second
              </Button>
            </div>
          )}
          {userChoice && (
            <DialogFooter>
              <p className="text-xl font-semibold text-center w-full">You chose to go {userChoice}!</p>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CoinTossDialog

