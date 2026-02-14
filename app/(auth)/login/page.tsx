"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginSchema, type LoginFormData } from "@/lib/schemas"

export default function LoginPage() {
	const router = useRouter()
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "sophie@forge-crm.com", password: "demo1234" },
	})

	const onSubmit = async (_data: LoginFormData) => {
		await new Promise((resolve) => setTimeout(resolve, 800))
		router.push("/dashboard")
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
						{...form.register("email")}
					/>
					{form.formState.errors.email && (
						<p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
					)}
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
						{...form.register("password")}
					/>
					{form.formState.errors.password && (
						<p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
					)}
				</div>
			</div>

			<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
				{form.formState.isSubmitting ? "Connexion..." : "Se connecter"}
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
