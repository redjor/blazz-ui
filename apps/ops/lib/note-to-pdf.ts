import { readFileSync } from "node:fs"
import { join } from "node:path"

// ── Types ───────────────────────────────────────────────────────────────
interface TiptapNode {
	type: string
	attrs?: Record<string, unknown>
	content?: TiptapNode[]
	text?: string
	marks?: { type: string; attrs?: Record<string, unknown> }[]
}

// ── Logo ────────────────────────────────────────────────────────────────
let cachedLogoBase64: string | null = null
function getLogoDataUri(): string {
	if (cachedLogoBase64) return cachedLogoBase64
	try {
		const logoPath = join(process.cwd(), "public/logos/blazz-dark.png")
		cachedLogoBase64 = `data:image/png;base64,${readFileSync(logoPath).toString("base64")}`
		return cachedLogoBase64
	} catch {
		return ""
	}
}

// ── Escape HTML ─────────────────────────────────────────────────────────
function esc(text: string): string {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

// ── Inline marks → HTML ─────────────────────────────────────────────────
function renderInline(nodes: TiptapNode[] | undefined): string {
	if (!nodes) return ""
	return nodes
		.map((node) => {
			if (node.type === "hardBreak") return "<br/>"
			if (node.type !== "text" || !node.text) {
				return node.content ? renderInline(node.content) : ""
			}
			let html = esc(node.text)
			if (node.marks) {
				for (const mark of node.marks) {
					if (mark.type === "bold") html = `<strong>${html}</strong>`
					if (mark.type === "italic") html = `<em>${html}</em>`
					if (mark.type === "strike") html = `<s>${html}</s>`
					if (mark.type === "code") html = `<code>${html}</code>`
					if (mark.type === "link") html = `<a href="${esc(String(mark.attrs?.href ?? ""))}">${html}</a>`
					if (mark.type === "highlight") {
						const color = (mark.attrs?.color as string) || "#fef08a"
						html = `<mark style="background:${esc(color)}">${html}</mark>`
					}
				}
			}
			return html
		})
		.join("")
}

// ── Block node → HTML ───────────────────────────────────────────────────
function renderNode(node: TiptapNode): string {
	switch (node.type) {
		case "doc":
			return renderChildren(node.content)

		case "heading": {
			const level = (node.attrs?.level as number) || 1
			const text = renderInline(node.content)
			const slug = (node.content?.map((n) => n.text || "").join("") || "")
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "")
			return `<h${level} id="h-${slug}" class="pdf-heading">${text}</h${level}>`
		}

		case "paragraph":
			return `<p>${renderInline(node.content)}</p>`

		case "bulletList":
			return `<ul>${renderChildren(node.content)}</ul>`

		case "orderedList":
			return `<ol>${renderChildren(node.content)}</ol>`

		case "listItem":
			return `<li>${renderChildren(node.content)}</li>`

		case "taskList":
			return `<ul class="task-list">${renderChildren(node.content)}</ul>`

		case "taskItem": {
			const checked = node.attrs?.checked as boolean
			const checkbox = checked ? '<span class="check checked">&#10003;</span>' : '<span class="check"></span>'
			return `<li class="task-item${checked ? " done" : ""}">${checkbox}${renderChildren(node.content)}</li>`
		}

		case "blockquote":
			return `<blockquote>${renderChildren(node.content)}</blockquote>`

		case "codeBlock": {
			const lang = (node.attrs?.language as string) || ""
			const code = node.content?.map((n) => n.text || "").join("") || ""
			if (lang === "mermaid") {
				return `<div class="mermaid-wrapper"><pre class="mermaid">${esc(code)}</pre></div>`
			}
			return `<pre class="code-block"><code${lang ? ` class="language-${esc(lang)}"` : ""}>${esc(code)}</code></pre>`
		}

		case "table":
			return `<table>${renderChildren(node.content)}</table>`

		case "tableRow":
			return `<tr>${renderChildren(node.content)}</tr>`

		case "tableHeader":
			return `<th>${renderChildren(node.content)}</th>`

		case "tableCell":
			return `<td>${renderChildren(node.content)}</td>`

		case "horizontalRule":
			return "<hr/>"

		case "image": {
			const src = node.attrs?.src as string
			const alt = (node.attrs?.alt as string) || ""
			if (src?.startsWith("data:") || src?.startsWith("http")) {
				return `<img src="${esc(src)}" alt="${esc(alt)}" />`
			}
			return `<p class="image-placeholder">[Image: ${esc(alt)}]</p>`
		}

		default:
			return node.content ? renderChildren(node.content) : ""
	}
}

function renderChildren(nodes: TiptapNode[] | undefined): string {
	if (!nodes) return ""
	return nodes.map(renderNode).join("")
}

// ── Extract H1 headings for TOC ─────────────────────────────────────────
interface TocEntry {
	slug: string
	text: string
}

function extractTopHeadings(node: TiptapNode): TocEntry[] {
	const entries: TocEntry[] = []

	// First pass: find the top-level heading level used (H1 or H2)
	let topLevel = 0
	function findTopLevel(n: TiptapNode) {
		if (n.type === "heading") {
			const level = (n.attrs?.level as number) || 1
			if (level <= 2 && (topLevel === 0 || level < topLevel)) topLevel = level
		}
		if (n.content) for (const child of n.content) findTopLevel(child)
	}
	findTopLevel(node)
	if (topLevel === 0) return entries

	// Second pass: extract headings at that level
	function collect(n: TiptapNode) {
		if (n.type === "heading" && (n.attrs?.level as number) === topLevel) {
			const text = n.content?.map((c) => c.text || "").join("") || ""
			const slug = text
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "")
			if (text.trim()) entries.push({ slug, text: text.trim() })
		}
		if (n.content) for (const child of n.content) collect(child)
	}
	collect(node)
	return entries
}

// ── Markdown fallback → HTML ────────────────────────────────────────────
function markdownToHtml(text: string): string {
	return text
		.split("\n")
		.map((line) => {
			// Headings
			const hm = line.match(/^(#{1,3})\s+(.+)/)
			if (hm) return `<h${hm[1].length}>${esc(hm[2])}</h${hm[1].length}>`
			// HR
			if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) return "<hr/>"
			// Empty
			if (line.trim() === "") return ""
			// Inline bold/code
			let html = esc(line)
			html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			html = html.replace(/`(.+?)`/g, "<code>$1</code>")
			return `<p>${html}</p>`
		})
		.join("\n")
}

// ── HTML template ───────────────────────────────────────────────────────
const CSS = `
@page {
  size: A4;
  margin: 48px 48px 64px 48px;
  @bottom-left { content: attr(data-title); font-size: 7px; color: #aaa; }
  @bottom-right { content: counter(page) " / " counter(pages); font-size: 7px; color: #aaa; }
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 10px;
  line-height: 1.6;
  color: #1a1a1a;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ── Cover page ── */
.cover {
  page-break-after: always;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 112px);
}
.cover-logo img { height: 32px; }
.cover-hero {
  margin: 32px 0 28px;
  height: 220px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e8eeff 0%, #c7d2fe 30%, #818cf8 70%, #6366f1 100%);
  position: relative;
  overflow: hidden;
}
.cover-hero::before {
  content: "";
  position: absolute;
  top: -40px; right: -40px;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
}
.cover-hero-img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 12px;
}
.cover-hero::after {
  content: "";
  position: absolute;
  bottom: -60px; left: 30%;
  width: 280px; height: 280px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
}
.cover-ref {
  font-size: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #888;
  margin-bottom: 12px;
}
.cover-title {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: #111;
  margin-bottom: 10px;
}
.cover-subtitle {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: auto;
}
.cover-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 48px;
  border-top: 1px solid #e5e5e5;
  padding-top: 20px;
  margin-top: 32px;
}
.cover-meta dt {
  font-size: 7px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #888;
  margin-bottom: 2px;
}
.cover-meta dd {
  font-size: 10px;
  color: #333;
  margin-bottom: 12px;
}

/* ── Content pages ── */
/* Logo */
.logo { margin-bottom: 16px; }
.logo img { height: 28px; }

/* Title block */
.note-title { font-size: 24px; font-weight: 700; margin-bottom: 4px; letter-spacing: -0.02em; }
.note-meta { font-size: 9px; color: #888; margin-bottom: 28px; }

/* Headings */
h1 { font-size: 20px; font-weight: 700; margin: 28px 0 8px; letter-spacing: -0.01em; }
h2 { font-size: 16px; font-weight: 700; margin: 24px 0 6px; }
h3 { font-size: 13px; font-weight: 600; margin: 18px 0 4px; }

/* ── Table of contents ── */
.toc-page { page-break-after: always; }
.toc-label {
  font-size: 9px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.08em; color: #2563eb; margin-bottom: 6px;
}
.toc-heading { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 48px; }
.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-entry {
  display: flex; align-items: baseline; gap: 12px;
  padding: 10px 0; border-bottom: 1px solid #f0f0f0;
}
.toc-num {
  font-size: 14px; font-weight: 700; color: #2563eb;
  min-width: 28px; font-variant-numeric: tabular-nums;
}
.toc-text { font-size: 13px; font-weight: 500; color: #222; flex: 1; }
.toc-dots {
  flex: 1; border-bottom: 1px dotted #ccc;
  margin: 0 4px; min-width: 40px; align-self: center;
  height: 0; position: relative; top: -3px;
}
.toc-page-num {
  font-size: 13px; font-weight: 500; color: #222;
  font-variant-numeric: tabular-nums; min-width: 20px; text-align: right;
}

/* Text */
p { margin: 4px 0; font-size: 10px; line-height: 1.6; }
a { color: #2563eb; text-decoration: none; }
strong { font-weight: 600; }
code { font-family: "JetBrains Mono", "Fira Code", "SF Mono", monospace; font-size: 9px; background: #f4f4f5; padding: 1px 4px; border-radius: 3px; }
mark { padding: 1px 2px; border-radius: 2px; }

/* Lists */
ul, ol { margin: 6px 0 6px 20px; font-size: 10px; }
li { margin: 2px 0; }
li > p { margin: 0; display: inline; }

/* Task list */
.task-list { list-style: none; margin-left: 0; padding: 0; }
.task-item { display: flex; align-items: flex-start; gap: 6px; margin: 3px 0; }
.task-item.done { color: #999; text-decoration: line-through; }
.check {
  display: inline-flex; align-items: center; justify-content: center;
  width: 14px; height: 14px; min-width: 14px;
  border: 1.5px solid #ccc; border-radius: 3px;
  font-size: 10px; line-height: 1; margin-top: 1px;
}
.check.checked { background: #2563eb; border-color: #2563eb; color: white; }

/* Blockquote */
blockquote {
  border-left: 3px solid #e5e5e5;
  padding: 4px 0 4px 16px;
  margin: 8px 0;
  color: #666;
  font-style: italic;
}

/* Code block */
.code-block {
  background: #18181b;
  color: #e4e4e7;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 12px 0;
  font-family: "JetBrains Mono", "Fira Code", "SF Mono", monospace;
  font-size: 9px;
  line-height: 1.65;
  overflow-x: auto;
  white-space: pre;
}
.code-block code { background: none; padding: 0; color: inherit; font-size: inherit; }

/* Table */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 9px;
}
th, td {
  border: 1px solid #e5e5e5;
  padding: 6px 10px;
  text-align: left;
  vertical-align: top;
}
th {
  font-weight: 600;
  background: #f9f9fb;
  font-size: 9px;
}
td { font-size: 9px; }
th > p, td > p { margin: 0; font-size: 9px; }

/* HR */
hr {
  border: none;
  border-top: 1px solid #e5e5e5;
  margin: 20px 0;
}

/* Image */
img { max-width: 100%; border-radius: 6px; margin: 8px 0; }
.image-placeholder { font-style: italic; color: #999; font-size: 9px; }

/* Mermaid diagrams */
.mermaid-wrapper {
  margin: 16px 0;
  padding: 24px;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  text-align: center;
  page-break-inside: avoid;
}
.mermaid-wrapper svg { max-width: 100%; height: auto; }

/* Footer */
.pdf-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  font-size: 7px;
  color: #aaa;
  padding: 0 48px 24px;
}
`

export function buildNoteHtml(title: string, meta: string, contentJson: unknown, contentText?: string | null, coverImageDataUri?: string | null): string {
	const logo = getLogoDataUri()

	let bodyHtml = ""
	let tocEntries: TocEntry[] = []

	if (contentJson) {
		const doc = (typeof contentJson === "string" ? JSON.parse(contentJson) : contentJson) as TiptapNode
		bodyHtml = renderNode(doc)
		tocEntries = extractTopHeadings(doc)
	} else if (contentText) {
		bodyHtml = markdownToHtml(contentText)
	}
	const hasMermaid = bodyHtml.includes('class="mermaid"')
	const hasToc = tocEntries.length >= 3

	// ── Cover page ──
	const heroHtml = coverImageDataUri ? `<div class="cover-hero"><img src="${coverImageDataUri}" class="cover-hero-img" /></div>` : `<div class="cover-hero"></div>`

	const coverHtml = `
<div class="cover">
	${logo ? `<div class="cover-logo"><img src="${logo}" /></div>` : ""}
	${heroHtml}
	<div class="cover-title">${esc(title)}</div>
	<div class="cover-subtitle">${esc(meta)}</div>
	<dl class="cover-meta">
		<dt>Auteur</dt><dd>Jonathan RUAS</dd>
		<dt>Date</dt><dd>${esc(meta.replace("Dernière modification : ", ""))}</dd>
		<dt>Statut</dt><dd>Document de travail</dd>
		<dt>Confidentialité</dt><dd>Interne</dd>
	</dl>
</div>`

	// ── TOC page ──
	const tocHtml = hasToc
		? `
<div class="toc-page">
	<div class="toc-label">Sommaire</div>
	<div class="toc-heading">Table des matières</div>
	<ol class="toc-list">
		${tocEntries
			.map(
				(entry, i) => `
		<li class="toc-entry">
			<span class="toc-num">${String(i + 1).padStart(2, "0")}</span>
			<span class="toc-text">${esc(entry.text)}</span>
			<span class="toc-dots"></span>
			<span class="toc-page-num" data-heading-id="h-${entry.slug}">—</span>
		</li>`
			)
			.join("")}
	</ol>
</div>`
		: ""

	return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<style>${CSS}</style>
</head>
<body>
${coverHtml}
${tocHtml}
<div class="content-pages">
${bodyHtml}
</div>
${
	hasMermaid
		? `<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose' });</script>`
		: ""
}
</body>
</html>`
}
