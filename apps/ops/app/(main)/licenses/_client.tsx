"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"
import { Empty } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { Check, Copy, Key, Plus, Trash2, XCircle } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { LicenseKeyForm } from "@/components/license-key-form"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

function getStatus(entry: { revokedAt?: number; expiresAt: string }) {
	if (entry.revokedAt) return "revoked" as const
	const expiry = new Date(entry.expiresAt)
	if (expiry < new Date()) return "expired" as const
	return "active" as const
}

function StatusBadge({ status }: { status: "active" | "expired" | "revoked" }) {
	const map = {
		active: { label: "Active", variant: "success" as const },
		expired: { label: "Expirée", variant: "warning" as const },
		revoked: { label: "Révoquée", variant: "destructive" as const },
	}
	const { label, variant } = map[status]
	return <Badge variant={variant}>{label}</Badge>
}

function CopyButton({ value }: { value: string }) {
	const [copied, setCopied] = useState(false)
	const handleCopy = () => {
		navigator.clipboard.writeText(value)
		setCopied(true)
		toast.success("Clé copiée")
		setTimeout(() => setCopied(false), 2000)
	}
	return (
		<Button size="sm" variant="ghost" onClick={handleCopy}>
			{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
		</Button>
	)
}

function LicenseListSkeleton() {
	return (
		<BlockStack gap="200">
			{Array.from({ length: 3 }).map((_, i) => (
				<div key={i} className="rounded-lg border border-edge bg-muted p-4">
					<InlineStack gap="300" blockAlign="center">
						<Skeleton className="h-4 w-64" />
						<Skeleton className="h-5 w-16 rounded-full" />
					</InlineStack>
					<div className="mt-2">
						<Skeleton className="h-3 w-48" />
					</div>
				</div>
			))}
		</BlockStack>
	)
}

export default function LicensesPageClient() {
	const keys = useQuery(api.licenseKeys.list)
	const revoke = useMutation(api.licenseKeys.revoke)
	const remove = useMutation(api.licenseKeys.remove)
	const [createOpen, setCreateOpen] = useState(false)
	const [generatedKey, setGeneratedKey] = useState<string | null>(null)
	const [filter, setFilter] = useState<"all" | "active" | "expired" | "revoked">("all")

	const topBarActions = useMemo(
		() => (
			<Button size="icon-sm" variant="ghost" onClick={() => setCreateOpen(true)}>
				<Plus className="size-4" />
			</Button>
		),
		[]
	)

	useAppTopBar([{ label: "Licences" }], topBarActions)

	const filtered = useMemo(() => {
		if (!keys) return undefined
		if (filter === "all") return keys
		return keys.filter((k) => getStatus(k) === filter)
	}, [keys, filter])

	const handleRevoke = async (id: Id<"licenseKeys">) => {
		try {
			await revoke({ id })
			toast.success("Clé révoquée")
		} catch {
			toast.error("Erreur")
		}
	}

	const handleDelete = async (id: Id<"licenseKeys">) => {
		try {
			await remove({ id })
			toast.success("Clé supprimée")
		} catch {
			toast.error("Erreur")
		}
	}

	return (
		<BlockStack gap="400" className="p-4">
			{/* Create dialog */}
			<Dialog
				open={createOpen}
				onOpenChange={(open) => {
					setCreateOpen(open)
					if (!open) setGeneratedKey(null)
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{generatedKey ? "Clé générée" : "Nouvelle clé licence"}</DialogTitle>
						{generatedKey && (
							<DialogDescription>
								Copiez cette clé maintenant. Elle ne sera plus affichée en entier.
							</DialogDescription>
						)}
					</DialogHeader>
					{generatedKey ? (
						<BlockStack gap="300">
							<div className="flex items-center gap-2 rounded-lg border border-edge bg-card p-3 font-mono text-sm break-all">
								{generatedKey}
								<CopyButton value={generatedKey} />
							</div>
							<Button
								onClick={() => {
									setCreateOpen(false)
									setGeneratedKey(null)
								}}
							>
								Fermer
							</Button>
						</BlockStack>
					) : (
						<LicenseKeyForm
							onSuccess={(key) => setGeneratedKey(key)}
							onCancel={() => setCreateOpen(false)}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Filters */}
			{keys && keys.length > 0 && (
				<InlineStack gap="200">
					{(["all", "active", "expired", "revoked"] as const).map((f) => (
						<Button
							key={f}
							size="sm"
							variant={filter === f ? "default" : "outline"}
							onClick={() => setFilter(f)}
						>
							{f === "all"
								? "Toutes"
								: f === "active"
									? "Actives"
									: f === "expired"
										? "Expirées"
										: "Révoquées"}
						</Button>
					))}
				</InlineStack>
			)}

			{/* Loading */}
			{keys === undefined && <LicenseListSkeleton />}

			{/* Empty */}
			{keys?.length === 0 && (
				<Empty
					icon={Key}
					title="Aucune clé licence"
					description="Générez des clés pour vos clients @blazz/pro"
					action={{ label: "Nouvelle clé", onClick: () => setCreateOpen(true), icon: Plus }}
				/>
			)}

			{/* List */}
			{filtered && filtered.length > 0 && (
				<BlockStack gap="200">
					{filtered.map((entry) => {
						const status = getStatus(entry)
						return (
							<div key={entry._id} className="rounded-lg border border-edge bg-muted p-4">
								<InlineStack gap="300" blockAlign="center" className="justify-between">
									<InlineStack gap="300" blockAlign="center" className="min-w-0 flex-1">
										<code className="text-sm font-mono text-fg truncate">
											{entry.key.slice(0, 20)}...{entry.key.slice(-8)}
										</code>
										<StatusBadge status={status} />
										<Badge variant="outline">{entry.plan}</Badge>
									</InlineStack>
									<InlineStack gap="100">
										<CopyButton value={entry.key} />
										{status === "active" && (
											<Button size="sm" variant="ghost" onClick={() => handleRevoke(entry._id)}>
												<XCircle className="size-3.5" />
											</Button>
										)}
										{status === "revoked" && (
											<Button size="sm" variant="ghost" onClick={() => handleDelete(entry._id)}>
												<Trash2 className="size-3.5" />
											</Button>
										)}
									</InlineStack>
								</InlineStack>
								<div className="mt-2 flex items-center gap-4 text-xs text-fg-muted">
									<span>Org: {entry.orgId}</span>
									{entry.clientName && <span>Client: {entry.clientName}</span>}
									{entry.email && <span>{entry.email}</span>}
									<span>Expire: {entry.expiresAt}</span>
									<span>Créée: {new Date(entry.createdAt).toLocaleDateString("fr-FR")}</span>
								</div>
							</div>
						)
					})}
				</BlockStack>
			)}
		</BlockStack>
	)
}
