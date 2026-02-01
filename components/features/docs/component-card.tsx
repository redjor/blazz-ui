import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
					"h-full transition-all duration-p-200 ease-p-ease-out",
					"hover:shadow-p-md hover:border-p-border-hover",
					"group-focus-visible:ring-2 group-focus-visible:ring-p-border-focus group-focus-visible:ring-offset-2",
					className
				)}
			>
				<CardHeader className="space-y-p-3">
					{Icon && (
						<div className="flex h-10 w-10 items-center justify-center rounded-p-lg bg-p-fill-secondary">
							<Icon className="h-5 w-5 text-p-icon" />
						</div>
					)}
					<div className="space-y-p-1">
						<CardTitle className="text-p-md font-p-semibold group-hover:text-p-text-brand transition-colors">
							{title}
						</CardTitle>
						<CardDescription className="text-p-sm text-p-text-secondary line-clamp-2">
							{description}
						</CardDescription>
					</div>
				</CardHeader>
			</Card>
		</Link>
	)
}

export interface ComponentSectionProps {
	title: string
	description: string
	components: ComponentCardProps[]
}

export function ComponentSection({ title, description, components }: ComponentSectionProps) {
	return (
		<div className="space-y-p-6">
			<div className="space-y-p-2">
				<h1 className="text-p-2xl font-p-bold text-p-text">{title}</h1>
				<p className="text-p-md text-p-text-secondary max-w-3xl">{description}</p>
			</div>
			<div className="grid gap-p-4 sm:grid-cols-2 lg:grid-cols-3">
				{components.map((component) => (
					<ComponentCard key={component.href} {...component} />
				))}
			</div>
		</div>
	)
}
