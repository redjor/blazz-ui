"use client"

import {
	SettingsHeader,
	SettingsPage,
	SettingsSection,
} from "@blazz/pro/components/blocks/settings-block"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@blazz/ui/components/ui/item"
import { Switch } from "@blazz/ui/components/ui/switch"
import { toast } from "sonner"
import type { FeatureFlag } from "@/lib/features"
import { useFeatureFlags } from "@/lib/feature-flags-context"

interface FeatureItem {
	flag: FeatureFlag
	label: string
	description: string
}

const featureGroups: { title: string; description: string; items: FeatureItem[] }[] = [
	{
		title: "Activité",
		description: "Fonctionnalités liées à votre activité freelance.",
		items: [
			{ flag: "invoicing", label: "Factures", description: "Gestion et génération de factures." },
			{ flag: "finances", label: "Finances", description: "Suivi des revenus et dépenses." },
			{ flag: "treasury", label: "Trésorerie", description: "Dépenses récurrentes et prévisionnel cashflow." },
			{ flag: "goals", label: "Objectifs", description: "Suivi des objectifs et KPIs." },
			{ flag: "recap", label: "Récapitulatif", description: "Récap hebdo/mensuel du temps passé." },
		],
	},
	{
		title: "Outils",
		description: "Outils complémentaires.",
		items: [
			{ flag: "chat", label: "Chat", description: "Assistant IA intégré." },
			{ flag: "notes", label: "Notes", description: "Prise de notes rapide." },
			{ flag: "bookmarks", label: "Bookmarks", description: "Sauvegarde de liens et ressources." },
			{ flag: "todos", label: "Todos", description: "Liste de tâches." },
		],
	},
	{
		title: "Agents",
		description: "Système d'agents autonomes et Mission Control.",
		items: [
			{ flag: "agents", label: "Agents", description: "Agents IA autonomes et conversations." },
			{ flag: "missions", label: "Missions", description: "Mission Control, activité et exécution automatique." },
		],
	},
	{
		title: "Admin",
		description: "Outils d'administration et de suivi technique.",
		items: [
			{ flag: "deployments", label: "Deployments", description: "Suivi des déploiements." },
			{ flag: "packages", label: "Packages", description: "Suivi des packages npm." },
			{ flag: "licenses", label: "Licences", description: "Gestion des clés de licence." },
		],
	},
]

export default function FeaturesClient() {
	const { flags, setFlag } = useFeatureFlags()

	const handleToggle = async (flag: FeatureFlag, enabled: boolean) => {
		try {
			await setFlag(flag, enabled)
			toast.success(`${enabled ? "Activé" : "Désactivé"}`)
		} catch {
			toast.error("Erreur lors de la mise à jour")
		}
	}

	return (
		<SettingsPage>
			<SettingsHeader
				title="Fonctionnalités"
				description="Activez ou désactivez les modules de l'application."
			/>
			{featureGroups.map((group) => (
				<SettingsSection key={group.title} title={group.title} description={group.description}>
					{group.items.map((item) => (
						<Item key={item.flag}>
							<ItemContent>
								<ItemTitle>{item.label}</ItemTitle>
								<ItemDescription>{item.description}</ItemDescription>
							</ItemContent>
							<ItemActions>
								<Switch
									checked={flags[item.flag]}
									onCheckedChange={(checked) => handleToggle(item.flag, checked)}
								/>
							</ItemActions>
						</Item>
					))}
				</SettingsSection>
			))}
		</SettingsPage>
	)
}
