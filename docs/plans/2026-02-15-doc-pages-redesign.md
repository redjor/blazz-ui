# Documentation Pages Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign all 39 component documentation pages with new shared components: TOC, hero examples, collapsible code with Shiki, Do/Don't patterns, better props table, and token swatches.

**Architecture:** Server/client component split — doc pages become Server Components, Shiki runs server-side, interactive parts (TOC scroll spy, code collapse, copy) are isolated Client Components. New components in `components/features/docs/`.

**Tech Stack:** Shiki (server-side syntax highlighting), React 19 Server Components, IntersectionObserver (TOC active state), existing design tokens (oklch).

---

### Task 1: Install Shiki

**Files:**
- Modify: `package.json`

**Step 1: Install shiki**

Run: `npm install shiki`

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add shiki for server-side syntax highlighting"
```

---

### Task 2: Create Shiki highlighter utility

**Files:**
- Create: `lib/shiki.ts`

**Step 1: Create the cached highlighter**

```ts
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
```

**Step 2: Commit**

```bash
git add lib/shiki.ts
git commit -m "feat(docs): add shiki highlighter utility with dual theme"
```

---

### Task 3: Create DocSection component

**Files:**
- Create: `components/features/docs/doc-section.tsx`

**Context:** Replaces raw `<section className="space-y-6"><h2 className="text-lg font-semibold">Title</h2>` pattern. Generates consistent IDs for anchor links and TOC.

**Step 1: Implement DocSection**

```tsx
import { cn } from "@/lib/utils"

interface DocSectionProps {
	id: string
	title: string
	children: React.ReactNode
	className?: string
	/** Spacing between child elements */
	spacing?: "sm" | "md" | "lg"
}

const spacingMap = {
	sm: "space-y-4",
	md: "space-y-6",
	lg: "space-y-8",
}

export function DocSection({ id, title, children, className, spacing = "md" }: DocSectionProps) {
	return (
		<section id={id} className={cn(spacingMap[spacing], className)} aria-labelledby={`${id}-heading`}>
			<h2 id={`${id}-heading`} className="text-lg font-semibold text-fg scroll-mt-6">
				<a href={`#${id}`} className="hover:underline underline-offset-4 decoration-edge">
					{title}
				</a>
			</h2>
			{children}
		</section>
	)
}
```

**Step 2: Commit**

```bash
git add components/features/docs/doc-section.tsx
git commit -m "feat(docs): add DocSection component with anchor links"
```

---

### Task 4: Create DocToc component (client)

**Files:**
- Create: `components/features/docs/doc-toc.tsx`

**Context:** Sticky sidebar TOC with IntersectionObserver for active section highlighting. Client component. Visible only on `lg:`.

**Step 1: Implement DocToc**

```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface TocItem {
	id: string
	title: string
}

interface DocTocProps {
	items: TocItem[]
}

export function DocToc({ items }: DocTocProps) {
	const [activeId, setActiveId] = React.useState<string>("")

	React.useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id)
					}
				}
			},
			{ rootMargin: "-80px 0px -60% 0px", threshold: 0 }
		)

		for (const item of items) {
			const el = document.getElementById(item.id)
			if (el) observer.observe(el)
		}

		return () => observer.disconnect()
	}, [items])

	if (items.length === 0) return null

	return (
		<nav className="sticky top-20 hidden lg:block" aria-label="Table of contents">
			<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
				On this page
			</p>
			<ul className="space-y-1.5 border-l border-edge pl-3">
				{items.map((item) => (
					<li key={item.id}>
						<a
							href={`#${item.id}`}
							className={cn(
								"block text-[13px] leading-snug transition-colors",
								activeId === item.id
									? "font-medium text-brand"
									: "text-fg-muted hover:text-fg"
							)}
						>
							{item.title}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}
```

**Step 2: Commit**

```bash
git add components/features/docs/doc-toc.tsx
git commit -m "feat(docs): add DocToc with IntersectionObserver scroll spy"
```

---

### Task 5: Create DocPage component

**Files:**
- Create: `components/features/docs/doc-page.tsx`

**Context:** Wrapper that combines `<Page>` with 2-column layout (content + TOC). Server component. Accepts `toc` array for the sidebar.

**Step 1: Implement DocPage**

```tsx
import { Page } from "@/components/ui/page"
import { DocToc, type TocItem } from "./doc-toc"

interface DocPageProps {
	title: string
	subtitle: string
	toc?: TocItem[]
	children: React.ReactNode
}

export function DocPage({ title, subtitle, toc, children }: DocPageProps) {
	return (
		<Page title={title} subtitle={subtitle}>
			<div className="flex gap-10">
				<div className="min-w-0 flex-1 space-y-12">
					{children}
				</div>
				{toc && toc.length > 0 && (
					<div className="hidden w-48 shrink-0 lg:block">
						<DocToc items={toc} />
					</div>
				)}
			</div>
		</Page>
	)
}
```

**Step 2: Commit**

```bash
git add components/features/docs/doc-page.tsx
git commit -m "feat(docs): add DocPage with TOC sidebar layout"
```

---

### Task 6: Create DocExample (server + client split)

**Files:**
- Create: `components/features/docs/doc-example.tsx` (server)
- Create: `components/features/docs/doc-example-client.tsx` (client)

**Context:** Server component calls Shiki to highlight code, then passes pre-rendered HTML to client component which handles collapse toggle and copy-to-clipboard. Code is collapsed by default (key UX improvement).

**Step 1: Create the client component**

`components/features/docs/doc-example-client.tsx`:

```tsx
"use client"

import * as React from "react"
import { Check, ChevronDown, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DocExampleClientProps {
	title?: string
	description?: string
	code: string
	highlightedCode: string
	children: React.ReactNode
	className?: string
	defaultExpanded?: boolean
}

export function DocExampleClient({
	title,
	description,
	code,
	highlightedCode,
	children,
	className,
	defaultExpanded = false,
}: DocExampleClientProps) {
	const [showCode, setShowCode] = React.useState(defaultExpanded)
	const [copied, setCopied] = React.useState(false)

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className={cn("space-y-3", className)}>
			{(title || description) && (
				<div className="space-y-1">
					{title && <h3 className="text-sm font-medium text-fg">{title}</h3>}
					{description && <p className="text-[13px] text-fg-muted">{description}</p>}
				</div>
			)}

			{/* Preview */}
			<div className="rounded-lg border border-edge bg-surface p-6">
				{children}
			</div>

			{/* Code toggle bar */}
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => setShowCode(!showCode)}
					className="flex items-center gap-1.5 text-xs font-medium text-fg-muted transition-colors hover:text-fg"
				>
					<ChevronDown
						className={cn(
							"size-3.5 transition-transform duration-200",
							showCode && "rotate-180"
						)}
					/>
					{showCode ? "Hide code" : "Show code"}
				</button>
				<Button
					variant="ghost"
					size="sm"
					onClick={copyToClipboard}
					className="ml-auto h-6 gap-1 px-2 text-xs text-fg-muted"
				>
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

			{/* Code block (collapsible) */}
			{showCode && (
				<div
					className="overflow-hidden rounded-lg border border-edge [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_code]:font-mono"
					dangerouslySetInnerHTML={{ __html: highlightedCode }}
				/>
			)}
		</div>
	)
}
```

**Step 2: Create the server component wrapper**

`components/features/docs/doc-example.tsx`:

```tsx
import { highlight } from "@/lib/shiki"
import { DocExampleClient } from "./doc-example-client"

interface DocExampleProps {
	title?: string
	description?: string
	code: string
	children: React.ReactNode
	className?: string
	defaultExpanded?: boolean
}

export async function DocExample({
	title,
	description,
	code,
	children,
	className,
	defaultExpanded,
}: DocExampleProps) {
	const highlightedCode = await highlight(code, "tsx")

	return (
		<DocExampleClient
			title={title}
			description={description}
			code={code}
			highlightedCode={highlightedCode}
			className={className}
			defaultExpanded={defaultExpanded}
		>
			{children}
		</DocExampleClient>
	)
}
```

**Step 3: Commit**

```bash
git add components/features/docs/doc-example.tsx components/features/docs/doc-example-client.tsx
git commit -m "feat(docs): add DocExample with Shiki highlighting and collapsible code"
```

---

### Task 7: Create DocExampleGrid component

**Files:**
- Create: `components/features/docs/doc-example-grid.tsx`

**Context:** Grid wrapper for showing multiple examples side by side (2 columns on sm+). Used for variant/size comparisons.

**Step 1: Implement DocExampleGrid**

```tsx
import { cn } from "@/lib/utils"

interface DocExampleGridProps {
	children: React.ReactNode
	columns?: 2 | 3
	className?: string
}

export function DocExampleGrid({ children, columns = 2, className }: DocExampleGridProps) {
	return (
		<div
			className={cn(
				"grid gap-6",
				columns === 2 && "sm:grid-cols-2",
				columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
				className
			)}
		>
			{children}
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add components/features/docs/doc-example-grid.tsx
git commit -m "feat(docs): add DocExampleGrid for side-by-side examples"
```

---

### Task 8: Create DocHero component

**Files:**
- Create: `components/features/docs/doc-hero.tsx`

**Context:** Prominent full-width preview at top of doc pages showing the component's primary use case. No code — just the visual.

**Step 1: Implement DocHero**

```tsx
import { cn } from "@/lib/utils"

interface DocHeroProps {
	children: React.ReactNode
	className?: string
}

export function DocHero({ children, className }: DocHeroProps) {
	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-xl border border-edge bg-raised/50 px-8 py-12",
				className
			)}
		>
			{children}
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add components/features/docs/doc-hero.tsx
git commit -m "feat(docs): add DocHero for prominent component showcase"
```

---

### Task 9: Create DocPropsTable component

**Files:**
- Create: `components/features/docs/doc-props-table.tsx`

**Context:** Improved props table with required badges, optional group headings, and better visual hierarchy. Replaces `PropsTable`.

**Step 1: Implement DocPropsTable**

```tsx
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export interface DocProp {
	name: string
	type: string
	default?: string
	description: string
	required?: boolean
}

export interface DocPropGroup {
	title: string
	props: DocProp[]
}

interface DocPropsTableProps {
	props?: DocProp[]
	groups?: DocPropGroup[]
	className?: string
}

function PropsRows({ props }: { props: DocProp[] }) {
	return (
		<>
			{props.map((prop) => (
				<tr key={prop.name} className="border-b border-edge last:border-0">
					<td className="py-2.5 pr-4 align-top">
						<div className="flex items-center gap-2">
							<code className="text-[13px] font-semibold text-fg">{prop.name}</code>
							{prop.required && (
								<Badge variant="fill" tone="caution" size="sm">required</Badge>
							)}
						</div>
					</td>
					<td className="py-2.5 pr-4 align-top">
						<code className="text-xs text-fg-muted font-mono">{prop.type}</code>
					</td>
					<td className="py-2.5 pr-4 align-top">
						{prop.default ? (
							<code className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono text-fg-muted">
								{prop.default}
							</code>
						) : (
							<span className="text-xs text-fg-subtle">—</span>
						)}
					</td>
					<td className="py-2.5 align-top text-[13px] text-fg-muted">{prop.description}</td>
				</tr>
			))}
		</>
	)
}

export function DocPropsTable({ props, groups, className }: DocPropsTableProps) {
	return (
		<div className={cn("overflow-x-auto", className)}>
			<table className="w-full text-sm">
				<thead>
					<tr className="border-b border-edge">
						<th className="py-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">Prop</th>
						<th className="py-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">Type</th>
						<th className="py-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">Default</th>
						<th className="py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">Description</th>
					</tr>
				</thead>
				<tbody>
					{props && <PropsRows props={props} />}
					{groups?.map((group) => (
						<React.Fragment key={group.title}>
							<tr>
								<td colSpan={4} className="pt-6 pb-2">
									<span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
										{group.title}
									</span>
								</td>
							</tr>
							<PropsRows props={group.props} />
						</React.Fragment>
					))}
				</tbody>
			</table>
		</div>
	)
}
```

Note: Check how `Badge` accepts `variant`, `tone`, and `size` props. Read `components/ui/badge.tsx` before implementing — adapt the Badge usage to match existing API. If Badge doesn't support `tone="caution"` or `variant="fill"`, use a simple styled `<span>` instead:

```tsx
<span className="rounded-full bg-caution/15 px-1.5 py-0.5 text-[10px] font-semibold text-caution">
	required
</span>
```

**Step 2: Commit**

```bash
git add components/features/docs/doc-props-table.tsx
git commit -m "feat(docs): add DocPropsTable with required badges and groups"
```

---

### Task 10: Create DocDoDont component

**Files:**
- Create: `components/features/docs/doc-do-dont.tsx`

**Context:** Side-by-side Do/Don't pattern for best practices. Green "Do" / red "Don't" with icons and preview slots.

**Step 1: Implement DocDoDont**

```tsx
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocDoDontProps {
	doExample: React.ReactNode
	doText: string
	dontExample: React.ReactNode
	dontText: string
	className?: string
}

export function DocDoDont({ doExample, doText, dontExample, dontText, className }: DocDoDontProps) {
	return (
		<div className={cn("grid gap-4 sm:grid-cols-2", className)}>
			{/* Do */}
			<div className="space-y-3">
				<div className="rounded-lg border border-edge bg-surface p-6">
					{doExample}
				</div>
				<div className="flex items-start gap-2">
					<div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-positive/15">
						<Check className="size-3 text-positive" />
					</div>
					<p className="text-[13px] text-fg-muted">{doText}</p>
				</div>
			</div>

			{/* Don't */}
			<div className="space-y-3">
				<div className="rounded-lg border border-edge bg-surface p-6">
					{dontExample}
				</div>
				<div className="flex items-start gap-2">
					<div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-negative/15">
						<X className="size-3 text-negative" />
					</div>
					<p className="text-[13px] text-fg-muted">{dontText}</p>
				</div>
			</div>
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add components/features/docs/doc-do-dont.tsx
git commit -m "feat(docs): add DocDoDont for best practices patterns"
```

---

### Task 11: Create DocTokens component

**Files:**
- Create: `components/features/docs/doc-tokens.tsx`

**Context:** Shows design tokens with inline color swatches. Token name + visual swatch for colors, or just name + value for non-color tokens.

**Step 1: Implement DocTokens**

```tsx
import { cn } from "@/lib/utils"

export interface DocToken {
	name: string
	/** CSS variable or class name */
	value?: string
	description?: string
	/** Show as color swatch */
	color?: boolean
}

interface DocTokensProps {
	tokens: DocToken[]
	className?: string
}

export function DocTokens({ tokens, className }: DocTokensProps) {
	return (
		<div className={cn("grid gap-2", className)}>
			{tokens.map((token) => (
				<div
					key={token.name}
					className="flex items-center gap-3 rounded-lg border border-edge px-3 py-2"
				>
					{token.color && token.value && (
						<div
							className="size-5 shrink-0 rounded border border-edge"
							style={{ backgroundColor: token.value }}
						/>
					)}
					<code className="text-[13px] font-medium text-fg">{token.name}</code>
					{token.description && (
						<span className="text-[13px] text-fg-muted">— {token.description}</span>
					)}
				</div>
			))}
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add components/features/docs/doc-tokens.tsx
git commit -m "feat(docs): add DocTokens with visual swatches"
```

---

### Task 12: Create DocRelated component

**Files:**
- Create: `components/features/docs/doc-related.tsx`

**Context:** Grid of compact cards linking to related components. Simpler than full ComponentCard.

**Step 1: Implement DocRelated**

```tsx
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface DocRelatedItem {
	title: string
	href: string
	description: string
}

interface DocRelatedProps {
	items: DocRelatedItem[]
	className?: string
}

export function DocRelated({ items, className }: DocRelatedProps) {
	return (
		<div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className="group rounded-lg border border-edge px-4 py-3 transition-colors hover:bg-raised/50"
				>
					<p className="text-sm font-medium text-fg group-hover:text-brand transition-colors">
						{item.title}
					</p>
					<p className="mt-0.5 text-xs text-fg-muted line-clamp-1">{item.description}</p>
				</Link>
			))}
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add components/features/docs/doc-related.tsx
git commit -m "feat(docs): add DocRelated grid component"
```

---

### Task 13: Update barrel export

**Files:**
- Modify: `components/features/docs/index.ts`

**Step 1: Update exports to include all new components**

Replace contents with:

```ts
export * from "./component-card"
export * from "./doc-page"
export * from "./doc-section"
export * from "./doc-toc"
export * from "./doc-hero"
export * from "./doc-example"
export * from "./doc-example-client"
export * from "./doc-example-grid"
export * from "./doc-props-table"
export * from "./doc-do-dont"
export * from "./doc-tokens"
export * from "./doc-related"
```

Note: Keep `component-card` (used by category pages). Remove `component-example` and `props-table` exports — they're replaced but keep files until all pages migrated.

**Step 2: Commit**

```bash
git add components/features/docs/index.ts
git commit -m "feat(docs): update barrel exports with new doc components"
```

---

### Task 14: Migrate Button page as reference implementation

**Files:**
- Modify: `app/(frame)/components/ui/button/page.tsx`

**Context:** This is the reference migration. All subsequent pages follow this pattern. Key changes:
1. Remove `"use client"` — page becomes a Server Component
2. Replace `<Page>` + raw sections with `<DocPage>` + `<DocSection>`
3. Replace `<ComponentExample>` with `<DocExample>` (async Shiki)
4. Add `<DocHero>` at top
5. Replace `<PropsTable>` with `<DocPropsTable>`
6. Add `<DocDoDont>` for best practices
7. Standardize all tokens to new names

**Step 1: Rewrite the Button page**

Read the current `app/(frame)/components/ui/button/page.tsx` and `components/ui/badge.tsx` (to verify Badge API for DocPropsTable).

Rewrite to this structure:

```tsx
import { Page } from "@/components/ui/page"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocExampleGrid } from "@/components/features/docs/doc-example-grid"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { DocDoDont } from "@/components/features/docs/doc-do-dont"
import { Mail, ChevronRight, Plus } from "lucide-react"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
]

const buttonProps: DocProp[] = [
	{ name: "variant", type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"', default: '"default"', description: "The visual style of the button." },
	{ name: "size", type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', default: '"default"', description: "The size of the button." },
	{ name: "disabled", type: "boolean", default: "false", description: "Whether the button is disabled." },
	{ name: "children", type: "React.ReactNode", description: "The content of the button.", required: true },
]

export default function ButtonPage() {
	return (
		<DocPage
			title="Button"
			subtitle="Buttons trigger actions and events. Use them to submit forms, navigate, or perform operations."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="flex flex-wrap items-center gap-3">
					<Button>Primary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="ghost">Ghost</Button>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleGrid>
					<DocExample title="Variants" description="Visual styles for different contexts." code={`...`}>
						{/* ... preview ... */}
					</DocExample>
					<DocExample title="Sizes" description="Available sizes." code={`...`}>
						{/* ... preview ... */}
					</DocExample>
				</DocExampleGrid>

				<DocExample title="With Icons" description="Add icons for visual context." code={`...`}>
					{/* ... */}
				</DocExample>

				<DocExample title="Loading State" description="Show a spinner while processing." code={`...`}>
					{/* ... */}
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="Props">
				<DocPropsTable props={buttonProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<DocDoDont
					doExample={<Button>Save changes</Button>}
					doText="Use clear, action-oriented labels that describe what happens."
					dontExample={<Button>Submit</Button>}
					dontText="Avoid generic labels that don't communicate the action."
				/>
				<DocDoDont
					doExample={
						<div className="flex gap-2">
							<Button>Confirm</Button>
							<Button variant="outline">Cancel</Button>
						</div>
					}
					doText="Use one primary button per section. Secondary actions use outline variant."
					dontExample={
						<div className="flex gap-2">
							<Button>Save</Button>
							<Button>Confirm</Button>
							<Button>Apply</Button>
						</div>
					}
					dontText="Don't use multiple primary buttons — it creates confusion about the main action."
				/>
			</DocSection>
		</DocPage>
	)
}
```

Port all existing examples from the current page. Keep the exact same preview content but use new component wrappers. Remove `"use client"` directive.

**Step 2: Verify in browser**

Run: `npm run dev`
Navigate to: `http://localhost:3100/components/ui/button`
Verify: TOC visible on desktop, hero visible, code collapsible, Shiki highlighting works, Do/Don't renders.

**Step 3: Commit**

```bash
git add app/(frame)/components/ui/button/page.tsx
git commit -m "feat(docs): migrate Button page to new doc component system"
```

---

### Task 15: Migrate all remaining UI component pages (27 pages)

**Files:**
- Modify: All files in `app/(frame)/components/ui/*/page.tsx` except `button/page.tsx`

**Context:** Apply the same migration pattern from Task 14. For each page:
1. Remove `"use client"`
2. Replace `Page` → `DocPage` with `toc` prop
3. Replace `<section>` + `<h2>` → `<DocSection>`
4. Replace `<ComponentExample>` → `<DocExample>`
5. Replace `<PropsTable>` → `<DocPropsTable>`
6. Standardize tokens: `text-muted-foreground` → `text-fg-muted`, `bg-muted` → `bg-raised`
7. Add `DocHero` with the component's primary use case
8. Convert "Best Practices" bullet lists into `<DocDoDont>` where applicable (keep as bullets if no visual Do/Don't makes sense)
9. Convert "Related Components" bullets into `<DocRelated>` grid
10. Convert "Design Tokens" bullets into `<DocTokens>` with swatches where applicable

**Pages to migrate (in order — simple first, complex last):**
1. `label/page.tsx`
2. `text/page.tsx`
3. `badge/page.tsx`
4. `avatar/page.tsx`
5. `skeleton/page.tsx`
6. `tooltip/page.tsx`
7. `switch/page.tsx`
8. `checkbox/page.tsx`
9. `input/page.tsx`
10. `textarea/page.tsx`
11. `select/page.tsx`
12. `tabs/page.tsx`
13. `alert/page.tsx`
14. `banner/page.tsx`
15. `breadcrumb/page.tsx`
16. `property/page.tsx`
17. `button-group/page.tsx`
18. `popover/page.tsx`
19. `dropdown-menu/page.tsx`
20. `menu/page.tsx`
21. `sheet/page.tsx`
22. `dialog/page.tsx`
23. `confirmation-dialog/page.tsx`
24. `command/page.tsx`
25. `table/page.tsx`
26. `phone-input/page.tsx`
27. `frame-panel/page.tsx`
28. `data-table/page.tsx`

Batch these in groups of 5-7 pages per commit.

**Step 1: Migrate pages 1-7** (simple components)

Follow Button pattern exactly. These have few examples and simple previews.

Run: `npm run dev` and spot-check 2-3 pages in browser.

Commit: `git commit -m "feat(docs): migrate label, text, badge, avatar, skeleton, tooltip, switch to new doc system"`

**Step 2: Migrate pages 8-14** (form + feedback components)

These have more examples. Pay attention to interactive demos (checkboxes, inputs need user interaction).

Commit: `git commit -m "feat(docs): migrate checkbox, input, textarea, select, tabs, alert, banner to new doc system"`

**Step 3: Migrate pages 15-21** (navigation + overlays)

These have trigger-based demos (popovers, dialogs, menus). Keep the interactive trigger patterns.

Commit: `git commit -m "feat(docs): migrate breadcrumb, property, button-group, popover, dropdown-menu, menu, sheet to new doc system"`

**Step 4: Migrate pages 22-28** (complex components)

These are the most complex. Dialog, Command, DataTable have many examples and sub-component props. Use `DocPropsTable` with `groups` for multi-part components.

Commit: `git commit -m "feat(docs): migrate dialog, confirmation-dialog, command, table, phone-input, frame-panel, data-table to new doc system"`

---

### Task 16: Migrate category pages and layout component pages

**Files:**
- Modify: `app/(frame)/components/forms/page.tsx`
- Modify: `app/(frame)/components/layout/page.tsx`
- Modify: `app/(frame)/components/feedback/page.tsx` (if exists)
- Modify: All other category index pages
- Modify: Layout component pages in `app/(frame)/components/layout/*/page.tsx`

**Context:** Category pages use `ComponentSection` (cards grid). They don't need the full DocPage treatment — just standardize tokens and optionally add a short intro paragraph.

Layout component pages (box, grid, inline-stack, etc.) follow the same migration pattern as UI components.

**Step 1: Migrate category pages**

Keep using `<Page>` and `<ComponentSection>` but standardize tokens.

**Step 2: Migrate layout component pages**

Same pattern as Task 15 — `DocPage` + `DocSection` + `DocExample`.

**Step 3: Commit**

```bash
git commit -m "feat(docs): migrate category and layout component pages to new doc system"
```

---

### Task 17: Cleanup old components

**Files:**
- Delete: `components/features/docs/component-example.tsx`
- Delete: `components/features/docs/props-table.tsx`
- Modify: `components/features/docs/index.ts` (remove old exports)

**Step 1: Verify no imports remain**

Run: `grep -r "ComponentExample\|PropsTable" app/ components/ --include="*.tsx" --include="*.ts"`

If any files still import old components, migrate them first.

**Step 2: Delete old files and update exports**

```bash
rm components/features/docs/component-example.tsx
rm components/features/docs/props-table.tsx
```

Update `index.ts` to remove old exports.

**Step 3: Verify build**

Run: `npm run build`
Expected: Clean build with no import errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore(docs): remove legacy ComponentExample and PropsTable"
```

---

## Execution Order

```
Task 1   Install Shiki
Task 2   Shiki utility
Task 3   DocSection          ─┐
Task 4   DocToc               │ Can be parallel
Task 7   DocExampleGrid       │
Task 8   DocHero              │
Task 10  DocDoDont            │
Task 11  DocTokens            │
Task 12  DocRelated          ─┘
Task 5   DocPage             (depends on Task 4)
Task 6   DocExample          (depends on Task 2)
Task 9   DocPropsTable       (check Badge API first)
Task 13  Barrel export       (depends on all components)
Task 14  Button migration    (reference — do this carefully)
Task 15  All UI pages        (batch after Button validated)
Task 16  Category + layout   (after UI pages)
Task 17  Cleanup             (last)
```
