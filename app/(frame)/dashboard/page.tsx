"use client"

import { DollarSign, Package, Plus, ShoppingCart, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Box } from "@/components/ui/box"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Page, PageSection } from "@/components/ui/page"

const stats = [
	{
		title: "Total Revenue",
		value: "$45,231",
		description: "+20.1% from last month",
		icon: DollarSign,
	},
	{
		title: "Products",
		value: "1,234",
		description: "+12 new this month",
		icon: Package,
	},
	{
		title: "Orders",
		value: "234",
		description: "+19% from last month",
		icon: ShoppingCart,
	},
	{
		title: "Customers",
		value: "573",
		description: "+42 new this month",
		icon: Users,
	},
]

export default function DashboardPage() {
	return (
		<Page
			title="Dashboard"
			fullWidth
			primaryAction={
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					New Product
				</Button>
			}
			additionalMetadata={<Badge variant="secondary">Live</Badge>}
		>
			{/* Stats Grid */}
			<PageSection>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat) => (
						<Box
							key={stat.title}
							padding="6"
							background="white"
							borderRadius="lg"
							border="default"
							shadow="sm"
						>
							<div className="flex flex-row items-center justify-between space-y-0 pb-2">
								<h3 className="text-heading-md text-muted-foreground">{stat.title}</h3>
								<stat.icon className="h-4 w-4 text-muted-foreground" />
							</div>
							<div className="space-y-1">
								<div className="text-heading-2xl">{stat.value}</div>
								<p className="text-body-sm text-muted-foreground">{stat.description}</p>
							</div>
						</Box>
					))}
				</div>
			</PageSection>

			{/* Quick Actions & Features */}
			<PageSection>
				<div className="grid gap-4 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
							<CardDescription>Common tasks and shortcuts</CardDescription>
						</CardHeader>
						<CardContent>
							<Box as="div" className="space-y-2">
								<Button className="w-full" variant="outline">
									Create New Product
								</Button>
								<Button className="w-full" variant="outline">
									View Orders
								</Button>
								<Button className="w-full" variant="outline">
									Manage Inventory
								</Button>
							</Box>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Features</CardTitle>
							<CardDescription>What's included in this demo</CardDescription>
						</CardHeader>
						<CardContent>
							<Box as="div" className="text-sm">
								<ul className="list-inside list-disc space-y-1 text-muted-foreground">
									<li>Shopify Polaris-inspired Page & Box components</li>
									<li>SHADCN UI sidebar with nested navigation</li>
									<li>Breadcrumb navigation system</li>
									<li>Command palette (Cmd+K)</li>
									<li>Responsive flexbox layout</li>
									<li>Full-width & narrow page variants</li>
									<li>Dark mode ready</li>
								</ul>
							</Box>
						</CardContent>
					</Card>
				</div>
			</PageSection>
		</Page>
	)
}
