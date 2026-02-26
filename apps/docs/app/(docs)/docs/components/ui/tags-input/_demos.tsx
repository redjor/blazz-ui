"use client"

import * as React from "react"
import { TagsInput } from "@blazz/ui/components/ui/tags-input"
import { Label } from "@blazz/ui/components/ui/label"

export function TagsInputDefaultDemo() {
	const [tags, setTags] = React.useState(["React", "TypeScript"])

	return (
		<TagsInput
			tags={tags}
			onTagsChange={setTags}
			placeholder="Add a tag..."
			className="max-w-sm"
		/>
	)
}

export function TagsInputWithSuggestionsDemo() {
	const [tags, setTags] = React.useState<string[]>(["Design"])

	return (
		<TagsInput
			tags={tags}
			onTagsChange={setTags}
			suggestions={[
				"Design",
				"Development",
				"Marketing",
				"Product",
				"Engineering",
				"Sales",
				"Support",
			]}
			placeholder="Add a skill..."
			className="max-w-sm"
		/>
	)
}

export function TagsInputMaxTagsDemo() {
	const [tags, setTags] = React.useState(["Important", "Urgent"])

	return (
		<div className="max-w-sm space-y-2">
			<Label>Tags (max 3)</Label>
			<TagsInput
				tags={tags}
				onTagsChange={setTags}
				maxTags={3}
				placeholder="Add up to 3 tags..."
			/>
		</div>
	)
}

export function TagsInputWithLabelDemo() {
	const [tags, setTags] = React.useState<string[]>([])

	return (
		<div className="max-w-sm space-y-2">
			<Label>Categories</Label>
			<TagsInput
				tags={tags}
				onTagsChange={setTags}
				suggestions={["Frontend", "Backend", "DevOps", "Mobile", "AI/ML"]}
				placeholder="Add categories..."
			/>
		</div>
	)
}
