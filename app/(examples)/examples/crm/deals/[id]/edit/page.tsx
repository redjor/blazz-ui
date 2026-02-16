"use client"

import { notFound } from "next/navigation"
import { use } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, X } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { FormSection } from "@/components/blocks/form-section"
import { FormField } from "@/components/blocks/form-field"
import { FieldGrid } from "@/components/blocks/field-grid"
import { Button } from "@/components/ui/button"
import { getDealById, companies } from "@/lib/sample-data"
import { dealSchema, type DealFormData } from "@/lib/schemas"

export default function EditDealPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const deal = getDealById(id)
	const router = useRouter()

	if (!deal) notFound()

	const form = useForm<DealFormData>({
		resolver: zodResolver(dealSchema),
		defaultValues: {
			title: deal.title,
			amount: String(deal.amount),
			stage: deal.stage,
			probability: String(deal.probability),
			expectedCloseDate: deal.expectedCloseDate,
			source: deal.source,
			companyId: deal.companyId,
		},
	})

	const onSubmit = async (data: DealFormData) => {
		await new Promise((r) => setTimeout(r, 500))
		toast.success(`Deal "${data.title}" mis à jour`)
		router.push(`/deals/${id}`)
	}

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={`Modifier ${deal.title}`}
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/crm/dashboard" },
					{ label: "Pipeline", href: "/examples/crm/deals" },
					{ label: deal.title, href: `/deals/${id}` },
					{ label: "Modifier" },
				]}
			/>

			<form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
				<FormSection title="Informations du deal" defaultOpen>
					<FieldGrid columns={2}>
						<FormField name="title" label="Titre" control={form.control} required span={2} />
						<FormField name="amount" label="Montant (€)" type="number" control={form.control} />
						<FormField
							name="stage"
							label="Étape"
							type="select"
							control={form.control}
							options={[
								{ value: "lead", label: "Lead" },
								{ value: "qualified", label: "Qualifié" },
								{ value: "proposal", label: "Proposition" },
								{ value: "negotiation", label: "Négociation" },
								{ value: "closed_won", label: "Gagné" },
								{ value: "closed_lost", label: "Perdu" },
							]}
						/>
						<FormField name="probability" label="Probabilité (%)" type="number" control={form.control} />
						<FormField name="expectedCloseDate" label="Date de clôture" control={form.control} />
						<FormField
							name="source"
							label="Source"
							type="select"
							control={form.control}
							options={[
								{ value: "Inbound", label: "Inbound" },
								{ value: "Outbound", label: "Outbound" },
								{ value: "Salon", label: "Salon" },
								{ value: "Partenaire", label: "Partenaire" },
								{ value: "LinkedIn", label: "LinkedIn" },
								{ value: "Référencement", label: "Référencement" },
								{ value: "Upsell", label: "Upsell" },
							]}
						/>
						<FormField
							name="companyId"
							label="Entreprise"
							type="select"
							control={form.control}
							options={companies.map((c) => ({ value: c.id, label: c.name }))}
						/>
					</FieldGrid>
				</FormSection>

				<div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-surface py-4">
					<Button type="button" variant="outline" onClick={() => router.back()}>
						<X className="size-4" data-icon="inline-start" />
						Annuler
					</Button>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						<Save className="size-4" data-icon="inline-start" />
						{form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer"}
					</Button>
				</div>
			</form>
		</div>
	)
}
