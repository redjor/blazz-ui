/**
 * Template: Multi-Step Form Page
 *
 * Formulaire multi-étapes avec navigation et validation.
 * Cas d'usage: Onboarding, profil utilisateur, checkout, wizards
 *
 * Features:
 * - Navigation entre étapes
 * - Progress indicator
 * - Validation par étape (Zod)
 * - Sauvegarde temporaire (localStorage)
 * - Summary step
 * - react-hook-form
 */

'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Page, PageHeader } from '@/components/layout/page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'

// TODO: Adapter les schémas à votre formulaire

// Étape 1: Informations personnelles
const step1Schema = z.object({
	firstName: z.string().min(2, 'Minimum 2 caractères'),
	lastName: z.string().min(2, 'Minimum 2 caractères'),
	email: z.string().email('Email invalide'),
	phone: z.string().min(10, 'Numéro invalide'),
})

// Étape 2: Informations professionnelles
const step2Schema = z.object({
	company: z.string().min(2, 'Minimum 2 caractères'),
	position: z.string().min(2, 'Minimum 2 caractères'),
	industry: z.enum(['tech', 'finance', 'healthcare', 'education', 'other']),
	experience: z.string().min(1, 'Requis'),
})

// Étape 3: Préférences
const step3Schema = z.object({
	bio: z.string().max(500, 'Maximum 500 caractères').optional(),
	newsletter: z.boolean(),
	notifications: z.boolean(),
	terms: z.boolean().refine((val) => val === true, {
		message: 'Vous devez accepter les conditions',
	}),
})

// Schéma complet
const formSchema = step1Schema.merge(step2Schema).merge(step3Schema)

type FormValues = z.infer<typeof formSchema>

const STORAGE_KEY = 'form-draft'

// TODO: Configurer vos étapes
const steps = [
	{
		id: 1,
		title: 'Informations personnelles',
		description: 'Vos coordonnées de base',
		fields: ['firstName', 'lastName', 'email', 'phone'] as const,
		schema: step1Schema,
	},
	{
		id: 2,
		title: 'Informations professionnelles',
		description: 'Votre activité professionnelle',
		fields: ['company', 'position', 'industry', 'experience'] as const,
		schema: step2Schema,
	},
	{
		id: 3,
		title: 'Préférences',
		description: 'Vos préférences et paramètres',
		fields: ['bio', 'newsletter', 'notifications', 'terms'] as const,
		schema: step3Schema,
	},
]

export default function FormPage() {
	const [currentStep, setCurrentStep] = useState(1)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const form = useForm<FormValues>({
		resolver: zodResolver(
			currentStep === 1
				? step1Schema
				: currentStep === 2
					? step2Schema
					: step3Schema
		),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			company: '',
			position: '',
			industry: 'tech',
			experience: '',
			bio: '',
			newsletter: false,
			notifications: true,
			terms: false,
		},
	})

	// Charger le brouillon au montage
	useEffect(() => {
		const draft = localStorage.getItem(STORAGE_KEY)
		if (draft) {
			try {
				const parsed = JSON.parse(draft)
				form.reset(parsed)
			} catch (e) {
				console.error('Erreur chargement brouillon:', e)
			}
		}
	}, [form])

	// Sauvegarder brouillon à chaque changement
	useEffect(() => {
		const subscription = form.watch((values) => {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
		})
		return () => subscription.unsubscribe()
	}, [form])

	const currentStepConfig = steps[currentStep - 1]

	const handleNext = async () => {
		const fields = currentStepConfig.fields
		const isValid = await form.trigger(fields as any)

		if (isValid) {
			setCurrentStep((prev) => Math.min(prev + 1, steps.length))
		}
	}

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1))
	}

	const onSubmit = async (values: FormValues) => {
		setIsSubmitting(true)
		try {
			// TODO: Remplacer par votre logique de soumission
			console.log('Form submitted:', values)
			await new Promise((resolve) => setTimeout(resolve, 2000))

			// Nettoyer le brouillon
			localStorage.removeItem(STORAGE_KEY)

			alert('Formulaire soumis avec succès!')
			form.reset()
			setCurrentStep(1)
		} catch (error) {
			console.error('Erreur soumission:', error)
			alert('Erreur lors de la soumission')
		} finally {
			setIsSubmitting(false)
		}
	}

	const progress = (currentStep / steps.length) * 100

	return (
		<DashboardLayout>
			<Page>
				<PageHeader
					title="Formulaire Multi-Étapes"
					description="Complétez toutes les étapes pour soumettre"
				/>

				{/* Progress Indicator */}
				<div className="mb-8">
					<div className="flex justify-between mb-2">
						{steps.map((step) => (
							<div
								key={step.id}
								className={cn(
									'flex items-center gap-2',
									currentStep === step.id
										? 'text-primary font-medium'
										: currentStep > step.id
											? 'text-primary'
											: 'text-muted-foreground'
								)}
							>
								<div
									className={cn(
										'flex h-8 w-8 items-center justify-center rounded-full border-2',
										currentStep === step.id
											? 'border-primary bg-primary text-primary-foreground'
											: currentStep > step.id
												? 'border-primary bg-primary text-primary-foreground'
												: 'border-muted-foreground'
									)}
								>
									{currentStep > step.id ? (
										<Check className="h-4 w-4" />
									) : (
										step.id
									)}
								</div>
								<span className="text-sm hidden md:block">{step.title}</span>
							</div>
						))}
					</div>
					<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-primary transition-all duration-300"
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>{currentStepConfig.title}</CardTitle>
						<p className="text-sm text-muted-foreground">
							{currentStepConfig.description}
						</p>
					</CardHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<CardContent className="space-y-6">
								{/* Étape 1: Informations personnelles */}
								{currentStep === 1 && (
									<>
										<div className="grid gap-4 md:grid-cols-2">
											<FormField
												control={form.control}
												name="firstName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Prénom</FormLabel>
														<FormControl>
															<Input placeholder="Jean" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="lastName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Nom</FormLabel>
														<FormControl>
															<Input placeholder="Dupont" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															type="email"
															placeholder="jean.dupont@example.com"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Téléphone</FormLabel>
													<FormControl>
														<Input
															type="tel"
															placeholder="+33 6 12 34 56 78"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</>
								)}

								{/* Étape 2: Informations professionnelles */}
								{currentStep === 2 && (
									<>
										<FormField
											control={form.control}
											name="company"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Entreprise</FormLabel>
													<FormControl>
														<Input placeholder="Ma Société" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="position"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Poste</FormLabel>
													<FormControl>
														<Input placeholder="Développeur" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="industry"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Secteur d'activité</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Sélectionnez un secteur" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="tech">
																Technologie
															</SelectItem>
															<SelectItem value="finance">Finance</SelectItem>
															<SelectItem value="healthcare">
																Santé
															</SelectItem>
															<SelectItem value="education">
																Éducation
															</SelectItem>
															<SelectItem value="other">Autre</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="experience"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Années d'expérience</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Sélectionnez" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="0-2">0-2 ans</SelectItem>
															<SelectItem value="3-5">3-5 ans</SelectItem>
															<SelectItem value="6-10">6-10 ans</SelectItem>
															<SelectItem value="10+">10+ ans</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</>
								)}

								{/* Étape 3: Préférences */}
								{currentStep === 3 && (
									<>
										<FormField
											control={form.control}
											name="bio"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Bio (optionnel)</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Parlez-nous un peu de vous..."
															rows={4}
															{...field}
														/>
													</FormControl>
													<FormDescription>
														Maximum 500 caractères
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Separator />

										<div className="space-y-4">
											<FormField
												control={form.control}
												name="newsletter"
												render={({ field }) => (
													<FormItem className="flex flex-row items-start space-x-3 space-y-0">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<div className="space-y-1 leading-none">
															<FormLabel>
																Recevoir la newsletter
															</FormLabel>
															<FormDescription>
																Recevez nos actualités et nouveautés
															</FormDescription>
														</div>
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="notifications"
												render={({ field }) => (
													<FormItem className="flex flex-row items-start space-x-3 space-y-0">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<div className="space-y-1 leading-none">
															<FormLabel>
																Recevoir les notifications
															</FormLabel>
															<FormDescription>
																Alertes par email sur votre compte
															</FormDescription>
														</div>
													</FormItem>
												)}
											/>

											<FormField
												control={form.control}
												name="terms"
												render={({ field }) => (
													<FormItem className="flex flex-row items-start space-x-3 space-y-0">
														<FormControl>
															<Checkbox
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<div className="space-y-1 leading-none">
															<FormLabel>
																J'accepte les conditions d'utilisation *
															</FormLabel>
															<FormDescription>
																Vous devez accepter pour continuer
															</FormDescription>
															<FormMessage />
														</div>
													</FormItem>
												)}
											/>
										</div>

										{/* Summary */}
										<Separator />
										<div className="rounded-lg bg-muted p-4">
											<h4 className="font-medium mb-3">Résumé</h4>
											<dl className="space-y-2 text-sm">
												<div className="flex justify-between">
													<dt className="text-muted-foreground">Nom complet:</dt>
													<dd className="font-medium">
														{form.watch('firstName')} {form.watch('lastName')}
													</dd>
												</div>
												<div className="flex justify-between">
													<dt className="text-muted-foreground">Email:</dt>
													<dd className="font-medium">{form.watch('email')}</dd>
												</div>
												<div className="flex justify-between">
													<dt className="text-muted-foreground">Entreprise:</dt>
													<dd className="font-medium">{form.watch('company')}</dd>
												</div>
												<div className="flex justify-between">
													<dt className="text-muted-foreground">Poste:</dt>
													<dd className="font-medium">{form.watch('position')}</dd>
												</div>
											</dl>
										</div>
									</>
								)}
							</CardContent>

							<CardFooter className="flex justify-between">
								<Button
									type="button"
									variant="outline"
									onClick={handlePrevious}
									disabled={currentStep === 1}
								>
									<ChevronLeft className="mr-2" />
									Précédent
								</Button>

								{currentStep < steps.length ? (
									<Button type="button" onClick={handleNext}>
										Suivant
										<ChevronRight className="ml-2" />
									</Button>
								) : (
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? 'Envoi...' : 'Soumettre'}
									</Button>
								)}
							</CardFooter>
						</form>
					</Form>
				</Card>
			</Page>
		</DashboardLayout>
	)
}
