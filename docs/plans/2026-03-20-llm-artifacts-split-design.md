# LLM Artifacts Split — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split LLM documentation artifacts so each package (@blazz/ui, @blazz/pro) carries its own AI.md, add 51 AI components to the registry, and fix the generator to produce per-package outputs.

**Architecture:** Extend the existing registry type system with `ComponentDataLite` for lightweight entries. Modify `generate-llms.ts` to filter by category and write 3 files: `packages/ui/AI.md`, `packages/pro/AI.md`, `apps/docs/public/llms.txt`. AI core components (13) get full `ComponentData`, generative UI (38) get `ComponentDataLite`.

**Tech Stack:** TypeScript, existing registry system in `apps/docs/src/data/`

---

### Task 1: Extend types with ComponentDataLite

**Files:**
- Modify: `apps/docs/src/data/types.ts`

**Step 1: Add ComponentDataLite type and helpers**

```ts
// Add after ComponentData

export type ComponentDataLite = {
  name: string
  category: "ai"
  description: string
  imports: ComponentImport
  useCase: string
  canonicalExample: string
}

export type RegistryEntry = ComponentData | ComponentDataLite

export function isFullComponent(entry: RegistryEntry): entry is ComponentData {
  return "props" in entry && "gotchas" in entry
}
```

**Step 2: Commit**

```bash
git add apps/docs/src/data/types.ts
git commit -m "feat(docs): add ComponentDataLite type for lightweight AI registry entries"
```

---

### Task 2: Add 13 AI core components to registry (full ComponentData)

**Files:**
- Create: `apps/docs/src/data/components/ai/chat.ts`
- Create: `apps/docs/src/data/components/ai/reasoning.ts`
- Create: `apps/docs/src/data/components/ai/tools.ts`

**Step 1: Create `apps/docs/src/data/components/ai/chat.ts`**

6 entries: Message, Conversation, PromptInput, Attachments, Shimmer, Suggestions.

Each follows the `ComponentData` shape (see `button.ts` for reference). Key data per component:

**Message:**
- imports: `{ path: "@blazz/pro/components/ai/chat", named: ["Message", "MessageContent", "MessageActions", "MessageAction", "MessageResponse", "MessageToolbar", "MessageBranch", "MessageBranchContent", "MessageBranchSelector"] }`
- gotchas: `from` prop required (role), `MessageResponse` is memoized (string children only), `MessageBranchContent` requires array of ReactElements
- canonicalExample: Message with MessageContent > MessageResponse + MessageActions

**Conversation:**
- imports: `{ path: "@blazz/pro/components/ai/chat", named: ["Conversation", "ConversationContent", "ConversationEmptyState", "ConversationScrollButton", "ConversationDownload"] }`
- gotchas: `ConversationScrollButton` must be inside `Conversation` (uses context), `ConversationDownload` creates markdown blob
- canonicalExample: Conversation wrapping messages + scroll button

**PromptInput:**
- imports: `{ path: "@blazz/pro/components/ai/chat", named: ["PromptInput", "PromptInputProvider", "PromptInputBody", "PromptInputTextarea", "PromptInputHeader", "PromptInputFooter", "PromptInputTools", "PromptInputSubmit", "PromptInputActionMenu", "PromptInputActionMenuTrigger", "PromptInputActionMenuContent"] }`
- gotchas: Without `PromptInputProvider` state is local, `onSubmit` receives `{ text, files }` not just string, Enter submits (Shift+Enter for newline), paste image support built-in
- canonicalExample: PromptInputProvider > PromptInput with textarea + footer + submit

**Attachments:**
- imports: `{ path: "@blazz/pro/components/ai/chat", named: ["Attachments", "Attachment", "AttachmentPreview", "AttachmentInfo", "AttachmentRemove"] }`
- gotchas: `variant` controls layout (grid/inline/list), `data` requires `id` field, `AttachmentInfo` hidden in grid variant
- canonicalExample: Attachments variant="grid" with map of files

**Shimmer:**
- imports: `{ path: "@blazz/pro/components/ai/chat", named: ["Shimmer"] }`
- gotchas: Only accepts string children (not ReactNode), infinite animation, `duration` in seconds
- canonicalExample: `<Shimmer duration={2}>Thinking...</Shimmer>`

**Suggestions:**
- imports: `{ path: "@blazz/pro/components/ai/chat", named: ["Suggestions", "Suggestion"] }`
- gotchas: `onClick` receives suggestion string not event, horizontal scroll container
- canonicalExample: Suggestions with 3 Suggestion items

**Step 2: Create `apps/docs/src/data/components/ai/reasoning.ts`**

4 entries: ChainOfThought, Reasoning, InlineCitation, Sources.

**ChainOfThought:**
- imports: `{ path: "@blazz/pro/components/ai/reasoning", named: ["ChainOfThought", "ChainOfThoughtHeader", "ChainOfThoughtContent", "ChainOfThoughtStep", "ChainOfThoughtSearchResults", "ChainOfThoughtSearchResult", "ChainOfThoughtImage"] }`
- gotchas: All children require ChainOfThought context, `status` controls step color (complete/active/pending), vertical connector line assumes DOM order
- canonicalExample: ChainOfThought with header + content + 2 steps

**Reasoning:**
- imports: `{ path: "@blazz/pro/components/ai/reasoning", named: ["Reasoning", "ReasoningTrigger", "ReasoningContent"] }`
- gotchas: Auto-opens when `isStreaming=true`, auto-closes 1s after streaming ends, `ReasoningContent` requires string children (markdown), `defaultOpen={false}` prevents auto-open
- canonicalExample: Reasoning with isStreaming + trigger + content

**InlineCitation:**
- imports: `{ path: "@blazz/pro/components/ai/reasoning", named: ["InlineCitation", "InlineCitationText", "InlineCitationCard", "InlineCitationCardTrigger", "InlineCitationCardBody", "InlineCitationSource"] }`
- gotchas: `sources` prop on trigger is array of URLs, parses first URL for domain display, carousel needs context
- canonicalExample: InlineCitation with text + card trigger + source

**Sources:**
- imports: `{ path: "@blazz/pro/components/ai/reasoning", named: ["Sources", "SourcesTrigger", "SourcesContent", "Source"] }`
- gotchas: All links open in new tab, `count` prop on trigger is manual (not auto-counted)
- canonicalExample: Sources with trigger + content + 2 Source links

**Step 3: Create `apps/docs/src/data/components/ai/tools.ts`**

3 entries: Confirmation, Context, ModelSelector.

**Confirmation:**
- imports: `{ path: "@blazz/pro/components/ai/tools", named: ["Confirmation", "ConfirmationTitle", "ConfirmationRequest", "ConfirmationAccepted", "ConfirmationRejected", "ConfirmationActions", "ConfirmationAction"] }`
- gotchas: Complex conditional rendering based on `approval` + `state`, children require Confirmation context, no built-in state management
- canonicalExample: Confirmation with title + request + accepted + rejected + actions

**Context:**
- imports: `{ path: "@blazz/pro/components/ai/tools", named: ["Context", "ContextTrigger", "ContextContent", "ContextContentHeader", "ContextContentBody", "ContextContentFooter", "ContextInputUsage", "ContextOutputUsage"] }`
- gotchas: Cost calculation requires `modelId` (tokenlens), SVG pie chart trigger, tokens formatted with compact notation
- canonicalExample: Context with trigger + content sections

**ModelSelector:**
- imports: `{ path: "@blazz/pro/components/ai/tools", named: ["ModelSelector", "ModelSelectorTrigger", "ModelSelectorContent", "ModelSelectorInput", "ModelSelectorList", "ModelSelectorGroup", "ModelSelectorItem", "ModelSelectorLogo", "ModelSelectorName"] }`
- gotchas: Provider logos from models.dev (requires internet), 100+ provider strings supported, can use CommandDialog alternative
- canonicalExample: ModelSelector with input + list + group + item with logo

**Step 4: Commit**

```bash
git add apps/docs/src/data/components/ai/
git commit -m "feat(docs): add 13 AI core component registry entries"
```

---

### Task 3: Add 38 generative UI components to registry (ComponentDataLite)

**Files:**
- Create: `apps/docs/src/data/components/ai/generative.ts`

**Step 1: Create the file with 38 ComponentDataLite entries**

Group by subdomain. Each entry has: name, category "ai", description (one-liner), imports (path + named), useCase, canonicalExample (minimal).

Structure — 6 arrays exported individually then spread into one:

```ts
import type { ComponentDataLite } from "../../types"

const commerce: ComponentDataLite[] = [
  { name: "InvoiceCard", category: "ai", description: "Invoice card with number, client, amount, status, and line items.", imports: { path: "@blazz/pro/components/ai/generative/commerce/invoice-card", named: ["InvoiceCard"] }, useCase: "Display invoice details in AI chat responses", canonicalExample: `<InvoiceCard number="INV-001" client="Acme" amount={1200} status="paid" />` },
  // ... 4 more commerce
]
const content: ComponentDataLite[] = [ /* 7 entries */ ]
const data: ComponentDataLite[] = [ /* 9 entries */ ]
const entities: ComponentDataLite[] = [ /* 5 entries */ ]
const planning: ComponentDataLite[] = [ /* 5 entries */ ]
const workflow: ComponentDataLite[] = [ /* 7 entries */ ]

export const generativeAiData: ComponentDataLite[] = [
  ...commerce, ...content, ...data, ...entities, ...planning, ...workflow,
]
```

Use the component inventory from the exploration agent for descriptions. Import paths follow the pattern: `@blazz/pro/components/ai/generative/{domain}/{component-name}`.

**Step 2: Commit**

```bash
git add apps/docs/src/data/components/ai/generative.ts
git commit -m "feat(docs): add 38 generative UI component registry entries (lite)"
```

---

### Task 4: Update registry.ts to include AI entries

**Files:**
- Modify: `apps/docs/src/data/registry.ts`

**Step 1: Import and add AI entries**

```ts
// Add imports
import { messageData, conversationData, promptInputData, attachmentsData, shimmerData, suggestionsData } from "./components/ai/chat"
import { chainOfThoughtData, reasoningData, inlineCitationData, sourcesData } from "./components/ai/reasoning"
import { confirmationData, contextData, modelSelectorData } from "./components/ai/tools"
import { generativeAiData } from "./components/ai/generative"
import type { RegistryEntry } from "./types"
```

Change the registry type from `ComponentData[]` to `RegistryEntry[]`:

```ts
export const registry: RegistryEntry[] = [
  // ... existing 26 entries unchanged ...

  // AI — Core
  messageData,
  conversationData,
  promptInputData,
  attachmentsData,
  shimmerData,
  suggestionsData,
  chainOfThoughtData,
  reasoningData,
  inlineCitationData,
  sourcesData,
  confirmationData,
  contextData,
  modelSelectorData,

  // AI — Generative UI
  ...generativeAiData,
]
```

**Step 2: Commit**

```bash
git add apps/docs/src/data/registry.ts
git commit -m "feat(docs): add AI components to registry (13 core + 38 generative)"
```

---

### Task 5: Update generate-llms.ts — per-package output

**Files:**
- Modify: `apps/docs/scripts/generate-llms.ts`

**Step 1: Add lite component renderer**

```ts
import { isFullComponent, type RegistryEntry, type ComponentDataLite } from "../src/data/types"

function renderComponentLite(c: ComponentDataLite): string {
  const lines: string[] = []
  lines.push(`### ${c.name}`)
  lines.push("")
  lines.push(`Import: \`${c.imports.path}\``)
  lines.push(`Named: \`${c.imports.named.join(", ")}\``)
  lines.push("")
  lines.push(c.description)
  lines.push(`Use case: ${c.useCase}`)
  lines.push("")
  lines.push("```tsx")
  lines.push(c.canonicalExample)
  lines.push("```")
  return lines.join("\n")
}
```

**Step 2: Refactor generation to produce per-package content**

Helper to determine package from category:

```ts
function getPackage(category: string): "@blazz/ui" | "@blazz/pro" {
  return category === "ui" || category === "patterns" ? "@blazz/ui" : "@blazz/pro"
}
```

**Step 3: Generate `packages/ui/AI.md`** — only ui + patterns

New function `generateUiAiMd()`:
- Header: `# @blazz/ui — AI Context`
- Critical patterns section (existing 5 rules, but remove any @blazz/pro references)
- Component index table (ui + patterns only)
- Full component reference (ui + patterns only)

**Step 4: Generate `packages/pro/AI.md`** — only blocks + ai

New function `generateProAiMd()`:
- Header: `# @blazz/pro — AI Context`
- Critical patterns section:
  - Import blocks: `@blazz/pro/components/blocks/{name}`
  - Import AI: `@blazz/pro/components/ai/{domain}` (NO barrel, direct import only)
  - `@blazz/ui` is a peer dependency — use its primitives
  - All components wrapped with `withProGuard()` (license required)
- Component index table (blocks + ai core)
- Full component reference — Blocks (existing 5: DataTable, StatsGrid, FilterBar, DetailPanel, ActivityTimeline)
- Full component reference — AI Core (13 components, full detail)
- AI Generative Components section (38 components, lite format, grouped by domain)

**Step 5: Generate `apps/docs/public/llms.txt`** — aggregation

Update `generateLlmsTxt()`:
- Header: `# Blazz UI Kit` (not just `@blazz/ui`)
- Add clear package markers: `# @blazz/ui — UI Primitives`, `# @blazz/ui — Patterns`, `# @blazz/pro — Business Blocks`, `# @blazz/pro — AI Components`
- Render full components with `renderComponent()`, lite ones with `renderComponentLite()`

**Step 6: Update output section**

```ts
const uiAiMd = generateUiAiMd()
const proAiMd = generateProAiMd()
const llmsTxt = generateLlmsTxt()

const uiPackageDir = join(import.meta.dirname, "..", "..", "..", "packages", "ui")
const proPackageDir = join(import.meta.dirname, "..", "..", "..", "packages", "pro")
const docsPublicDir = join(import.meta.dirname, "..", "public")

writeFileSync(join(uiPackageDir, "AI.md"), uiAiMd, "utf-8")
writeFileSync(join(proPackageDir, "AI.md"), proAiMd, "utf-8")
writeFileSync(join(docsPublicDir, "llms.txt"), llmsTxt, "utf-8")

// Update counts
const uiCount = registry.filter(c => getPackage(c.category) === "@blazz/ui").length
const proCount = registry.filter(c => getPackage(c.category) === "@blazz/pro").length
console.log(`✓ packages/ui/AI.md — ${uiCount} components`)
console.log(`✓ packages/pro/AI.md — ${proCount} components`)
console.log(`✓ public/llms.txt — ${registry.length} components total`)
```

**Step 7: Commit**

```bash
git add apps/docs/scripts/generate-llms.ts
git commit -m "feat(docs): split generator to produce per-package AI.md + unified llms.txt"
```

---

### Task 6: Run the generator and verify outputs

**Step 1: Run generator**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app
pnpm tsx apps/docs/scripts/generate-llms.ts
```

Expected output:
```
✓ packages/ui/AI.md — 20 components
✓ packages/pro/AI.md — 56 components
✓ public/llms.txt — 76 components total
```

**Step 2: Verify packages/ui/AI.md**

- Header says `@blazz/ui`
- Contains ONLY ui + patterns components
- NO references to `@blazz/pro` imports
- Critical patterns section present

**Step 3: Verify packages/pro/AI.md**

- Header says `@blazz/pro`
- Contains blocks + ai core (full) + generative (lite)
- AI import rule documented: direct import, no barrel
- `withProGuard()` mentioned

**Step 4: Verify apps/docs/public/llms.txt**

- Header says `Blazz UI Kit` (not just `@blazz/ui`)
- Clear package markers per section
- All 76 components present

**Step 5: Commit generated files**

```bash
git add packages/ui/AI.md packages/pro/AI.md apps/docs/public/llms.txt
git commit -m "chore(docs): regenerate LLM artifacts — split per-package"
```

---

### Task 7: Update MCP server source data reference (if needed)

**Files:**
- Check: MCP server tool implementations that read from registry or AI.md

**Step 1: Verify MCP server reads from registry**

Check if `mcp__blazz__get_component` and `mcp__blazz__list_components` reference the registry or AI.md directly. If they use the registry, the type change from `ComponentData[]` to `RegistryEntry[]` may need handling.

**Step 2: Update any type references if needed**

If the MCP server uses `ComponentData` type, update to accept `RegistryEntry` and handle both full and lite entries.

**Step 3: Commit if changes made**

```bash
git add <changed-files>
git commit -m "fix(mcp): handle RegistryEntry union type in component tools"
```

---

## Summary

| Task | Description | New files | Modified files |
|------|-------------|-----------|---------------|
| 1 | Extend types | — | `types.ts` |
| 2 | 13 AI core entries | 3 files in `components/ai/` | — |
| 3 | 38 generative entries | `components/ai/generative.ts` | — |
| 4 | Update registry | — | `registry.ts` |
| 5 | Update generator | — | `generate-llms.ts` |
| 6 | Run + verify | — | 3 generated files |
| 7 | MCP server compat | — | TBD |
