"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import {
	AlertCircle,
	Circle,
	ExternalLink,
	GitBranch,
	GitCommitHorizontal,
	RefreshCw,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface VercelDeployment {
	uid: string
	name: string
	url: string
	created: number
	ready?: number
	state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED"
	target?: string | null
	meta?: {
		githubCommitMessage?: string
		githubCommitRef?: string
		githubCommitSha?: string
		githubCommitAuthorName?: string
	}
	creator?: { username?: string }
}

const STATUS_COLOR: Record<string, string> = {
	READY: "text-success",
	ERROR: "text-destructive",
	BUILDING: "text-warning",
	INITIALIZING: "text-warning",
	QUEUED: "text-fg-muted",
	CANCELED: "text-fg-muted",
}

const STATUS_LABEL: Record<string, string> = {
	READY: "Ready",
	ERROR: "Error",
	BUILDING: "Building…",
	INITIALIZING: "Initializing…",
	QUEUED: "Queued",
	CANCELED: "Canceled",
}

const BRANCHES = ["main", "develop"] as const

export default function DeploymentsPageClient() {
	const [branches, setBranches] = useState<Record<string, VercelDeployment> | null>(null)
	const [domains, setDomains] = useState<string[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const fetchDeployments = useCallback(async () => {
		setLoading(true)
		setError(null)
		try {
			const res = await fetch("/api/deployments")
			const data = await res.json()
			if (!res.ok) throw new Error(data.error ?? `Erreur ${res.status}`)
			setBranches(data.branches ?? {})
			setDomains(data.domains ?? [])
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur inconnue")
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchDeployments()
	}, [fetchDeployments])

	// Loading
	if (loading && !branches) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title="Deployments" />
				<BlockStack gap="400">
					{BRANCHES.map((b) => (
						<BlockStack key={b} gap="300" className="rounded-lg border border-edge p-5">
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-56" />
						</BlockStack>
					))}
				</BlockStack>
			</BlockStack>
		)
	}

	// Error
	if (error) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title="Deployments" />
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

	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader
				title="Deployments"
				actionsSlot={
					<Button variant="outline" size="sm" onClick={fetchDeployments} disabled={loading}>
						<RefreshCw className={loading ? "animate-spin" : ""} />
						Refresh
					</Button>
				}
			/>

			<BlockStack gap="400">
				{BRANCHES.map((branch) => {
					const d = branches?.[branch]
					const isProduction = branch === "main"

					if (!d) {
						return (
							<BlockStack
								key={branch}
								gap="200"
								className="rounded-lg border border-edge bg-surface-3 p-5"
							>
								<InlineStack gap="100" blockAlign="center">
									<GitBranch className="h-3.5 w-3.5 text-fg-muted" />
									<span className="text-sm font-mono font-medium text-fg">{branch}</span>
								</InlineStack>
								<p className="text-xs text-fg-muted">Aucun déploiement trouvé</p>
							</BlockStack>
						)
					}

					const colorClass = STATUS_COLOR[d.state] ?? "text-fg-muted"
					const statusLabel = STATUS_LABEL[d.state] ?? d.state
					const sha = d.meta?.githubCommitSha?.slice(0, 7)
					const commitMsg = d.meta?.githubCommitMessage
					const author = d.creator?.username ?? d.meta?.githubCommitAuthorName

					return (
						<BlockStack
							key={branch}
							gap="400"
							className="rounded-lg border border-edge bg-surface-3 p-5"
						>
							{/* Deployment URL */}
							<BlockStack gap="100">
								<span className="text-xs text-fg-muted uppercase tracking-wide font-medium">
									Deployment
								</span>
								<a
									href={`https://${d.url}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-fg-muted hover:text-fg transition-colors inline-flex items-center gap-1 w-fit"
								>
									{d.url}
									<ExternalLink className="h-3 w-3" />
								</a>
							</BlockStack>

							{/* Domains (production only) */}
							{isProduction && domains.length > 0 && (
								<BlockStack gap="100">
									<span className="text-xs text-fg-muted uppercase tracking-wide font-medium">
										Domains
									</span>
									<BlockStack gap="050">
										{domains.map((domain) => (
											<a
												key={domain}
												href={`https://${domain}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-fg-muted hover:text-fg transition-colors inline-flex items-center gap-1 w-fit"
											>
												{domain}
												<ExternalLink className="h-3 w-3" />
											</a>
										))}
									</BlockStack>
								</BlockStack>
							)}

							{/* Status */}
							<BlockStack gap="100">
								<InlineStack gap="300">
									<span className="text-xs text-fg-muted uppercase tracking-wide font-medium">
										Status
									</span>
									<span className="text-xs text-fg-muted uppercase tracking-wide font-medium">
										Created
									</span>
								</InlineStack>
								<InlineStack gap="300" blockAlign="center">
									<InlineStack gap="100" blockAlign="center">
										<Circle className={`h-2.5 w-2.5 fill-current ${colorClass}`} />
										<span className={`text-sm ${colorClass}`}>{statusLabel}</span>
									</InlineStack>
									<span className="text-sm text-fg-muted">
										{formatDistanceToNow(new Date(d.created), { addSuffix: true, locale: fr })}
										{author && ` by ${author}`}
									</span>
								</InlineStack>
							</BlockStack>

							{/* Source */}
							<BlockStack gap="100">
								<span className="text-xs text-fg-muted uppercase tracking-wide font-medium">
									Source
								</span>
								<BlockStack gap="050">
									<InlineStack gap="100" blockAlign="center">
										<GitBranch className="h-3.5 w-3.5 text-fg-muted" />
										<span className="text-sm font-mono text-fg">{branch}</span>
									</InlineStack>
									{(sha || commitMsg) && (
										<InlineStack gap="100" blockAlign="center" className="ml-0.5">
											<GitCommitHorizontal className="h-3.5 w-3.5 text-fg-muted" />
											{sha && (
												<span className="text-sm font-mono text-fg-muted">{sha}</span>
											)}
											{commitMsg && (
												<span className="text-sm text-fg-muted line-clamp-1">{commitMsg}</span>
											)}
										</InlineStack>
									)}
								</BlockStack>
							</BlockStack>
						</BlockStack>
					)
				})}
			</BlockStack>
		</BlockStack>
	)
}
