"use client"

import { PageHeader } from "@/components/blocks/page-header"
import { FormSection } from "@/components/blocks/form-section"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title="Paramètres"
				description="Configuration de l'application"
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Paramètres" },
				]}
			/>

			<div className="max-w-2xl space-y-6">
				<FormSection title="Profil" description="Vos informations personnelles" defaultOpen>
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
					</div>
					<div className="mt-4 flex justify-end">
						<Button size="sm">Enregistrer</Button>
					</div>
				</FormSection>

				<FormSection title="Entreprise" description="Informations de votre organisation">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1.5 col-span-2">
							<Label htmlFor="companyName">Nom de l'entreprise</Label>
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
					</div>
					<div className="mt-4 flex justify-end">
						<Button size="sm">Enregistrer</Button>
					</div>
				</FormSection>

				<FormSection title="Notifications" description="Préférences de notifications" defaultOpen={false}>
					<p className="text-sm text-muted-foreground">
						Configuration des notifications email et in-app.
					</p>
				</FormSection>
			</div>
		</div>
	)
}
