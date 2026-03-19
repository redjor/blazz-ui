import { getAuthUserId } from "@convex-dev/auth/server"
import type { GenericActionCtx, GenericQueryCtx } from "convex/server"
import { ConvexError } from "convex/values"

/**
 * Vérifie que l'utilisateur est authentifié.
 * Retourne le userId (document ID from users table) pour les checks d'ownership.
 */
export async function requireAuth(ctx: GenericQueryCtx<any> | GenericActionCtx<any>) {
	const userId = await getAuthUserId(ctx)
	if (!userId) {
		throw new ConvexError("Non authentifié")
	}
	return { userId }
}
