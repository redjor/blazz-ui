"use client"

import {
	Item,
	ItemContent,
	ItemTitle,
	ItemDescription,
	ItemActions,
} from "@blazz/ui/components/ui/item"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Switch } from "@blazz/ui/components/ui/switch"
import {
	SettingsPage,
	SettingsHeader,
	SettingsSection,
} from "@blazz/pro/components/blocks/settings-block"
import { useMutation, useQuery } from "convex/react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export default function SettingsGeneralClient() {
	const { theme, setTheme } = useTheme()
	const collections = useQuery(api.bookmarkCollections.list)
	const readLaterCollectionId = useQuery(api.settings.get, { key: "readLaterCollectionId" })
	const setSetting = useMutation(api.settings.set)
	const removeSetting = useMutation(api.settings.remove)

	const handleReadLaterChange = async (value: string) => {
		try {
			if (value === "__none__") {
				await removeSetting({ key: "readLaterCollectionId" })
				toast.success("Read Later désactivé")
			} else {
				await setSetting({ key: "readLaterCollectionId", value })
				toast.success("Collection Read Later mise à jour")
			}
		} catch {
			toast.error("Erreur")
		}
	}

	const collectionItems = [
		{ value: "__none__", label: "Aucune" },
		...(collections?.map((c) => ({ value: c._id, label: `${c.icon ? `${c.icon} ` : ""}${c.name}` })) ?? []),
	]

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

			<SettingsSection
				title="Bookmarks"
				description="Configurez le comportement des bookmarks."
			>
				<Item>
					<ItemContent>
						<ItemTitle>Collection Read Later</ItemTitle>
						<ItemDescription>
							Choisissez la collection utilisée pour le bouton "Read Later" sur chaque bookmark.
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Select
							value={readLaterCollectionId ?? "__none__"}
							onValueChange={handleReadLaterChange}
							items={collectionItems}
						>
							<SelectTrigger className="w-48">
								<SelectValue placeholder="Aucune" />
							</SelectTrigger>
							<SelectContent>
								{collectionItems.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</ItemActions>
				</Item>
			</SettingsSection>
		</SettingsPage>
	)
}
