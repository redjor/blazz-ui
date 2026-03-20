// apps/docs/src/data/components/ai/chat.ts
import type { ComponentData } from "../../types"

export const messageData: ComponentData = {
	name: "Message",
	category: "ai",
	description:
		"Message bubble for AI chat interfaces. Compound component with content, actions, branching, and streaming response support.",
	docPath: "/docs/ai/chat/message",
	imports: {
		path: "@blazz/pro/components/ai/chat",
		named: [
			"Message",
			"MessageContent",
			"MessageActions",
			"MessageAction",
			"MessageResponse",
			"MessageToolbar",
			"MessageBranch",
			"MessageBranchContent",
			"MessageBranchSelector",
		],
	},
	props: [
		{
			name: "from",
			type: '"user" | "assistant" | "system" | "data" | "tool"',
			required: true,
			description: "Role of the message sender — controls alignment and styling.",
		},
	],
	gotchas: [
		"from prop is required — without it, no message styling is applied",
		"MessageResponse only accepts string children (markdown) — it's memoized with custom equality check",
		"MessageAction needs tooltip prop for accessibility — renders icon-only button by default",
		"MessageBranchContent requires array of ReactElements as children — not strings",
	],
	canonicalExample: `<Message from="assistant">
  <MessageContent>
    <MessageResponse>
      # Response\\nMarkdown content here
    </MessageResponse>
  </MessageContent>
  <MessageActions>
    <MessageAction tooltip="Copy"><CopyIcon /></MessageAction>
  </MessageActions>
</Message>`,
}

export const conversationData: ComponentData = {
	name: "Conversation",
	category: "ai",
	description:
		"Scrollable chat container with sticky-to-bottom behavior, empty state, and download support.",
	docPath: "/docs/ai/chat/conversation",
	imports: {
		path: "@blazz/pro/components/ai/chat",
		named: [
			"Conversation",
			"ConversationContent",
			"ConversationEmptyState",
			"ConversationScrollButton",
			"ConversationDownload",
		],
	},
	props: [
		{
			name: "children",
			type: "React.ReactNode",
			required: true,
			description: "Messages and other content.",
		},
	],
	gotchas: [
		"ConversationScrollButton must be inside Conversation — uses StickToBottom context, throws otherwise",
		"ConversationDownload creates markdown blob — pass messages array and optional filename (default: conversation.md)",
		"ConversationEmptyState renders centered when no messages — customize with title, description, icon props",
	],
	canonicalExample: `<Conversation>
  <ConversationContent>
    {messages.map((msg) => (
      <Message key={msg.id} from={msg.role}>
        <MessageContent><MessageResponse>{msg.content}</MessageResponse></MessageContent>
      </Message>
    ))}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>`,
}

export const promptInputData: ComponentData = {
	name: "PromptInput",
	category: "ai",
	description:
		"Chat input form with file attachments, drag-and-drop, paste support, and composable toolbar.",
	docPath: "/docs/ai/chat/prompt-input",
	imports: {
		path: "@blazz/pro/components/ai/chat",
		named: [
			"PromptInput",
			"PromptInputProvider",
			"PromptInputBody",
			"PromptInputTextarea",
			"PromptInputHeader",
			"PromptInputFooter",
			"PromptInputTools",
			"PromptInputSubmit",
			"PromptInputActionMenu",
			"PromptInputActionMenuTrigger",
			"PromptInputActionMenuContent",
		],
	},
	props: [
		{
			name: "onSubmit",
			type: "(message: { text: string; files: FileUIPart[] }, event: FormEvent) => void | Promise<void>",
			required: true,
			description: "Submit handler receiving text and attached files.",
		},
		{
			name: "accept",
			type: "string",
			description: "File input accept attribute (e.g. 'image/*').",
		},
		{
			name: "maxFiles",
			type: "number",
			description: "Maximum number of attachable files.",
		},
		{
			name: "maxFileSize",
			type: "number",
			description: "Maximum file size in bytes.",
		},
		{
			name: "globalDrop",
			type: "boolean",
			default: "false",
			description: "Enable document-wide drag-and-drop.",
		},
		{
			name: "onError",
			type: '(err: { code: "max_files" | "max_file_size" | "accept"; message: string }) => void',
			description: "Called on file validation errors.",
		},
	],
	gotchas: [
		"Without PromptInputProvider, state is local to PromptInput — use Provider to lift state across components",
		"onSubmit receives { text, files } — not just a string. Handle both fields",
		"Enter submits, Shift+Enter for newline — paste image support is built-in",
		"PromptInputSubmit responds to status prop: 'submitted' | 'streaming' shows spinner/stop, 'error' shows X",
	],
	canonicalExample: `<PromptInput
  accept="image/*"
  maxFiles={5}
  maxFileSize={5 * 1024 * 1024}
  onError={(err) => toast.error(err.message)}
  onSubmit={async (msg) => {
    await sendMessage(msg.text, msg.files)
  }}
>
  <PromptInputBody>
    <PromptInputTextarea />
  </PromptInputBody>
  <PromptInputFooter>
    <PromptInputTools>
      <PromptInputActionMenu>
        <PromptInputActionMenuTrigger />
        <PromptInputActionMenuContent />
      </PromptInputActionMenu>
    </PromptInputTools>
    <PromptInputSubmit status={status} onStop={handleStop} />
  </PromptInputFooter>
</PromptInput>`,
}

export const attachmentsData: ComponentData = {
	name: "Attachments",
	category: "ai",
	description:
		"File attachment display with grid, inline, and list variants. Supports image/video preview, info, and remove actions.",
	docPath: "/docs/ai/chat/attachments",
	imports: {
		path: "@blazz/pro/components/ai/chat",
		named: [
			"Attachments",
			"Attachment",
			"AttachmentPreview",
			"AttachmentInfo",
			"AttachmentRemove",
		],
	},
	props: [
		{
			name: "variant",
			type: '"grid" | "inline" | "list"',
			default: '"grid"',
			description: "Layout variant for the attachment container.",
		},
	],
	gotchas: [
		"variant controls layout: grid (96px squares), inline (h-8 chips), list (full-width rows)",
		"Attachment data prop requires id field — type is FileUIPart & { id: string }",
		"AttachmentInfo is hidden in grid variant — only visible in inline and list",
		"AttachmentPreview only renders images/videos if data has url field",
	],
	canonicalExample: `<Attachments variant="grid">
  {files.map((file) => (
    <Attachment key={file.id} data={file} onRemove={() => removeFile(file.id)}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  ))}
</Attachments>`,
}

export const shimmerData: ComponentData = {
	name: "Shimmer",
	category: "ai",
	description: "Animated text shimmer effect for AI thinking/loading states.",
	docPath: "/docs/ai/chat/shimmer",
	imports: {
		path: "@blazz/pro/components/ai/chat",
		named: ["Shimmer"],
	},
	props: [
		{
			name: "children",
			type: "string",
			required: true,
			description: "Text to display with shimmer animation.",
		},
		{
			name: "duration",
			type: "number",
			default: "2",
			description: "Animation duration in seconds.",
		},
		{
			name: "spread",
			type: "number",
			default: "2",
			description: "Gradient spread in pixels (multiplied by string length).",
		},
		{
			name: "as",
			type: "ElementType",
			default: '"p"',
			description: "HTML element to render as.",
		},
	],
	gotchas: [
		"Only accepts string children — not ReactNode. Passing JSX will break",
		"Infinite animation — no way to stop it, unmount the component instead",
		"Uses framer-motion internally — component is memoized",
	],
	canonicalExample: `<Shimmer duration={2}>Thinking...</Shimmer>`,
}

export const suggestionsData: ComponentData = {
	name: "Suggestions",
	category: "ai",
	description: "Horizontal scrollable list of suggested prompts for AI chat.",
	docPath: "/docs/ai/chat/suggestions",
	imports: {
		path: "@blazz/pro/components/ai/chat",
		named: ["Suggestions", "Suggestion"],
	},
	props: [
		{
			name: "suggestion",
			type: "string",
			required: true,
			description: "Suggestion text to display and pass to onClick.",
		},
		{
			name: "onClick",
			type: "(suggestion: string) => void",
			description: "Called with suggestion string when clicked.",
		},
	],
	gotchas: [
		"onClick receives the suggestion string — not a click event",
		"Suggestions wraps ScrollArea — horizontal scroll, hidden scrollbar",
		"Children of Suggestion override displayed text but onClick still receives the suggestion prop value",
	],
	canonicalExample: `<Suggestions>
  <Suggestion suggestion="How does it work?" onClick={handleSuggestion}>
    How does it work?
  </Suggestion>
  <Suggestion suggestion="Tell me more" onClick={handleSuggestion} />
</Suggestions>`,
}
