"use client"

import {
	ModelSelector,
	ModelSelectorContent,
	ModelSelectorEmpty,
	ModelSelectorGroup,
	ModelSelectorInput,
	ModelSelectorItem,
	ModelSelectorList,
	ModelSelectorLogo,
	ModelSelectorLogoGroup,
	ModelSelectorName,
	ModelSelectorTrigger,
} from "@blazz/pro/components/ai/tools/model-selector"
import { Button } from "@blazz/ui/components/ui/button"
import { useState } from "react"

const models = [
	{ id: "gpt-4o", name: "GPT-4o", provider: "openai" as const },
	{ id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "anthropic" as const },
	{ id: "gemini-pro", name: "Gemini Pro", provider: "google" as const },
	{ id: "llama-3.1-70b", name: "Llama 3.1 70B", provider: "groq" as const },
	{ id: "mistral-large", name: "Mistral Large", provider: "mistral" as const },
]

export function ModelSelectorDemo() {
	const [open, setOpen] = useState(false)
	return (
		<ModelSelector open={open} onOpenChange={setOpen}>
			<ModelSelectorTrigger render={<Button variant="outline" />}>Select a model</ModelSelectorTrigger>
			<ModelSelectorContent>
				<ModelSelectorInput placeholder="Search models..." />
				<ModelSelectorList>
					<ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
					<ModelSelectorGroup heading="Available Models">
						{models.map((model) => (
							<ModelSelectorItem key={model.id} value={model.id} onSelect={() => setOpen(false)}>
								<ModelSelectorLogo provider={model.provider} />
								<ModelSelectorName>{model.name}</ModelSelectorName>
							</ModelSelectorItem>
						))}
					</ModelSelectorGroup>
				</ModelSelectorList>
			</ModelSelectorContent>
		</ModelSelector>
	)
}

export function ModelSelectorGroupedDemo() {
	const [open, setOpen] = useState(false)
	return (
		<ModelSelector open={open} onOpenChange={setOpen}>
			<ModelSelectorTrigger render={<Button variant="outline" />}>Choose model</ModelSelectorTrigger>
			<ModelSelectorContent>
				<ModelSelectorInput placeholder="Search models..." />
				<ModelSelectorList>
					<ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
					<ModelSelectorGroup heading="OpenAI">
						<ModelSelectorItem value="gpt-4o" onSelect={() => setOpen(false)}>
							<ModelSelectorLogo provider="openai" />
							<ModelSelectorName>GPT-4o</ModelSelectorName>
						</ModelSelectorItem>
						<ModelSelectorItem value="gpt-4o-mini" onSelect={() => setOpen(false)}>
							<ModelSelectorLogo provider="openai" />
							<ModelSelectorName>GPT-4o Mini</ModelSelectorName>
						</ModelSelectorItem>
					</ModelSelectorGroup>
					<ModelSelectorGroup heading="Anthropic">
						<ModelSelectorItem value="claude-sonnet" onSelect={() => setOpen(false)}>
							<ModelSelectorLogo provider="anthropic" />
							<ModelSelectorName>Claude 3.5 Sonnet</ModelSelectorName>
						</ModelSelectorItem>
						<ModelSelectorItem value="claude-haiku" onSelect={() => setOpen(false)}>
							<ModelSelectorLogo provider="anthropic" />
							<ModelSelectorName>Claude 3.5 Haiku</ModelSelectorName>
						</ModelSelectorItem>
					</ModelSelectorGroup>
					<ModelSelectorGroup heading="Google">
						<ModelSelectorItem value="gemini-pro" onSelect={() => setOpen(false)}>
							<ModelSelectorLogo provider="google" />
							<ModelSelectorName>Gemini Pro</ModelSelectorName>
						</ModelSelectorItem>
					</ModelSelectorGroup>
				</ModelSelectorList>
			</ModelSelectorContent>
		</ModelSelector>
	)
}

export function LogoGroupDemo() {
	return (
		<div className="flex items-center gap-4">
			<ModelSelectorLogoGroup>
				<ModelSelectorLogo provider="openai" />
				<ModelSelectorLogo provider="anthropic" />
				<ModelSelectorLogo provider="google" />
			</ModelSelectorLogoGroup>
			<span className="text-sm text-fg-muted">3 providers available</span>
		</div>
	)
}
