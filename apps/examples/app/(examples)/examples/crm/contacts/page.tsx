"use client"

import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { createContactsPreset } from "@/components/data-table-presets"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Box } from "@blazz/ui/components/ui/box"
import { Plus, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { toast } from "sonner"
import { contacts } from "@/lib/sample-data"

export default function ContactsPage() {
	const router = useRouter()

	const { columns, views, rowActions, bulkActions } = useMemo(
		() =>
			createContactsPreset({
				onView: (contact) => router.push(`/contacts/${contact.id}`),
				onEdit: (contact) => router.push(`/contacts/${contact.id}/edit`),
				onBulkArchive: (items) => toast.success(`${items.length} contact(s) archivé(s)`),
				onBulkDelete: (items) => toast.success(`${items.length} contact(s) supprimé(s)`),
			}),
		[router]
	)

	return (
		<div className="p-6 space-y-4">
			<PageHeader
				title="Contacts"
				description="Gérez vos contacts"
				breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Contacts" }]}
				actions={[
					{ label: "Importer", href: "/contacts/import", icon: Upload, variant: "outline" },
					{ label: "Nouveau contact", href: "/contacts/new", icon: Plus },
				]}
			/>

			<Box background="surface" border="default" borderRadius="lg" className="overflow-hidden">
				<DataTable
					data={contacts}
					columns={columns}
					views={views}
					rowActions={rowActions}
					bulkActions={bulkActions}
					getRowId={(row) => row.id}
					enableSorting
					enablePagination
					enableRowSelection
					enableGlobalSearch
					enableAdvancedFilters
					enableCustomViews
					combineSearchAndFilters
					searchPlaceholder="Rechercher par nom, email..."
					locale="fr"
					variant="lined"
					pagination={{ pageSize: 25, pageSizeOptions: [10, 25, 50, 100] }}
				/>
			</Box>
		</div>
	)
}
