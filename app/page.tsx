import { ArrowRight, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
	return (
		<div className="min-h-screen p-8 bg-background">
			<div className="max-w-4xl mx-auto space-y-8">
				<div>
					<h1 className="text-heading-3xl tracking-tight">@blazz/ui-boilerplate</h1>
					<p className="text-body-lg text-muted-foreground mt-2">
						Package UI réutilisable avec shadcn/ui et Base UI pour Next.js 16 + React 19
					</p>
				</div>

				<Card className="border-primary/20 bg-primary/5">
					<CardHeader>
						<div className="flex items-center gap-2">
							<LayoutDashboard className="h-5 w-5 text-primary" />
							<CardTitle>Shopify Frame Layout</CardTitle>
						</div>
						<CardDescription>
							Découvrez notre nouveau système de layout inspiré de Shopify Polaris
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-body-md text-muted-foreground">
							Navigation avec sidebar officielle ShadCn, menus imbriqués, breadcrumbs dynamiques, et
							palette de commandes (Cmd+K). Design sage green inspiré de Shopify.
						</p>
						<div className="flex gap-2">
							<Link href="/examples/crm/dashboard">
								<Button>
									Voir la démo CRM
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
							<Link href="/docs/components">
								<Button variant="outline">Documentation</Button>
							</Link>
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Composants UI</CardTitle>
							<CardDescription>Exemples de composants disponibles dans le package</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<h4 className="text-heading-md">Buttons</h4>
								<div className="flex gap-2 flex-wrap">
									<Button>Default</Button>
									<Button variant="secondary">Secondary</Button>
									<Button variant="outline">Outline</Button>
									<Button variant="ghost">Ghost</Button>
									<Button variant="destructive">Destructive</Button>
								</div>
							</div>

							<div className="space-y-2">
								<h4 className="text-heading-md">Badges</h4>
								<div className="flex gap-2 flex-wrap">
									<Badge>Default</Badge>
									<Badge variant="info">Secondary</Badge>
									<Badge variant="outline">Outline</Badge>
									<Badge variant="critical">Destructive</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>À propos</CardTitle>
							<CardDescription>Informations sur le package</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-body-md text-muted-foreground">
								Ce package contient des composants UI basés sur <strong>Base UI</strong> (la
								nouvelle architecture de shadcn), un système de layout, et des utilities complètes.
							</p>
							<div className="space-y-2">
								<h4 className="text-heading-md">Inclus:</h4>
								<ul className="text-body-md text-muted-foreground space-y-1 list-disc list-inside">
									<li>Composants shadcn/ui avec Base UI</li>
									<li>DashboardLayout + Navbar + NavTabs</li>
									<li>Design system avec Tailwind v4</li>
									<li>Utilities (cn, arrays, strings, etc.)</li>
									<li>Dark mode support</li>
								</ul>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
