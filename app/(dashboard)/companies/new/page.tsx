"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Save, X } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { FormSection } from "@/components/blocks/form-section"
import { FormField } from "@/components/blocks/form-field"
import { FieldGrid } from "@/components/blocks/field-grid"
import { Button } from "@/components/ui/button"

interface CompanyForm {
	name: string
	domain: string
	industry: string
	size: string
	revenue: string
	phone: string
	email: string
	address: string
	city: string
	country: string
	status: string
}

export default function NewCompanyPage() {
	const router = useRouter()
	const form = useForm<CompanyForm>({
		defaultValues: { country: "France", status: "prospect" },
	})

	const onSubmit = async (data: CompanyForm) => {
		await new Promise((r) => setTimeout(r, 500))
		alert(`Entreprise "${data.name}" créée`)
		router.push("/companies")
	}

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title="Nouvelle entreprise"
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Entreprises", href: "/companies" },
					{ label: "Nouvelle" },
				]}
			/>

			<form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
				<FormSection title="Informations générales" defaultOpen>
					<FieldGrid columns={2}>
						<FormField name="name" label="Nom de l'entreprise" control={form.control} required />
						<FormField name="domain" label="Domaine" control={form.control} placeholder="exemple.com" />
						<FormField
							name="industry"
							label="Secteur"
							type="select"
							control={form.control}
							options={[
								{ value: "Technologie", label: "Technologie" },
								{ value: "Logiciel", label: "Logiciel" },
								{ value: "Industrie", label: "Industrie" },
								{ value: "Finance", label: "Finance" },
								{ value: "Santé", label: "Santé" },
								{ value: "Énergie", label: "Énergie" },
								{ value: "Média", label: "Média" },
								{ value: "Commerce", label: "Commerce" },
								{ value: "Logistique", label: "Logistique" },
								{ value: "Éducation", label: "Éducation" },
								{ value: "Construction", label: "Construction" },
							]}
						/>
						<FormField
							name="size"
							label="Taille"
							type="select"
							control={form.control}
							options={[
								{ value: "1-10", label: "1-10" },
								{ value: "10-50", label: "10-50" },
								{ value: "50-200", label: "50-200" },
								{ value: "200-500", label: "200-500" },
								{ value: "500+", label: "500+" },
							]}
						/>
						<FormField name="revenue" label="CA annuel (€)" type="number" control={form.control} />
						<FormField
							name="status"
							label="Statut"
							type="select"
							control={form.control}
							options={[
								{ value: "prospect", label: "Prospect" },
								{ value: "active", label: "Actif" },
								{ value: "inactive", label: "Inactif" },
							]}
						/>
					</FieldGrid>
				</FormSection>

				<FormSection title="Coordonnées">
					<FieldGrid columns={2}>
						<FormField name="phone" label="Téléphone" type="tel" control={form.control} />
						<FormField name="email" label="Email" type="email" control={form.control} />
						<FormField name="address" label="Adresse" control={form.control} span={2} />
						<FormField name="city" label="Ville" control={form.control} />
						<FormField name="country" label="Pays" control={form.control} />
					</FieldGrid>
				</FormSection>

				<div className="sticky bottom-0 flex items-center justify-end gap-3 border-t bg-background py-4">
					<Button type="button" variant="outline" onClick={() => router.back()}>
						<X className="size-4" data-icon="inline-start" />
						Annuler
					</Button>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						<Save className="size-4" data-icon="inline-start" />
						{form.formState.isSubmitting ? "Enregistrement..." : "Créer l'entreprise"}
					</Button>
				</div>
			</form>
		</div>
	)
}
