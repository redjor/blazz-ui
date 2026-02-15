import { cn } from "@/lib/utils"

interface DocHeroProps {
	children: React.ReactNode
	className?: string
}

export function DocHero({ children, className }: DocHeroProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-xl border border-edge bg-raised/50 px-8 py-12",
				className
			)}
		>
			{children}
		</div>
	)
}
