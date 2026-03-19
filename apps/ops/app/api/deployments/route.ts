import { NextResponse } from "next/server"

const BRANCHES = ["main", "develop"]

interface VercelDeployment {
	uid: string
	name: string
	url: string
	created: number
	ready?: number
	state: string
	target?: string | null
	meta?: {
		githubCommitMessage?: string
		githubCommitRef?: string
		githubCommitSha?: string
		githubCommitAuthorName?: string
	}
	creator?: {
		username?: string
	}
}

export async function GET() {
	const token = process.env.VERCEL_TOKEN
	const projectId = process.env.VERCEL_PROJECT_ID

	if (!token || !projectId) {
		return NextResponse.json(
			{ error: "VERCEL_TOKEN ou VERCEL_PROJECT_ID manquant" },
			{ status: 500 },
		)
	}

	const headers = { Authorization: `Bearer ${token}` }

	// Fetch recent deployments
	const res = await fetch(
		`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=50`,
		{ headers },
	)

	if (!res.ok) {
		const body = await res.text()
		return NextResponse.json(
			{ error: `Vercel API ${res.status}: ${body}` },
			{ status: res.status },
		)
	}

	const data = await res.json()
	const all: VercelDeployment[] = data.deployments ?? []

	// Find latest deployment per branch
	const latest: Record<string, VercelDeployment> = {}
	for (const d of all) {
		const branch = d.meta?.githubCommitRef
		if (branch && BRANCHES.includes(branch) && !latest[branch]) {
			latest[branch] = d
		}
	}

	// Fetch production domains from project
	let domains: string[] = []
	try {
		const domainsRes = await fetch(
			`https://api.vercel.com/v9/projects/${projectId}/domains`,
			{ headers },
		)
		if (domainsRes.ok) {
			const domainsData = await domainsRes.json()
			domains = (domainsData.domains ?? []).map((d: { name: string }) => d.name)
		}
	} catch {
		// ignore — domains are optional
	}

	return NextResponse.json({ branches: latest, domains })
}
