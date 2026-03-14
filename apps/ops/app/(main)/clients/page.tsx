"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Empty } from "@blazz/ui/components/ui/empty"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { ChevronRight, Plus, Users } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ClientForm } from "@/components/client-form"
import { useOpsTopBar } from "@/components/ops-frame"
import { api } from "@/convex/_generated/api"
import Image from "next/image"

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
		<div className="space-y-1">
			{Array.from({ length: 4 }).map((_, i) => (
				<div key={i} className="flex items-center gap-3 px-3 py-2.5">
					<Skeleton className="size-8 rounded shrink-0" />
					<div className="flex-1 space-y-1.5">
						<Skeleton className="h-3.5 w-32" />
						<Skeleton className="h-3 w-48" />
					</div>
				</div>
			))}
		</div>
	)
}

export default function ClientsPage() {
	const clients = useQuery(api.clients.list)
	const [open, setOpen] = useState(false)

	const topBarActions = useMemo(
		() => (
			<Button size="sm" onClick={() => setOpen(true)}>
				Nouveau client
			</Button>
		),
		[]
	)

	useOpsTopBar([{ label: "Clients" }], topBarActions)

	return (
		<div className="p-4 space-y-4">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nouveau client</DialogTitle>
					</DialogHeader>
					<ClientForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
				</DialogContent>
			</Dialog>

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
			{clients && clients.length > 0 && (
				<div className="space-y-1">
					{clients.map((client) => (
						<Link
							key={client._id}
							href={`/clients/${client._id}`}
							className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-transparent hover:border-edge hover:bg-surface-3 transition-colors"
						>
							<ClientAvatar name={client.name} logoUrl={client.logoUrl} />
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-fg truncate">{client.name}</p>
								{client.email && <p className="text-xs text-fg-muted truncate">{client.email}</p>}
							</div>
							<ChevronRight className="size-4 text-fg-muted shrink-0" />
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
