import type { Content, ContentText, StyleDictionary, TableCell, TDocumentDefinitions } from "pdfmake/interfaces"

// ── Types ───────────────────────────────────────────────────────────────
interface TiptapNode {
	type: string
	attrs?: Record<string, unknown>
	content?: TiptapNode[]
	text?: string
	marks?: { type: string; attrs?: Record<string, unknown> }[]
}

// ── Styles ──────────────────────────────────────────────────────────────
const styles: StyleDictionary = {
	title: { fontSize: 24, bold: true, margin: [0, 0, 0, 4] },
	meta: { fontSize: 9, color: "#888", margin: [0, 0, 0, 24] },
	h1: { fontSize: 20, bold: true, margin: [0, 20, 0, 6] },
	h2: { fontSize: 16, bold: true, margin: [0, 16, 0, 4] },
	h3: { fontSize: 13, bold: true, margin: [0, 12, 0, 4] },
	body: { fontSize: 10, lineHeight: 1.5 },
	code: { font: "Courier", fontSize: 9, background: "#f4f4f5", margin: [0, 8, 0, 8] },
	blockquote: { italics: true, color: "#666", margin: [12, 6, 0, 6] },
	tableHeader: { bold: true, fontSize: 9, fillColor: "#f4f4f5", margin: [4, 4, 4, 4] },
	tableCell: { fontSize: 9, margin: [4, 3, 4, 3] },
}

// ── Inline text extraction ──────────────────────────────────────────────
function extractInlineText(nodes: TiptapNode[] | undefined): ContentText[] {
	if (!nodes) return []
	const parts: ContentText[] = []

	for (const node of nodes) {
		if (node.type === "text" && node.text) {
			const part: ContentText = { text: node.text }
			if (node.marks) {
				for (const mark of node.marks) {
					if (mark.type === "bold") part.bold = true
					if (mark.type === "italic") part.italics = true
					if (mark.type === "strike") part.decoration = "lineThrough"
					if (mark.type === "code") {
						part.font = "Courier"
						part.fontSize = 9
						part.background = "#f0f0f0"
					}
					if (mark.type === "highlight") {
						part.background = (mark.attrs?.color as string) || "#fef08a"
					}
				}
			}
			parts.push(part)
		} else if (node.type === "hardBreak") {
			parts.push({ text: "\n" })
		} else if (node.content) {
			parts.push(...extractInlineText(node.content))
		}
	}
	return parts
}

function inlineToString(nodes: TiptapNode[] | undefined): string {
	if (!nodes) return ""
	return nodes.map((n) => n.text || "").join("")
}

// ── Block conversion ────────────────────────────────────────────────────
function convertNode(node: TiptapNode): Content | null {
	switch (node.type) {
		case "heading": {
			const level = (node.attrs?.level as number) || 1
			const style = level === 1 ? "h1" : level === 2 ? "h2" : "h3"
			return { text: extractInlineText(node.content), style }
		}

		case "paragraph": {
			const parts = extractInlineText(node.content)
			if (parts.length === 0) return { text: " ", style: "body", margin: [0, 2, 0, 2] }
			return { text: parts, style: "body" }
		}

		case "bulletList":
			return {
				ul: (node.content || []).map((li) => convertListItem(li)).filter(Boolean) as Content[],
				margin: [0, 4, 0, 4],
				style: "body",
			}

		case "orderedList":
			return {
				ol: (node.content || []).map((li) => convertListItem(li)).filter(Boolean) as Content[],
				margin: [0, 4, 0, 4],
				style: "body",
			}

		case "taskList":
			return {
				ul: (node.content || []).map((li) => {
					const checked = li.attrs?.checked as boolean
					const prefix = checked ? "☑ " : "☐ "
					const inner = extractInlineText(li.content?.[0]?.content)
					return {
						text: [{ text: prefix, bold: true }, ...inner],
						...(checked ? { decoration: "lineThrough" as const, color: "#999" } : {}),
					}
				}),
				margin: [0, 4, 0, 4],
				style: "body",
				listType: "none",
			}

		case "blockquote":
			return {
				stack: convertChildren(node.content),
				style: "blockquote",
			}

		case "codeBlock":
			return {
				text: inlineToString(node.content) || " ",
				style: "code",
				preserveLeadingSpaces: true,
			}

		case "table":
			return convertTable(node)

		case "horizontalRule":
			return {
				canvas: [{ type: "line", x1: 0, y1: 0, x2: 500, y2: 0, lineWidth: 0.5, lineColor: "#ddd" }],
				margin: [0, 12, 0, 12],
			}

		case "image": {
			// Skip images in PDF for now — could add base64 support later
			return { text: `[Image: ${(node.attrs?.alt as string) || ""}]`, italics: true, color: "#999", fontSize: 9 }
		}

		default:
			if (node.content) return { stack: convertChildren(node.content) }
			return null
	}
}

function convertListItem(node: TiptapNode): Content | null {
	if (!node.content) return null
	const children = convertChildren(node.content)
	if (children.length === 1) return children[0]
	return { stack: children }
}

function convertChildren(nodes: TiptapNode[] | undefined): Content[] {
	if (!nodes) return []
	return nodes.map(convertNode).filter(Boolean) as Content[]
}

// ── Table conversion ────────────────────────────────────────────────────
function convertTable(node: TiptapNode): Content {
	const rows = node.content || []
	const body: TableCell[][] = []
	const widths: string[] = []

	for (const row of rows) {
		const cells: TableCell[] = []
		for (const cell of row.content || []) {
			const isHeader = cell.type === "tableHeader"
			const parts = extractInlineText(cell.content?.[0]?.content)
			cells.push({
				text: parts.length > 0 ? parts : " ",
				style: isHeader ? "tableHeader" : "tableCell",
			})
		}
		if (widths.length === 0) {
			widths.push(...cells.map(() => "*"))
		}
		body.push(cells)
	}

	if (body.length === 0) return { text: "" }

	return {
		table: {
			headerRows: 1,
			widths,
			body,
		},
		layout: {
			hLineWidth: () => 0.5,
			vLineWidth: () => 0.5,
			hLineColor: () => "#ddd",
			vLineColor: () => "#ddd",
			paddingLeft: () => 4,
			paddingRight: () => 4,
			paddingTop: () => 3,
			paddingBottom: () => 3,
		},
		margin: [0, 6, 0, 6],
	}
}

// ── Markdown fallback ───────────────────────────────────────────────────
function parseMarkdownInline(text: string): ContentText[] {
	const parts: ContentText[] = []
	const regex = /\*\*(.+?)\*\*|__(.+?)__|`(.+?)`|~~(.+?)~~|(\*|_)(.+?)\5/g
	let lastIndex = 0
	let match: RegExpExecArray | null

	// biome-ignore lint/suspicious/noAssignInExpressions: standard regex exec loop
	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push({ text: text.slice(lastIndex, match.index) })
		}
		if (match[1] || match[2]) {
			parts.push({ text: match[1] || match[2], bold: true })
		} else if (match[3]) {
			parts.push({ text: match[3], font: "Courier", fontSize: 9, background: "#f0f0f0" })
		} else if (match[4]) {
			parts.push({ text: match[4], decoration: "lineThrough" })
		} else if (match[6]) {
			parts.push({ text: match[6], italics: true })
		}
		lastIndex = match.index + match[0].length
	}
	if (lastIndex < text.length) {
		parts.push({ text: text.slice(lastIndex) })
	}
	return parts.length > 0 ? parts : [{ text }]
}

function markdownToContent(text: string): Content[] {
	const lines = text.split("\n")
	const result: Content[] = []
	let i = 0

	while (i < lines.length) {
		const line = lines[i]

		// Headings
		const headingMatch = line.match(/^(#{1,3})\s+(.+)/)
		if (headingMatch) {
			const level = headingMatch[1].length
			const style = level === 1 ? "h1" : level === 2 ? "h2" : "h3"
			result.push({ text: parseMarkdownInline(headingMatch[2]), style })
			i++
			continue
		}

		// Horizontal rule
		if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
			result.push({
				canvas: [{ type: "line", x1: 0, y1: 0, x2: 500, y2: 0, lineWidth: 0.5, lineColor: "#ddd" }],
				margin: [0, 12, 0, 12],
			})
			i++
			continue
		}

		// Table
		if (line.includes("|") && i + 1 < lines.length && /^\|?\s*[-:]+/.test(lines[i + 1])) {
			const tableLines: string[] = [line]
			i++ // skip header
			i++ // skip separator
			while (i < lines.length && lines[i].includes("|")) {
				tableLines.push(lines[i])
				i++
			}
			// Determine column count from header row
			const headerCells = line.split("|").slice(line.startsWith("|") ? 1 : 0)
			const colCount = headerCells.filter((_, idx, arr) => !(idx === arr.length - 1 && arr[arr.length - 1].trim() === "")).length

			const tableBody: TableCell[][] = tableLines.map((tl, rowIdx) => {
				const raw = tl.split("|")
				// Trim leading/trailing empty segments from pipes
				if (raw[0]?.trim() === "") raw.shift()
				if (raw[raw.length - 1]?.trim() === "") raw.pop()
				// Pad or trim to match column count
				const cells = Array.from({ length: colCount }, (_, idx) => (raw[idx] ?? "").trim())
				return cells.map((c) => ({
					text: c ? parseMarkdownInline(c) : " ",
					style: rowIdx === 0 ? "tableHeader" : "tableCell",
				}))
			})
			if (tableBody.length > 0) {
				const widths = tableBody[0].map(() => "*")
				result.push({
					table: { headerRows: 1, widths, body: tableBody },
					layout: {
						hLineWidth: () => 0.5,
						vLineWidth: () => 0.5,
						hLineColor: () => "#ddd",
						vLineColor: () => "#ddd",
						paddingLeft: () => 4,
						paddingRight: () => 4,
						paddingTop: () => 3,
						paddingBottom: () => 3,
					},
					margin: [0, 6, 0, 6],
				})
			}
			continue
		}

		// Checklist
		if (/^- \[[ x]\] /.test(line)) {
			const items: Content[] = []
			while (i < lines.length && /^- \[[ x]\] /.test(lines[i])) {
				const checked = lines[i].startsWith("- [x] ")
				const text = lines[i].replace(/^- \[[ x]\] /, "")
				const prefix = checked ? "☑ " : "☐ "
				items.push({
					text: [{ text: prefix, bold: true }, ...parseMarkdownInline(text)],
					...(checked ? { decoration: "lineThrough" as const, color: "#999" } : {}),
				})
				i++
			}
			// biome-ignore lint/suspicious/noExplicitAny: pdfmake listType typing
			result.push({ ul: items, margin: [0, 4, 0, 4], style: "body", listType: "none" as any })
			continue
		}

		// Unordered list
		if (/^[-*] /.test(line)) {
			const items: Content[] = []
			while (i < lines.length && /^[-*] /.test(lines[i])) {
				items.push({ text: parseMarkdownInline(lines[i].replace(/^[-*] /, "")), style: "body" })
				i++
			}
			result.push({ ul: items, margin: [0, 4, 0, 4], style: "body" })
			continue
		}

		// Ordered list
		if (/^\d+\. /.test(line)) {
			const items: Content[] = []
			while (i < lines.length && /^\d+\. /.test(lines[i])) {
				items.push({ text: parseMarkdownInline(lines[i].replace(/^\d+\. /, "")), style: "body" })
				i++
			}
			result.push({ ol: items, margin: [0, 4, 0, 4], style: "body" })
			continue
		}

		// Empty line
		if (line.trim() === "") {
			i++
			continue
		}

		// Regular paragraph
		result.push({ text: parseMarkdownInline(line), style: "body" })
		i++
	}

	return result
}

// ── Main export ─────────────────────────────────────────────────────────
export function noteToDocDefinition(title: string, meta: string, content: TiptapNode | null, contentText?: string | null, logoBase64?: string | null): TDocumentDefinitions {
	const body: Content[] = []

	if (logoBase64) {
		body.push({ image: logoBase64, width: 80, margin: [0, 0, 0, 12] })
	}

	body.push({ text: title, style: "title" })
	body.push({ text: meta, style: "meta" })

	if (content?.content) {
		body.push(...convertChildren(content.content))
	} else if (contentText) {
		body.push(...markdownToContent(contentText))
	}

	return {
		footer: (currentPage: number, pageCount: number) => ({
			columns: [
				{ text: title, fontSize: 7, color: "#aaa", margin: [48, 0, 0, 0] },
				{
					text: `${currentPage} / ${pageCount}`,
					fontSize: 7,
					color: "#aaa",
					alignment: "right" as const,
					margin: [0, 0, 48, 0],
				},
			],
		}),
		content: body,
		styles,
		defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.4 },
		pageMargins: [48, 56, 48, 40],
		info: { title },
	}
}
