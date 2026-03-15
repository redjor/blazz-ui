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
import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "basic",
		code: `<ModelSelector open={open} onOpenChange={setOpen}>
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
</ModelSelector>`,
	},
	{
		key: "grouped",
		code: `<ModelSelectorGroup heading="OpenAI">
  <ModelSelectorItem value="gpt-4o">
    <ModelSelectorLogo provider="openai" />
    <ModelSelectorName>GPT-4o</ModelSelectorName>
  </ModelSelectorItem>
</ModelSelectorGroup>
<ModelSelectorGroup heading="Anthropic">
  ...
</ModelSelectorGroup>`,
	},
	{
		key: "logo-group",
		code: `<ModelSelectorLogoGroup>
  <ModelSelectorLogo provider="openai" />
  <ModelSelectorLogo provider="anthropic" />
  <ModelSelectorLogo provider="google" />
</ModelSelectorLogoGroup>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/model-selector")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ModelSelectorPage,
})

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

function ModelSelectorPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Basic Model Selector"
					description="A dialog with search input and flat list of models."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<ModelSelectorDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Grouped by Provider"
					description="Models organized by provider with separate group headings."
					code={examples[1].code}
					highlightedCode={html("grouped")}
				>
					<ModelSelectorGroupedDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Logo Group"
					description="Stack multiple provider logos in a compact overlapping layout."
					code={examples[2].code}
					highlightedCode={html("logo-group")}
				>
					<LogoGroupDemo />
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
