"use client"

import type { ComponentProps } from "react"
import { useCallback } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../../lib/with-pro-guard"
import { Button } from "@blazz/ui"
import { ScrollArea, ScrollBar } from "@blazz/ui"

export type SuggestionsProps = ComponentProps<typeof ScrollArea>

const SuggestionsBase = ({ className, children, ...props }: SuggestionsProps) => (
	<ScrollArea className="w-full overflow-x-auto whitespace-nowrap" {...props}>
		<div className={cn("flex w-max flex-nowrap items-center gap-2", className)}>{children}</div>
		<ScrollBar className="hidden" orientation="horizontal" />
	</ScrollArea>
)

export type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
	suggestion: string
	onClick?: (suggestion: string) => void
}

const SuggestionBase = ({
	suggestion,
	onClick,
	className,
	variant = "outline",
	size = "sm",
	children,
	...props
}: SuggestionProps) => {
	const handleClick = useCallback(() => {
		onClick?.(suggestion)
	}, [onClick, suggestion])

	return (
		<Button
			className={cn("cursor-pointer rounded-full px-4", className)}
			onClick={handleClick}
			size={size}
			type="button"
			variant={variant}
			{...props}
		>
			{children || suggestion}
		</Button>
	)
}

export const Suggestions = withProGuard(SuggestionsBase, "Suggestions")

export const Suggestion = withProGuard(SuggestionBase, "Suggestion")
