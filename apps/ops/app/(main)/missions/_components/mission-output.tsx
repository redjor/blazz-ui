"use client"

import { Box } from "@blazz/ui/components/ui/box"

interface MissionOutputProps {
	output?: string | null
}

export function MissionOutput({ output }: MissionOutputProps) {
	if (!output) {
		return <Box className="py-8 text-center text-sm text-fg-muted">Aucun output pour cette mission.</Box>
	}

	return (
		<Box className="rounded-lg border border-edge bg-card p-4">
			<pre className="text-sm text-fg whitespace-pre-wrap break-words font-mono leading-relaxed">{output}</pre>
		</Box>
	)
}
