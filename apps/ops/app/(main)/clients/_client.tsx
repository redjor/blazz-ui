"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Empty } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { ChevronRight, Plus, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ClientForm } from "@/components/client-form"
import { api } from "@/convex/_generated/api"

const typeLabels = {
	freelance: "Freelance",
	product: "Produit",
	both: "Les deux",
} as const

function ClientAvatar({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
	const initials = name.slice(0, 2).toUpperCase()
	return (
		<div className="size-8 rounded border border-edge bg-surface flex items-center justify-center overflow-hidden shrink-0">
			{logoUrl ? (
				<Image
					src={logoUrl}
					alt={name}
					width={24}
					height={24}
					className="size-full object-contain"
				/>
			) : (
				<span className="text-xs font-semibold text-fg-muted">{initials}</span>
			)}
		</div>
	)
}

function ClientListSkeleton() {
	return (
		<BlockStack gap="100">
			{Array.from({ length: 4 }).map((_, i) => (
				<InlineStack key={i} gap="300" blockAlign="center" className="px-3 py-2.5">
					<Skeleton className="size-8 rounded shrink-0" />
					<BlockStack gap="150" className="flex-1">
						<Skeleton className="h-3.5 w-32" />
						<Skeleton className="h-3 w-48" />
					</BlockStack>
				</InlineStack>
			))}
		</BlockStack>
	)
}

export default function ClientsPageClient() {
	const clients = useQuery(api.clients.list)
	const [open, setOpen] = useState(false)
	const [filter, setFilter] = useState<"all" | "freelance" | "product" | "both">("all")

	const topBarActions = useMemo(
		() => (
			<Button size="icon-sm" variant="ghost" onClick={() => setOpen(true)}>
				<Plus className="size-4" />
			</Button>
		),
		[]
	)

	useAppTopBar([{ label: "Clients" }], topBarActions)

	const filtered = useMemo(() => {
		if (!clients) return undefined
		if (filter === "all") return clients
		return clients.filter((c) => {
			const type = c.type ?? "freelance"
			return type === filter || type === "both"
		})
	}, [clients, filter])

	return (
		<BlockStack gap="400" className="p-4">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nouveau client</DialogTitle>
					</DialogHeader>
					<ClientForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
				</DialogContent>
			</Dialog>

			{/* Filters */}
			{clients && clients.length > 0 && (
				<InlineStack gap="200">
					{(["all", "freelance", "product", "both"] as const).map((f) => (
						<Button
							key={f}
							size="sm"
							variant={filter === f ? "default" : "outline"}
							onClick={() => setFilter(f)}
						>
							{f === "all" ? "Tous" : typeLabels[f]}
						</Button>
					))}
				</InlineStack>
			)}

			{/* Loading */}
			{clients === undefined && <ClientListSkeleton />}

			{/* Empty state */}
			{clients?.length === 0 && (
				<Empty
					icon={Users}
					title="Aucun client"
					description="Créez votre premier client pour commencer à tracker du temps"
					action={{ label: "Nouveau client", onClick: () => setOpen(true), icon: Plus }}
				/>
			)}

			{/* List */}
			{filtered && filtered.length > 0 && (
				<BlockStack gap="100">
					{filtered.map((client) => (
						<Link
							key={client._id}
							href={`/clients/${client._id}`}
							className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-transparent hover:border-edge hover:bg-surface-3 transition-colors"
						>
							<ClientAvatar name={client.name} logoUrl={client.logoUrl} />
							<div className="flex-1 min-w-0">
								<InlineStack gap="200" blockAlign="center">
									<p className="text-sm font-medium text-fg truncate">{client.name}</p>
									<Badge variant="outline" className="text-[10px] shrink-0">
										{typeLabels[client.type ?? "freelance"]}
									</Badge>
								</InlineStack>
								{client.email && <p className="text-xs text-fg-muted truncate">{client.email}</p>}
							</div>
							<ChevronRight className="size-4 text-fg-muted shrink-0" />
						</Link>
					))}
				</BlockStack>
			)}
		</BlockStack>
	)
}
