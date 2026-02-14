"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		await new Promise((resolve) => setTimeout(resolve, 800))
		router.push("/dashboard")
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-1 text-center">
				<h2 className="text-lg font-semibold">Créer un compte</h2>
				<p className="text-sm text-muted-foreground">
					Commencez à utiliser Forge CRM
				</p>
			</div>

			<div className="space-y-3">
				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-1.5">
						<Label htmlFor="firstName">Prénom</Label>
						<Input id="firstName" placeholder="Sophie" required />
					</div>
					<div className="space-y-1.5">
						<Label htmlFor="lastName">Nom</Label>
						<Input id="lastName" placeholder="Martin" required />
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="sophie@entreprise.com"
						required
					/>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="password">Mot de passe</Label>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						required
					/>
				</div>
			</div>

			<Button type="submit" className="w-full" disabled={loading}>
				{loading ? "Création..." : "Créer mon compte"}
			</Button>

			<p className="text-center text-xs text-muted-foreground">
				Déjà un compte ?{" "}
				<Link href="/login" className="text-foreground hover:underline">
					Se connecter
				</Link>
			</p>
		</form>
	)
}
