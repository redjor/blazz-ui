import { mkdir } from "node:fs/promises"
import { join } from "node:path"
import { chromium } from "playwright"
import { thumbnailRegistry } from "../config/thumbnail-registry"

const BASE_URL = "http://localhost:3100"
const OUTPUT_DIR = join(process.cwd(), "public", "thumbnails")
const THEMES = ["light", "dark"] as const
const VIEWPORT = { width: 800, height: 600 }

async function main() {
	const args = process.argv.slice(2)
	const themeArg = args.find((a) => a.startsWith("--theme="))?.split("=")[1]
	const componentArg = args.find((a) => a.startsWith("--component="))?.split("=")[1]

	const themes = themeArg && themeArg !== "both" ? [themeArg as "light" | "dark"] : THEMES

	const entries = componentArg
		? thumbnailRegistry.filter((e) => e.slug === componentArg)
		: thumbnailRegistry

	if (entries.length === 0) {
		console.error(`No component found for: ${componentArg}`)
		process.exit(1)
	}

	// Ensure output dirs exist
	for (const theme of themes) {
		await mkdir(join(OUTPUT_DIR, theme), { recursive: true })
	}

	const browser = await chromium.launch()
	const context = await browser.newContext({ viewport: VIEWPORT })
	const page = await context.newPage()

	let success = 0
	let errors = 0

	console.log(
		`Generating thumbnails for ${entries.length} components × ${themes.length} themes...\n`
	)

	for (const entry of entries) {
		for (const theme of themes) {
			const url = `${BASE_URL}/thumbnail/${entry.slug}?theme=${theme}`
			const outPath = join(OUTPUT_DIR, theme, `${entry.slug}.png`)

			try {
				await page.goto(url, { waitUntil: "networkidle" })
				await page.waitForTimeout(500)
				// Hide Next.js dev indicator
				await page.evaluate(() => {
					document
						.querySelectorAll("[data-next-badge-root], nextjs-portal")
						.forEach((el) => el.remove())
				})
				await page.screenshot({ path: outPath, type: "png" })
				console.log(`  ✓ ${theme}/${entry.slug}.png`)
				success++
			} catch (err) {
				console.error(`  ✗ ${theme}/${entry.slug}: ${err}`)
				errors++
			}
		}
	}

	await browser.close()
	console.log(`\nDone: ${success} generated, ${errors} errors`)

	if (errors > 0) process.exit(1)
}

main()
