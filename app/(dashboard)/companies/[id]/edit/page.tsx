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
import { getCompanyById } from "@/lib/sample-data"
import { companySchema, type CompanyFormData } from "@/lib/schemas"

export default function EditCompanyPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const company = getCompanyById(id)
	const router = useRouter()

	if (!company) notFound()

	const form = useForm<CompanyFormData>({
		resolver: zodResolver(companySchema),
		defaultValues: {
			name: company.name,
			domain: company.domain ?? "",
			industry: company.industry,
			size: company.size,
			phone: company.phone ?? "",
			email: company.email ?? "",
			address: company.address ?? "",
			city: company.city ?? "",
			country: company.country,
			status: company.status,
		},
	})

	const onSubmit = async (data: CompanyFormData) => {
		await new Promise((r) => setTimeout(r, 500))
		toast.success(`Entreprise "${data.name}" mise à jour`)
		router.push(`/companies/${id}`)
	}

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={`Modifier ${company.name}`}
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Entreprises", href: "/companies" },
					{ label: company.name, href: `/companies/${id}` },
					{ label: "Modifier" },
				]}
			/>

			<form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
				<FormSection title="Informations générales" defaultOpen>
					<FieldGrid columns={2}>
						<FormField name="name" label="Nom" control={form.control} required />
						<FormField name="domain" label="Domaine" control={form.control} />
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
							name="status"
							label="Statut"
							type="select"
							control={form.control}
							options={[
								{ value: "prospect", label: "Prospect" },
								{ value: "active", label: "Actif" },
								{ value: "inactive", label: "Inactif" },
								{ value: "churned", label: "Perdu" },
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
						{form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer"}
					</Button>
				</div>
			</form>
		</div>
	)
}
