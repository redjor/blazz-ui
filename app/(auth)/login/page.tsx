"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		// Simulate auth — in production, call a server action
		await new Promise((resolve) => setTimeout(resolve, 800))
		router.push("/dashboard")
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-1 text-center">
				<h2 className="text-lg font-semibold">Connexion</h2>
				<p className="text-sm text-muted-foreground">
					Entrez vos identifiants pour accéder au CRM
				</p>
			</div>

			<div className="space-y-3">
				<div className="space-y-1.5">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="sophie@forge-crm.com"
						defaultValue="sophie@forge-crm.com"
						required
					/>
				</div>

				<div className="space-y-1.5">
					<div className="flex items-center justify-between">
						<Label htmlFor="password">Mot de passe</Label>
						<Link
							href="/forgot-password"
							className="text-xs text-muted-foreground hover:underline"
						>
							Mot de passe oublié ?
						</Link>
					</div>
					<Input
						id="password"
						type="password"
						placeholder="••••••••"
						defaultValue="demo1234"
						required
					/>
				</div>
			</div>

			<Button type="submit" className="w-full" disabled={loading}>
				{loading ? "Connexion..." : "Se connecter"}
			</Button>

			<p className="text-center text-xs text-muted-foreground">
				Pas encore de compte ?{" "}
				<Link href="/register" className="text-foreground hover:underline">
					Créer un compte
				</Link>
			</p>
		</form>
	)
}
