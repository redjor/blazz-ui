"use client"

import {
	Item,
	ItemContent,
	ItemTitle,
	ItemDescription,
} from "@blazz/ui/components/ui/item"
import {
	SettingsPage,
	SettingsHeader,
	SettingsSection,
} from "@blazz/pro/components/blocks/settings-block"

export default function SettingsGeneralClient() {
	return (
		<SettingsPage>
			<SettingsHeader
				title="Préférences"
				description="Gérez les préférences de votre espace."
			/>
			<SettingsSection
				title="Général"
				description="Paramètres généraux de l'application."
			>
				<Item>
					<ItemContent>
						<ItemTitle>Aucune préférence configurable pour l'instant</ItemTitle>
						<ItemDescription>
							De nouvelles options arriveront bientôt.
						</ItemDescription>
					</ItemContent>
				</Item>
			</SettingsSection>
		</SettingsPage>
	)
}
