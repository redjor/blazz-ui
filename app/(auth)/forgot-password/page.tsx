"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas"

export default function ForgotPasswordPage() {
	const [sent, setSent] = useState(false)
	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
	})

	const onSubmit = async (_data: ForgotPasswordFormData) => {
		await new Promise((resolve) => setTimeout(resolve, 800))
		setSent(true)
	}

	if (sent) {
		return (
			<div className="space-y-4 text-center">
				<h2 className="text-lg font-semibold">Email envoyé</h2>
				<p className="text-sm text-muted-foreground">
					Si un compte existe avec cette adresse, vous recevrez un lien
					de réinitialisation.
				</p>
				<Link href="/login">
					<Button variant="outline" className="w-full">
						Retour à la connexion
					</Button>
				</Link>
			</div>
		)
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-1 text-center">
				<h2 className="text-lg font-semibold">Mot de passe oublié</h2>
				<p className="text-sm text-muted-foreground">
					Entrez votre email pour recevoir un lien de réinitialisation
				</p>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="sophie@forge-crm.com"
					{...form.register("email")}
				/>
				{form.formState.errors.email && (
					<p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
				)}
			</div>

			<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
				{form.formState.isSubmitting ? "Envoi..." : "Envoyer le lien"}
			</Button>

			<p className="text-center text-xs text-muted-foreground">
				<Link href="/login" className="text-foreground hover:underline">
					Retour à la connexion
				</Link>
			</p>
		</form>
	)
}
