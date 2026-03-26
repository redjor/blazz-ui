# Tiptap AI Slash Menu — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add AI writing capabilities (Ask AI, Continue Writing, Summarize, Fix grammar, Translate, Change tone) to the existing Tiptap editor slash menu in apps/ops, with a preview block for reviewing generated content before insertion.

**Architecture:** New API route `app/api/ai/editor/route.ts` handles streaming text generation via AI SDK + OpenAI. The existing `tiptap-editor.tsx` gets AI entries in the slash menu. A new `ai-preview-block.tsx` React component renders the preview overlay below the cursor with Accept/Discard/Try again controls.

**Tech Stack:** AI SDK (`ai`, `@ai-sdk/openai`), Tiptap React, GPT-4o-mini, streaming via `useCompletion`

---

### Task 1: API Route for AI Editor Actions

**Files:**
- Create: `apps/ops/app/api/ai/editor/route.ts`

**Step 1: Create the streaming API route**

```typescript
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

const SYSTEM_PROMPTS: Record<string, string> = {
  ask: "You are a helpful writing assistant. Respond in the same language as the user's prompt. Output only the generated content, no preamble.",
  continue:
    "You are a writing assistant. Continue the text naturally, matching the style, tone, and language. Output only the continuation, no preamble or repetition of existing text.",
  summarize:
    "Summarize the following text concisely, preserving key points. Use the same language as the input. Output only the summary.",
  fix: "Fix grammar, spelling, and punctuation in the following text. Preserve the meaning and tone. Output only the corrected text.",
  translate:
    "Detect the language of the following text. If French, translate to English. If English, translate to French. For other languages, translate to English. Output only the translation.",
  tone_professional:
    "Rewrite the following text in a professional, formal tone. Same language. Output only the rewritten text.",
  tone_casual:
    "Rewrite the following text in a casual, conversational tone. Same language. Output only the rewritten text.",
  tone_friendly:
    "Rewrite the following text in a warm, friendly tone. Same language. Output only the rewritten text.",
  tone_concise:
    "Rewrite the following text to be as concise as possible while preserving meaning. Same language. Output only the rewritten text.",
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { action, prompt, context } = await req.json()

  const systemPrompt = SYSTEM_PROMPTS[action]
  if (!systemPrompt) {
    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Build user message based on action
  let userMessage = ""
  if (action === "ask") {
    userMessage = context ? `Context:\n${context}\n\nRequest: ${prompt}` : prompt
  } else if (action === "continue") {
    userMessage = context || ""
  } else {
    // summarize, fix, translate, tone_*
    userMessage = prompt || context || ""
  }

  const result = streamText({
    model: openai.chat("gpt-4o-mini"),
    system: systemPrompt,
    prompt: userMessage,
  })

  return result.toDataStreamResponse()
}
```

**Step 2: Test manually**

```bash
curl -X POST http://localhost:3120/api/ai/editor \
  -H "Content-Type: application/json" \
  -d '{"action":"ask","prompt":"Write a haiku about code"}'
```

Expected: streaming text response

**Step 3: Commit**

```bash
git add apps/ops/app/api/ai/editor/route.ts
git commit -m "feat(ops): add AI editor streaming route"
```

---

### Task 2: AI Preview Block Component

**Files:**
- Create: `apps/ops/components/ai-preview-block.tsx`

**Step 1: Build the preview component**

This component renders below the editor cursor when AI generates content. It shows:
- The streamed AI text (growing in real time)
- A refinement input ("Tell AI what else needs to be changed...")
- Action buttons: Try again, Discard, Apply

```tsx
"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Card } from "@blazz/ui/components/ui/card"
import { useCompletion } from "@ai-sdk/react"
import { Loader2, RefreshCw, Sparkles, X, Check, ArrowUp } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

export type AIAction =
  | "ask"
  | "continue"
  | "summarize"
  | "fix"
  | "translate"
  | "tone_professional"
  | "tone_casual"
  | "tone_friendly"
  | "tone_concise"

interface AIPreviewBlockProps {
  /** The AI action to perform */
  action: AIAction
  /** User prompt (for "ask" action) */
  initialPrompt?: string
  /** Existing editor content as context */
  editorContext: string
  /** Called when user clicks Apply */
  onApply: (text: string) => void
  /** Called when user clicks Discard */
  onDiscard: () => void
  /** Position relative to editor container */
  style?: React.CSSProperties
}

export function AIPreviewBlock({
  action,
  initialPrompt,
  editorContext,
  onApply,
  onDiscard,
  style,
}: AIPreviewBlockProps) {
  const [refinementInput, setRefinementInput] = useState("")
  const [currentPrompt, setCurrentPrompt] = useState(initialPrompt ?? "")
  const inputRef = useRef<HTMLInputElement>(null)

  const { completion, isLoading, complete, stop } = useCompletion({
    api: "/api/ai/editor",
    body: { action, context: editorContext },
  })

  // Auto-trigger on mount (except "ask" which needs prompt first)
  useEffect(() => {
    if (action === "ask" && !initialPrompt) {
      // Don't auto-trigger, wait for user prompt
      return
    }
    complete(currentPrompt || editorContext)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTryAgain = useCallback(() => {
    complete(currentPrompt || editorContext)
  }, [complete, currentPrompt, editorContext])

  const handleRefinement = useCallback(() => {
    if (!refinementInput.trim()) return
    const newPrompt = `Previous result:\n${completion}\n\nRefinement: ${refinementInput}`
    setCurrentPrompt(newPrompt)
    setRefinementInput("")
    complete(newPrompt)
  }, [refinementInput, completion, complete])

  const needsInitialPrompt = action === "ask" && !initialPrompt && !completion && !isLoading

  return (
    <Card className="border-brand/30 bg-raised shadow-lg overflow-hidden">
      {/* Preview content */}
      {(completion || isLoading) && (
        <div className="px-4 py-3 text-sm text-fg leading-relaxed whitespace-pre-wrap">
          {completion || (
            <span className="flex items-center gap-2 text-fg-muted">
              <Loader2 className="size-3.5 animate-spin" />
              Generation en cours…
            </span>
          )}
        </div>
      )}

      {/* Initial prompt input (for "ask" action without pre-filled prompt) */}
      {needsInitialPrompt && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask AI what you want..."
              className="flex-1 bg-transparent text-sm text-fg placeholder:text-fg-muted outline-none"
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && currentPrompt.trim()) {
                  complete(currentPrompt)
                }
                if (e.key === "Escape") onDiscard()
              }}
              autoFocus
            />
            <button
              type="button"
              onClick={() => currentPrompt.trim() && complete(currentPrompt)}
              disabled={!currentPrompt.trim()}
              className="p-1 rounded-full bg-brand text-white disabled:opacity-40"
            >
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Action bar (shown after generation) */}
      {(completion || isLoading) && (
        <div className="border-t border-separator px-3 py-2 space-y-2">
          {/* Refinement input */}
          {!isLoading && completion && (
            <div className="flex items-center gap-2">
              <Sparkles className="size-3.5 text-brand shrink-0" />
              <input
                type="text"
                placeholder="Tell AI what else needs to be changed..."
                className="flex-1 bg-transparent text-xs text-fg placeholder:text-fg-muted outline-none"
                value={refinementInput}
                onChange={(e) => setRefinementInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRefinement()
                  if (e.key === "Escape") onDiscard()
                }}
              />
              {refinementInput.trim() && (
                <button
                  type="button"
                  onClick={handleRefinement}
                  className="p-1 rounded-full bg-brand text-white"
                >
                  <ArrowUp className="size-3" />
                </button>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="xs"
              onClick={handleTryAgain}
              disabled={isLoading}
            >
              <RefreshCw className="size-3 mr-1" />
              Try again
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="xs" onClick={onDiscard}>
                <X className="size-3 mr-1" />
                Discard
              </Button>
              <Button
                size="xs"
                onClick={() => onApply(completion)}
                disabled={isLoading || !completion}
              >
                <Check className="size-3 mr-1" />
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/ai-preview-block.tsx
git commit -m "feat(ops): add AI preview block component"
```

---

### Task 3: Integrate AI Commands in Slash Menu

**Files:**
- Modify: `apps/ops/components/tiptap-editor.tsx`

**Step 1: Add AI slash commands and state**

Add these imports at the top:
```typescript
import { Sparkles, Languages, SpellCheck, PenLine, MessageSquare } from "lucide-react"
import { AIPreviewBlock, type AIAction } from "./ai-preview-block"
```

Add AI commands to the `SLASH_COMMANDS` array. Change `SlashCommand` to support groups and AI actions:

```typescript
interface SlashCommand {
  label: string
  icon: React.ReactNode
  hint: string
  command: string
  group?: "ai" | "style"
  aiAction?: AIAction
  children?: { label: string; aiAction: AIAction }[]
}
```

Add these AI commands at the **beginning** of `SLASH_COMMANDS`:
```typescript
{
  label: "Ask AI",
  hint: "ai",
  icon: <Sparkles className="size-4" />,
  command: "ai-ask",
  group: "ai",
  aiAction: "ask",
},
{
  label: "Continue Writing",
  hint: "ai",
  icon: <PenLine className="size-4" />,
  command: "ai-continue",
  group: "ai",
  aiAction: "continue",
},
{
  label: "Summarize",
  hint: "ai",
  icon: <Sparkles className="size-4" />,
  command: "ai-summarize",
  group: "ai",
  aiAction: "summarize",
},
{
  label: "Fix grammar",
  hint: "ai",
  icon: <SpellCheck className="size-4" />,
  command: "ai-fix",
  group: "ai",
  aiAction: "fix",
},
{
  label: "Translate",
  hint: "ai",
  icon: <Languages className="size-4" />,
  command: "ai-translate",
  group: "ai",
  aiAction: "translate",
},
{
  label: "Change tone",
  hint: "ai",
  icon: <MessageSquare className="size-4" />,
  command: "ai-tone",
  group: "ai",
  children: [
    { label: "Professional", aiAction: "tone_professional" },
    { label: "Casual", aiAction: "tone_casual" },
    { label: "Friendly", aiAction: "tone_friendly" },
    { label: "Concise", aiAction: "tone_concise" },
  ],
},
```

**Step 2: Add AI state to TiptapEditor**

Inside `TiptapEditor` component, add state for AI preview:

```typescript
const [aiState, setAiState] = useState<{
  action: AIAction
  prompt?: string
  position: { top: number; left: number }
} | null>(null)

// Sub-menu state for "Change tone"
const [toneSubmenu, setToneSubmenu] = useState<{
  position: { top: number; left: number }
} | null>(null)
```

**Step 3: Handle AI commands in `executeCommand`**

In the `executeCommand` switch, add handling for AI commands. When an AI slash command is selected:
1. Delete the slash text
2. Get selected text or full editor content as context
3. For "ask" → open AI preview with no prompt (user types in the preview)
4. For "change tone" → open tone sub-menu
5. For others → open AI preview with the action, auto-trigger generation

```typescript
// Inside executeCommand, add before the closing }:
if (cmd.command.startsWith("ai-")) {
  const e = editorRef.current
  if (!e) return

  const slashRange = findSlashCommandRange(e)
  if (slashRange) {
    e.chain().focus().deleteRange({ from: slashRange.from, to: slashRange.to }).run()
  }

  // Get context: selected text or full doc text
  const { from, to } = e.state.selection
  const selectedText = from !== to ? e.state.doc.textBetween(from, to) : ""
  const fullText = e.getText()
  const context = selectedText || fullText

  if (cmd.command === "ai-tone" && cmd.children) {
    // Open tone sub-menu at cursor position
    const coords = e.view.coordsAtPos(e.state.selection.from)
    const editorRect = e.view.dom.getBoundingClientRect()
    setToneSubmenu({
      position: {
        top: coords.bottom - editorRect.top + 4,
        left: coords.left - editorRect.left,
      },
    })
    return
  }

  const action = cmd.aiAction!
  const coords = e.view.coordsAtPos(e.state.selection.from)
  const editorRect = e.view.dom.getBoundingClientRect()

  setAiState({
    action,
    position: {
      top: coords.bottom - editorRect.top + 8,
      left: 0, // full width below cursor
    },
  })
  return
}
```

**Step 4: Update `SlashMenu` to render groups**

Modify the `SlashMenu` component to render AI and Style group headers:

```tsx
// Inside SlashMenu render, before mapping commands:
const aiCommands = commands.filter((c) => c.group === "ai")
const styleCommands = commands.filter((c) => c.group !== "ai")

// Render with group headers:
{aiCommands.length > 0 && (
  <>
    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
      AI
    </div>
    {aiCommands.map(/* ... same button rendering */)}
  </>
)}
{styleCommands.length > 0 && (
  <>
    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
      Style
    </div>
    {styleCommands.map(/* ... same button rendering */)}
  </>
)}
```

Note: The index-based selection needs to be adjusted to work across both groups as a single flat list.

**Step 5: Render AI preview and tone sub-menu in JSX**

After the EditorContent, add:

```tsx
{/* AI Preview */}
{aiState && (
  <div className="absolute z-50 left-0 right-0" style={{ top: aiState.position.top }}>
    <AIPreviewBlock
      action={aiState.action}
      initialPrompt={aiState.prompt}
      editorContext={
        editor.state.selection.from !== editor.state.selection.to
          ? editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)
          : editor.getText()
      }
      onApply={(text) => {
        editor.chain().focus().insertContent(text).run()
        setAiState(null)
      }}
      onDiscard={() => setAiState(null)}
    />
  </div>
)}

{/* Tone sub-menu */}
{toneSubmenu && (
  <div
    className="absolute z-50"
    style={{ top: toneSubmenu.position.top, left: toneSubmenu.position.left }}
  >
    <Card size="sm" className="w-[200px] p-1 shadow-lg">
      {[
        { label: "Professional", action: "tone_professional" as const },
        { label: "Casual", action: "tone_casual" as const },
        { label: "Friendly", action: "tone_friendly" as const },
        { label: "Concise", action: "tone_concise" as const },
      ].map((tone) => (
        <button
          key={tone.action}
          type="button"
          className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-muted text-fg"
          onClick={() => {
            const coords = editor.view.coordsAtPos(editor.state.selection.from)
            const editorRect = editor.view.dom.getBoundingClientRect()
            setToneSubmenu(null)
            setAiState({
              action: tone.action,
              position: {
                top: coords.bottom - editorRect.top + 8,
                left: 0,
              },
            })
          }}
        >
          {tone.label}
        </button>
      ))}
    </Card>
  </div>
)}
```

**Step 6: Commit**

```bash
git add apps/ops/components/tiptap-editor.tsx
git commit -m "feat(ops): integrate AI commands in Tiptap slash menu"
```

---

### Task 4: Manual Testing & Polish

**Step 1: Start the dev server**

```bash
pnpm dev:ops
```

**Step 2: Test each AI action**

Open a note or todo with rich description at `http://localhost:3120/notes` or `/todos/[id]`:

1. Type `/` → verify AI group appears at the top with 6 entries
2. Select "Ask AI" → verify input appears, type a prompt, verify streaming + preview
3. Click "Apply" → verify text is inserted into editor
4. Test "Continue Writing" with existing text
5. Test "Summarize" with a paragraph of text
6. Test "Fix grammar" with intentionally broken text
7. Test "Translate" with French text → expect English output
8. Test "Change tone" → verify sub-menu appears with 4 options
9. Test "Try again" → verify re-generation
10. Test "Discard" → verify preview disappears
11. Test refinement input → type feedback, verify re-generation with context

**Step 3: Fix any issues found during testing**

**Step 4: Final commit**

```bash
git add -u
git commit -m "fix(ops): polish AI slash menu interactions"
```
