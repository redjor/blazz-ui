"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Check, Copy } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { SectionShell } from "./section-shell"

const snippet = `import { DataTable, col } from "@blazz/pro/components/blocks/data-table"
import { PageHeader } from "@blazz/ui/components/patterns/page-header-shell"

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <>
      <PageHeader
        title="Clients"
        actions={[{ label: "New client", href: "/clients/new" }]}
      />
      <DataTable
        data={clients}
        columns={[
          col.text("name", "Name"),
          col.badge("status", "Status"),
          col.currency("mrr", "MRR"),
          col.date("createdAt", "Created"),
        ]}
      />
    </>
  )
}`

export function CodeDemo() {
	const [copied, setCopied] = useState(false)

	async function onCopy() {
		try {
			await navigator.clipboard.writeText(snippet)
			setCopied(true)
			setTimeout(() => setCopied(false), 1500)
		} catch {
			// noop
		}
	}

	return (
		<SectionShell eyebrow="Ship in minutes" title="Import, compose, ship" description="Every block ships as a single import. Real pages take a handful of lines — not a week of CSS and refactors.">
			<motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
				{/* Code panel */}
				<div className="overflow-hidden rounded-xl border border-container bg-card shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
					<div className="flex items-center justify-between border-b border-edge/50 bg-muted/30 px-4 py-2.5">
						<div className="flex items-center gap-2">
							<Badge variant="default" fill="subtle" size="xs">
								app/clients/page.tsx
							</Badge>
							<span className="text-xs text-fg-subtle">TypeScript</span>
						</div>
						<Button variant="ghost" size="sm" className="h-7 gap-1.5 px-2 text-xs" onClick={onCopy}>
							{copied ? (
								<>
									<Check className="size-3 text-positive" />
									Copied
								</>
							) : (
								<>
									<Copy className="size-3" />
									Copy
								</>
							)}
						</Button>
					</div>
					<pre className="overflow-x-auto p-5 text-[12.5px] leading-[1.65] font-mono text-fg">
						<code
							// biome-ignore lint/security/noDangerouslySetInnerHtml: static snippet
							dangerouslySetInnerHTML={{ __html: highlight(snippet) }}
						/>
					</pre>
				</div>

				{/* Preview panel */}
				<div className="overflow-hidden rounded-xl border border-container bg-card shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
					<div className="flex items-center justify-between border-b border-edge/50 bg-muted/30 px-4 py-2.5">
						<Badge variant="success" fill="subtle" size="xs">
							Live result
						</Badge>
						<span className="text-xs text-fg-subtle">/clients</span>
					</div>
					<div className="bg-muted/10 p-5">
						<img src="/thumbnails/light/data-table.png" alt="Live result of the code snippet" className="w-full rounded-lg border border-edge/40 dark:hidden" />
						<img src="/thumbnails/dark/data-table.png" alt="Live result of the code snippet" className="hidden w-full rounded-lg border border-edge/40 dark:block" />
					</div>
				</div>
			</motion.div>
		</SectionShell>
	)
}

// Tiny syntax highlighter — keeps the snippet readable without a runtime dep.
function highlight(code: string): string {
	const escaped = code.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

	return escaped
		.replace(/(".*?")/g, '<span style="color:var(--color-positive)">$1</span>')
		.replace(/\b(import|from|export|default|async|function|return|const|await)\b/g, '<span style="color:var(--color-brand)">$1</span>')
		.replace(/(\/\/.*$)/gm, '<span style="color:var(--color-fg-subtle)">$1</span>')
}
