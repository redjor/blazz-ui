"use client"

import { toast } from "sonner"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { FormSection } from "@blazz/ui/components/patterns/form-section"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Button } from "@blazz/ui/components/ui/button"
import { Switch } from "@blazz/ui/components/ui/switch"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@blazz/ui/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@blazz/ui/components/ui/tabs"

export default function SettingsPage() {
	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title="Paramètres"
				description="Configuration de l'application"
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/crm/dashboard" },
					{ label: "Paramètres" },
				]}
			/>

			<Tabs defaultValue="profile">
				<TabsList variant="line">
					<TabsTrigger value="profile">Profil</TabsTrigger>
					<TabsTrigger value="company">Entreprise</TabsTrigger>
					<TabsTrigger value="notifications">Notifications</TabsTrigger>
					<TabsTrigger value="integrations">Intégrations</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<div className="max-w-2xl space-y-6 pt-4">
						<FormSection title="Informations personnelles" defaultOpen>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<Label htmlFor="firstName">Prénom</Label>
									<Input id="firstName" defaultValue="Sophie" />
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="lastName">Nom</Label>
									<Input id="lastName" defaultValue="Martin" />
								</div>
								<div className="space-y-1.5 col-span-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" defaultValue="sophie.martin@forge-crm.com" />
								</div>
								<div className="space-y-1.5 col-span-2">
									<Label htmlFor="phone">Téléphone</Label>
									<Input id="phone" type="tel" defaultValue="+33 6 12 34 56 78" />
								</div>
							</div>
							<div className="mt-4 flex justify-end">
								<Button size="sm" onClick={() => toast.success("Profil mis à jour")}>
									Enregistrer
								</Button>
							</div>
						</FormSection>

						<FormSection title="Mot de passe">
							<div className="space-y-4">
								<div className="space-y-1.5">
									<Label htmlFor="currentPassword">Mot de passe actuel</Label>
									<Input id="currentPassword" type="password" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-1.5">
										<Label htmlFor="newPassword">Nouveau mot de passe</Label>
										<Input id="newPassword" type="password" />
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="confirmPassword">Confirmer</Label>
										<Input id="confirmPassword" type="password" />
									</div>
								</div>
							</div>
							<div className="mt-4 flex justify-end">
								<Button size="sm" variant="outline" onClick={() => toast.success("Mot de passe modifié")}>
									Modifier le mot de passe
								</Button>
							</div>
						</FormSection>
					</div>
				</TabsContent>

				<TabsContent value="company">
					<div className="max-w-2xl space-y-6 pt-4">
						<FormSection title="Informations de l'entreprise" defaultOpen>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5 col-span-2">
									<Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
									<Input id="companyName" defaultValue="Forge CRM SAS" />
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="companyPhone">Téléphone</Label>
									<Input id="companyPhone" defaultValue="+33 1 42 68 53 00" />
								</div>
								<div className="space-y-1.5">
									<Label htmlFor="companyWebsite">Site web</Label>
									<Input id="companyWebsite" defaultValue="forge-crm.com" />
								</div>
								<div className="space-y-1.5 col-span-2">
									<Label htmlFor="companyAddress">Adresse</Label>
									<Input id="companyAddress" defaultValue="123 Avenue des Champs-Élysées, 75008 Paris" />
								</div>
							</div>
							<div className="mt-4 flex justify-end">
								<Button size="sm" onClick={() => toast.success("Entreprise mise à jour")}>
									Enregistrer
								</Button>
							</div>
						</FormSection>

						<FormSection title="Facturation">
							<div className="space-y-3">
								<div className="flex items-center justify-between rounded-md border p-3">
									<div>
										<p className="text-sm font-medium">Plan actuel</p>
										<p className="text-xs text-fg-muted">Forge CRM Enterprise</p>
									</div>
									<Badge variant="success">Actif</Badge>
								</div>
								<div className="flex items-center justify-between rounded-md border p-3">
									<div>
										<p className="text-sm font-medium">Prochain renouvellement</p>
										<p className="text-xs text-fg-muted">15 mars 2026</p>
									</div>
									<span className="text-sm font-medium">2 400 €/an</span>
								</div>
							</div>
						</FormSection>
					</div>
				</TabsContent>

				<TabsContent value="notifications">
					<div className="max-w-2xl space-y-6 pt-4">
						<Card>
							<CardHeader>
								<CardTitle>Notifications email</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[
										{ id: "new-deal", label: "Nouveau deal créé", desc: "Recevoir un email quand un deal est créé", defaultChecked: true },
										{ id: "deal-won", label: "Deal gagné", desc: "Notification quand un deal est marqué comme gagné", defaultChecked: true },
										{ id: "deal-lost", label: "Deal perdu", desc: "Notification quand un deal est marqué comme perdu", defaultChecked: false },
										{ id: "new-contact", label: "Nouveau contact", desc: "Recevoir un email quand un contact est ajouté", defaultChecked: false },
										{ id: "quote-accepted", label: "Devis accepté", desc: "Notification quand un devis est accepté par le client", defaultChecked: true },
									].map((item) => (
										<div key={item.id} className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium">{item.label}</p>
												<p className="text-xs text-fg-muted">{item.desc}</p>
											</div>
											<Switch id={item.id} defaultChecked={item.defaultChecked} />
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Notifications in-app</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{[
										{ id: "in-mentions", label: "Mentions", desc: "Quand quelqu'un vous mentionne dans un commentaire", defaultChecked: true },
										{ id: "in-assignments", label: "Assignations", desc: "Quand un deal ou contact vous est assigné", defaultChecked: true },
										{ id: "in-reminders", label: "Rappels", desc: "Rappels de suivi et échéances", defaultChecked: true },
									].map((item) => (
										<div key={item.id} className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium">{item.label}</p>
												<p className="text-xs text-fg-muted">{item.desc}</p>
											</div>
											<Switch id={item.id} defaultChecked={item.defaultChecked} />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="integrations">
					<div className="max-w-2xl space-y-4 pt-4">
						{[
							{ name: "Google Workspace", desc: "Synchroniser contacts et calendrier", connected: true },
							{ name: "Slack", desc: "Notifications dans vos canaux Slack", connected: true },
							{ name: "Stripe", desc: "Suivi des paiements et factures", connected: false },
							{ name: "HubSpot", desc: "Import/export de contacts et deals", connected: false },
							{ name: "Zapier", desc: "Automatisation avec 5000+ applications", connected: false },
						].map((integration) => (
							<Card key={integration.name}>
								<CardContent className="flex items-center justify-between p-4">
									<div>
										<p className="text-sm font-medium">{integration.name}</p>
										<p className="text-xs text-fg-muted">{integration.desc}</p>
									</div>
									{integration.connected ? (
										<div className="flex items-center gap-2">
											<Badge variant="success">Connecté</Badge>
											<Button
												variant="outline"
												size="sm"
												onClick={() => toast.success(`${integration.name} déconnecté`)}
											>
												Déconnecter
											</Button>
										</div>
									) : (
										<Button
											size="sm"
											onClick={() => toast.success(`${integration.name} connecté`)}
										>
											Connecter
										</Button>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
