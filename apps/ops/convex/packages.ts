import { v } from "convex/values"
import { internal } from "./_generated/api"
import { action, internalAction, internalMutation, query } from "./_generated/server"

export const list = query({
	args: {},
	handler: async (ctx) => {
		return ctx.db.query("packages").collect()
	},
})

export const upsert = internalMutation({
	args: {
		name: v.string(),
		latestVersion: v.string(),
		publishedAt: v.string(),
		weeklyDownloads: v.number(),
		description: v.string(),
		license: v.optional(v.string()),
		unpackedSize: v.optional(v.number()),
		lastSyncedAt: v.number(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("packages")
			.withIndex("by_name", (q) => q.eq("name", args.name))
			.unique()

		if (existing) {
			await ctx.db.patch(existing._id, args)
		} else {
			await ctx.db.insert("packages", args)
		}
	},
})

export const sync = internalAction({
	args: {},
	handler: async (ctx) => {
		const TRACKED = ["@blazz/ui", "next", "react", "typescript", "tailwindcss", "prisma"]

		for (const name of TRACKED) {
			try {
				const [registryRes, downloadsRes] = await Promise.all([
					fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
						headers: { Accept: "application/vnd.npm.install-v1+json" },
					}),
					fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`),
				])

				if (!registryRes.ok) continue

				const registry = await registryRes.json()
				const latestVersion = registry["dist-tags"]?.latest ?? "0.0.0"
				const versionData = registry.versions?.[latestVersion]

				let weeklyDownloads = 0
				if (downloadsRes.ok) {
					const dlData = await downloadsRes.json()
					weeklyDownloads = dlData.downloads ?? 0
				}

				await ctx.runMutation(internal.packages.upsert, {
					name,
					latestVersion,
					publishedAt: registry.modified ?? "",
					weeklyDownloads,
					description: registry.description ?? "",
					license: versionData?.license ?? undefined,
					unpackedSize: versionData?.dist?.unpackedSize ?? undefined,
					lastSyncedAt: Date.now(),
				})
			} catch (e) {
				console.error(`Failed to sync ${name}:`, e)
			}
		}
	},
})

export const triggerSync = action({
	args: {},
	handler: async (ctx) => {
		await ctx.runAction(internal.packages.sync)
	},
})
