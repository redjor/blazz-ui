import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { NextResponse } from "next/server"

const FILE_MAP: Record<string, string> = {
	soul: "SOUL.md",
	style: "STYLE.md",
	skill: "SKILL.md",
	context: "CONTEXT.md",
}

function agentDir(slug: string) {
	return join(process.cwd(), "agents", slug)
}

async function loadFile(slug: string, key: string): Promise<string> {
	try {
		return await readFile(join(agentDir(slug), FILE_MAP[key]!), "utf-8")
	} catch {
		return ""
	}
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params

	const [soul, style, skill, context] = await Promise.all([loadFile(slug, "soul"), loadFile(slug, "style"), loadFile(slug, "skill"), loadFile(slug, "context")])

	return NextResponse.json({ soul, style, skill, context })
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const body = await request.json()
	const { file, content } = body as { file: string; content: string }

	if (!FILE_MAP[file]) {
		return NextResponse.json({ error: "Invalid file key" }, { status: 400 })
	}

	const filePath = join(agentDir(slug), FILE_MAP[file]!)
	await writeFile(filePath, content, "utf-8")

	return NextResponse.json({ ok: true })
}
