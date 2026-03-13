import { cn } from "@blazz/ui/lib/utils"

interface DocHeroProps {
	children: React.ReactNode
	className?: string
}

export function DocHero({ children, className }: DocHeroProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-xl border border-container bg-raised/50 px-8 py-12",
				className
			)}
			style={{
				backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
				backgroundSize: "24px 24px",
			}}
		>
			{children}
		</div>
	)
}
