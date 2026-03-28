"use client"

import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { LogoGroupDemo, ModelSelectorDemo, ModelSelectorGroupedDemo } from "./model-selector-demos"

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

const highlightedPromise = highlightExamples(examples as any)

const toc = [{ id: "examples", title: "Examples" }]

export default function ModelSelectorPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Model Selector" subtitle="A searchable dialog for selecting AI models with provider logos and grouped categories." toc={toc}>
			<DocHero>
				<ModelSelectorDemo />
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Basic Model Selector" description="A dialog with search input and flat list of models." code={examples[0].code} highlightedCode={html("basic")}>
					<ModelSelectorDemo />
				</DocExampleClient>

				<DocExampleClient title="Grouped by Provider" description="Models organized by provider with separate group headings." code={examples[1].code} highlightedCode={html("grouped")}>
					<ModelSelectorGroupedDemo />
				</DocExampleClient>

				<DocExampleClient title="Logo Group" description="Stack multiple provider logos in a compact overlapping layout." code={examples[2].code} highlightedCode={html("logo-group")}>
					<LogoGroupDemo />
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
