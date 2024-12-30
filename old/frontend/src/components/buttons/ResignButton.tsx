import React from 'react'
import { ActionButton } from './ActionButton'
import { BiSolidExit } from "react-icons/bi";



function ResignButton() {
    return (
        <ActionButton className='px-24 w-full font-jaro flex  items-center gap-2 justify-center bg-[#7d1313] text-2xl hover:scale-100 hover:bg-[#722121] '>
            <BiSolidExit />
            <p>
                RESIGN
            </p>
        </ActionButton>
    )
}

export default ResignButton
