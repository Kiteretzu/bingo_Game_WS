import { Button } from "@repo/ui/button";
import { CoinToss } from "@repo/ui/exp";
import Test from "@repo/ui/test";





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
