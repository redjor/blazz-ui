"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OpsFrame } from "@/components/ops-frame"
import { ClientForm } from "@/components/client-form"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@blazz/ui/components/ui/dialog"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Plus, ChevronRight, Users } from "lucide-react"
import Link from "next/link"

function ClientAvatar({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div className="size-8 rounded border border-edge bg-surface flex items-center justify-center overflow-hidden shrink-0">
      {logoUrl ? (
        <img src={logoUrl} alt={name} className="size-full object-contain" />
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

  return (
    <OpsFrame>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-fg">
            Clients
            {clients !== undefined && (
              <span className="ml-2 text-sm font-normal text-fg-muted">({clients.length})</span>
            )}
          </h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="size-4 mr-1.5" />Nouveau client
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouveau client</DialogTitle></DialogHeader>
              <ClientForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading */}
        {clients === undefined && <ClientListSkeleton />}

        {/* Empty state */}
        {clients?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <Users className="size-10 text-fg-muted" />
            <div>
              <p className="text-sm font-medium text-fg">Aucun client</p>
              <p className="text-xs text-fg-muted mt-0.5">Créez votre premier client pour commencer à tracker du temps</p>
            </div>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="size-4 mr-1.5" />Nouveau client
            </Button>
          </div>
        )}

        {/* List */}
        {clients && clients.length > 0 && (
          <div className="space-y-1">
            {clients.map((client) => (
              <Link
                key={client._id}
                href={`/clients/${client._id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-transparent hover:border-edge hover:bg-raised transition-colors"
              >
                <ClientAvatar name={client.name} logoUrl={client.logoUrl} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-fg truncate">{client.name}</p>
                  {client.email && (
                    <p className="text-xs text-fg-muted truncate">{client.email}</p>
                  )}
                </div>
                <ChevronRight className="size-4 text-fg-muted shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </OpsFrame>
  )
}
