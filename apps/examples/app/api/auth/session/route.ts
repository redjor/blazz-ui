import { NextResponse } from "next/server"
import type { User } from "@/hooks/use-session"

/**
 * GET /api/auth/session
 *
 * Récupère les informations de session de l'utilisateur connecté
 */
export async function GET() {
	try {
		// TODO: Ajouter ici la logique de récupération de session selon le provider d'auth utilisé
		// Exemples:
		// - NextAuth: getServerSession()
		// - Session cookies: lire et valider le cookie de session
		// - JWT: valider et décoder le token
		// - Okta/Auth0: valider le token avec le provider

		// Pour l'instant, retourner un utilisateur mock pour les tests
		// La vraie implémentation dépendra du système d'authentification choisi

		// Vérifier si l'utilisateur est connecté (à implémenter)
		const isAuthenticated = true // Demo mode — mock user always authenticated

		if (!isAuthenticated) {
			return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
		}

		// Utilisateur mock pour les tests
		const user: User = {
			id: "1",
			email: "user@example.com",
			name: "John Doe",
			firstName: "John",
			lastName: "Doe",
			role: "admin",
			branch: null,
		}

		return NextResponse.json({ user }, { status: 200 })
	} catch (error) {
		console.error("Erreur lors de la récupération de la session:", error)
		return NextResponse.json(
			{ error: "Erreur lors de la récupération de la session" },
			{ status: 500 }
		)
	}
}
