import { Card } from "@blazz/ui/components/ui/card"
import { cn } from "@blazz/ui/lib/utils"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { useId } from "react"
import { ComponentCardThumbnail } from "./component-card-thumbnail"

export interface CategoryPageHeroProps {
	title: string
	description: string
	className?: string
}

export function CategoryPageHero({ title, description, className }: CategoryPageHeroProps) {
	return (
		<div className={cn("mb-8 py-8", className)}>
			<div className="space-y-2">
				<h1 className="text-3xl font-semibold tracking-tight text-fg">{title}</h1>
				<p className="max-w-2xl text-base leading-relaxed text-fg-muted">{description}</p>
			</div>
		</div>
	)
}

export interface ComponentCardProps {
	title: string
	description: string
	href: string
	icon: LucideIcon
	thumbnail?: string
	className?: string
}

export function ComponentCard({
	title,
	description,
	href,
	icon: Icon,
	thumbnail,
	className,
}: ComponentCardProps) {
	const id = useId()
	const descId = `${id}-desc`

	return (
		<Link href={href} className="group" aria-describedby={descId}>
			<Card
				className={cn(
					"h-full transition-colors hover:bg-surface-3/50",
					"group-focus-visible:ring-2 group-focus-visible:ring-brand group-focus-visible:ring-offset-2",
					thumbnail && "overflow-hidden",
					className
				)}
			>
				{thumbnail && <ComponentCardThumbnail slug={thumbnail} alt={title} />}
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
				<div className="space-y-1.5">
					<div className="flex items-center gap-3">
						<h2 className="shrink-0 text-sm font-semibold text-fg">{title}</h2>
						<div className="h-px flex-1 bg-edge" />
					</div>
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
