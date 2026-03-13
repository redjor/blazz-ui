"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Label } from "@blazz/ui/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"

interface UserMetadataEditorProps {
	metadata: Record<string, any>
	onSave: (metadata: Record<string, any>) => void
	label: string
}

export function UserMetadataEditor({ metadata, onSave, label }: UserMetadataEditorProps) {
	const [value, setValue] = useState(JSON.stringify(metadata, null, 2))
	const [error, setError] = useState<string | null>(null)

	const handleSave = () => {
		try {
			const parsed = JSON.parse(value)
			setError(null)
			onSave(parsed)
			toast.success("Metadata updated", {
				description: `${label} has been updated successfully.`,
			})
		} catch (_err) {
			setError("Invalid JSON format")
			toast.error("Invalid JSON", {
				description: "Please enter valid JSON format.",
			})
		}
	}

	const handleChange = (newValue: string) => {
		setValue(newValue)
		setError(null)
	}

	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<textarea
				className="w-full min-h-[150px] p-3 text-sm font-mono border rounded-md bg-raised/50 focus:outline-none focus:ring-2 focus:ring-brand"
				value={value}
				onChange={(e) => handleChange(e.target.value)}
				placeholder={`{\n  "key": "value"\n}`}
			/>
			{error && <p className="text-sm text-negative">{error}</p>}
			<Button onClick={handleSave} size="sm">
				Save {label.toLowerCase()}
			</Button>
		</div>
	)
}
