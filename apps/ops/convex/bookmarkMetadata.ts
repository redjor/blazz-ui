import { v } from "convex/values"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"
import { extractMetadata } from "./lib/bookmarkMetadata"

export const enrichBookmark = internalAction({
	args: { bookmarkId: v.id("bookmarks") },
	handler: async (ctx, { bookmarkId }) => {
		const bookmark = await ctx.runQuery(internal.bookmarks.getInternal, { id: bookmarkId })
		if (!bookmark) return
		if (bookmark.title && bookmark.title.trim() !== "") return

		const metadata = await extractMetadata(bookmark.url)
		await ctx.runMutation(internal.bookmarks.internalEnrich, {
			id: bookmarkId,
			type: metadata.type,
			title: metadata.title,
			description: metadata.description,
			thumbnailUrl: metadata.thumbnailUrl,
			author: metadata.author,
			siteName: metadata.siteName,
			embedUrl: metadata.embedUrl,
		})
	},
})
