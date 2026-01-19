/**
 * Pattern: Stats Card
 *
 * Card réutilisable pour afficher des métriques et statistiques.
 * Cas d'usage: Dashboards, analytics, KPI displays
 *
 * Features:
 * - Affichage métrique avec valeur
 * - Indicateur de tendance (up/down/neutral)
 * - Icônes personnalisables
 * - Description/sous-titre
 * - Skeleton loading state
 * - Variants de style
 * - Action optionnelle
 */

'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
	TrendingUp,
	TrendingDown,
	Minus,
	type LucideIcon,
	ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

// Variants de style
const statsCardVariants = cva('transition-colors', {
	variants: {
		variant: {
			default: '',
			bordered: 'border-2',
			elevated: 'shadow-md hover:shadow-lg',
		},
		trend: {
			up: 'border-l-4 border-l-green-500',
			down: 'border-l-4 border-l-red-500',
			neutral: 'border-l-4 border-l-muted',
			none: '',
		},
	},
	defaultVariants: {
		variant: 'default',
		trend: 'none',
	},
})

export interface StatsCardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof statsCardVariants> {
	/** Titre de la métrique */
	title: string
	/** Valeur principale à afficher */
	value: string | number
	/** Description / sous-titre (optionnel) */
	description?: string
	/** Changement en pourcentage (ex: "+12.5%", "-3.2%") */
	change?: string
	/** Direction de la tendance */
	trend?: 'up' | 'down' | 'neutral' | 'none'
	/** Icône à afficher (composant Lucide) */
	icon?: LucideIcon
	/** Couleur de l'icône */
	iconColor?: string
	/** État de chargement */
	isLoading?: boolean
	/** Action optionnelle (bouton voir détails) */
	action?: {
		label: string
		onClick: () => void
	}
	/** Format personnalisé pour la valeur */
	valueFormatter?: (value: string | number) => string
}

/**
 * Composant Card pour afficher des statistiques et métriques
 *
 * @example
 * ```tsx
 * <StatsCard
 *   title="Revenus Totaux"
 *   value="€45,231"
 *   change="+20.1%"
 *   trend="up"
 *   description="vs mois dernier"
 *   icon={DollarSign}
 * />
 * ```
 */
export function StatsCard({
	title,
	value,
	description,
	change,
	trend = 'none',
	icon: Icon,
	iconColor,
	isLoading = false,
	action,
	valueFormatter,
	variant,
	className,
	...props
}: StatsCardProps) {
	const formattedValue = valueFormatter ? valueFormatter(value) : value

	// Icône de tendance
	const TrendIcon =
		trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

	// Couleur de tendance
	const trendColor =
		trend === 'up'
			? 'text-green-500'
			: trend === 'down'
				? 'text-red-500'
				: 'text-muted-foreground'

	if (isLoading) {
		return (
			<Card className={cn(statsCardVariants({ variant }), className)} {...props}>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<Skeleton className="h-4 w-[100px]" />
					{Icon && <Skeleton className="h-4 w-4 rounded" />}
				</CardHeader>
				<CardContent>
					<Skeleton className="h-8 w-[120px] mb-2" />
					<Skeleton className="h-3 w-[80px]" />
				</CardContent>
			</Card>
		)
	}

	return (
		<Card
			className={cn(statsCardVariants({ variant, trend }), className)}
			{...props}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
				{Icon && (
					<Icon
						className={cn('h-4 w-4', iconColor || 'text-muted-foreground')}
					/>
				)}
			</CardHeader>
			<CardContent>
				<div className="flex items-baseline justify-between">
					<p className="text-2xl font-bold">{formattedValue}</p>
					{action && (
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={action.onClick}
							aria-label={action.label}
						>
							<ArrowUpRight className="h-4 w-4" />
						</Button>
					)}
				</div>

				{(change || description) && (
					<div className="flex items-center gap-2 mt-1 text-xs">
						{change && trend !== 'none' && (
							<div className={cn('flex items-center gap-1', trendColor)}>
								<TrendIcon className="h-3 w-3" />
								<span className="font-medium">{change}</span>
							</div>
						)}
						{description && (
							<span className="text-muted-foreground">{description}</span>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	)
}

// =============================================================================
// VARIANTE: Stats Card Compact
// =============================================================================

export interface StatsCardCompactProps {
	title: string
	value: string | number
	icon?: LucideIcon
	trend?: 'up' | 'down' | 'neutral'
	change?: string
	isLoading?: boolean
	className?: string
}

/**
 * Version compacte du Stats Card (pour layouts serrés)
 */
export function StatsCardCompact({
	title,
	value,
	icon: Icon,
	trend = 'neutral',
	change,
	isLoading = false,
	className,
}: StatsCardCompactProps) {
	if (isLoading) {
		return (
			<div className={cn('flex items-center gap-3 p-3 rounded-lg border', className)}>
				<Skeleton className="h-10 w-10 rounded" />
				<div className="flex-1 space-y-1">
					<Skeleton className="h-3 w-[60px]" />
					<Skeleton className="h-5 w-[80px]" />
				</div>
			</div>
		)
	}

	const trendColor =
		trend === 'up'
			? 'text-green-500'
			: trend === 'down'
				? 'text-red-500'
				: 'text-muted-foreground'

	return (
		<div
			className={cn(
				'flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors',
				className
			)}
		>
			{Icon && (
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
					<Icon className="h-5 w-5 text-primary" />
				</div>
			)}
			<div className="flex-1 min-w-0">
				<p className="text-xs text-muted-foreground truncate">{title}</p>
				<div className="flex items-baseline gap-2">
					<p className="text-lg font-bold">{value}</p>
					{change && (
						<span className={cn('text-xs font-medium', trendColor)}>
							{change}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}

// =============================================================================
// VARIANTE: Stats Card avec Badge
// =============================================================================

export interface StatsCardWithBadgeProps extends StatsCardProps {
	badge?: {
		label: string
		variant?: 'default' | 'secondary' | 'outline' | 'destructive'
	}
}

/**
 * Stats Card avec badge (ex: "Nouveau", "Trending", etc.)
 */
export function StatsCardWithBadge({
	badge,
	...props
}: StatsCardWithBadgeProps) {
	const { title, value, description, change, trend, icon: Icon, isLoading } = props

	if (isLoading) {
		return <StatsCard {...props} isLoading />
	}

	return (
		<Card className={cn(props.className)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-center gap-2">
					<h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
					{badge && (
						<Badge variant={badge.variant || 'default'} className="text-xs">
							{badge.label}
						</Badge>
					)}
				</div>
				{Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
			</CardHeader>
			<CardContent>
				<p className="text-2xl font-bold">{value}</p>
				{(change || description) && (
					<div className="flex items-center gap-2 mt-1 text-xs">
						{change && trend !== 'none' && (
							<span
								className={cn(
									'font-medium',
									trend === 'up'
										? 'text-green-500'
										: trend === 'down'
											? 'text-red-500'
											: 'text-muted-foreground'
								)}
							>
								{change}
							</span>
						)}
						{description && (
							<span className="text-muted-foreground">{description}</span>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	)
}

// =============================================================================
// EXEMPLES D'UTILISATION
// =============================================================================

import { DollarSign, Users, ShoppingCart, Activity } from 'lucide-react'

export function StatsCardExamples() {
	return (
		<div className="space-y-8">
			{/* Grid de Stats Cards standards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Revenus Totaux"
					value="€45,231"
					change="+20.1%"
					trend="up"
					description="vs mois dernier"
					icon={DollarSign}
				/>

				<StatsCard
					title="Nouveaux Utilisateurs"
					value={2350}
					change="+12.5%"
					trend="up"
					description="vs mois dernier"
					icon={Users}
					variant="bordered"
				/>

				<StatsCard
					title="Commandes"
					value={1234}
					change="-4.2%"
					trend="down"
					description="vs mois dernier"
					icon={ShoppingCart}
					variant="elevated"
				/>

				<StatsCard
					title="Taux de Conversion"
					value="3.24%"
					change="+1.8%"
					trend="up"
					description="vs mois dernier"
					icon={Activity}
					action={{
						label: 'Voir détails',
						onClick: () => console.log('View details'),
					}}
				/>
			</div>

			{/* Stats Cards Compact */}
			<div className="grid gap-3 md:grid-cols-2">
				<StatsCardCompact
					title="Total Visits"
					value="124.5K"
					icon={Users}
					trend="up"
					change="+5.2%"
				/>
				<StatsCardCompact
					title="Bounce Rate"
					value="32.8%"
					icon={Activity}
					trend="down"
					change="-2.1%"
				/>
			</div>

			{/* Stats Cards avec Badges */}
			<div className="grid gap-4 md:grid-cols-3">
				<StatsCardWithBadge
					title="Monthly Revenue"
					value="€12,345"
					change="+18%"
					trend="up"
					icon={DollarSign}
					badge={{ label: 'Nouveau', variant: 'default' }}
				/>
				<StatsCardWithBadge
					title="Active Users"
					value="8.5K"
					change="+24%"
					trend="up"
					icon={Users}
					badge={{ label: 'Trending', variant: 'secondary' }}
				/>
				<StatsCardWithBadge
					title="Avg Order Value"
					value="€156"
					change="-3%"
					trend="down"
					icon={ShoppingCart}
				/>
			</div>

			{/* Loading State */}
			<div className="grid gap-4 md:grid-cols-4">
				<StatsCard
					title="Loading..."
					value="0"
					isLoading
					icon={DollarSign}
				/>
				<StatsCardCompact
					title="Loading..."
					value="0"
					isLoading
					icon={Users}
				/>
			</div>
		</div>
	)
}

// =============================================================================
// UTILITAIRES: Formatters
// =============================================================================

/**
 * Formateur de monnaie
 */
export const currencyFormatter = (value: string | number, currency = 'EUR') => {
	const numValue = typeof value === 'string' ? parseFloat(value) : value
	return new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency,
	}).format(numValue)
}

/**
 * Formateur de nombres avec suffixes (K, M, B)
 */
export const compactNumberFormatter = (value: string | number) => {
	const numValue = typeof value === 'string' ? parseFloat(value) : value
	return new Intl.NumberFormat('fr-FR', {
		notation: 'compact',
		compactDisplay: 'short',
	}).format(numValue)
}

/**
 * Formateur de pourcentage
 */
export const percentFormatter = (value: string | number) => {
	const numValue = typeof value === 'string' ? parseFloat(value) : value
	return `${numValue.toFixed(2)}%`
}
