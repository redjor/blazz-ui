"use client"

import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Box } from "@/components/ui/box"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InlineGrid } from "@/components/ui/inline-grid"
import { Page, PageSection } from "@/components/ui/page"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, CartesianGrid } from "recharts"

const stats = [
	{
		title: "Total Revenue",
		value: "$125,430",
		change: "+12.5%",
		icon: DollarSign,
		trend: "up"
	},
	{
		title: "Total Orders",
		value: "2,847",
		change: "+8.2%",
		icon: BarChart3,
		trend: "up"
	},
	{
		title: "Active Customers",
		value: "1,234",
		change: "+15.3%",
		icon: Users,
		trend: "up"
	},
	{
		title: "Growth Rate",
		value: "23.5%",
		change: "+2.1%",
		icon: TrendingUp,
		trend: "up"
	},
]

const revenueData = [
	{ month: "Jan", revenue2025: 12000, revenue2024: 10000 },
	{ month: "Feb", revenue2025: 19000, revenue2024: 15000 },
	{ month: "Mar", revenue2025: 15000, revenue2024: 13000 },
	{ month: "Apr", revenue2025: 25000, revenue2024: 20000 },
	{ month: "May", revenue2025: 22000, revenue2024: 18000 },
	{ month: "Jun", revenue2025: 30000, revenue2024: 24000 },
	{ month: "Jul", revenue2025: 28000, revenue2024: 22000 },
	{ month: "Aug", revenue2025: 32000, revenue2024: 26000 },
	{ month: "Sep", revenue2025: 29000, revenue2024: 24000 },
	{ month: "Oct", revenue2025: 35000, revenue2024: 28000 },
	{ month: "Nov", revenue2025: 38000, revenue2024: 30000 },
	{ month: "Dec", revenue2025: 42000, revenue2024: 32000 },
]

const revenueChartConfig = {
	revenue2025: {
		label: "Revenue 2025",
		color: "hsl(var(--chart-1))",
	},
	revenue2024: {
		label: "Revenue 2024",
		color: "hsl(var(--chart-2))",
	},
}

const trafficData = [
	{ week: "Week 1", visits: 4200, pageViews: 8500 },
	{ week: "Week 2", visits: 5300, pageViews: 10200 },
	{ week: "Week 3", visits: 4800, pageViews: 9400 },
	{ week: "Week 4", visits: 6100, pageViews: 12300 },
]

const trafficChartConfig = {
	visits: {
		label: "Visits",
		color: "hsl(var(--chart-3))",
	},
	pageViews: {
		label: "Page Views",
		color: "hsl(var(--chart-4))",
	},
}

const categoryData = [
	{ category: "Electronics", sales: 35, fill: "hsl(var(--chart-1))" },
	{ category: "Clothing", sales: 25, fill: "hsl(var(--chart-2))" },
	{ category: "Food & Beverage", sales: 20, fill: "hsl(var(--chart-3))" },
	{ category: "Home & Garden", sales: 12, fill: "hsl(var(--chart-4))" },
	{ category: "Sports", sales: 8, fill: "hsl(var(--chart-5))" },
]

const categoryChartConfig = {
	sales: {
		label: "Sales",
	},
	Electronics: {
		label: "Electronics",
		color: "hsl(var(--chart-1))",
	},
	Clothing: {
		label: "Clothing",
		color: "hsl(var(--chart-2))",
	},
	"Food & Beverage": {
		label: "Food & Beverage",
		color: "hsl(var(--chart-3))",
	},
	"Home & Garden": {
		label: "Home & Garden",
		color: "hsl(var(--chart-4))",
	},
	Sports: {
		label: "Sports",
		color: "hsl(var(--chart-5))",
	},
}

export default function ReportsPage() {
	return (
		<Page
			title="Reports"
			fullWidth
			additionalMetadata={<Badge variant="success">Updated</Badge>}
		>
			<PageSection>
				<InlineGrid columns={4} gap="400">
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
								<p className="text-body-sm text-green-600 font-medium">{stat.change}</p>
							</div>
						</Box>
					))}
				</InlineGrid>
			</PageSection>

			<PageSection>
				<Card>
							<CardHeader>
								<CardTitle>Revenue Comparison</CardTitle>
								<CardDescription>Monthly revenue comparison between 2024 and 2025</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={revenueChartConfig}>
									<BarChart data={revenueData}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="month"
											tickLine={false}
											tickMargin={10}
											axisLine={false}
										/>
										<ChartTooltip content={<ChartTooltipContent />} />
										<ChartLegend content={<ChartLegendContent />} />
										<Bar dataKey="revenue2025" fill="var(--color-revenue2025)" radius={4} />
										<Bar dataKey="revenue2024" fill="var(--color-revenue2024)" radius={4} />
									</BarChart>
								</ChartContainer>
							</CardContent>
							<CardFooter className="flex-col items-start gap-2 text-sm">
								<div className="flex gap-2 font-medium leading-none">
									Revenue up by 31% this year <TrendingUp className="h-4 w-4" />
								</div>
								<div className="text-muted-foreground leading-none">
									Showing revenue comparison for the last 12 months
								</div>
							</CardFooter>
						</Card>
			</PageSection>

			<PageSection>
				<InlineGrid columns={2} gap="400">
					<Card>
							<CardHeader>
								<CardTitle>Traffic Analysis</CardTitle>
								<CardDescription>Weekly website traffic trends</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={trafficChartConfig}>
									<LineChart data={trafficData}>
										<CartesianGrid vertical={false} />
										<XAxis
											dataKey="week"
											tickLine={false}
											axisLine={false}
											tickMargin={8}
										/>
										<ChartTooltip content={<ChartTooltipContent />} />
										<ChartLegend content={<ChartLegendContent />} />
										<Line
											dataKey="visits"
											type="monotone"
											stroke="var(--color-visits)"
											strokeWidth={2}
											dot={false}
										/>
										<Line
											dataKey="pageViews"
											type="monotone"
											stroke="var(--color-pageViews)"
											strokeWidth={2}
											dot={false}
										/>
									</LineChart>
								</ChartContainer>
							</CardContent>
							<CardFooter>
								<div className="text-sm text-muted-foreground">
									Average 5,100 visits and 10,100 page views per week
								</div>
							</CardFooter>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Sales by Category</CardTitle>
								<CardDescription>Product category distribution</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={categoryChartConfig} className="mx-auto aspect-square max-h-[300px]">
									<PieChart>
										<ChartTooltip content={<ChartTooltipContent hideLabel />} />
										<Pie data={categoryData} dataKey="sales" nameKey="category" />
									</PieChart>
								</ChartContainer>
							</CardContent>
							<CardFooter className="flex-col gap-2 text-sm">
								<div className="flex items-center gap-2 font-medium leading-none">
									Electronics leads with 35% <BarChart3 className="h-4 w-4" />
								</div>
								<div className="text-muted-foreground leading-none">
									Top 5 categories by sales volume
								</div>
							</CardFooter>
						</Card>
				</InlineGrid>
			</PageSection>
		</Page>
	)
}
