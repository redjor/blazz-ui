# AI Elements — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Install 13 AI chatbot components from AI SDK Elements and adapt them to the Blazz design system.

**Architecture:** Install via AI Elements CLI (copies source code into `components/ai-elements/`). Adapt styling to Blazz design tokens. Create showcase pages in `app/(frame)/components/ai/`. Components are visual-only with mock data — no real LLM connection.

**Tech Stack:** AI SDK Elements CLI, streamdown (markdown rendering), motion (animations), Radix UI primitives, Blazz design tokens (oklch)

---

## Task 1: Install AI Elements CLI & first component (Shimmer)

Start with the simplest component to validate the installation workflow.

**Files:**
- Create: `components/ai-elements/shimmer.tsx` (via CLI)

**Step 1: Install shimmer component**

```bash
npx ai-elements@latest add shimmer
```

This should:
- Create `components/ai-elements/shimmer.tsx`
- `motion` is already installed, no new deps needed

**Step 2: Verify the file was created**

```bash
ls components/ai-elements/shimmer.tsx
```

Expected: file exists

**Step 3: Verify the component compiles**

```bash
npx next build --no-lint 2>&1 | head -30
```

Or simply start dev and check for errors. If the CLI created import paths like `@/registry/default/ui/...` instead of `@/components/ui/...`, fix the import paths.

**Step 4: Commit**

```bash
git add components/ai-elements/
git commit -m "feat(ai): install shimmer component from AI Elements"
```

---

## Task 2: Install Core Chat components (Message, Conversation, PromptInput)

**Files:**
- Create: `components/ai-elements/message.tsx` (via CLI)
- Create: `components/ai-elements/conversation.tsx` (via CLI)
- Create: `components/ai-elements/prompt-input.tsx` (via CLI)

**Step 1: Install the 3 core components**

```bash
npx ai-elements@latest add message conversation prompt-input
```

New npm dependencies expected:
- `ai` (core AI SDK — types like ChatStatus, FileUIPart)
- `streamdown`, `@streamdown/cjk`, `@streamdown/code`, `@streamdown/math`, `@streamdown/mermaid`
- `use-stick-to-bottom`
- `nanoid`

New shadcn primitives expected (auto-installed):
- `hover-card` (for prompt-input)
- `input-group` (for prompt-input)

Accept all dependency installations when prompted.

**Step 2: Fix import paths if needed**

The CLI may generate imports like `@/registry/default/ui/button` instead of `@/components/ui/button`. If so, fix all occurrences:

```bash
# Check for wrong import paths
grep -r "@/registry" components/ai-elements/
```

If found, replace `@/registry/default/ui/` with `@/components/ui/` and `@/registry/default/ai-elements/` with `@/components/ai-elements/` in all files.

**Step 3: Add `@source` directive to globals.css**

The Message component requires streamdown CSS. Add to `app/globals.css`:

```css
@source "../node_modules/streamdown/dist/*.js";
```

**Step 4: Verify compilation**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && npx next build --no-lint 2>&1 | tail -20
```

Fix any import or type errors.

**Step 5: Commit**

```bash
git add .
git commit -m "feat(ai): install message, conversation, prompt-input components"
```

---

## Task 3: Install Interaction components (Suggestion, Confirmation, Attachments, ModelSelector)

**Files:**
- Create: `components/ai-elements/suggestion.tsx`
- Create: `components/ai-elements/confirmation.tsx`
- Create: `components/ai-elements/attachments.tsx`
- Create: `components/ai-elements/model-selector.tsx`

**Step 1: Install components**

```bash
npx ai-elements@latest add suggestion confirmation attachments model-selector
```

New shadcn primitives expected:
- `carousel` (for inline-citation, install now to avoid issues)

**Step 2: Fix import paths**

```bash
grep -r "@/registry" components/ai-elements/
```

Replace all `@/registry/default/ui/` → `@/components/ui/` and `@/registry/default/ai-elements/` → `@/components/ai-elements/`.

**Step 3: Verify compilation**

```bash
npx next build --no-lint 2>&1 | tail -20
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat(ai): install suggestion, confirmation, attachments, model-selector"
```

---

## Task 4: Install Reasoning components (Reasoning, ChainOfThought)

**Files:**
- Create: `components/ai-elements/reasoning.tsx`
- Create: `components/ai-elements/chain-of-thought.tsx`

**Step 1: Install components**

```bash
npx ai-elements@latest add reasoning chain-of-thought
```

New npm dependency expected:
- `@radix-ui/react-use-controllable-state`

**Step 2: Fix import paths**

```bash
grep -r "@/registry" components/ai-elements/
```

Fix as before.

**Step 3: Verify compilation**

```bash
npx next build --no-lint 2>&1 | tail -20
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat(ai): install reasoning and chain-of-thought components"
```

---

## Task 5: Install Citation components (Sources, InlineCitation, Context)

**Files:**
- Create: `components/ai-elements/sources.tsx`
- Create: `components/ai-elements/inline-citation.tsx`
- Create: `components/ai-elements/context.tsx`

**Step 1: Install components**

```bash
npx ai-elements@latest add sources inline-citation context
```

New npm dependencies expected:
- `tokenlens` (for context component)

New shadcn primitives expected:
- `carousel` (for inline-citation)
- `progress` (for context)

**Step 2: Fix import paths**

```bash
grep -r "@/registry" components/ai-elements/
```

Fix as before.

**Step 3: Verify compilation**

```bash
npx next build --no-lint 2>&1 | tail -20
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat(ai): install sources, inline-citation, context components"
```

---

## Task 6: Adapt styling — Design tokens migration

For each component in `components/ai-elements/`, replace shadcn CSS variable references with Blazz design tokens.

**Files:**
- Modify: All files in `components/ai-elements/*.tsx`

**Step 1: Audit current color usage**

```bash
grep -n "text-primary\|text-muted\|bg-primary\|bg-muted\|bg-secondary\|border-border\|text-foreground\|bg-background\|bg-accent\|text-accent" components/ai-elements/*.tsx
```

**Step 2: Replace shadcn color classes with Blazz tokens**

Mapping:
| shadcn class | Blazz equivalent |
|-------------|-----------------|
| `text-primary` | `text-fg` |
| `text-muted-foreground` | `text-fg-muted` |
| `text-foreground` | `text-fg` |
| `bg-background` | `bg-surface` |
| `bg-muted` | `bg-raised` |
| `bg-primary` | `bg-brand` |
| `bg-secondary` | `bg-raised` |
| `bg-accent` | `bg-raised-hover` |
| `border-border` | `border-edge` |
| `text-destructive` | `text-danger` |

Apply these replacements across all `components/ai-elements/*.tsx` files.

**Step 3: Replace CSS variable references in inline styles**

Look for `var(--color-*)` or `var(--*)` references and update to Blazz tokens.

**Step 4: Verify light and dark mode**

Start dev server (`pnpm dev`), import a component in a test page, verify both themes render correctly.

**Step 5: Commit**

```bash
git add components/ai-elements/
git commit -m "style(ai): adapt all components to Blazz design tokens"
```

---

## Task 7: Create barrel export

**Files:**
- Create: `components/ai-elements/index.ts`

**Step 1: Create the barrel export file**

```ts
// components/ai-elements/index.ts
export * from "./shimmer"
export * from "./message"
export * from "./conversation"
export * from "./prompt-input"
export * from "./suggestion"
export * from "./confirmation"
export * from "./attachments"
export * from "./model-selector"
export * from "./reasoning"
export * from "./chain-of-thought"
export * from "./sources"
export * from "./inline-citation"
export * from "./context"
```

**Step 2: Verify no naming conflicts**

```bash
npx next build --no-lint 2>&1 | tail -20
```

**Step 3: Commit**

```bash
git add components/ai-elements/index.ts
git commit -m "feat(ai): add barrel export for all AI elements"
```

---

## Task 8: Create showcase page — AI Elements index

**Files:**
- Create: `app/(frame)/components/ai/page.tsx`

**Step 1: Create the index page**

Create a page that lists all 13 AI components with a small preview/description card for each. Use the existing showcase page pattern from `app/(frame)/components/`.

Check existing showcase pages for the pattern:
```bash
ls app/\(frame\)/components/ 2>/dev/null || ls app/\(docs\)/components/ 2>/dev/null
```

The index page should display:
- Title: "AI Elements"
- Subtitle: "Composants d'interface IA pour construire des chatbots, assistants et copilots."
- Grid of 13 component cards with name, short description, and link to detail page

**Step 2: Verify the page renders**

Navigate to `/components/ai` in the dev server.

**Step 3: Commit**

```bash
git add "app/(frame)/components/ai/"
git commit -m "feat(ai): add AI elements showcase index page"
```

---

## Task 9: Create showcase page — Conversation demo

This is the hero demo page showing a full chat interface with all core components working together.

**Files:**
- Create: `app/(frame)/components/ai/conversation/page.tsx`

**Step 1: Create the conversation demo page**

Build a complete chat demo with mock data:
- `Conversation` container with auto-scroll
- Several `Message` components (user + assistant) with mock content
- `PromptInput` at the bottom (non-functional, visual only)
- `Suggestion` chips above the input
- One message showing `Reasoning` block (collapsed)
- One message showing `Sources`

Use static mock data — no hooks like `useChat`. Structure:

```tsx
const mockMessages = [
  { role: "user", content: "Comment optimiser les performances de mon app React ?" },
  { role: "assistant", content: "Voici plusieurs stratégies...", reasoning: "..." },
  // etc.
]
```

**Step 2: Verify the page renders correctly in both themes**

**Step 3: Commit**

```bash
git add "app/(frame)/components/ai/"
git commit -m "feat(ai): add conversation showcase demo page"
```

---

## Task 10: Create showcase pages — Individual component demos

**Files:**
- Create: `app/(frame)/components/ai/message/page.tsx`
- Create: `app/(frame)/components/ai/prompt-input/page.tsx`
- Create: `app/(frame)/components/ai/suggestion/page.tsx`
- Create: `app/(frame)/components/ai/reasoning/page.tsx`
- Create: `app/(frame)/components/ai/chain-of-thought/page.tsx`
- Create: `app/(frame)/components/ai/sources/page.tsx`
- Create: `app/(frame)/components/ai/inline-citation/page.tsx`
- Create: `app/(frame)/components/ai/confirmation/page.tsx`
- Create: `app/(frame)/components/ai/attachments/page.tsx`
- Create: `app/(frame)/components/ai/model-selector/page.tsx`
- Create: `app/(frame)/components/ai/context/page.tsx`
- Create: `app/(frame)/components/ai/shimmer/page.tsx`

**Step 1: Create individual demo pages**

For each component, create a showcase page with:
- Component name and description
- 2-3 variants/examples with mock data
- Light/dark preview

Keep pages simple — one component per page with clear examples.

**Step 2: Verify all pages render**

Navigate to each route in the dev server.

**Step 3: Commit**

```bash
git add "app/(frame)/components/ai/"
git commit -m "feat(ai): add individual component showcase pages"
```

---

## Task 11: Add AI section to showcase navigation

**Files:**
- Modify: `config/navigation.ts`

**Step 1: Read the current navigation config**

```bash
cat config/navigation.ts
```

**Step 2: Add AI Elements section**

Add a new navigation group "AI Elements" with links to all 13 component pages plus the index page. Place it after the existing component groups.

**Step 3: Verify sidebar navigation**

Start dev server, check that the AI Elements section appears in the showcase sidebar.

**Step 4: Commit**

```bash
git add config/navigation.ts
git commit -m "feat(ai): add AI elements section to showcase navigation"
```

---

## Task 12: Final verification & cleanup

**Step 1: Full build check**

```bash
npx next build --no-lint
```

**Step 2: Visual check**

Navigate through all AI showcase pages in both light and dark mode. Verify:
- All components render without errors
- Styling is consistent with Blazz design system
- Navigation works correctly
- No console errors

**Step 3: Clean up any unused imports or dead code**

**Step 4: Final commit**

```bash
git add .
git commit -m "chore(ai): final cleanup and verification"
```
