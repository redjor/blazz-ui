"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { use } from "react"
import { ProjectTabs } from "@/components/project-tabs"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

interface Props {
	params: Promise<{ pid: string }>
	children: React.ReactNode
}

export default function ProjectLayout({ params, children }: Props) {
	const { pid } = use(params)
	const project = useQuery(api.projects.get, { id: pid as Id<"projects"> })
	const clientId = project?.clientId
	const client = useQuery(api.clients.get, clientId ? { id: clientId } : "skip")
	const basePath = `/projects/${pid}`

	useAppTopBar(project != null ? [{ label: "Clients", href: "/clients" }, { label: client?.name ?? "...", href: `/clients/${clientId}` }, { label: project.name }] : null)

	if (project === undefined) {
		return (
			<div className="flex flex-col h-[calc(100vh-3.5rem)]">
				<div className="border-b border-edge px-6 py-2.5">
					<Skeleton className="h-4 w-64" />
				</div>
				<div className="flex-1 p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<Skeleton className="h-32 w-full" />
				</div>
			</div>
		)
	}

	if (project === null) {
		return <div className="p-6 text-fg-muted text-sm">Projet introuvable.</div>
	}

	return (
		<div className="flex flex-col h-[calc(100vh-3.5rem)]">
			<div className="border-b border-edge/50">
				<ProjectTabs basePath={basePath} />
			</div>
			<div className="flex-1 min-w-0 overflow-y-auto">{children}</div>
		</div>
	)
}
