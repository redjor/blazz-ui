import { useId } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface ComponentCardProps {
	title: string
	description: string
	href: string
	icon: LucideIcon
	className?: string
}

export function ComponentCard({
	title,
	description,
	href,
	icon: Icon,
	className,
}: ComponentCardProps) {
	const id = useId()
	const descId = `${id}-desc`

	return (
		<Link href={href} className="group" aria-describedby={descId}>
			<Card
				className={cn(
					"h-full transition-colors hover:bg-raised/50",
					"group-focus-visible:ring-2 group-focus-visible:ring-brand group-focus-visible:ring-offset-2",
					className
				)}
			>
				<div className="flex flex-col gap-3 p-4">
					<Icon className="size-5 text-fg-muted" />
					<div className="space-y-1">
						<h3 className="text-sm font-medium text-fg group-hover:text-brand transition-colors">
							{title}
						</h3>
						<p id={descId} className="text-xs text-fg-muted line-clamp-2">
							{description}
						</p>
					</div>
				</div>
			</Card>
		</Link>
	)
}

export interface ComponentSectionProps {
	title?: string
	description?: string
	components: ComponentCardProps[]
}

export function ComponentSection({ title, description, components }: ComponentSectionProps) {
	return (
		<section className={cn(title && "space-y-4")}>
			{title && (
				<div>
					<h2 className="text-xs font-medium uppercase tracking-wider text-fg-muted">{title}</h2>
					{description && <p className="text-xs text-fg-muted">{description}</p>}
				</div>
			)}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{components.map((component) => (
					<ComponentCard key={component.href} {...component} />
				))}
			</div>
		</section>
	)
}
