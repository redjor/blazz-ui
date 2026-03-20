"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { toast, toastProgress } from "@blazz/ui/components/ui/toast"

export function ToastHeroDemo() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button variant="outline" size="sm" onClick={() => toast("Fichier sauvegardé")}>
				Default
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => toast.success("Client créé avec succès")}
			>
				Success
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => toast.error("Une erreur est survenue")}
			>
				Error
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => toast.warning("Quota presque atteint")}
			>
				Warning
			</Button>
			<Button variant="outline" size="sm" onClick={() => toast.info("Mise à jour disponible")}>
				Info
			</Button>
		</div>
	)
}

export function ToastDefaultDemo() {
	return (
		<Button variant="outline" size="sm" onClick={() => toast("Fichier sauvegardé")}>
			Afficher le toast
		</Button>
	)
}

export function ToastTypesDemo() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => toast.success("Client créé avec succès")}
			>
				Success
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => toast.error("Une erreur est survenue")}
			>
				Error
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => toast.warning("Quota presque atteint")}
			>
				Warning
			</Button>
			<Button variant="outline" size="sm" onClick={() => toast.info("Mise à jour disponible")}>
				Info
			</Button>
		</div>
	)
}

export function ToastDescriptionDemo() {
	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() =>
				toast.success("Facture générée", {
					description: "La facture FA-2024-042 a été envoyée par email.",
				})
			}
		>
			Afficher le toast
		</Button>
	)
}

export function ToastPromiseDemo() {
	function handlePromise() {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
			loading: "Enregistrement en cours…",
			success: "Client enregistré",
			error: "Impossible d'enregistrer",
		})
	}

	return (
		<Button variant="outline" size="sm" onClick={handlePromise}>
			Lancer la promesse
		</Button>
	)
}

export function ToastDismissDemo() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => {
					const id = toast.loading("Import en cours…")
					setTimeout(() => toast.success("Import terminé", { id }), 2500)
				}}
			>
				Loading → Success
			</Button>
			<Button variant="outline" size="sm" onClick={() => toast.dismiss()}>
				Tout fermer
			</Button>
		</div>
	)
}

export function ToastProgressTypesDemo() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					toastProgress.success("Données sauvegardées", {
						description: "Toutes les modifications ont été appliquées.",
					})
				}
			>
				Success
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					toastProgress.error("Échec de l'opération", {
						description: "Impossible de joindre le serveur.",
					})
				}
			>
				Error
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					toastProgress.warning("Quota presque atteint", {
						description: "Il vous reste 5% d'espace disponible.",
					})
				}
			>
				Warning
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					toastProgress.info("Nouvelle version disponible", {
						description: "Rechargez la page pour profiter des dernières fonctionnalités.",
					})
				}
			>
				Info
			</Button>
		</div>
	)
}

export function ToastProgressOptionsDemo() {
	return (
		<div className="flex flex-wrap gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					toastProgress.success("Sauvegarde terminée", {
						showCountdown: false,
					})
				}
			>
				Barre seule
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					toastProgress.info("Redirection dans quelques secondes…", {
						showProgress: false,
						duration: 8000,
					})
				}
			>
				Countdown seul
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					toastProgress.warning("Session expire bientôt", {
						description: "Vous serez déconnecté automatiquement.",
						duration: 10000,
					})
				}
			>
				10 secondes
			</Button>
		</div>
	)
}
