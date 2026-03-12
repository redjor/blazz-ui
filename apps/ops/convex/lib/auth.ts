import type { GenericQueryCtx } from "convex/server"
import { ConvexError } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

/**
 * Vérifie que l'utilisateur est authentifié.
 * Retourne le userId (document ID from users table) pour les checks d'ownership.
 */
export async function requireAuth(ctx: GenericQueryCtx<any>) {
	const userId = await getAuthUserId(ctx)
	if (!userId) {
		throw new ConvexError("Non authentifié")
	}
	return { userId }
}
