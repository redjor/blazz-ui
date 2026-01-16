"use client"

import { useEffect } from "react"

/**
 * Hook pour bloquer la navigation pendant une opération critique
 *
 * - Ajoute un event listener `beforeunload` pour bloquer fermeture onglet/navigateur
 * - Affiche une alerte native du navigateur si l'utilisateur tente de quitter
 *
 * @param isBlocking - Si true, bloque la navigation
 */
export function useBlockNavigation(isBlocking: boolean) {
	useEffect(() => {
		if (!isBlocking) return

		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault()
			// Chrome requires returnValue to be set
			e.returnValue = ""
			return ""
		}

		window.addEventListener("beforeunload", handleBeforeUnload)
		return () => window.removeEventListener("beforeunload", handleBeforeUnload)
	}, [isBlocking])
}
