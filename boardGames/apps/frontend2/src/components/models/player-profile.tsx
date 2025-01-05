import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PlayerProfileProps {
    name: string
    image: string
    record: string
}

export function PlayerProfile({ name, image, record }: PlayerProfileProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
                        <img
                            src={image}
                            alt={`${name}'s profile`}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <div className="text-center">
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-muted-foreground">{record}</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}