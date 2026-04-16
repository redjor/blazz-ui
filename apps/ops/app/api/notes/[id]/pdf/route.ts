import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ConvexHttpClient } from "convex/browser"
import { formatDate } from "date-fns"
import { fr } from "date-fns/locale"
import type { NextRequest } from "next/server"
// @ts-expect-error — pdfmake 0.2 CJS import
import PdfPrinter from "pdfmake/src/printer"
import { internal } from "@/convex/_generated/api"
import { noteToDocDefinition } from "@/lib/note-to-pdf"

let logoBase64: string | null = null
function getLogoBase64(): string | null {
	if (logoBase64) return logoBase64
	try {
		const logoPath = join(process.cwd(), "public/logos/blazz-dark.png")
		logoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`
		return logoBase64
	} catch {
		return null
	}
}

const fonts = {
	Helvetica: {
		normal: "Helvetica",
		bold: "Helvetica-Bold",
		italics: "Helvetica-Oblique",
		bolditalics: "Helvetica-BoldOblique",
	},
	Courier: {
		normal: "Courier",
		bold: "Courier-Bold",
		italics: "Courier-Oblique",
		bolditalics: "Courier-BoldOblique",
	},
}

function generatePdfBuffer(docDefinition: Parameters<InstanceType<typeof PdfPrinter>["createPdfKitDocument"]>[0]): Promise<Buffer> {
	const printer = new PdfPrinter(fonts)
	const doc = printer.createPdfKitDocument(docDefinition)

	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = []
		doc.on("data", (chunk: Buffer) => chunks.push(chunk))
		doc.on("end", () => resolve(Buffer.concat(chunks)))
		doc.on("error", reject)
		doc.end()
	})
}

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

	let content = null
	if (note.contentJson) {
		try {
			content = typeof note.contentJson === "string" ? JSON.parse(note.contentJson) : note.contentJson
		} catch {
			// fallback: no structured content
		}
	}

	try {
		const logo = getLogoBase64()
		const docDefinition = noteToDocDefinition(note.title, meta, content, note.contentText, logo)
		const buffer = await generatePdfBuffer(docDefinition)

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
