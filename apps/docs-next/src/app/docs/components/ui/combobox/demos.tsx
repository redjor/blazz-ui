"use client"

import { Combobox } from "@blazz/ui/components/ui/combobox"
import { Label } from "@blazz/ui/components/ui/label"
import { Flag, Globe } from "lucide-react"
import * as React from "react"

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
	{ value: "react", label: "React" },
	{ value: "vue", label: "Vue" },
	{ value: "angular", label: "Angular" },
	{ value: "svelte", label: "Svelte" },
	{ value: "solid", label: "Solid" },
	{ value: "nextjs", label: "Next.js" },
]

const teamMembers = [
	{ value: "alex", label: "Alex Johnson", description: "Software Engineer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" },
	{ value: "sarah", label: "Sarah Chen", description: "Product Manager", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face" },
	{ value: "michael", label: "Michael Rodriguez", description: "UX Designer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" },
	{ value: "emma", label: "Emma Wilson", description: "Technical Lead", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face" },
	{ value: "david", label: "David Kim", description: "CTO", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face" },
]

const priorityOptions = [
	{ value: "urgent", label: "Urgent", icon: <Flag fill="currentColor" className="size-3.5 shrink-0 text-destructive" /> },
	{ value: "high", label: "High", icon: <Flag fill="currentColor" className="size-3.5 shrink-0 text-orange-500" /> },
	{ value: "normal", label: "Normal", icon: <Flag className="size-3.5 shrink-0 text-fg-muted" /> },
	{ value: "low", label: "Low", icon: <Flag className="size-3.5 shrink-0 text-fg-muted opacity-40" /> },
]

export function ComboboxDefaultDemo() {
	const [value, setValue] = React.useState("")
	return <Combobox value={value} onValueChange={setValue} options={fruits} placeholder="Select a fruit..." searchPlaceholder="Search fruits..." className="w-[240px]" />
}

export function ComboboxWithIconDemo() {
	const [value, setValue] = React.useState("")
	return <Combobox value={value} onValueChange={setValue} options={languages} placeholder="Select language..." searchPlaceholder="Search languages..." icon={<Globe className="h-4 w-4 text-fg-muted" />} className="w-[240px]" />
}

export function ComboboxWithLabelDemo() {
	const [value, setValue] = React.useState("")
	return (
		<div className="w-[240px] space-y-2">
			<Label>Framework</Label>
			<Combobox value={value} onValueChange={setValue} options={frameworks} placeholder="Select framework..." searchPlaceholder="Search frameworks..." />
		</div>
	)
}

export function ComboboxCustomEmptyDemo() {
	const [value, setValue] = React.useState("")
	return <Combobox value={value} onValueChange={setValue} options={fruits} placeholder="Select a fruit..." searchPlaceholder="Type to search..." emptyMessage="No fruit matches your search." className="w-[240px]" />
}

export function ComboboxIconTriggerDemo() {
	const [value, setValue] = React.useState("normal")
	return <Combobox value={value} onValueChange={(v) => setValue(v || "normal")} options={priorityOptions} iconTrigger icon={<Flag className="size-3.5 text-fg-muted" />} />
}

export function ComboboxTeamMemberDemo() {
	const [value, setValue] = React.useState("alex")
	return <Combobox value={value} onValueChange={setValue} options={teamMembers} placeholder="Select a member..." searchPlaceholder="Search members..." className="w-[260px]" />
}
