/**
 * Template: Login Page
 *
 * Page de connexion utilisateur.
 * Cas d'usage: Authentication, login flow
 *
 * Features:
 * - Formulaire de connexion
 * - Validation email/password
 * - Remember me
 * - Forgot password link
 * - Social login options
 * - Error handling
 * - Loading states
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, Github, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// TODO: Adapter le schéma de validation
const loginSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z.string().min(8, 'Minimum 8 caractères'),
	rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	})

	const onSubmit = async (values: LoginFormValues) => {
		setIsLoading(true)
		setError(null)

		try {
			// TODO: Remplacer par votre logique d'authentification
			console.log('Login attempt:', values)

			// Simuler un appel API
			await new Promise((resolve, reject) => {
				setTimeout(() => {
					// Simuler erreur 30% du temps pour demo
					if (Math.random() > 0.7) {
						reject(new Error('Email ou mot de passe incorrect'))
					} else {
						resolve(true)
					}
				}, 1500)
			})

			// TODO: Rediriger vers dashboard ou page appropriée
			console.log('Login successful')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Une erreur est survenue')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSocialLogin = (provider: 'github' | 'google') => {
		console.log('Social login:', provider)
		// TODO: Implémenter OAuth flow
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
			<div className="w-full max-w-md">
				{/* Logo / Brand */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold">Blazz UI</h1>
					<p className="text-muted-foreground mt-2">
						Connectez-vous à votre compte
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Connexion</CardTitle>
						<CardDescription>
							Entrez vos identifiants pour accéder à votre compte
						</CardDescription>
					</CardHeader>

					<CardContent>
						{/* Error Alert */}
						{error && (
							<Alert variant="destructive" className="mb-6">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="vous@example.com"
													autoComplete="email"
													disabled={isLoading}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center justify-between">
												<FormLabel>Mot de passe</FormLabel>
												<Link
													href="/auth/forgot-password"
													className="text-sm text-primary hover:underline"
												>
													Mot de passe oublié ?
												</Link>
											</div>
											<FormControl>
												<Input
													type="password"
													placeholder="••••••••"
													autoComplete="current-password"
													disabled={isLoading}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="rememberMe"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={field.onChange}
													disabled={isLoading}
												/>
											</FormControl>
											<div className="space-y-1 leading-none">
												<FormLabel className="font-normal">
													Se souvenir de moi
												</FormLabel>
											</div>
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									{isLoading ? 'Connexion...' : 'Se connecter'}
								</Button>
							</form>
						</Form>

						{/* Social Login */}
						<div className="mt-6">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Ou continuer avec
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 mt-6">
								<Button
									variant="outline"
									onClick={() => handleSocialLogin('github')}
									disabled={isLoading}
								>
									<Github className="mr-2 h-4 w-4" />
									GitHub
								</Button>
								<Button
									variant="outline"
									onClick={() => handleSocialLogin('google')}
									disabled={isLoading}
								>
									<Mail className="mr-2 h-4 w-4" />
									Google
								</Button>
							</div>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col space-y-4">
						<Separator />
						<p className="text-sm text-center text-muted-foreground">
							Pas encore de compte ?{' '}
							<Link
								href="/auth/register"
								className="text-primary hover:underline font-medium"
							>
								Créer un compte
							</Link>
						</p>
					</CardFooter>
				</Card>

				{/* Footer Links */}
				<div className="mt-8 text-center text-xs text-muted-foreground space-x-4">
					<Link href="/terms" className="hover:underline">
						Conditions d'utilisation
					</Link>
					<Link href="/privacy" className="hover:underline">
						Politique de confidentialité
					</Link>
				</div>
			</div>
		</div>
	)
}
