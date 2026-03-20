# Deployments Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a page to the ops app that displays the 20 latest Vercel deployments for a configured project.

**Architecture:** Client-side fetch to Vercel REST API. Token and project ID stored in Convex settings KV. No new Convex tables. Feature-flagged behind `deployments`.

**Tech Stack:** Vercel API v6, Convex settings (existing), @blazz/ui + @blazz/pro components, date-fns, lucide-react

---

### Task 1: Add feature flag + sidebar entry

**Files:**
- Modify: `apps/ops/lib/features.ts`
- Modify: `apps/ops/components/ops-frame.tsx`

**Step 1: Add `deployments` feature flag**

In `apps/ops/lib/features.ts`, add `deployments: true` to the `features` object (after `finances`).

Add to `routeMap`:
```ts
"/deployments": "deployments",
```

**Step 2: Add sidebar nav item**

In `apps/ops/components/ops-frame.tsx`:

1. Add `Rocket` to lucide-react imports
2. In the Admin group, add before Packages:
```ts
{ title: "Deployments", url: "/deployments", icon: Rocket, flag: "deployments" },
```

**Step 3: Commit**

```bash
git add apps/ops/lib/features.ts apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add deployments feature flag and sidebar entry"
```

---

### Task 2: Create deployments page (server + client shell)

**Files:**
- Create: `apps/ops/app/(main)/deployments/page.tsx`
- Create: `apps/ops/app/(main)/deployments/_client.tsx`

**Step 1: Create server page**

`apps/ops/app/(main)/deployments/page.tsx`:
```tsx
import type { Metadata } from "next"
import DeploymentsPageClient from "./_client"

export const metadata: Metadata = {
	title: "Deployments",
}

export default function DeploymentsPage() {
	return <DeploymentsPageClient />
}
```

**Step 2: Create client page with config check + fetch + 4 states**

`apps/ops/app/(main)/deployments/_client.tsx`:
```tsx
"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { AlertCircle, GitBranch, RefreshCw, Rocket, Settings } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"

interface VercelDeployment {
	uid: string
	name: string
	url: string
	created: number
	ready?: number
	state: "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED"
	meta?: {
		githubCommitMessage?: string
		githubCommitRef?: string
	}
}

const stateConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
	READY: { label: "Ready", variant: "default" },
	ERROR: { label: "Error", variant: "destructive" },
	BUILDING: { label: "Building", variant: "secondary" },
	INITIALIZING: { label: "Init", variant: "secondary" },
	QUEUED: { label: "Queued", variant: "outline" },
	CANCELED: { label: "Canceled", variant: "outline" },
}

export default function DeploymentsPageClient() {
	const settings = useQuery(api.settings.list)
	const token = settings?.vercel_token
	const projectId = settings?.vercel_project_id

	const [deployments, setDeployments] = useState<VercelDeployment[] | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const fetchDeployments = useCallback(async () => {
		if (!token || !projectId) return
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(
				`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=20`,
				{ headers: { Authorization: `Bearer ${token}` } },
			)
			if (!res.ok) {
				const body = await res.json().catch(() => ({}))
				throw new Error(body?.error?.message || `Vercel API error ${res.status}`)
			}
			const data = await res.json()
			setDeployments(data.deployments)
		} catch (err) {
			setError(err instanceof Error ? err.message : "Erreur inconnue")
		} finally {
			setLoading(false)
		}
	}, [token, projectId])

	useEffect(() => {
		fetchDeployments()
	}, [fetchDeployments])

	// Settings not loaded yet
	if (settings === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title="Deployments" />
				<BlockStack gap="300">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-16 w-full rounded-lg" />
					))}
				</BlockStack>
			</BlockStack>
		)
	}

	// Token or project ID not configured
	if (!token || !projectId) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title="Deployments" />
				<BlockStack gap="300" className="items-center py-12 text-center">
					<Settings className="h-10 w-10 text-fg-muted mb-3" />
					<p className="text-sm text-fg-muted">
						Configure ton token Vercel et project ID dans les paramètres.
					</p>
					<p className="text-xs text-fg-muted">
						Clés : <code className="font-mono">vercel_token</code> et{" "}
						<code className="font-mono">vercel_project_id</code>
					</p>
					<Button variant="outline" size="sm" className="mt-3" asChild>
						<Link href="/settings">Paramètres</Link>
					</Button>
				</BlockStack>
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader
				title="Deployments"
				description="Derniers déploiements Vercel"
				actions={
					<Button variant="outline" size="sm" onClick={fetchDeployments} disabled={loading}>
						<RefreshCw className={loading ? "animate-spin" : ""} />
						Refresh
					</Button>
				}
			/>

			{/* Error state */}
			{error && (
				<BlockStack gap="200" className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
					<InlineStack gap="200" blockAlign="center">
						<AlertCircle className="h-4 w-4 text-destructive" />
						<p className="text-sm text-destructive">{error}</p>
					</InlineStack>
				</BlockStack>
			)}

			{/* Loading state */}
			{loading && !deployments && (
				<BlockStack gap="300">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-16 w-full rounded-lg" />
					))}
				</BlockStack>
			)}

			{/* Empty state */}
			{deployments && deployments.length === 0 && (
				<BlockStack className="items-center py-12 text-center">
					<Rocket className="h-10 w-10 text-fg-muted mb-3" />
					<p className="text-sm text-fg-muted">Aucun déploiement trouvé.</p>
				</BlockStack>
			)}

			{/* Success state */}
			{deployments && deployments.length > 0 && (
				<BlockStack gap="200">
					{deployments.map((d) => {
						const config = stateConfig[d.state] ?? { label: d.state, variant: "outline" as const }
						const buildDuration = d.ready && d.created ? Math.round((d.ready - d.created) / 1000) : null
						const branch = d.meta?.githubCommitRef
						const message = d.meta?.githubCommitMessage

						return (
							<InlineStack
								key={d.uid}
								gap="300"
								align="space-between"
								blockAlign="center"
								className="rounded-lg border border-edge bg-surface-3 px-4 py-3"
							>
								<BlockStack gap="100" className="min-w-0 flex-1">
									<InlineStack gap="200" blockAlign="center">
										<Badge variant={config.variant} className="shrink-0 text-xs">
											{config.label}
										</Badge>
										{branch && (
											<InlineStack gap="100" blockAlign="center" className="text-xs text-fg-muted">
												<GitBranch className="h-3 w-3" />
												<span className="font-mono">{branch}</span>
											</InlineStack>
										)}
									</InlineStack>
									{message && (
										<p className="text-xs text-fg-muted truncate">{message}</p>
									)}
								</BlockStack>

								<BlockStack gap="050" className="shrink-0 text-right">
									<span className="text-xs text-fg-muted">
										{formatDistanceToNow(new Date(d.created), {
											addSuffix: true,
											locale: fr,
										})}
									</span>
									{buildDuration != null && (
										<span className="text-xs text-fg-muted/60 font-mono">
											{buildDuration}s
										</span>
									)}
								</BlockStack>
							</InlineStack>
						)
					})}
				</BlockStack>
			)}
		</BlockStack>
	)
}
```

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/deployments/
git commit -m "feat(ops): add deployments page with Vercel API integration"
```

---

### Task 3: Verify and fix

**Step 1: Run dev server**

```bash
pnpm dev:ops
```

Navigate to `/deployments`. Verify:
- Without settings → shows config message with link to /settings
- With `vercel_token` + `vercel_project_id` in settings → shows deployments list
- Refresh button works
- Error state shows if token is invalid

**Step 2: Fix any issues found**

**Step 3: Commit fixes if any**

```bash
git commit -m "fix(ops): polish deployments page"
```
