"use client"

import { SettingsHeader, SettingsPage, SettingsSection } from "@blazz/pro/components/blocks/settings-block"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@blazz/ui/components/ui/item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Switch } from "@blazz/ui/components/ui/switch"
import { useMutation, useQuery } from "convex/react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"

export default function SettingsGeneralClient() {
	const { theme, setTheme } = useTheme()
	const collections = useQuery(api.bookmarkCollections.list)
	const readLaterCollectionId = useQuery(api.settings.get, { key: "readLaterCollectionId" })
	const setSetting = useMutation(api.settings.set)
	const removeSetting = useMutation(api.settings.remove)
	const vehicleSettings = useQuery(api.vehicleSettings.get)
	const saveVehicle = useMutation(api.vehicleSettings.save)

	const fiscalPowerItems = [
		{ value: "3", label: "3 CV" },
		{ value: "4", label: "4 CV" },
		{ value: "5", label: "5 CV" },
		{ value: "6", label: "6 CV" },
		{ value: "7", label: "7 CV+" },
	]

	const vehicleTypeItems = [
		{ value: "car", label: "Voiture" },
		{ value: "motorcycle", label: "Moto" },
	]

	async function handleVehicleSave(partial: { fiscalPower?: number; vehicleType?: "car" | "motorcycle" }) {
		try {
			await saveVehicle({
				fiscalPower: partial.fiscalPower ?? vehicleSettings?.fiscalPower ?? 5,
				vehicleType: partial.vehicleType ?? vehicleSettings?.vehicleType ?? "car",
			})
			toast.success("Véhicule mis à jour")
		} catch {
			toast.error("Erreur")
		}
	}

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
		...(collections?.map((c) => ({
			value: c._id,
			label: `${c.icon ? `${c.icon} ` : ""}${c.name}`,
		})) ?? []),
	]

	return (
		<SettingsPage>
			<SettingsHeader title="Préférences" description="Gérez les préférences de votre espace." />
			<SettingsSection title="Apparence" description="Personnalisez l'apparence de l'application.">
				<Item>
					<ItemContent>
						<ItemTitle>Mode sombre</ItemTitle>
						<ItemDescription>Basculer entre le thème clair et sombre.</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
					</ItemActions>
				</Item>
			</SettingsSection>

			<SettingsSection title="Bookmarks" description="Configurez le comportement des bookmarks.">
				<Item>
					<ItemContent>
						<ItemTitle>Collection Read Later</ItemTitle>
						<ItemDescription>Choisissez la collection utilisée pour le bouton "Read Later" sur chaque bookmark.</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Select value={readLaterCollectionId ?? "__none__"} onValueChange={handleReadLaterChange} items={collectionItems}>
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

			<SettingsSection title="Véhicule" description="Configuration pour le calcul des indemnités kilométriques URSSAF.">
				<Item>
					<ItemContent>
						<ItemTitle>Puissance fiscale</ItemTitle>
						<ItemDescription>Puissance fiscale de votre véhicule (en CV).</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Select value={vehicleSettings?.fiscalPower?.toString() ?? "5"} onValueChange={(v) => handleVehicleSave({ fiscalPower: Number(v) })} items={fiscalPowerItems}>
							<SelectTrigger className="w-24">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{fiscalPowerItems.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</ItemActions>
				</Item>
				<Item>
					<ItemContent>
						<ItemTitle>Type de véhicule</ItemTitle>
						<ItemDescription>Voiture ou moto (barème différent).</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Select value={vehicleSettings?.vehicleType ?? "car"} onValueChange={(v) => handleVehicleSave({ vehicleType: v as "car" | "motorcycle" })} items={vehicleTypeItems}>
							<SelectTrigger className="w-32">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{vehicleTypeItems.map((item) => (
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
