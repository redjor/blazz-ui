"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { StatsStrip } from "@blazz/ui/components/blocks/stats-strip"
import { Field, FieldGrid } from "@blazz/ui/components/patterns/field-grid"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@blazz/ui/components/ui/dialog"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Pencil, Plus } from "lucide-react"
import Link from "next/link"
import { use, useState } from "react"
import { ClientForm } from "@/components/client-form"
import { useOpsTopBar } from "@/components/ops-frame"
import { ProjectForm } from "@/components/project-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import Image from "next/image"

interface Props {
	params: Promise<{ id: string }>
}

const statusDot: Record<string, string> = {
	active: "bg-green-500",
	paused: "bg-amber-500",
	closed: "bg-fg-muted",
}
const statusLabel: Record<string, string> = {
	active: "Actif",
	paused: "En pause",
	closed: "Clôturé",
}

export default function ClientDetailPage({ params }: Props) {
	const { id } = use(params)
	const client = useQuery(api.clients.get, { id: id as Id<"clients"> })
	const projects = useQuery(api.projects.listByClient, { clientId: id as Id<"clients"> })
	const clientStats = useQuery(api.clients.getStats, { clientId: id as Id<"clients"> })
	const [editOpen, setEditOpen] = useState(false)
	const [projectOpen, setProjectOpen] = useState(false)
	const [editingProject, setEditingProject] = useState<Doc<"projects"> | null>(null)

	useOpsTopBar(
		client != null
			? [{ label: "Clients", href: "/clients" }, { label: client.name }]
			: null
	)

	if (client === undefined) {
		return (
			<div className="p-6 space-y-6">
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-6 w-48" />
					</div>
					<div className="flex items-start gap-4">
						<Skeleton className="size-14 rounded-lg shrink-0" />
						<div className="grid grid-cols-3 gap-x-6 gap-y-4 flex-1">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="space-y-1.5">
									<Skeleton className="h-3.5 w-20" />
									<Skeleton className="h-4 w-32" />
								</div>
							))}
						</div>
					</div>
				</div>
		)
	}

	if (client === null) {
		return <div className="p-6 text-fg-muted text-sm">Client introuvable.</div>
	}

	const fmt = (n: number) => `${n.toLocaleString("fr-FR")} €`

	return (
		<>
		<div className="p-6 space-y-8">
				<PageHeader
					title={client.name}
					actions={[
						{
							label: "Modifier",
							variant: "outline",
							onClick: () => setEditOpen(true),
						},
					]}
				/>

				{/* Avatar + coordonnées */}
				<div className="flex items-start gap-4">
					<div className="size-14 rounded-lg border border-edge bg-surface flex items-center justify-center overflow-hidden shrink-0">
						{client.logoUrl ? (
							<Image src={client.logoUrl} alt={client.name} className="size-full object-contain" width={40} height={40} />
						) : (
							<span className="text-lg font-semibold text-fg-muted">
								{client.name.slice(0, 2).toUpperCase()}
							</span>
						)}
					</div>
					<FieldGrid columns={3} className="flex-1">
						{client.email && <Field label="Email" value={client.email} />}
						{client.phone && <Field label="Téléphone" value={client.phone} />}
						{client.address && <Field label="Adresse" value={client.address} span={2} />}
						{!client.email && !client.phone && !client.address && (
							<Field label="Informations" value="—" />
						)}
					</FieldGrid>
				</div>

				{/* Stats pipeline */}
				<StatsStrip
					loading={clientStats === undefined}
					stats={
						clientStats
							? [
									{ label: "À facturer", value: fmt(clientStats.toInvoice) },
									{ label: "Facturé (non payé)", value: fmt(clientStats.invoiced) },
									{ label: "Payé", value: fmt(clientStats.paid) },
									{ label: "CA total", value: fmt(clientStats.total) },
								]
							: []
					}
				/>

				{/* Projets */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-sm font-medium text-fg">Projets</h2>
						<Dialog open={projectOpen} onOpenChange={setProjectOpen}>
							<DialogTrigger render={<Button size="sm" variant="outline" />}>
								<Plus className="size-4 mr-1.5" />
								Nouveau projet
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Nouveau projet</DialogTitle>
								</DialogHeader>
								<ProjectForm
									clientId={id as Id<"clients">}
									onSuccess={() => setProjectOpen(false)}
									onCancel={() => setProjectOpen(false)}
								/>
							</DialogContent>
						</Dialog>
					</div>

					{projects?.length === 0 && (
						<p className="text-sm text-fg-muted">Aucun projet pour ce client.</p>
					)}

					<div className="space-y-2">
						{projects?.map((project) => (
							<div
								key={project._id}
								className="flex items-center justify-between py-2.5 border-b border-edge last:border-0"
							>
								<Link
									href={`/clients/${id}/projects/${project._id}`}
									className="flex-1 min-w-0 hover:opacity-75 transition-opacity"
								>
									<span className="block text-sm font-medium text-fg">{project.name}</span>
									<span className="block text-xs text-fg-muted mt-0.5 tabular-nums">
										{project.tjm}€/j · {project.hoursPerDay}h/j · {project.currency}
										{project.startDate && ` · depuis ${project.startDate}`}
									</span>
								</Link>
								<div className="flex items-center gap-3 shrink-0 ml-4">
									<span className="flex items-center gap-1.5 text-xs text-fg-muted">
										<span
											className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`}
										/>
										{statusLabel[project.status]}
									</span>
									<Button
										variant="ghost"
										size="icon"
										className="size-8 text-fg-muted"
										onClick={() => setEditingProject(project)}
									>
										<Pencil className="size-3.5" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Edit client dialog */}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier le client</DialogTitle>
					</DialogHeader>
					<ClientForm
						defaultValues={{ ...client, id: client._id }}
						onSuccess={() => setEditOpen(false)}
						onCancel={() => setEditOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Edit project dialog */}
			<Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier le projet</DialogTitle>
					</DialogHeader>
					{editingProject && (
						<ProjectForm
							clientId={id as Id<"clients">}
							defaultValues={{ ...editingProject, id: editingProject._id }}
							onSuccess={() => setEditingProject(null)}
							onCancel={() => setEditingProject(null)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}
