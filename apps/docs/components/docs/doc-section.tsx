import { cn } from "@blazz/ui/lib/utils"

interface DocSectionProps {
	id: string
	title: string
	children: React.ReactNode
	className?: string
	spacing?: "sm" | "md" | "lg"
}

const spacingMap = {
	sm: "space-y-4",
	md: "space-y-6",
	lg: "space-y-8",
}

export function DocSection({ id, title, children, className, spacing = "md" }: DocSectionProps) {
	return (
		<section id={id} className={cn(spacingMap[spacing], className)} aria-labelledby={`${id}-heading`}>
			<h2 id={`${id}-heading`} className="text-xl font-semibold tracking-tight text-fg scroll-mt-6">
				<a href={`#${id}`} className="hover:underline underline-offset-4 decoration-edge">
					{title}
				</a>
			</h2>
			{children}
		</section>
	)
}
