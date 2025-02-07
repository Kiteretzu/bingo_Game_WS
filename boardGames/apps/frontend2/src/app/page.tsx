import CoinTossDialog from "@/components/dialog/coin-toss-dialog"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900 text-white">
      <CoinTossDialog />
    </main>
  )
}

