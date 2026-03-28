"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useQuery } from "convex/react"
import { FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { InvoiceSection } from "@/components/invoice-section"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useFeatureFlags } from "@/lib/feature-flags-context"

export default function ProjectInvoicesPage({ params }: { params: Promise<{ pid: string }> }) {
	const { isEnabled } = useFeatureFlags()
	const { pid } = use(params)
	const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
	const router = useRouter()

	if (!isEnabled("invoicing")) {
		return <div className="p-6 text-fg-muted text-sm">Facturation non activée.</div>
	}

	const entries = data?.entries ?? []
	const readyEntries = entries.filter((e) => e.billable && e.status !== "invoiced" && e.status !== "paid" && !e.invoicedAt)

	return (
		<BlockStack gap="400" className="p-6">
			<InlineStack align="space-between" blockAlign="center">
				<h2 className="text-sm font-medium text-fg">Factures</h2>
				{readyEntries.length > 0 && (
					<Button size="sm" variant="outline" onClick={() => router.push(`/invoices/new?clientId=${data?.project.clientId}&projectId=${pid}`)}>
						<FileText className="size-3.5 mr-1" />
						Facturer ({readyEntries.length} entrée{readyEntries.length > 1 ? "s" : ""})
					</Button>
				)}
			</InlineStack>
			<InvoiceSection projectId={pid as Id<"projects">} />
		</BlockStack>
	)
}
