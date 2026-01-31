/**
 * Template: Dashboard Page
 *
 * Dashboard avec métriques et graphiques.
 * Cas d'usage: Admin dashboard, Analytics, KPI monitoring
 *
 * Features:
 * - Cards de statistiques avec tendances
 * - Graphiques (placeholder - ajouter charting lib)
 * - Liste activité récente
 * - Actions rapides
 * - Layout responsive
 */

'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	TrendingUp,
	TrendingDown,
	Users,
	DollarSign,
	ShoppingCart,
	Activity,
	Download,
	Filter,
	Calendar,
	MoreHorizontal,
	ArrowUpRight,
	ArrowDownRight,
} from 'lucide-react'

// TODO: Remplacer par vos données réelles (API call)
const stats = [
	{
		id: 1,
		title: 'Revenus Totaux',
		value: '€45,231',
		change: '+20.1%',
		trend: 'up' as const,
		icon: DollarSign,
		description: 'vs mois dernier',
	},
	{
		id: 2,
		title: 'Nouveaux Utilisateurs',
		value: '2,350',
		change: '+12.5%',
		trend: 'up' as const,
		icon: Users,
		description: 'vs mois dernier',
	},
	{
		id: 3,
		title: 'Commandes',
		value: '1,234',
		change: '-4.2%',
		trend: 'down' as const,
		icon: ShoppingCart,
		description: 'vs mois dernier',
	},
	{
		id: 4,
		title: 'Taux de Conversion',
		value: '3.24%',
		change: '+1.8%',
		trend: 'up' as const,
		icon: Activity,
		description: 'vs mois dernier',
	},
]

// TODO: Remplacer par vos activités réelles
const recentActivities = [
	{
		id: 1,
		user: 'Jean Dupont',
		action: 'a créé une nouvelle commande',
		target: '#CMD-1234',
		time: 'Il y a 5 minutes',
		status: 'success' as const,
	},
	{
		id: 2,
		user: 'Marie Martin',
		action: 'a mis à jour le produit',
		target: 'MacBook Pro M3',
		time: 'Il y a 10 minutes',
		status: 'info' as const,
	},
	{
		id: 3,
		user: 'Pierre Durand',
		action: 'a supprimé un utilisateur',
		target: 'user@example.com',
		time: 'Il y a 25 minutes',
		status: 'warning' as const,
	},
	{
		id: 4,
		user: 'Sophie Dubois',
		action: 'a annulé la commande',
		target: '#CMD-1220',
		time: 'Il y a 1 heure',
		status: 'error' as const,
	},
	{
		id: 5,
		user: 'Luc Bernard',
		action: 'a créé un nouveau compte',
		target: 'Enterprise Plan',
		time: 'Il y a 2 heures',
		status: 'success' as const,
	},
]

// TODO: Remplacer par vos top items
const topProducts = [
	{
		id: 1,
		name: 'MacBook Pro M3',
		sales: 234,
		revenue: '€234,500',
		trend: 'up' as const,
	},
	{
		id: 2,
		name: 'iPhone 15 Pro',
		sales: 189,
		revenue: '€189,000',
		trend: 'up' as const,
	},
	{
		id: 3,
		name: 'AirPods Pro',
		sales: 156,
		revenue: '€46,800',
		trend: 'down' as const,
	},
	{
		id: 4,
		name: 'iPad Air',
		sales: 123,
		revenue: '€98,400',
		trend: 'up' as const,
	},
]

const quickActions = [
	{ label: 'Nouvelle commande', onClick: () => console.log('New order') },
	{ label: 'Ajouter utilisateur', onClick: () => console.log('Add user') },
	{ label: 'Créer produit', onClick: () => console.log('Create product') },
	{ label: 'Voir rapports', onClick: () => console.log('View reports') },
]

export default function DashboardPage() {
	const handleExport = () => {
		console.log('Export data')
		// TODO: Implémenter export
	}

	const handleFilter = () => {
		console.log('Filter')
		// TODO: Implémenter filtres
	}

	return (
		<DashboardLayout>
			<Page>
				<PageHeader
					title="Dashboard"
					description="Vue d'ensemble de vos métriques"
					actions={
						<div className="flex gap-2">
							<Button variant="outline" onClick={handleFilter}>
								<Filter className="mr-2" />
								Filtrer
							</Button>
							<Button variant="outline" onClick={handleExport}>
								<Download className="mr-2" />
								Exporter
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">
										<Calendar className="mr-2" />
										30 derniers jours
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem>Aujourd'hui</DropdownMenuItem>
									<DropdownMenuItem>7 derniers jours</DropdownMenuItem>
									<DropdownMenuItem>30 derniers jours</DropdownMenuItem>
									<DropdownMenuItem>3 derniers mois</DropdownMenuItem>
									<DropdownMenuItem>12 derniers mois</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					}
				/>

				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
					{stats.map((stat) => {
						const Icon = stat.icon
						return (
							<Card key={stat.id}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										{stat.title}
									</CardTitle>
									<Icon className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">{stat.value}</div>
									<div className="flex items-center text-xs text-muted-foreground mt-1">
										{stat.trend === 'up' ? (
											<TrendingUp className="mr-1 h-3 w-3 text-green-500" />
										) : (
											<TrendingDown className="mr-1 h-3 w-3 text-red-500" />
										)}
										<span
											className={
												stat.trend === 'up'
													? 'text-green-500'
													: 'text-red-500'
											}
										>
											{stat.change}
										</span>
										<span className="ml-1">{stat.description}</span>
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>

				<div className="grid gap-4 md:grid-cols-7 mb-8">
					{/* Chart Area - TODO: Ajouter votre bibliothèque de charts */}
					<Card className="md:col-span-4">
						<CardHeader>
							<CardTitle>Revenus par Mois</CardTitle>
							<CardDescription>
								Évolution des revenus sur les 12 derniers mois
							</CardDescription>
						</CardHeader>
						<CardContent>
							{/* Placeholder - Remplacer par vrai chart (Recharts, Chart.js, etc.) */}
							<div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed">
								<div className="text-center text-muted-foreground">
									<Activity className="h-12 w-12 mx-auto mb-2" />
									<p className="font-medium">Chart Placeholder</p>
									<p className="text-sm">
										Intégrer Recharts, Chart.js ou autre
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Top Products */}
					<Card className="md:col-span-3">
						<CardHeader>
							<CardTitle>Top Produits</CardTitle>
							<CardDescription>Produits les plus vendus</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{topProducts.map((product, index) => (
									<div key={product.id} className="flex items-center gap-4">
										<div
											className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium"
										>
											{index + 1}
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">
												{product.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{product.sales} ventes
											</p>
										</div>
										<div className="text-right">
											<p className="text-sm font-medium">
												{product.revenue}
											</p>
											{product.trend === 'up' ? (
												<ArrowUpRight className="h-4 w-4 text-green-500 ml-auto" />
											) : (
												<ArrowDownRight className="h-4 w-4 text-red-500 ml-auto" />
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-4 md:grid-cols-7">
					{/* Recent Activity */}
					<Card className="md:col-span-4">
						<CardHeader>
							<CardTitle>Activité Récente</CardTitle>
							<CardDescription>
								Dernières actions dans l'application
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[400px] pr-4">
								<div className="space-y-4">
									{recentActivities.map((activity, index) => (
										<div key={activity.id}>
											<div className="flex items-start gap-3">
												<div
													className={`mt-1 flex h-2 w-2 rounded-full ${
														activity.status === 'success'
															? 'bg-green-500'
															: activity.status === 'info'
																? 'bg-blue-500'
																: activity.status === 'warning'
																	? 'bg-yellow-500'
																	: 'bg-red-500'
													}`}
												/>
												<div className="flex-1 space-y-1">
													<p className="text-sm">
														<span className="font-medium">
															{activity.user}
														</span>{' '}
														{activity.action}{' '}
														<span className="font-medium text-primary">
															{activity.target}
														</span>
													</p>
													<p className="text-xs text-muted-foreground">
														{activity.time}
													</p>
												</div>
											</div>
											{index < recentActivities.length - 1 && (
												<Separator className="my-3" />
											)}
										</div>
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>

					{/* Quick Actions & Stats */}
					<div className="md:col-span-3 space-y-4">
						{/* Quick Actions */}
						<Card>
							<CardHeader>
								<CardTitle>Actions Rapides</CardTitle>
								<CardDescription>Raccourcis fréquents</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-2">
								{quickActions.map((action, index) => (
									<Button
										key={index}
										variant="outline"
										className="justify-start"
										onClick={action.onClick}
									>
										{action.label}
									</Button>
								))}
							</CardContent>
						</Card>

						{/* Additional Stats */}
						<Card>
							<CardHeader>
								<CardTitle>Statistiques</CardTitle>
								<CardDescription>Autres métriques</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										Taux d'abandon panier
									</span>
									<span className="text-sm font-medium">23.5%</span>
								</div>
								<Separator />
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										Valeur moyenne commande
									</span>
									<span className="text-sm font-medium">€156</span>
								</div>
								<Separator />
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										Tickets support ouverts
									</span>
									<Badge variant="info">12</Badge>
								</div>
								<Separator />
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground">
										Temps réponse moyen
									</span>
									<span className="text-sm font-medium">2.4h</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</Page>
		</DashboardLayout>
	)
}
