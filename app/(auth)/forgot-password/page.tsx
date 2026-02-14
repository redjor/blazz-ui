"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
	const [loading, setLoading] = useState(false)
	const [sent, setSent] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 800))
		setLoading(false)
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
		<form onSubmit={handleSubmit} className="space-y-4">
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
					required
				/>
			</div>

			<Button type="submit" className="w-full" disabled={loading}>
				{loading ? "Envoi..." : "Envoyer le lien"}
			</Button>

			<p className="text-center text-xs text-muted-foreground">
				<Link href="/login" className="text-foreground hover:underline">
					Retour à la connexion
				</Link>
			</p>
		</form>
	)
}
