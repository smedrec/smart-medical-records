'use client'

import { ComponentPropsWithoutRef, forwardRef } from 'react'

import { Button } from '@repo/ui/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@repo/ui/components/ui/tooltip'
import { cn } from '@repo/ui/lib/utils'

export type TooltipIconButtonProps = ComponentPropsWithoutRef<typeof Button> & {
	tooltip: string
	side?: 'top' | 'bottom' | 'left' | 'right'
}

export const TooltipIconButton = forwardRef<HTMLButtonElement, TooltipIconButtonProps>(
	({ children, tooltip, side = 'bottom', className, ...rest }, ref) => {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							{...rest}
							className={cn('size-6 p-1', className)}
							ref={ref}
						>
							{children}
							<span className="sr-only">{tooltip}</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side={side}>{tooltip}</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		)
	}
)

TooltipIconButton.displayName = 'TooltipIconButton'
