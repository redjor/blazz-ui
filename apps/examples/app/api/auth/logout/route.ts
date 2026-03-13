import { NextResponse } from "next/server"

/**
 * POST /api/auth/logout
 *
 * Déconnecte l'utilisateur en supprimant la session
 */
export async function POST() {
	try {
		// TODO: Ajouter ici la logique de déconnexion selon le provider d'auth utilisé
		// Exemples:
		// - NextAuth: signOut()
		// - Session cookies: supprimer les cookies de session
		// - JWT: invalider le token (blacklist)
		// - Okta/Auth0: appeler l'endpoint de logout du provider

		// NOTE: Client-side code calling this endpoint should also invalidate
		// the React Query ["session"] cache via queryClient.invalidateQueries()

		// Pour l'instant, on retourne une réponse de succès
		// La vraie implémentation dépendra du système d'authentification choisi

		const response = NextResponse.json({ message: "Déconnexion réussie" }, { status: 200 })

		// Supprimer les cookies de session (à adapter selon votre implémentation)
		response.cookies.set("session", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 0, // Expire immédiatement
		})

		return response
	} catch (error) {
		console.error("Erreur lors de la déconnexion:", error)
		return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 })
	}
}
