import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export type ActionButtonProps = ComponentProps<'button'>

export const ActionButton = ({ className, children, ...props }: ActionButtonProps) => (
    <button
        className={twMerge(
            'px-8 py-3 bg-[#456e4a] text-white font-semibold rounded-lg hover:scale-105 duration-300 active:bg-[#456e4a]/45',
            className
        )}
        {...props}
    >
        {children}
    </button>
)