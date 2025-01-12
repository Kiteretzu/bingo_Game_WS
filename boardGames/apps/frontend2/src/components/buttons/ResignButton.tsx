import React from 'react'
import { Button } from '@/components/ui/button'
import { FlagIcon } from 'lucide-react'

function ResignButton() {
    return (
        <Button
            variant="destructive"
            size="lg"
            className="font-semibold px-4 py-2"
        >
            <FlagIcon className="mr-2 h-4 w-4" />
            Resign
        </Button>
    )
}

export default ResignButton

