"use client"

import { useState } from "react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { Button } from "@blazz/ui/components/ui/button"
import {
	ModelSelector,
	ModelSelectorTrigger,
	ModelSelectorContent,
	ModelSelectorInput,
	ModelSelectorList,
	ModelSelectorEmpty,
	ModelSelectorGroup,
	ModelSelectorItem,
	ModelSelectorLogo,
	ModelSelectorLogoGroup,
	ModelSelectorName,
} from "@blazz/ui/components/ai/tools/model-selector"

const toc = [{ id: "examples", title: "Examples" }]

const models = [
	{ id: "gpt-4o", name: "GPT-4o", provider: "openai" as const },
	{ id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "anthropic" as const },
	{ id: "gemini-pro", name: "Gemini Pro", provider: "google" as const },
	{ id: "llama-3.1-70b", name: "Llama 3.1 70B", provider: "groq" as const },
	{ id: "mistral-large", name: "Mistral Large", provider: "mistral" as const },
]

function ModelSelectorDemo() {
	const [open, setOpen] = useState(false)

	return (
		<ModelSelector open={open} onOpenChange={setOpen}>
			<ModelSelectorTrigger render={<Button variant="outline" />}>
				Select a model
			</ModelSelectorTrigger>
			<ModelSelectorContent>
				<ModelSelectorInput placeholder="Search models..." />
				<ModelSelectorList>
					<ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
					<ModelSelectorGroup heading="Available Models">
						{models.map((model) => (
							<ModelSelectorItem
								key={model.id}
								value={model.id}
								onSelect={() => setOpen(false)}
							>
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

function ModelSelectorGroupedDemo() {
	const [open, setOpen] = useState(false)

	return (
		<ModelSelector open={open} onOpenChange={setOpen}>
			<ModelSelectorTrigger render={<Button variant="outline" />}>
				Choose model
			</ModelSelectorTrigger>
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

function LogoGroupDemo() {
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

export default function ModelSelectorPage() {
	return (
		<DocPage
			title="Model Selector"
			subtitle="A searchable dialog for selecting AI models with provider logos and grouped categories."
			toc={toc}
		>
			<DocHero>
				<ModelSelectorDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic Model Selector"
					description="A dialog with search input and flat list of models."
					code={`<ModelSelector open={open} onOpenChange={setOpen}>
  <ModelSelectorTrigger asChild>
    <Button variant="outline">Select a model</Button>
  </ModelSelectorTrigger>
  <ModelSelectorContent>
    <ModelSelectorInput placeholder="Search..." />
    <ModelSelectorList>
      <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
      <ModelSelectorGroup heading="Models">
        <ModelSelectorItem value="gpt-4o">
          <ModelSelectorLogo provider="openai" />
          <ModelSelectorName>GPT-4o</ModelSelectorName>
        </ModelSelectorItem>
      </ModelSelectorGroup>
    </ModelSelectorList>
  </ModelSelectorContent>
</ModelSelector>`}
				>
					<ModelSelectorDemo />
				</DocExample>

				<DocExample
					title="Grouped by Provider"
					description="Models organized by provider with separate group headings."
					code={`<ModelSelectorGroup heading="OpenAI">
  <ModelSelectorItem value="gpt-4o">
    <ModelSelectorLogo provider="openai" />
    <ModelSelectorName>GPT-4o</ModelSelectorName>
  </ModelSelectorItem>
</ModelSelectorGroup>
<ModelSelectorGroup heading="Anthropic">
  ...
</ModelSelectorGroup>`}
				>
					<ModelSelectorGroupedDemo />
				</DocExample>

				<DocExample
					title="Logo Group"
					description="Stack multiple provider logos in a compact overlapping layout."
					code={`<ModelSelectorLogoGroup>
  <ModelSelectorLogo provider="openai" />
  <ModelSelectorLogo provider="anthropic" />
  <ModelSelectorLogo provider="google" />
</ModelSelectorLogoGroup>`}
				>
					<LogoGroupDemo />
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
