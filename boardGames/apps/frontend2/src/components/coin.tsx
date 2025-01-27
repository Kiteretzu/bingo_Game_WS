import { motion } from "framer-motion"

interface CoinProps {
  isFlipping: boolean
  side: "heads" | "tails" | null
}

const Coin: React.FC<CoinProps> = ({ isFlipping, side }) => {
  return (
    <div className="relative w-32 h-32">
      <motion.div
        className="absolute w-full h-full"
        animate={{
          rotateY: isFlipping ? [0, 360, 720, 1080, 1440] : side === "heads" ? 0 : 180,
          z: isFlipping ? [0, 150, 0, -150, 0] : 0,
        }}
        transition={{
          duration: isFlipping ? 2 : 0.5,
          ease: "easeInOut",
          times: isFlipping ? [0, 0.25, 0.5, 0.75, 1] : [0, 1],
        }}
      >
        <div className="absolute inset-0 w-full h-full rounded-full shadow-lg transform backface-hidden">
          <img src="/coin-heads.svg" alt="Heads" layout="fill" />
        </div>
        <div className="absolute inset-0 w-full h-full rounded-full shadow-lg transform rotateY-180 backface-hidden">
          <img src="/coin-tails.svg" alt="Tails" layout="fill" />
          dsd
        </div>
      </motion.div>
    </div>
  )
}

export default Coin

