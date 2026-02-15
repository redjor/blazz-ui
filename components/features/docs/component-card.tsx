import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface ComponentCardProps {
	title: string
	description: string
	href: string
	icon?: LucideIcon
	className?: string
}

export function ComponentCard({
	title,
	description,
	href,
	icon: Icon,
	className,
}: ComponentCardProps) {
	return (
		<Link href={href} className="group">
			<Card
				className={cn(
					"h-full transition-colors hover:bg-raised/50",
					"group-focus-visible:ring-2 group-focus-visible:ring-brand group-focus-visible:ring-offset-2",
					className
				)}
			>
				<CardHeader>
					{Icon && (
						<div className="flex size-10 items-center justify-center rounded-lg bg-raised">
							<Icon className="size-5 text-fg-muted" />
						</div>
					)}
					<CardTitle className="text-sm group-hover:text-brand transition-colors">
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					<p className="text-xs text-fg-muted line-clamp-2">
						{description}
					</p>
				</CardContent>
			</Card>
		</Link>
	)
}

export interface ComponentSectionProps {
	components: ComponentCardProps[]
}

export function ComponentSection({ components }: ComponentSectionProps) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{components.map((component) => (
				<ComponentCard key={component.href} {...component} />
			))}
		</div>
	)
}
