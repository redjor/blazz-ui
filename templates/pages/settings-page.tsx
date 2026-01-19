/**
 * Template: Settings Page
 *
 * Page de paramètres avec navigation par tabs.
 * Cas d'usage: User settings, app configuration, preferences
 *
 * Features:
 * - Navigation par tabs
 * - Formulaires de configuration
 * - Sections multiples
 * - Sauvegarde par section
 * - Validation
 */

"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Page, PageHeader } from "@/components/layout/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Settings, Shield, Palette, Bell, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// TODO: Adapter les schémas à vos besoins

// Profile Schema
const profileSchema = z.object({
	firstName: z.string().min(2, "Minimum 2 caractères"),
	lastName: z.string().min(2, "Minimum 2 caractères"),
	email: z.string().email("Email invalide"),
	bio: z.string().max(500, "Maximum 500 caractères").optional(),
	phone: z.string().optional(),
	website: z.string().url("URL invalide").optional().or(z.literal("")),
})

// Preferences Schema
const preferencesSchema = z.object({
	language: z.enum(["fr", "en", "es", "de"]),
	timezone: z.string(),
	dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]),
	emailNotifications: z.boolean(),
	pushNotifications: z.boolean(),
	weeklyDigest: z.boolean(),
})

// Security Schema
const securitySchema = z
	.object({
		currentPassword: z.string().min(8, "Minimum 8 caractères"),
		newPassword: z.string().min(8, "Minimum 8 caractères"),
		confirmPassword: z.string(),
		twoFactorAuth: z.boolean(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	})

// Appearance Schema
const appearanceSchema = z.object({
	theme: z.enum(["light", "dark", "system"]),
	density: z.enum(["comfortable", "compact"]),
	sidebarPosition: z.enum(["left", "right"]),
})

type ProfileFormValues = z.infer<typeof profileSchema>
type PreferencesFormValues = z.infer<typeof preferencesSchema>
type SecurityFormValues = z.infer<typeof securitySchema>
type AppearanceFormValues = z.infer<typeof appearanceSchema>

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState("profile")

	// Profile Form
	const profileForm = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			firstName: "Jean",
			lastName: "Dupont",
			email: "jean.dupont@example.com",
			bio: "",
			phone: "+33 6 12 34 56 78",
			website: "",
		},
	})

	// Preferences Form
	const preferencesForm = useForm<PreferencesFormValues>({
		resolver: zodResolver(preferencesSchema),
		defaultValues: {
			language: "fr",
			timezone: "Europe/Paris",
			dateFormat: "DD/MM/YYYY",
			emailNotifications: true,
			pushNotifications: true,
			weeklyDigest: false,
		},
	})

	// Security Form
	const securityForm = useForm<SecurityFormValues>({
		resolver: zodResolver(securitySchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
			twoFactorAuth: false,
		},
	})

	// Appearance Form
	const appearanceForm = useForm<AppearanceFormValues>({
		resolver: zodResolver(appearanceSchema),
		defaultValues: {
			theme: "system",
			density: "comfortable",
			sidebarPosition: "left",
		},
	})

	// Handlers
	const onProfileSubmit = (values: ProfileFormValues) => {
		console.log("Profile updated:", values)
		// TODO: Implémenter sauvegarde profile
	}

	const onPreferencesSubmit = (values: PreferencesFormValues) => {
		console.log("Preferences updated:", values)
		// TODO: Implémenter sauvegarde préférences
	}

	const onSecuritySubmit = (values: SecurityFormValues) => {
		console.log("Security updated:", values)
		// TODO: Implémenter changement mot de passe
		securityForm.reset()
	}

	const onAppearanceSubmit = (values: AppearanceFormValues) => {
		console.log("Appearance updated:", values)
		// TODO: Implémenter changement apparence
	}

	const handleAvatarUpload = () => {
		console.log("Upload avatar")
		// TODO: Implémenter upload avatar
	}

	return (
		<DashboardLayout>
			<Page>
				<PageHeader
					title="Paramètres"
					description="Gérez vos préférences et paramètres de compte"
				/>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
					<TabsList>
						<TabsTrigger value="profile" className="flex items-center gap-2">
							<User className="h-4 w-4" />
							<span className="hidden sm:inline">Profil</span>
						</TabsTrigger>
						<TabsTrigger value="preferences" className="flex items-center gap-2">
							<Settings className="h-4 w-4" />
							<span className="hidden sm:inline">Préférences</span>
						</TabsTrigger>
						<TabsTrigger value="security" className="flex items-center gap-2">
							<Shield className="h-4 w-4" />
							<span className="hidden sm:inline">Sécurité</span>
						</TabsTrigger>
						<TabsTrigger value="appearance" className="flex items-center gap-2">
							<Palette className="h-4 w-4" />
							<span className="hidden sm:inline">Apparence</span>
						</TabsTrigger>
					</TabsList>

					{/* Profile Tab */}
					<TabsContent value="profile" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Informations Personnelles</CardTitle>
								<CardDescription>Mettez à jour vos informations de profil</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Avatar Section */}
								<div className="flex items-center gap-4">
									<Avatar className="h-20 w-20">
										<AvatarImage src="/avatar.jpg" alt="Profile" />
										<AvatarFallback>JD</AvatarFallback>
									</Avatar>
									<div className="space-y-2">
										<Button variant="outline" size="sm" onClick={handleAvatarUpload}>
											<Upload className="mr-2 h-4 w-4" />
											Changer la photo
										</Button>
										<p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Max 2MB.</p>
									</div>
								</div>

								<Separator />

								<Form {...profileForm}>
									<form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
										<div className="grid gap-4 md:grid-cols-2">
											<FormField
												control={profileForm.control}
												name="firstName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Prénom</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<FormField
												control={profileForm.control}
												name="lastName"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Nom</FormLabel>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<FormField
											control={profileForm.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input type="email" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={profileForm.control}
											name="phone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Téléphone</FormLabel>
													<FormControl>
														<Input type="tel" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={profileForm.control}
											name="website"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Site web</FormLabel>
													<FormControl>
														<Input type="url" placeholder="https://" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={profileForm.control}
											name="bio"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Bio</FormLabel>
													<FormControl>
														<Textarea placeholder="Parlez-nous de vous..." rows={4} {...field} />
													</FormControl>
													<FormDescription>Maximum 500 caractères</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="flex gap-2">
											<Button type="submit">Sauvegarder</Button>
											<Button type="button" variant="outline" onClick={() => profileForm.reset()}>
												Annuler
											</Button>
										</div>
									</form>
								</Form>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Preferences Tab */}
					<TabsContent value="preferences" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Préférences</CardTitle>
								<CardDescription>Configurez vos préférences d'utilisation</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...preferencesForm}>
									<form
										onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)}
										className="space-y-6"
									>
										<FormField
											control={preferencesForm.control}
											name="language"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Langue</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="fr">Français</SelectItem>
															<SelectItem value="en">English</SelectItem>
															<SelectItem value="es">Español</SelectItem>
															<SelectItem value="de">Deutsch</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={preferencesForm.control}
											name="timezone"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Fuseau horaire</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
															<SelectItem value="America/New_York">
																America/New York (GMT-5)
															</SelectItem>
															<SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={preferencesForm.control}
											name="dateFormat"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Format de date</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
															<SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
															<SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Separator />

										<div className="space-y-4">
											<h4 className="font-medium flex items-center gap-2">
												<Bell className="h-4 w-4" />
												Notifications
											</h4>

											<FormField
												control={preferencesForm.control}
												name="emailNotifications"
												render={({ field }) => (
													<FormItem className="flex items-center justify-between rounded-lg border p-4">
														<div className="space-y-0.5">
															<FormLabel>Notifications par email</FormLabel>
															<FormDescription>
																Recevoir les notifications par email
															</FormDescription>
														</div>
														<FormControl>
															<Switch checked={field.value} onCheckedChange={field.onChange} />
														</FormControl>
													</FormItem>
												)}
											/>

											<FormField
												control={preferencesForm.control}
												name="pushNotifications"
												render={({ field }) => (
													<FormItem className="flex items-center justify-between rounded-lg border p-4">
														<div className="space-y-0.5">
															<FormLabel>Notifications push</FormLabel>
															<FormDescription>
																Recevoir les notifications dans le navigateur
															</FormDescription>
														</div>
														<FormControl>
															<Switch checked={field.value} onCheckedChange={field.onChange} />
														</FormControl>
													</FormItem>
												)}
											/>

											<FormField
												control={preferencesForm.control}
												name="weeklyDigest"
												render={({ field }) => (
													<FormItem className="flex items-center justify-between rounded-lg border p-4">
														<div className="space-y-0.5">
															<FormLabel>Résumé hebdomadaire</FormLabel>
															<FormDescription>Recevoir un résumé chaque lundi</FormDescription>
														</div>
														<FormControl>
															<Switch checked={field.value} onCheckedChange={field.onChange} />
														</FormControl>
													</FormItem>
												)}
											/>
										</div>

										<div className="flex gap-2">
											<Button type="submit">Sauvegarder</Button>
											<Button
												type="button"
												variant="outline"
												onClick={() => preferencesForm.reset()}
											>
												Annuler
											</Button>
										</div>
									</form>
								</Form>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Security Tab */}
					<TabsContent value="security" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Sécurité</CardTitle>
								<CardDescription>
									Gérez votre mot de passe et la sécurité de votre compte
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...securityForm}>
									<form
										onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
										className="space-y-6"
									>
										<FormField
											control={securityForm.control}
											name="currentPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Mot de passe actuel</FormLabel>
													<FormControl>
														<Input type="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={securityForm.control}
											name="newPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Nouveau mot de passe</FormLabel>
													<FormControl>
														<Input type="password" {...field} />
													</FormControl>
													<FormDescription>Minimum 8 caractères</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={securityForm.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Confirmer le mot de passe</FormLabel>
													<FormControl>
														<Input type="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Separator />

										<FormField
											control={securityForm.control}
											name="twoFactorAuth"
											render={({ field }) => (
												<FormItem className="flex items-center justify-between rounded-lg border p-4">
													<div className="space-y-0.5">
														<FormLabel>Authentification à deux facteurs (2FA)</FormLabel>
														<FormDescription>
															Ajouter une couche de sécurité supplémentaire
														</FormDescription>
													</div>
													<FormControl>
														<Switch checked={field.value} onCheckedChange={field.onChange} />
													</FormControl>
												</FormItem>
											)}
										/>

										<div className="flex gap-2">
											<Button type="submit">Changer le mot de passe</Button>
											<Button type="button" variant="outline" onClick={() => securityForm.reset()}>
												Annuler
											</Button>
										</div>
									</form>
								</Form>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Appearance Tab */}
					<TabsContent value="appearance" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Apparence</CardTitle>
								<CardDescription>Personnalisez l'apparence de l'application</CardDescription>
							</CardHeader>
							<CardContent>
								<Form {...appearanceForm}>
									<form
										onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)}
										className="space-y-6"
									>
										<FormField
											control={appearanceForm.control}
											name="theme"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Thème</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="light">Clair</SelectItem>
															<SelectItem value="dark">Sombre</SelectItem>
															<SelectItem value="system">Système</SelectItem>
														</SelectContent>
													</Select>
													<FormDescription>Choisissez le thème de l'interface</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={appearanceForm.control}
											name="density"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Densité</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="comfortable">Confortable</SelectItem>
															<SelectItem value="compact">Compact</SelectItem>
														</SelectContent>
													</Select>
													<FormDescription>Ajustez l'espacement de l'interface</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={appearanceForm.control}
											name="sidebarPosition"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Position du sidebar</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value="left">Gauche</SelectItem>
															<SelectItem value="right">Droite</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="flex gap-2">
											<Button type="submit">Sauvegarder</Button>
											<Button
												type="button"
												variant="outline"
												onClick={() => appearanceForm.reset()}
											>
												Annuler
											</Button>
										</div>
									</form>
								</Form>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</Page>
		</DashboardLayout>
	)
}
