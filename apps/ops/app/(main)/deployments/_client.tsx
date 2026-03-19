"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Divider } from "@blazz/ui/components/ui/divider"
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
	Globe,
	RefreshCw,
	Rocket,
	Shield,
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

const BRANCH_CONFIG = {
	main: { label: "Production", icon: Shield, accent: "border-success/40" },
	develop: { label: "Preview", icon: Rocket, accent: "border-brand/40" },
} as const

type BranchName = keyof typeof BRANCH_CONFIG

const BRANCHES: BranchName[] = ["main", "develop"]

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<BlockStack gap="100">
			<span className="text-[11px] text-fg-muted uppercase tracking-wider font-medium">
				{label}
			</span>
			{children}
		</BlockStack>
	)
}

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
							<InlineStack gap="200" blockAlign="center">
								<Skeleton className="h-5 w-5 rounded" />
								<Skeleton className="h-5 w-24" />
								<Skeleton className="h-5 w-16 rounded-full" />
							</InlineStack>
							<Skeleton className="h-px w-full" />
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-4 w-48" />
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
					const config = BRANCH_CONFIG[branch]
					const BranchIcon = config.icon
					const isProduction = branch === "main"

					if (!d) {
						return (
							<BlockStack
								key={branch}
								className={`rounded-lg border-l-[3px] ${config.accent} border border-edge bg-surface-3 p-5`}
								gap="200"
							>
								<InlineStack gap="200" blockAlign="center">
									<BranchIcon className="h-4 w-4 text-fg-muted" />
									<span className="text-sm font-semibold text-fg">{config.label}</span>
									<Badge variant="outline" size="xs">
										<span className="font-mono">{branch}</span>
									</Badge>
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
							className={`rounded-lg border-l-[3px] ${config.accent} border border-edge bg-surface-3`}
						>
							{/* Header */}
							<InlineStack
								gap="200"
								align="space-between"
								blockAlign="center"
								className="px-5 pt-4 pb-3"
							>
								<InlineStack gap="200" blockAlign="center">
									<BranchIcon className="h-4 w-4 text-fg-muted" />
									<span className="text-sm font-semibold text-fg">{config.label}</span>
									<Badge variant="outline" size="xs">
										<span className="font-mono">{branch}</span>
									</Badge>
								</InlineStack>
								<InlineStack gap="100" blockAlign="center">
									<Circle className={`h-2 w-2 fill-current ${colorClass}`} />
									<span className={`text-xs font-medium ${colorClass}`}>{statusLabel}</span>
								</InlineStack>
							</InlineStack>

							<Divider />

							{/* Body */}
							<BlockStack gap="300" className="px-5 py-4">
								{/* Deployment URL */}
								<InfoRow label="Deployment">
									<a
										href={`https://${d.url}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-fg-muted hover:text-fg transition-colors inline-flex items-center gap-1 w-fit font-mono"
									>
										{d.url}
										<ExternalLink className="h-3 w-3 shrink-0" />
									</a>
								</InfoRow>

								{/* Domains (production only) */}
								{isProduction && domains.length > 0 && (
									<InfoRow label="Domains">
										<BlockStack gap="050">
											{domains.map((domain) => (
												<a
													key={domain}
													href={`https://${domain}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-fg hover:text-brand transition-colors inline-flex items-center gap-1.5 w-fit"
												>
													<Globe className="h-3 w-3 text-fg-muted shrink-0" />
													{domain}
													<ExternalLink className="h-3 w-3 text-fg-muted shrink-0" />
												</a>
											))}
										</BlockStack>
									</InfoRow>
								)}

								{/* Created */}
								<InfoRow label="Created">
									<span className="text-sm text-fg-muted">
										{formatDistanceToNow(new Date(d.created), { addSuffix: true, locale: fr })}
										{author && (
											<>
												{" "}par{" "}
												<span className="text-fg font-medium">{author}</span>
											</>
										)}
									</span>
								</InfoRow>

								{/* Source */}
								{(sha || commitMsg) && (
									<InfoRow label="Source">
										<InlineStack gap="100" blockAlign="center">
											<GitCommitHorizontal className="h-3.5 w-3.5 text-fg-muted shrink-0" />
											{sha && (
												<span className="text-sm font-mono text-fg-muted">{sha}</span>
											)}
											{commitMsg && (
												<span className="text-sm text-fg line-clamp-1">{commitMsg}</span>
											)}
										</InlineStack>
									</InfoRow>
								)}
							</BlockStack>
						</BlockStack>
					)
				})}
			</BlockStack>
		</BlockStack>
	)
}
