// apps/docs/src/data/components/ai/reasoning.ts
import type { ComponentData } from "../../types"

export const chainOfThoughtData: ComponentData = {
	name: "ChainOfThought",
	category: "ai",
	description: "Collapsible chain-of-thought reasoning display with step-by-step progress, search results, and images.",
	docPath: "/docs/ai/reasoning/chain-of-thought",
	imports: {
		path: "@blazz/pro/components/ai/reasoning",
		named: ["ChainOfThought", "ChainOfThoughtHeader", "ChainOfThoughtContent", "ChainOfThoughtStep", "ChainOfThoughtSearchResults", "ChainOfThoughtSearchResult", "ChainOfThoughtImage"],
	},
	props: [
		{
			name: "open",
			type: "boolean",
			description: "Controlled open state.",
		},
		{
			name: "defaultOpen",
			type: "boolean",
			description: "Initial open state.",
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "Called when open state changes.",
		},
	],
	gotchas: [
		"All child components require ChainOfThought context — throws if used standalone",
		"ChainOfThoughtStep status controls styling: 'complete' (muted), 'active' (foreground), 'pending' (muted/50)",
		"Vertical connector line assumes steps are in DOM order — don't reorder dynamically",
		"ChainOfThoughtStep icon defaults to DotIcon — pass LucideIcon component reference (not JSX)",
	],
	canonicalExample: `<ChainOfThought defaultOpen>
  <ChainOfThoughtHeader>Reasoning Steps</ChainOfThoughtHeader>
  <ChainOfThoughtContent>
    <ChainOfThoughtStep icon={SearchIcon} label="Searching" status="complete" />
    <ChainOfThoughtStep label="Analyzing" status="active">
      <ChainOfThoughtSearchResults>
        <ChainOfThoughtSearchResult>Source 1</ChainOfThoughtSearchResult>
      </ChainOfThoughtSearchResults>
    </ChainOfThoughtStep>
  </ChainOfThoughtContent>
</ChainOfThought>`,
}

export const reasoningData: ComponentData = {
	name: "Reasoning",
	category: "ai",
	description: "Collapsible reasoning block that auto-expands during streaming and shows thinking duration.",
	docPath: "/docs/ai/reasoning/reasoning",
	imports: {
		path: "@blazz/pro/components/ai/reasoning",
		named: ["Reasoning", "ReasoningTrigger", "ReasoningContent"],
	},
	props: [
		{
			name: "isStreaming",
			type: "boolean",
			description: "Whether reasoning is currently streaming.",
		},
		{
			name: "duration",
			type: "number",
			description: "Thinking duration in seconds (auto-calculated if not provided).",
		},
		{
			name: "open",
			type: "boolean",
			description: "Controlled open state.",
		},
		{
			name: "defaultOpen",
			type: "boolean",
			description: "Initial open state.",
		},
	],
	gotchas: [
		"Auto-opens when isStreaming=true — set defaultOpen={false} to prevent this behavior",
		"Auto-closes 1 second after streaming ends — one-time behavior, won't auto-close again",
		"ReasoningContent requires string children (markdown rendered via Streamdown) — not React nodes",
		"ReasoningTrigger shows Shimmer animation while streaming, then 'Thought for Ns' after",
	],
	canonicalExample: `<Reasoning isStreaming={isStreaming}>
  <ReasoningTrigger />
  <ReasoningContent>
    # Analysis\\n\\nThe data suggests...
  </ReasoningContent>
</Reasoning>`,
}

export const inlineCitationData: ComponentData = {
	name: "InlineCitation",
	category: "ai",
	description: "Inline citation badge with hover card showing source details in a carousel.",
	docPath: "/docs/ai/reasoning/inline-citation",
	imports: {
		path: "@blazz/pro/components/ai/reasoning",
		named: ["InlineCitation", "InlineCitationText", "InlineCitationCard", "InlineCitationCardTrigger", "InlineCitationCardBody", "InlineCitationSource"],
	},
	props: [
		{
			name: "sources",
			type: "string[]",
			required: true,
			description: "Array of source URLs displayed in the citation badge.",
		},
	],
	gotchas: [
		"sources prop on InlineCitationCardTrigger is array of URLs — parses first URL for domain display",
		"Carousel components need InlineCitationCarousel context — wrap items in the carousel",
		"Badge shows '{domain} +{N}' format — falls back to 'unknown' if URL parsing fails",
	],
	canonicalExample: `<InlineCitation>
  <InlineCitationText>Referenced text</InlineCitationText>
  <InlineCitationCard>
    <InlineCitationCardTrigger sources={["https://example.com"]} />
    <InlineCitationCardBody>
      <InlineCitationSource title="Example" url="https://example.com" description="Source details" />
    </InlineCitationCardBody>
  </InlineCitationCard>
</InlineCitation>`,
}

export const sourcesData: ComponentData = {
	name: "Sources",
	category: "ai",
	description: "Collapsible list of reference sources with count badge.",
	docPath: "/docs/ai/reasoning/sources",
	imports: {
		path: "@blazz/pro/components/ai/reasoning",
		named: ["Sources", "SourcesTrigger", "SourcesContent", "Source"],
	},
	props: [
		{
			name: "count",
			type: "number",
			required: true,
			description: "Number of sources displayed in trigger text.",
		},
	],
	gotchas: [
		"All links open in new tab by default (target='_blank')",
		"count prop on SourcesTrigger is manual — not auto-counted from children",
		"Source is an anchor element — pass href and title props",
	],
	canonicalExample: `<Sources>
  <SourcesTrigger count={2} />
  <SourcesContent>
    <Source href="https://example.com" title="Example Article" />
    <Source href="https://other.com" title="Other Source" />
  </SourcesContent>
</Sources>`,
}
