import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from './ui/separator'

const dummyData = [
  { moveCount: 1, value: "21" },
  { moveCount: 2, value: "34" },
  { moveCount: 3, value: "50" },
  { moveCount: 4, value: "12" },
  { moveCount: 5, value: "67" },
  { moveCount: 6, value: "23" },
  { moveCount: 7, value: "45" },
  { moveCount: 8, value: "78" },
  { moveCount: 9, value: "56" },
  { moveCount: 10, value: "89" },
  { moveCount: 11, value: "32" },
  { moveCount: 12, value: "91" }
];

function PlayerDashBoard() {
  return (
    <div className='w-full max-w-lg rounded-l-xl bg-gray-800 h-full'>
      {/* upper part */}
      <div className=' flex space-x-8 items-center '>
        <Avatar className='bg-black rounded-xl w-16 h-16 border-[#0c0c0c] border-4'>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className='text-white bg-black'>CN</AvatarFallback>
        </Avatar>

        <p className='text-2xl font-medium'>Player name</p>
      </div>
      <Separator className="my-2" />
      <div className='grid grid-flow-col py-3 pb-7  grid-rows-7 grid-cols-3 px-9'>
        {dummyData.map((each) => (
          <div key={each.moveCount} className="text-white">
            <span>{each.moveCount}{')'}</span> {each.value}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayerDashBoard