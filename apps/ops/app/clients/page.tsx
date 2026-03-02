"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { OpsFrame } from "@/components/ops-frame"
import { ClientForm } from "@/components/client-form"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@blazz/ui/components/ui/dialog"
import { Plus, ChevronRight } from "lucide-react"
import Link from "next/link"

function ClientAvatar({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div className="size-9 rounded-md border border-edge bg-surface flex items-center justify-center overflow-hidden shrink-0">
      {logoUrl ? (
        <img src={logoUrl} alt={name} className="size-full object-contain" />
      ) : (
        <span className="text-xs font-semibold text-fg-muted">{initials}</span>
      )}
    </div>
  )
}

export default function ClientsPage() {
  const clients = useQuery(api.clients.list)
  const [open, setOpen] = useState(false)

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-fg">Clients</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus className="size-4 mr-1.5" />Nouveau client
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouveau client</DialogTitle></DialogHeader>
              <ClientForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {clients === undefined && <p className="text-fg-muted text-sm">Chargement…</p>}
        {clients?.length === 0 && <p className="text-fg-muted text-sm">Aucun client. Créez-en un !</p>}

        <div className="space-y-2">
          {clients?.map((client) => (
            <Link
              key={client._id}
              href={`/clients/${client._id}`}
              className="flex items-center justify-between p-4 rounded-lg border border-edge bg-raised hover:bg-panel transition-colors"
            >
              <div className="flex items-center gap-3">
                <ClientAvatar name={client.name} logoUrl={client.logoUrl} />
                <div>
                  <p className="font-medium text-fg">{client.name}</p>
                  {client.email && <p className="text-sm text-fg-muted">{client.email}</p>}
                </div>
              </div>
              <ChevronRight className="size-4 text-fg-muted" />
            </Link>
          ))}
        </div>
      </div>
    </OpsFrame>
  )
}
