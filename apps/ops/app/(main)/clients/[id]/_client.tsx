"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsStrip } from "@blazz/pro/components/blocks/stats-strip"
import { Field, FieldGrid } from "@blazz/ui/components/patterns/field-grid"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@blazz/ui/components/ui/dialog"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Pencil, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { use, useState } from "react"
import { ClientForm } from "@/components/client-form"
import { ProjectForm } from "@/components/project-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

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

export default function ClientDetailPageClient({ params }: Props) {
	const { id } = use(params)
	const client = useQuery(api.clients.get, { id: id as Id<"clients"> })
	const projects = useQuery(api.projects.listByClient, { clientId: id as Id<"clients"> })
	const clientStats = useQuery(api.clients.getStats, { clientId: id as Id<"clients"> })
	const [editOpen, setEditOpen] = useState(false)
	const [projectOpen, setProjectOpen] = useState(false)
	const [editingProject, setEditingProject] = useState<Doc<"projects"> | null>(null)

	useAppTopBar(
		client != null ? [{ label: "Clients", href: "/clients" }, { label: client.name }] : null
	)

	if (client === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<BlockStack gap="200">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-6 w-48" />
				</BlockStack>
				<InlineStack gap="400" blockAlign="start">
					<Skeleton className="size-14 rounded-lg shrink-0" />
					<InlineGrid columns={3} gap="400" className="flex-1">
						{Array.from({ length: 6 }).map((_, i) => (
							<BlockStack key={i} gap="150">
								<Skeleton className="h-3.5 w-20" />
								<Skeleton className="h-4 w-32" />
							</BlockStack>
						))}
					</InlineGrid>
				</InlineStack>
			</BlockStack>
		)
	}

	if (client === null) {
		return <div className="p-6 text-fg-muted text-sm">Client introuvable.</div>
	}

	const fmt = (n: number) => `${n.toLocaleString("fr-FR")} €`

	return (
		<>
			<BlockStack gap="800" className="p-6">
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
				<InlineStack gap="400" blockAlign="start">
					<Box className="size-14 rounded-lg border border-edge bg-surface flex items-center justify-center overflow-hidden shrink-0">
						{client.logoUrl ? (
							<Image
								src={client.logoUrl}
								alt={client.name}
								className="size-full object-contain"
								width={40}
								height={40}
							/>
						) : (
							<span className="text-lg font-semibold text-fg-muted">
								{client.name.slice(0, 2).toUpperCase()}
							</span>
						)}
					</Box>
					<FieldGrid columns={3} className="flex-1">
						{client.email && <Field label="Email" value={client.email} />}
						{client.phone && <Field label="Téléphone" value={client.phone} />}
						{client.address && <Field label="Adresse" value={client.address} span={2} />}
						{!client.email && !client.phone && !client.address && (
							<Field label="Informations" value="—" />
						)}
					</FieldGrid>
				</InlineStack>

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
				<BlockStack gap="400">
					<InlineStack align="space-between" blockAlign="center">
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
					</InlineStack>

					{projects?.length === 0 && (
						<p className="text-sm text-fg-muted">Aucun projet pour ce client.</p>
					)}

					<BlockStack gap="200">
						{projects?.map((project) => (
							<InlineStack
								key={project._id}
								align="space-between"
								blockAlign="center"
								className="py-2.5 border-b border-edge last:border-0"
							>
								<Link
									href={`/projects/${project._id}`}
									className="flex-1 min-w-0 hover:opacity-75 transition-opacity"
								>
									<span className="block text-sm font-medium text-fg">{project.name}</span>
									<span className="block text-xs text-fg-muted mt-0.5 font-mono">
										{project.tjm}€/j · {project.hoursPerDay}h/j · {project.currency}
										{project.startDate && ` · depuis ${project.startDate}`}
									</span>
								</Link>
								<InlineStack gap="300" blockAlign="center" className="shrink-0 ml-4">
									{project.budgetPercent !== null && (
										<span
											className={`inline-block size-2 rounded-full ${
												project.budgetPercent >= 90
													? "bg-red-500"
													: project.budgetPercent >= 70
														? "bg-amber-500"
														: "bg-green-500"
											}`}
											title={`Budget : ${project.budgetPercent}%`}
										/>
									)}
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
								</InlineStack>
							</InlineStack>
						))}
					</BlockStack>
				</BlockStack>
			</BlockStack>

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
