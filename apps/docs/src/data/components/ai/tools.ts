// apps/docs/src/data/components/ai/tools.ts
import type { ComponentData } from "../../types"

export const confirmationData: ComponentData = {
	name: "Confirmation",
	category: "ai",
	description: "Tool execution confirmation UI with approval states: requested, accepted, rejected.",
	docPath: "/docs/ai/tools/confirmation",
	imports: {
		path: "@blazz/pro/components/ai/tools",
		named: ["Confirmation", "ConfirmationTitle", "ConfirmationRequest", "ConfirmationAccepted", "ConfirmationRejected", "ConfirmationActions", "ConfirmationAction"],
	},
	props: [
		{
			name: "state",
			type: 'ToolUIPart["state"]',
			required: true,
			description: "Current tool invocation state.",
		},
		{
			name: "approval",
			type: "ToolUIPartApproval",
			description: "Approval state (approved: true/false with optional reason).",
		},
	],
	gotchas: [
		"Complex conditional rendering — ConfirmationRequest only shows when state='approval-requested'",
		"ConfirmationAccepted/Rejected only render when approval matches AND state is approval-responded/output-*",
		"No built-in approval state management — you must handle approve/reject externally",
		"Returns null when no approval or state is input-streaming/input-available",
	],
	canonicalExample: `<Confirmation approval={approval} state={toolState}>
  <ConfirmationTitle>Execute database query?</ConfirmationTitle>
  <ConfirmationRequest>This will run a SELECT query on the users table.</ConfirmationRequest>
  <ConfirmationAccepted>Query approved</ConfirmationAccepted>
  <ConfirmationRejected>Query rejected</ConfirmationRejected>
  <ConfirmationActions>
    <ConfirmationAction variant="default" onClick={approve}>Approve</ConfirmationAction>
    <ConfirmationAction variant="outline" onClick={reject}>Reject</ConfirmationAction>
  </ConfirmationActions>
</Confirmation>`,
}

export const contextData: ComponentData = {
	name: "Context",
	category: "ai",
	description: "Token usage and cost visualization with pie chart trigger and detailed breakdown hover card.",
	docPath: "/docs/ai/tools/context",
	imports: {
		path: "@blazz/pro/components/ai/tools",
		named: ["Context", "ContextTrigger", "ContextContent", "ContextContentHeader", "ContextContentBody", "ContextContentFooter", "ContextInputUsage", "ContextOutputUsage"],
	},
	props: [
		{
			name: "usedTokens",
			type: "number",
			required: true,
			description: "Number of tokens used.",
		},
		{
			name: "maxTokens",
			type: "number",
			required: true,
			description: "Maximum token capacity.",
		},
		{
			name: "usage",
			type: "LanguageModelUsage",
			description: "Token usage breakdown (inputTokens, outputTokens, reasoningTokens, cachedInputTokens).",
		},
		{
			name: "modelId",
			type: "string",
			description: "Model ID for cost calculation via tokenlens.",
		},
	],
	gotchas: [
		"Cost calculation requires modelId — without it, footer shows no cost",
		"ContextTrigger renders SVG pie chart showing usage percentage — hoverable",
		"Tokens formatted with compact notation ('1.2K') — not raw numbers",
		"Usage sub-components auto-hide when their token count is 0",
	],
	canonicalExample: `<Context usedTokens={1250} maxTokens={4096} usage={{ inputTokens: 800, outputTokens: 450 }} modelId="gpt-4">
  <ContextTrigger />
  <ContextContent>
    <ContextContentHeader />
    <ContextContentBody>
      <ContextInputUsage />
      <ContextOutputUsage />
    </ContextContentBody>
    <ContextContentFooter />
  </ContextContent>
</Context>`,
}

export const modelSelectorData: ComponentData = {
	name: "ModelSelector",
	category: "ai",
	description: "Command palette-style model picker with provider logos and search.",
	docPath: "/docs/ai/tools/model-selector",
	imports: {
		path: "@blazz/pro/components/ai/tools",
		named: [
			"ModelSelector",
			"ModelSelectorTrigger",
			"ModelSelectorContent",
			"ModelSelectorInput",
			"ModelSelectorList",
			"ModelSelectorGroup",
			"ModelSelectorItem",
			"ModelSelectorLogo",
			"ModelSelectorName",
		],
	},
	props: [
		{
			name: "open",
			type: "boolean",
			description: "Controlled open state.",
		},
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "Called when open state changes.",
		},
	],
	gotchas: [
		"ModelSelectorLogo provider prop supports 100+ providers — fetches SVG from models.dev (requires internet)",
		"provider is a TypeScript union type with autocomplete — 'openai' | 'anthropic' | 'google' | etc.",
		"Can use ModelSelectorDialog (CommandDialog) as alternative to Dialog-based selector for keyboard shortcuts",
		"Logo images use dark:invert — designed for both light and dark themes",
	],
	canonicalExample: `<ModelSelector open={open} onOpenChange={setOpen}>
  <ModelSelectorTrigger>Select Model</ModelSelectorTrigger>
  <ModelSelectorContent>
    <ModelSelectorInput placeholder="Search models..." />
    <ModelSelectorList>
      <ModelSelectorGroup heading="Popular">
        <ModelSelectorItem value="gpt-4">
          <ModelSelectorLogo provider="openai" />
          <ModelSelectorName>GPT-4</ModelSelectorName>
        </ModelSelectorItem>
      </ModelSelectorGroup>
    </ModelSelectorList>
  </ModelSelectorContent>
</ModelSelector>`,
}
