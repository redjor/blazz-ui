import { NextResponse } from "next/server"

export async function GET() {
	const token = process.env.VERCEL_TOKEN
	const projectId = process.env.VERCEL_PROJECT_ID

	if (!token || !projectId) {
		return NextResponse.json(
			{ error: "VERCEL_TOKEN ou VERCEL_PROJECT_ID manquant dans les variables d'environnement" },
			{ status: 500 },
		)
	}

	const res = await fetch(
		`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=20`,
		{ headers: { Authorization: `Bearer ${token}` } },
	)

	if (!res.ok) {
		const body = await res.text()
		return NextResponse.json(
			{ error: `Vercel API ${res.status}: ${body}` },
			{ status: res.status },
		)
	}

	const data = await res.json()
	return NextResponse.json({ deployments: data.deployments ?? [] })
}
