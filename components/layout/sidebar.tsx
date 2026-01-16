import {
  ClientInfoCard,
  OccupantInfoCard,
  SidebarNewClientButton,
} from '@/features/client-management/components'
import { ClientSearch } from '@/features/client-management/components/search/client-search'

interface SidebarProps {
  clientId?: string | null
}

/**
 * Sidebar - Barre latérale globale de l'application
 * Affiche la recherche client et les informations du client sélectionné
 */
export function Sidebar({ clientId }: Readonly<SidebarProps>) {
  return (
    <aside className="flex w-82 flex-col border-r bg-gray-200">
      {/* Top section - scrollable */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Client Search - Always visible at the top */}
        <ClientSearch updateUrl />

        {/* Create New Client Button - Only visible when no client selected */}
        {!clientId && <SidebarNewClientButton />}

        {/* Client Info Card - Only displayed if client is selected */}
        {clientId && <ClientInfoCard clientId={clientId} />}

        {/* Occupant Info Card - Only displayed if client has lodged card */}
        {clientId && <OccupantInfoCard clientId={clientId} />}
      </div>
    </aside>
  )
}
