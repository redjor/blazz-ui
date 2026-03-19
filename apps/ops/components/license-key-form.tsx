"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { DialogFooter } from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "convex/react"
import { Loader2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { api } from "@/convex/_generated/api"
import { generateLicenseKey } from "@/lib/license-keygen"

const schema = z.object({
	plan: z.enum(["PRO", "TEAM", "ENTERPRISE"]),
	orgId: z
		.string()
		.min(1, "Org ID requis")
		.regex(/^[a-z0-9-]+$/, "Minuscules, chiffres et tirets uniquement"),
	expiresAt: z.string().min(1, "Date d'expiration requise"),
	clientId: z.string().optional(),
	clientName: z.string().optional(),
	email: z.string().email().optional().or(z.literal("")),
})

type FormValues = z.infer<typeof schema>

interface Props {
	onSuccess?: (key: string) => void
	onCancel?: () => void
}

export function LicenseKeyForm({ onSuccess, onCancel }: Props) {
	const create = useMutation(api.licenseKeys.create)
	const clients = useQuery(api.clients.list)

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			plan: "PRO",
			orgId: "",
			expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
			clientId: "",
			clientName: "",
			email: "",
		},
	})

	const selectedClientId = watch("clientId")

	const onSubmit = async (values: FormValues) => {
		try {
			const key = await generateLicenseKey(values.plan, values.orgId, values.expiresAt)

			const selectedClient = selectedClientId && clients?.find((c) => c._id === selectedClientId)

			await create({
				key,
				plan: values.plan,
				orgId: values.orgId,
				expiresAt: values.expiresAt,
				clientId: selectedClient ? selectedClient._id : undefined,
				clientName: selectedClient ? selectedClient.name : values.clientName || undefined,
				email: values.email || undefined,
			})

			toast.success("Clé générée")
			onSuccess?.(key)
		} catch {
			toast.error("Erreur lors de la génération")
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1.5">
				<Label htmlFor="plan">Plan</Label>
				<Controller
					control={control}
					name="plan"
					render={({ field }) => (
						<Select
							value={field.value}
							onValueChange={field.onChange}
							items={[
								{ value: "PRO", label: "Pro" },
								{ value: "TEAM", label: "Team" },
								{ value: "ENTERPRISE", label: "Enterprise" },
							]}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="PRO">Pro</SelectItem>
								<SelectItem value="TEAM">Team</SelectItem>
								<SelectItem value="ENTERPRISE">Enterprise</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="orgId">Org ID</Label>
				<Input id="orgId" placeholder="acme-corp" {...register("orgId")} />
				{errors.orgId && <p className="text-xs text-red-500">{errors.orgId.message}</p>}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="expiresAt">Expiration</Label>
				<Input id="expiresAt" type="date" {...register("expiresAt")} />
				{errors.expiresAt && <p className="text-xs text-red-500">{errors.expiresAt.message}</p>}
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="clientId">Client (optionnel)</Label>
				<Controller
					control={control}
					name="clientId"
					render={({ field }) => (
						<Select
							value={field.value ?? ""}
							onValueChange={(val) => {
								field.onChange(val)
								const client = clients?.find((c) => c._id === val)
								if (client) {
									setValue("clientName", client.name)
									if (client.email) setValue("email", client.email)
								}
							}}
							items={[
								{ value: "", label: "Aucun" },
								...(clients?.map((c) => ({ value: c._id, label: c.name })) ?? []),
							]}
						>
							<SelectTrigger>
								<SelectValue placeholder="Lier à un client..." />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">Aucun</SelectItem>
								{clients?.map((c) => (
									<SelectItem key={c._id} value={c._id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
			</div>

			{!selectedClientId && (
				<>
					<div className="space-y-1.5">
						<Label htmlFor="clientName">Nom client</Label>
						<Input id="clientName" placeholder="Nom du client" {...register("clientName")} />
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="client@example.com"
							{...register("email")}
						/>
					</div>
				</>
			)}

			<DialogFooter>
				{onCancel && (
					<Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
						Annuler
					</Button>
				)}
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Générer la clé"}
				</Button>
			</DialogFooter>
		</form>
	)
}
