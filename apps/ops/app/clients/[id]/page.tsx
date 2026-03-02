"use client"

import { useState, use } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id, Doc } from "@/convex/_generated/dataModel"
import { OpsFrame } from "@/components/ops-frame"
import { ProjectForm } from "@/components/project-form"
import { ClientForm } from "@/components/client-form"
import { Button } from "@blazz/ui/components/ui/button"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@blazz/ui/components/ui/dialog"
import { Plus, ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

const statusLabel: Record<string, string> = { active: "Actif", paused: "En pause", closed: "Clôturé" }
const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  closed: "outline",
}

export default function ClientDetailPage({ params }: Props) {
  const { id } = use(params)
  const client = useQuery(api.clients.get, { id: id as Id<"clients"> })
  const projects = useQuery(api.projects.listByClient, { clientId: id as Id<"clients"> })
  const [editOpen, setEditOpen] = useState(false)
  const [projectOpen, setProjectOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Doc<"projects"> | null>(null)

  if (client === undefined) {
    return <OpsFrame><div className="p-6 text-fg-muted text-sm">Chargement…</div></OpsFrame>
  }

  if (client === null) {
    return <OpsFrame><div className="p-6 text-fg-muted text-sm">Client introuvable.</div></OpsFrame>
  }

  return (
    <OpsFrame>
      <div className="p-6 space-y-8">
        <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg">
          <ArrowLeft className="size-3.5" />Clients
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-lg border border-edge bg-surface flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
              {client.logoUrl ? (
                <img src={client.logoUrl} alt={client.name} className="size-full object-contain" />
              ) : (
                <span className="text-lg font-semibold text-fg-muted">
                  {client.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-fg">{client.name}</h1>
              {client.email && <p className="text-sm text-fg-muted">{client.email}</p>}
              {client.phone && <p className="text-sm text-fg-muted">{client.phone}</p>}
              {client.address && <p className="text-sm text-fg-muted mt-1">{client.address}</p>}
            </div>
          </div>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
              Modifier
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Modifier le client</DialogTitle></DialogHeader>
              <ClientForm
                defaultValues={{ ...client, id: client._id }}
                onSuccess={() => setEditOpen(false)}
                onCancel={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium text-fg">Projets</h2>
            <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
              <DialogTrigger render={<Button size="sm" variant="outline" />}>
                <Plus className="size-4 mr-1.5" />Nouveau projet
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nouveau projet</DialogTitle></DialogHeader>
                <ProjectForm clientId={id as Id<"clients">} onSuccess={() => setProjectOpen(false)} onCancel={() => setProjectOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {projects?.length === 0 && <p className="text-sm text-fg-muted">Aucun projet pour ce client.</p>}

          <div className="space-y-2">
            {projects?.map((project) => (
              <div key={project._id} className="flex items-center justify-between p-4 rounded-lg border border-edge bg-raised">
                <div>
                  <p className="font-medium text-fg">{project.name}</p>
                  <p className="text-xs text-fg-muted mt-0.5">
                    {project.tjm}€/j · {project.hoursPerDay}h/j · {project.currency}
                    {project.startDate && ` · depuis ${project.startDate}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[project.status]}>{statusLabel[project.status]}</Badge>
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

      {/* Edit project dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Modifier le projet</DialogTitle></DialogHeader>
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
    </OpsFrame>
  )
}
