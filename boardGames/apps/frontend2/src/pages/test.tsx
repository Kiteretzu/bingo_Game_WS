import CoinToss from '@/components/coinToss'
import { Button } from "@repo/ui/button";
import Test from "@repo/ui/test";
import { ExpandableCard } from "@repo/ui/exp";
import HowToPlay from '@/components/HowToPlay';





function test() {
  return (
    <div className='min-h-screen bg-slate-950'>
      <CoinToss />
      <Button children={"Hi"} appName={''} />
      <Test />
      <div className='max-w-sm'>

      </div>
    </div>
  )
}

export default test
