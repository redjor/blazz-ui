"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import {
	AlertCircle,
	Clock,
	ExternalLink,
	GitBranch,
	RefreshCw,
	Rocket,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface VercelDeployment {
	uid: string
	name: string
	url: string
	created: number
	ready?: number
	state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED"
	meta?: {
		githubCommitMessage?: string
		githubCommitRef?: string
	}
}

const STATUS_CONFIG: Record<
	VercelDeployment["state"],
	{ label: string; variant: "default" | "critical" | "secondary" | "outline" }
> = {
	READY: { label: "Ready", variant: "default" },
	ERROR: { label: "Error", variant: "critical" },
	BUILDING: { label: "Building", variant: "secondary" },
	INITIALIZING: { label: "Init", variant: "secondary" },
	QUEUED: { label: "Queued", variant: "outline" },
	CANCELED: { label: "Canceled", variant: "outline" },
}

function formatDuration(created: number, ready?: number): string | null {
	if (!ready) return null
	const seconds = Math.round((ready - created) / 1000)
	if (seconds < 60) return `${seconds}s`
	const minutes = Math.floor(seconds / 60)
	const remaining = seconds % 60
	return `${minutes}m ${remaining}s`
}

function DeploymentsSkeleton() {
	return (
		<BlockStack gap="300">
			{Array.from({ length: 5 }).map((_, i) => (
				<BlockStack key={i} gap="200" className="rounded-lg border border-edge p-4">
					<InlineStack gap="200" blockAlign="center">
						<Skeleton className="h-5 w-16" />
						<Skeleton className="h-4 w-40" />
					</InlineStack>
					<Skeleton className="h-4 w-64" />
					<Skeleton className="h-3 w-24" />
				</BlockStack>
			))}
		</BlockStack>
	)
}

export default function DeploymentsPageClient() {
	const [deployments, setDeployments] = useState<VercelDeployment[] | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const fetchDeployments = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch("/api/deployments")
			const data = await res.json()
			if (!res.ok) {
				throw new Error(data.error ?? `Erreur ${res.status}`)
			}
			setDeployments(data.deployments ?? [])
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur inconnue")
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchDeployments()
	}, [fetchDeployments])

	// Loading: fetching deployments
	if (loading || deployments === null) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title="Deployments" description="Derniers déploiements Vercel" />
				<DeploymentsSkeleton />
			</BlockStack>
		)
	}

	// Error
	if (error) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title="Deployments" description="Derniers déploiements Vercel" />
				<BlockStack className="text-center py-12 items-center">
					<AlertCircle className="h-10 w-10 text-destructive mb-3" />
					<p className="text-sm text-fg font-medium">Erreur de chargement</p>
					<p className="text-xs text-fg-muted mt-1 max-w-md">{error}</p>
					<Button variant="outline" size="sm" className="mt-3" onClick={fetchDeployments}>
						Réessayer
					</Button>
				</BlockStack>
			</BlockStack>
		)
	}

	// Success
	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader
				title="Deployments"
				description={`${deployments.length} derniers déploiements`}
				actionsSlot={
					<Button variant="outline" size="sm" onClick={fetchDeployments} disabled={loading}>
						<RefreshCw className={loading ? "animate-spin" : ""} />
						Refresh
					</Button>
				}
			/>

			{deployments.length === 0 ? (
				<BlockStack className="text-center py-12 items-center">
					<Rocket className="h-10 w-10 text-fg-muted mb-3" />
					<p className="text-sm text-fg-muted">Aucun déploiement trouvé.</p>
				</BlockStack>
			) : (
				<BlockStack gap="300">
					{deployments.map((d) => {
						const config = STATUS_CONFIG[d.state]
						const duration = formatDuration(d.created, d.ready)
						const branch = d.meta?.githubCommitRef
						const commitMsg = d.meta?.githubCommitMessage

						return (
							<BlockStack
								key={d.uid}
								gap="200"
								className="rounded-lg border border-edge bg-surface-3 p-4"
							>
								<InlineStack gap="300" align="space-between" blockAlign="center">
									<InlineStack gap="200" blockAlign="center">
										<Badge variant={config.variant}>{config.label}</Badge>
										{branch && (
											<InlineStack gap="100" blockAlign="center">
												<GitBranch className="h-3 w-3 text-fg-muted" />
												<span className="text-xs font-mono text-fg-muted">
													{branch}
												</span>
											</InlineStack>
										)}
									</InlineStack>
									<InlineStack gap="200" blockAlign="center">
										{duration && (
											<InlineStack gap="100" blockAlign="center">
												<Clock className="h-3 w-3 text-fg-muted" />
												<span className="text-xs font-mono text-fg-muted tabular-nums">
													{duration}
												</span>
											</InlineStack>
										)}
										<a
											href={`https://${d.url}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-fg-muted hover:text-fg transition-colors"
										>
											<ExternalLink className="h-3.5 w-3.5" />
										</a>
									</InlineStack>
								</InlineStack>

								{commitMsg && (
									<p className="text-sm text-fg line-clamp-1">{commitMsg}</p>
								)}

								<p className="text-xs text-fg-muted">
									{formatDistanceToNow(new Date(d.created), {
										addSuffix: true,
										locale: fr,
									})}
								</p>
							</BlockStack>
						)
					})}
				</BlockStack>
			)}
		</BlockStack>
	)
}
