import type { GenericQueryCtx } from "convex/server"
import { ConvexError } from "convex/values"

/**
 * Vérifie que l'utilisateur est authentifié.
 * Retourne le userId (identity.subject) pour les checks d'ownership.
 */
export async function requireAuth(ctx: GenericQueryCtx<any>) {
	const identity = await ctx.auth.getUserIdentity()
	if (!identity) {
		throw new ConvexError("Non authentifié")
	}
	return { identity, userId: identity.subject }
}
