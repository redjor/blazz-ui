import { cn } from "@/lib/utils"

interface PropertyProps {
	label: string
	children: React.ReactNode
	className?: string
}

function Property({ label, children, className }: PropertyProps) {
	return (
		<div className={cn("flex flex-col gap-0.5", className)}>
			<span className="text-xs text-fg-muted">{label}</span>
			<span className="text-sm font-semibold text-fg">{children}</span>
		</div>
	)
}

export { Property }
