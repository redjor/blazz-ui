"use client"

import { FormField } from "@blazz/ui/components/patterns/form-field"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const basicSchema = z.object({
	name: z.string().min(1, "Le nom est requis"),
})

export function BasicDemo() {
	const { control } = useForm({
		resolver: zodResolver(basicSchema),
		defaultValues: { name: "" },
	})
	return (
		<div className="w-full max-w-sm">
			<FormField name="name" label="Nom" control={control} placeholder="Jean Dupont" />
		</div>
	)
}

const requiredSchema = z.object({
	email: z.string().email("Email invalide").min(1),
})

export function RequiredDemo() {
	const { control, handleSubmit } = useForm({
		resolver: zodResolver(requiredSchema),
		defaultValues: { email: "" },
	})
	return (
		<div className="w-full max-w-sm">
			<form onSubmit={handleSubmit(() => {})}>
				<FormField name="email" label="Email" control={control} type="email" placeholder="jean@acme.com" required description="L'email de contact principal." />
			</form>
		</div>
	)
}

const selectSchema = z.object({
	status: z.string().min(1),
})

export function SelectDemo() {
	const { control } = useForm({
		resolver: zodResolver(selectSchema),
		defaultValues: { status: "" },
	})
	return (
		<div className="w-full max-w-sm">
			<FormField
				name="status"
				label="Statut"
				control={control}
				type="select"
				options={[
					{ value: "active", label: "Actif" },
					{ value: "inactive", label: "Inactif" },
					{ value: "pending", label: "En attente" },
				]}
			/>
		</div>
	)
}

const textareaSchema = z.object({
	notes: z.string().optional(),
})

export function TextareaDemo() {
	const { control } = useForm({
		resolver: zodResolver(textareaSchema),
		defaultValues: { notes: "" },
	})
	return (
		<div className="w-full max-w-sm">
			<FormField name="notes" label="Notes" control={control} type="textarea" placeholder="Ajouter une note..." rows={4} />
		</div>
	)
}

const gridSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	email: z.string().email(),
	phone: z.string().optional(),
	notes: z.string().optional(),
})

export function GridDemo() {
	const { control } = useForm({
		resolver: zodResolver(gridSchema),
		defaultValues: { firstName: "", lastName: "", email: "", phone: "", notes: "" },
	})
	return (
		<div className="w-full grid grid-cols-2 gap-4">
			<FormField name="firstName" label="Prénom" control={control} required />
			<FormField name="lastName" label="Nom" control={control} required />
			<FormField name="email" label="Email" control={control} type="email" required />
			<FormField name="phone" label="Téléphone" control={control} type="tel" />
			<FormField name="notes" label="Notes" control={control} type="textarea" span={2} placeholder="Ajouter une note..." />
		</div>
	)
}
