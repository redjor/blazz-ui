"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useAction, useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { ExternalLink, Package, RefreshCw } from "lucide-react"
import { useState } from "react"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { api } from "@/convex/_generated/api"
import { formatBytes } from "@/lib/format"

export default function PackagesPageClient() {
	const packages = useQuery(api.packages.list)
	const triggerSync = useAction(api.packages.triggerSync)
	const [syncing, setSyncing] = useState(false)

	const handleSync = async () => {
		setSyncing(true)
		try {
			await triggerSync()
		} finally {
			setSyncing(false)
		}
	}

	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader
				title="Packages"
				description="Suivi des packages npm publiés"
				actions={
					<Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
						<RefreshCw className={syncing ? "animate-spin" : ""} />
						Refresh
					</Button>
				}
			/>

			{packages === undefined ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 1 }).map((_, i) => (
						<BlockStack key={i} gap="300" className="rounded-lg border border-edge p-5">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-4 w-24" />
						</BlockStack>
					))}
				</div>
			) : packages.length === 0 ? (
				<BlockStack className="text-center py-12 items-center">
					<Package className="h-10 w-10 text-fg-muted mb-3" />
					<p className="text-sm text-fg-muted">Aucun package synchronisé.</p>
					<Button variant="outline" size="sm" className="mt-3" onClick={handleSync}>
						Synchroniser maintenant
					</Button>
				</BlockStack>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{packages.map((pkg) => (
						<BlockStack key={pkg._id} gap="300" className="rounded-lg border border-edge bg-surface-3 p-5">
							<InlineStack gap="200" align="space-between" blockAlign="start">
								<div className="min-w-0">
									<a
										href={`https://www.npmjs.com/package/${pkg.name}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm font-semibold text-fg hover:underline inline-flex items-center gap-1"
									>
										{pkg.name}
										<ExternalLink className="h-3 w-3 text-fg-muted" />
									</a>
									{pkg.description && (
										<p className="text-xs text-fg-muted mt-0.5 line-clamp-2">{pkg.description}</p>
									)}
								</div>
								<Badge variant="secondary" className="shrink-0 font-mono text-xs">
									v{pkg.latestVersion}
								</Badge>
							</InlineStack>

							<div className="grid grid-cols-2 gap-y-1.5 text-xs">
								<div className="text-fg-muted">Downloads/semaine</div>
								<div className="text-fg font-mono text-right tabular-nums">
									{pkg.weeklyDownloads.toLocaleString("fr-FR")}
								</div>

								{pkg.unpackedSize != null && (
									<>
										<div className="text-fg-muted">Taille</div>
										<div className="text-fg font-mono text-right">
											{formatBytes(pkg.unpackedSize)}
										</div>
									</>
								)}

								{pkg.license && (
									<>
										<div className="text-fg-muted">License</div>
										<div className="text-fg text-right">{pkg.license}</div>
									</>
								)}

								{pkg.publishedAt && (
									<>
										<div className="text-fg-muted">Publié</div>
										<div className="text-fg text-right">
											{formatDistanceToNow(new Date(pkg.publishedAt), {
												addSuffix: true,
												locale: fr,
											})}
										</div>
									</>
								)}
							</div>

							{pkg.lastSyncedAt && (
								<p className="text-[11px] text-fg-muted/60 pt-1 border-t border-edge-subtle">
									Sync{" "}
									{formatDistanceToNow(new Date(pkg.lastSyncedAt), {
										addSuffix: true,
										locale: fr,
									})}
								</p>
							)}
						</BlockStack>
					))}
				</div>
			)}
		</BlockStack>
	)
}
