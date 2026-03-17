"use client"

import {
	Item,
	ItemContent,
	ItemTitle,
	ItemDescription,
	ItemActions,
} from "@blazz/ui/components/ui/item"
import { Switch } from "@blazz/ui/components/ui/switch"
import {
	SettingsPage,
	SettingsHeader,
	SettingsSection,
} from "@blazz/pro/components/blocks/settings-block"
import { useTheme } from "next-themes"

export default function SettingsGeneralClient() {
	const { theme, setTheme } = useTheme()

	return (
		<SettingsPage>
			<SettingsHeader
				title="Préférences"
				description="Gérez les préférences de votre espace."
			/>
			<SettingsSection
				title="Apparence"
				description="Personnalisez l'apparence de l'application."
			>
				<Item>
					<ItemContent>
						<ItemTitle>Mode sombre</ItemTitle>
						<ItemDescription>
							Basculer entre le thème clair et sombre.
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Switch
							checked={theme === "dark"}
							onCheckedChange={(checked) =>
								setTheme(checked ? "dark" : "light")
							}
						/>
					</ItemActions>
				</Item>
			</SettingsSection>
		</SettingsPage>
	)
}
