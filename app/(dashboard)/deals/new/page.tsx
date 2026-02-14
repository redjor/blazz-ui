"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Save, X } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { FormSection } from "@/components/blocks/form-section"
import { FormField } from "@/components/blocks/form-field"
import { FieldGrid } from "@/components/blocks/field-grid"
import { Button } from "@/components/ui/button"
import { companies, contacts } from "@/lib/sample-data"

interface DealForm {
	title: string
	amount: string
	stage: string
	probability: string
	expectedCloseDate: string
	source: string
	companyId: string
	contactId: string
}

export default function NewDealPage() {
	const router = useRouter()
	const form = useForm<DealForm>({
		defaultValues: { stage: "lead", probability: "15" },
	})

	const onSubmit = async (data: DealForm) => {
		await new Promise((r) => setTimeout(r, 500))
		alert(`Deal "${data.title}" créé`)
		router.push("/deals")
	}

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title="Nouveau deal"
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Pipeline", href: "/deals" },
					{ label: "Nouveau" },
				]}
			/>

			<form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
				<FormSection title="Informations du deal" defaultOpen>
					<FieldGrid columns={2}>
						<FormField name="title" label="Titre du deal" control={form.control} required span={2} />
						<FormField name="amount" label="Montant (€)" type="number" control={form.control} required />
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
							]}
						/>
						<FormField name="probability" label="Probabilité (%)" type="number" control={form.control} />
						<FormField name="expectedCloseDate" label="Date de clôture prévue" type="text" control={form.control} placeholder="YYYY-MM-DD" />
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
					</FieldGrid>
				</FormSection>

				<FormSection title="Entreprise & Contact">
					<FieldGrid columns={2}>
						<FormField
							name="companyId"
							label="Entreprise"
							type="select"
							control={form.control}
							required
							options={companies.map((c) => ({ value: c.id, label: c.name }))}
						/>
						<FormField
							name="contactId"
							label="Contact"
							type="select"
							control={form.control}
							options={contacts.map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))}
						/>
					</FieldGrid>
				</FormSection>

				<div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-background py-4">
					<Button type="button" variant="outline" onClick={() => router.back()}>
						<X className="size-4" data-icon="inline-start" />
						Annuler
					</Button>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						<Save className="size-4" data-icon="inline-start" />
						{form.formState.isSubmitting ? "Enregistrement..." : "Créer le deal"}
					</Button>
				</div>
			</form>
		</div>
	)
}
