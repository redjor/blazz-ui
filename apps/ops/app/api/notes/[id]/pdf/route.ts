import { ConvexHttpClient } from "convex/browser"
import { formatDate } from "date-fns"
import { fr } from "date-fns/locale"
import type { NextRequest } from "next/server"
import puppeteer from "puppeteer"
import { internal } from "@/convex/_generated/api"
import { generateCoverImage } from "@/lib/generate-cover-image"
import { buildNoteHtml } from "@/lib/note-to-pdf"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
	const deployKey = process.env.CONVEX_DEPLOY_KEY
	const userId = process.env.OPS_USER_ID

	if (!convexUrl || !deployKey || !userId) {
		return Response.json({ error: "Server not configured" }, { status: 500 })
	}

	const client = new ConvexHttpClient(convexUrl)
	client.setAdminAuth(deployKey)

	// biome-ignore lint/suspicious/noExplicitAny: Convex ID type mismatch
	const note = await client.query(internal.cli.notesGet, { userId, id: id as any })
	if (!note) {
		return Response.json({ error: "Note not found" }, { status: 404 })
	}

	const dateStr = formatDate(note.updatedAt, "d MMMM yyyy", { locale: fr })
	const meta = `Dernière modification : ${dateStr}`
	const safeTitle = note.title.replace(/</g, "&lt;").replace(/>/g, "&gt;")

	try {
		// Generate AI cover image (falls back to gradient if it fails)
		const coverImage = await generateCoverImage(note.title)
		const html = buildNoteHtml(note.title, meta, note.contentJson, note.contentText, coverImage)

		const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] })
		const page = await browser.newPage()
		await page.setContent(html, { waitUntil: "networkidle0" })

		// ── Pass 1: calculate TOC page numbers ──
		// Get heading positions and page height to estimate page numbers
		const headingPages = await page.evaluate(() => {
			const PAGE_HEIGHT = 1122.5 // A4 at 96dpi
			const MARGIN_TOP = 48
			const MARGIN_BOTTOM = 64
			const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM

			const results: Record<string, number> = {}
			const headings = document.querySelectorAll<HTMLElement>(".pdf-heading")

			for (const h of headings) {
				const top = h.offsetTop
				const pageNum = Math.floor(top / CONTENT_HEIGHT) + 1
				results[h.id] = pageNum
			}
			return results
		})

		// Update TOC page numbers
		await page.evaluate((pageMap: Record<string, number>) => {
			const tocNums = document.querySelectorAll<HTMLElement>(".toc-page-num")
			for (const el of tocNums) {
				const headingId = el.dataset.headingId
				if (headingId && pageMap[headingId]) {
					el.textContent = String(pageMap[headingId])
				}
			}
		}, headingPages)

		// ── Pass 2: generate final PDF ──
		const buffer = await page.pdf({
			format: "A4",
			margin: { top: "48px", right: "48px", bottom: "64px", left: "48px" },
			printBackground: true,
			displayHeaderFooter: true,
			headerTemplate: "<span></span>",
			footerTemplate: `
				<div style="width:100%;font-size:7px;color:#aaa;display:flex;justify-content:space-between;padding:0 48px;">
					<span>${safeTitle}</span>
					<span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
				</div>
			`,
		})

		await browser.close()

		const filename = note.title.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüÿçœæ\s-]/g, "").replace(/\s+/g, "-")

		return new Response(buffer, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="${filename}.pdf"`,
			},
		})
	} catch (error) {
		console.error("[PDF] Generation failed:", error)
		return Response.json({ error: "PDF generation failed", details: String(error) }, { status: 500 })
	}
}
