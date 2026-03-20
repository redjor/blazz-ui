import { createHighlighter, type Highlighter } from "shiki"

let highlighter: Highlighter | null = null

async function getHighlighter() {
	if (highlighter) return highlighter
	highlighter = await createHighlighter({
		themes: ["github-dark", "github-light"],
		langs: ["tsx", "css", "bash", "json"],
	})
	return highlighter
}

export async function highlight(code: string, lang: string = "tsx") {
	const h = await getHighlighter()
	return h.codeToHtml(code, {
		lang,
		themes: {
			dark: "github-dark",
			light: "github-light",
		},
	})
}
