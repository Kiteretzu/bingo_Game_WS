import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppSelector } from "@/store/hooks"

interface PlayerProfileProps {
    name: string
    image: string
    record: string
}

export function PlayerProfile({ name, image, record }: PlayerProfileProps) {
    const dummyData = useAppSelector(state=> state.profile.avatar)
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
                        <img
                            src={dummyData}
                            alt={`${name}'s profile`}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <div className="text-center">
                        <p className="font-semibold ">Smarth</p>
                        <p className="text-sm text-muted-foreground">{record}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}