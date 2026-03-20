"use client"

import { Field, FieldGrid } from "@blazz/ui/components/patterns/field-grid"
import { FormField } from "@blazz/ui/components/patterns/form-field"
import { useForm } from "react-hook-form"

export function DetailDemo() {
	return (
		<div className="w-full">
			<FieldGrid columns={3}>
				<Field label="Nom" value="Acme Corp" />
				<Field label="Secteur" value="SaaS" />
				<Field label="Pays" value="France" />
				<Field label="Téléphone" value="+33 1 23 45 67 89" />
				<Field label="Site web" value="acme.com" />
				<Field label="Employés" value="250" />
			</FieldGrid>
		</div>
	)
}

export function SpanDemo() {
	return (
		<div className="w-full">
			<FieldGrid columns={3}>
				<Field label="Prénom" value="Jean" />
				<Field label="Nom" value="Dupont" />
				<Field label="Email" value="jean@acme.com" />
				<Field label="Adresse" value="12 rue de la Paix, 75001 Paris" span={2} />
				<Field label="Pays" value="France" />
				<Field label="Notes" value={null} span={3} />
			</FieldGrid>
		</div>
	)
}

export function Cols2Demo() {
	return (
		<div className="w-full">
			<FieldGrid columns={2}>
				<Field label="Référence" value="FACT-2025-0042" />
				<Field label="Statut" value="Envoyée" />
				<Field label="Date d'émission" value="15 jan. 2025" />
				<Field label="Date d'échéance" value="15 fév. 2025" />
				<Field label="Montant HT" value="4 200 €" />
				<Field label="Montant TTC" value="5 040 €" />
			</FieldGrid>
		</div>
	)
}

export function FormDemo() {
	const { control } = useForm({
		defaultValues: { firstName: "", lastName: "", email: "", phone: "", notes: "" },
	})
	return (
		<div className="w-full">
			<FieldGrid columns={2}>
				<FormField name="firstName" label="Prénom" control={control} required />
				<FormField name="lastName" label="Nom" control={control} required />
				<FormField name="email" label="Email" control={control} type="email" required />
				<FormField name="phone" label="Téléphone" control={control} type="tel" />
				<FormField name="notes" label="Notes" control={control} type="textarea" span={2} />
			</FieldGrid>
		</div>
	)
}
