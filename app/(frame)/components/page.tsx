import Link from "next/link"
import { Page } from "@/components/ui/page"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { componentsNavigation } from "@/config/components-navigation"

export default function ComponentsPage() {
	return (
		<Page
			title="Components"
			subtitle="A collection of reusable components for building consistent user interfaces. Browse by category or search for a specific component."
		>
			<div className="space-y-8">
				{componentsNavigation.map((category) => (
					<section key={category.id} className="space-y-4">
						<div className="flex items-center gap-2">
							<category.icon className="h-5 w-5 text-muted-foreground" />
							<h2 className="text-lg font-semibold">{category.title}</h2>
						</div>
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{category.items.map((component) => (
								<Link key={component.href} href={component.href}>
									<Card className="h-full transition-colors hover:bg-muted/50">
										<CardHeader className="p-4">
											<CardTitle className="text-sm font-medium">
												{component.title}
											</CardTitle>
										</CardHeader>
									</Card>
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</Page>
	)
}
