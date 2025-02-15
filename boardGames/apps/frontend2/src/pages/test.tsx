import { TossOptionDialog } from "@/components/dialog/toss-after-dialog"
import { CoinToss } from "../components/CoinToss"
import { TossWaitingDialog } from "@/components/dialog/toss-wating-dialog"





function test() {
  return (
    <div className='min-h-screen bg-slate-950'>
      <CoinToss />
      <div className='max-w-sm'>
        <TossOptionDialog />
        <TossWaitingDialog  isOpen/>
      </div>
    </div>
  )
}
export default test
