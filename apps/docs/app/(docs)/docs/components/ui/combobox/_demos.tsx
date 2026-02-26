"use client"

import * as React from "react"
import { Combobox } from "@blazz/ui/components/ui/combobox"
import { Label } from "@blazz/ui/components/ui/label"
import { Globe } from "lucide-react"

const fruits = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "cherry", label: "Cherry" },
	{ value: "grape", label: "Grape" },
	{ value: "mango", label: "Mango" },
	{ value: "orange", label: "Orange" },
	{ value: "pear", label: "Pear" },
	{ value: "strawberry", label: "Strawberry" },
]

const languages = [
	{ value: "en", label: "English" },
	{ value: "fr", label: "French" },
	{ value: "de", label: "German" },
	{ value: "es", label: "Spanish" },
	{ value: "pt", label: "Portuguese" },
	{ value: "ja", label: "Japanese" },
]

const frameworks = [
	{ value: "react", label: "React", suggested: true },
	{ value: "vue", label: "Vue" },
	{ value: "angular", label: "Angular" },
	{ value: "svelte", label: "Svelte", suggested: true },
	{ value: "solid", label: "Solid" },
	{ value: "nextjs", label: "Next.js", suggested: true },
]

export function ComboboxDefaultDemo() {
	const [value, setValue] = React.useState("")

	return (
		<Combobox
			value={value}
			onValueChange={setValue}
			options={fruits}
			placeholder="Select a fruit..."
			searchPlaceholder="Search fruits..."
			className="w-[240px]"
		/>
	)
}

export function ComboboxWithIconDemo() {
	const [value, setValue] = React.useState("")

	return (
		<Combobox
			value={value}
			onValueChange={setValue}
			options={languages}
			placeholder="Select language..."
			searchPlaceholder="Search languages..."
			icon={<Globe className="h-4 w-4 text-fg-muted" />}
			className="w-[240px]"
		/>
	)
}

export function ComboboxWithLabelDemo() {
	const [value, setValue] = React.useState("")

	return (
		<div className="w-[240px] space-y-2">
			<Label>Framework</Label>
			<Combobox
				value={value}
				onValueChange={setValue}
				options={frameworks}
				placeholder="Select framework..."
				searchPlaceholder="Search frameworks..."
			/>
		</div>
	)
}

export function ComboboxCustomEmptyDemo() {
	const [value, setValue] = React.useState("")

	return (
		<Combobox
			value={value}
			onValueChange={setValue}
			options={fruits}
			placeholder="Select a fruit..."
			searchPlaceholder="Type to search..."
			emptyMessage="No fruit matches your search."
			className="w-[240px]"
		/>
	)
}
