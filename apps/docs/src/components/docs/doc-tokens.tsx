import { cn } from "@blazz/ui/lib/utils"

export interface DocToken {
	name: string
	value?: string
	description?: string
	color?: boolean
}

interface DocTokensProps {
	tokens: DocToken[]
	className?: string
}

export function DocTokens({ tokens, className }: DocTokensProps) {
	return (
		<div className={cn("grid gap-2", className)}>
			{tokens.map((token) => (
				<div
					key={token.name}
					className="flex items-center gap-3 rounded-lg border border-container px-3 py-2"
				>
					{token.color && token.value && (
						<div
							className="size-5 shrink-0 rounded border border-container"
							style={{ backgroundColor: token.value }}
						/>
					)}
					<code className="text-[13px] font-medium text-fg">{token.name}</code>
					{token.description && (
						<span className="text-[13px] text-fg-muted">— {token.description}</span>
					)}
				</div>
			))}
		</div>
	)
}
