"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerSchema, type RegisterFormData } from "@/lib/schemas"

export default function RegisterPage() {
	const router = useRouter()
	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	})

	const onSubmit = async (_data: RegisterFormData) => {
		await new Promise((resolve) => setTimeout(resolve, 800))
		router.push("/examples/crm/dashboard")
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1 text-center">
				<h2 className="text-lg font-semibold">Créer un compte</h2>
				<p className="text-sm text-fg-muted">
					Commencez à utiliser Forge CRM
				</p>
			</div>

			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1.5">
						<Label htmlFor="firstName">Prénom</Label>
						<Input id="firstName" placeholder="Sophie" {...form.register("firstName")} />
						{form.formState.errors.firstName && (
							<p className="text-xs text-negative">{form.formState.errors.firstName.message}</p>
						)}
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="lastName">Nom</Label>
						<Input id="lastName" placeholder="Martin" {...form.register("lastName")} />
						{form.formState.errors.lastName && (
							<p className="text-xs text-negative">{form.formState.errors.lastName.message}</p>
						)}
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="sophie@entreprise.com"
						{...form.register("email")}
					/>
					{form.formState.errors.email && (
						<p className="text-xs text-negative">{form.formState.errors.email.message}</p>
					)}
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="password">Mot de passe</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						{...form.register("password")}
					/>
					{form.formState.errors.password && (
						<p className="text-xs text-negative">{form.formState.errors.password.message}</p>
					)}
				</div>
			</div>

			<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
				{form.formState.isSubmitting ? "Création..." : "Créer mon compte"}
			</Button>

			<p className="text-center text-xs text-fg-muted">
				Déjà un compte ?{" "}
				<Link href="/login" className="text-fg hover:underline">
					Se connecter
				</Link>
			</p>
		</form>
	)
}
