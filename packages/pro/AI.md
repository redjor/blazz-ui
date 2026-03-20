# @blazz/pro — AI Context

> Read before generating any @blazz/pro code.

## Critical Patterns

### 1. Import paths
- Blocks: `@blazz/pro/components/blocks/{name}` (e.g. data-table, stats-grid)
- AI core: `@blazz/pro/components/ai/{domain}` (e.g. chat, reasoning, tools) — direct import, NO barrel
- AI generative: `@blazz/pro/components/ai/generative/{domain}/{name}` — direct import

### 2. No barrel export for AI
AI components are NOT exported from `@blazz/pro` barrel. Import directly from their module path. `import { ChatMessage } from "@blazz/pro"` will NOT work.

### 3. @blazz/ui is a peer dependency
Use @blazz/ui primitives (Button, Dialog, Badge, etc.) — don't recreate them. @blazz/pro builds on top of @blazz/ui.

### 4. License required
All @blazz/pro components are wrapped with `withProGuard()`. Wrap your app in `<BlazzProvider licenseKey={key}>` to unlock them.

---

## Component Index — Blocks

| Component | Import | Key Gotcha |
|-----------|--------|------------|
| DataTable | `@blazz/pro/components/blocks/data-table` | Import from @blazz/pro/components/blocks/data-table — not from @blazz/ui |
| StatsGrid | `@blazz/pro/components/blocks/stats-grid` | Maximum 4 stats per row — beyond that the eye doesn't know where to focus |
| FilterBar | `@blazz/pro/components/blocks/filter-bar` | FilterBar goes ABOVE the DataTable, outside of it — not inside |
| DetailPanel | `@blazz/pro/components/blocks/detail-panel` | DetailPanel is a compound component — always use DetailPanel.Header and DetailPa |
| ActivityTimeline | `@blazz/pro/components/blocks/activity-timeline` | The prop is 'events', not 'activities' — the component uses TimelineEvent, not A |

## Component Index — AI Core

| Component | Import | Key Gotcha |
|-----------|--------|------------|
| Message | `@blazz/pro/components/ai/chat` | from prop is required — without it, no message styling is applied |
| Conversation | `@blazz/pro/components/ai/chat` | ConversationScrollButton must be inside Conversation — uses StickToBottom contex |
| PromptInput | `@blazz/pro/components/ai/chat` | Without PromptInputProvider, state is local to PromptInput — use Provider to lif |
| Attachments | `@blazz/pro/components/ai/chat` | variant controls layout: grid (96px squares), inline (h-8 chips), list (full-wid |
| Shimmer | `@blazz/pro/components/ai/chat` | Only accepts string children — not ReactNode. Passing JSX will break |
| Suggestions | `@blazz/pro/components/ai/chat` | onClick receives the suggestion string — not a click event |
| ChainOfThought | `@blazz/pro/components/ai/reasoning` | All child components require ChainOfThought context — throws if used standalone |
| Reasoning | `@blazz/pro/components/ai/reasoning` | Auto-opens when isStreaming=true — set defaultOpen={false} to prevent this behav |
| InlineCitation | `@blazz/pro/components/ai/reasoning` | sources prop on InlineCitationCardTrigger is array of URLs — parses first URL fo |
| Sources | `@blazz/pro/components/ai/reasoning` | All links open in new tab by default (target='_blank') |
| Confirmation | `@blazz/pro/components/ai/tools` | Complex conditional rendering — ConfirmationRequest only shows when state='appro |
| Context | `@blazz/pro/components/ai/tools` | Cost calculation requires modelId — without it, footer shows no cost |
| ModelSelector | `@blazz/pro/components/ai/tools` | ModelSelectorLogo provider prop supports 100+ providers — fetches SVG from model |

---

## Full Component Reference — Blocks

### DataTable

`@blazz/pro/components/blocks/data-table`
Named: `DataTable, col`

- ⚠️ Import from @blazz/pro/components/blocks/data-table — not from @blazz/ui
- ⚠️ Use col() factory for column definitions — not raw ColumnDef from TanStack Table
- ⚠️ For preset tables (CRM, StockBase) use createCompaniesPreset/createContactsPreset etc.
- ⚠️ getRowId is required for row selection to work correctly

```tsx
import { DataTable, col } from "@blazz/pro/components/blocks/data-table"

const columns = [
  col.text("name", { header: "Name", cell: (row) => row.name }),
  col.badge("status", { header: "Status", cell: (row) => row.status }),
  col.actions([
    { label: "Edit", onClick: (row) => handleEdit(row) },
    { label: "Delete", onClick: (row) => handleDelete(row), destructive: true },
  ]),
]

<DataTable
  data={contacts}
  columns={columns}
  getRowId={(row) => row.id}
  onRowClick={(row) => navigate(`/contacts/${row.id}`)}
/>
```

### StatsGrid

`@blazz/pro/components/blocks/stats-grid`
Named: `StatsGrid`

- ⚠️ Maximum 4 stats per row — beyond that the eye doesn't know where to focus
- ⚠️ trend is a number (positive = green ▲, negative = red ▼)
- ⚠️ value should be pre-formatted string ('€1.2M', '2 847') — not a raw number
- ⚠️ icon accepts a LucideIcon component reference (icon: DollarSign), not a JSX element
- ⚠️ trendInverted reverses the color logic — use it for metrics where lower is better (e.g. bug count, churn)

```tsx
import { DollarSign, Users, Briefcase, TrendingUp } from "lucide-react"

<StatsGrid
  stats={[
    { label: "Revenue", value: "€1.2M", trend: 8.2, icon: DollarSign },
    { label: "Contacts", value: "2 847", trend: 12, icon: Users },
    { label: "Deals", value: "143", trend: -3.1, icon: Briefcase },
    { label: "Win Rate", value: "34%", trend: 2.4, icon: TrendingUp },
  ]}
/>
```

### FilterBar

`@blazz/pro/components/blocks/filter-bar`
Named: `FilterBar`

- ⚠️ FilterBar goes ABOVE the DataTable, outside of it — not inside
- ⚠️ Persist filters in URL searchParams for back-button support
- ⚠️ onReset should clear both search and all activeFilters

```tsx
<FilterBar
  search={search}
  onSearchChange={setSearch}
  activeFilters={filters}
  onFilterChange={setFilters}
  onReset={() => { setSearch(""); setFilters({}) }}
  filters={[
    { key: "status", label: "Status", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
  ]}
/>
```

### DetailPanel

`@blazz/pro/components/blocks/detail-panel`
Named: `DetailPanel`

- ⚠️ DetailPanel is a compound component — always use DetailPanel.Header and DetailPanel.Section, never pass title/subtitle/actions directly on <DetailPanel>
- ⚠️ DetailPanelProperty does not exist — render field values as plain JSX (dl/dt/dd or custom layout) inside DetailPanel.Section
- ⚠️ actions on DetailPanel.Header accepts DetailPanelAction[] (array of objects), not React.ReactNode
- ⚠️ Missing values should display '—' (em dash), never empty string
- ⚠️ For tabbed detail views, wrap DetailPanel children in Tabs from @blazz/ui/components/ui/tabs — DetailPanel does not include tabs itself

```tsx
import { Pencil, Trash2 } from "lucide-react"

<DetailPanel>
  <DetailPanel.Header
    title={contact.name}
    subtitle={contact.role}
    status={<Badge variant="success">Active</Badge>}
    actions={[
      { label: "Edit", icon: Pencil, variant: "outline", onClick: () => openEdit() },
      { label: "Delete", icon: Trash2, variant: "destructive", onClick: () => handleDelete() },
    ]}
  />
  <DetailPanel.Section title="Contact Info">
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <dt className="text-fg-muted">Email</dt>
      <dd>{contact.email}</dd>
      <dt className="text-fg-muted">Phone</dt>
      <dd>{contact.phone ?? "—"}</dd>
    </dl>
  </DetailPanel.Section>
  <DetailPanel.Section title="Company" description="Organisation associée">
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <dt className="text-fg-muted">Name</dt>
      <dd>{contact.company ?? "—"}</dd>
    </dl>
  </DetailPanel.Section>
</DetailPanel>
```

### ActivityTimeline

`@blazz/pro/components/blocks/activity-timeline`
Named: `ActivityTimeline`

- ⚠️ The prop is 'events', not 'activities' — the component uses TimelineEvent, not Activity
- ⚠️ 'user' is a plain string (display name), not an object — no avatarUrl or id
- ⚠️ 'date' must be an ISO string parseable by new Date() — the component formats it internally
- ⚠️ 'action' is the main event label; 'detail' is an optional secondary line shown in muted text
- ⚠️ Always provide loading state — timeline is usually async

```tsx
const events = [
  { date: new Date().toISOString(), user: "Alice", action: "Called the client", detail: "Left a voicemail" },
  { date: new Date().toISOString(), user: "Bob", action: "Sent proposal email" },
]

<ActivityTimeline events={events} loading={false} />
```

---

## Full Component Reference — AI Core

### Message

`@blazz/pro/components/ai/chat`
Named: `Message, MessageContent, MessageActions, MessageAction, MessageResponse, MessageToolbar, MessageBranch, MessageBranchContent, MessageBranchSelector`

- ⚠️ from prop is required — without it, no message styling is applied
- ⚠️ MessageResponse only accepts string children (markdown) — it's memoized with custom equality check
- ⚠️ MessageAction needs tooltip prop for accessibility — renders icon-only button by default
- ⚠️ MessageBranchContent requires array of ReactElements as children — not strings

```tsx
<Message from="assistant">
  <MessageContent>
    <MessageResponse>
      # Response\nMarkdown content here
    </MessageResponse>
  </MessageContent>
  <MessageActions>
    <MessageAction tooltip="Copy"><CopyIcon /></MessageAction>
  </MessageActions>
</Message>
```

### Conversation

`@blazz/pro/components/ai/chat`
Named: `Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton, ConversationDownload`

- ⚠️ ConversationScrollButton must be inside Conversation — uses StickToBottom context, throws otherwise
- ⚠️ ConversationDownload creates markdown blob — pass messages array and optional filename (default: conversation.md)
- ⚠️ ConversationEmptyState renders centered when no messages — customize with title, description, icon props

```tsx
<Conversation>
  <ConversationContent>
    {messages.map((msg) => (
      <Message key={msg.id} from={msg.role}>
        <MessageContent><MessageResponse>{msg.content}</MessageResponse></MessageContent>
      </Message>
    ))}
  </ConversationContent>
  <ConversationScrollButton />
</Conversation>
```

### PromptInput

`@blazz/pro/components/ai/chat`
Named: `PromptInput, PromptInputProvider, PromptInputBody, PromptInputTextarea, PromptInputHeader, PromptInputFooter, PromptInputTools, PromptInputSubmit, PromptInputActionMenu, PromptInputActionMenuTrigger, PromptInputActionMenuContent`

- ⚠️ Without PromptInputProvider, state is local to PromptInput — use Provider to lift state across components
- ⚠️ onSubmit receives { text, files } — not just a string. Handle both fields
- ⚠️ Enter submits, Shift+Enter for newline — paste image support is built-in
- ⚠️ PromptInputSubmit responds to status prop: 'submitted' | 'streaming' shows spinner/stop, 'error' shows X

```tsx
<PromptInput
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
</PromptInput>
```

### Attachments

`@blazz/pro/components/ai/chat`
Named: `Attachments, Attachment, AttachmentPreview, AttachmentInfo, AttachmentRemove`

- ⚠️ variant controls layout: grid (96px squares), inline (h-8 chips), list (full-width rows)
- ⚠️ Attachment data prop requires id field — type is FileUIPart & { id: string }
- ⚠️ AttachmentInfo is hidden in grid variant — only visible in inline and list
- ⚠️ AttachmentPreview only renders images/videos if data has url field

```tsx
<Attachments variant="grid">
  {files.map((file) => (
    <Attachment key={file.id} data={file} onRemove={() => removeFile(file.id)}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  ))}
</Attachments>
```

### Shimmer

`@blazz/pro/components/ai/chat`
Named: `Shimmer`

- ⚠️ Only accepts string children — not ReactNode. Passing JSX will break
- ⚠️ Infinite animation — no way to stop it, unmount the component instead
- ⚠️ Uses framer-motion internally — component is memoized

```tsx
<Shimmer duration={2}>Thinking...</Shimmer>
```

### Suggestions

`@blazz/pro/components/ai/chat`
Named: `Suggestions, Suggestion`

- ⚠️ onClick receives the suggestion string — not a click event
- ⚠️ Suggestions wraps ScrollArea — horizontal scroll, hidden scrollbar
- ⚠️ Children of Suggestion override displayed text but onClick still receives the suggestion prop value

```tsx
<Suggestions>
  <Suggestion suggestion="How does it work?" onClick={handleSuggestion}>
    How does it work?
  </Suggestion>
  <Suggestion suggestion="Tell me more" onClick={handleSuggestion} />
</Suggestions>
```

### ChainOfThought

`@blazz/pro/components/ai/reasoning`
Named: `ChainOfThought, ChainOfThoughtHeader, ChainOfThoughtContent, ChainOfThoughtStep, ChainOfThoughtSearchResults, ChainOfThoughtSearchResult, ChainOfThoughtImage`

- ⚠️ All child components require ChainOfThought context — throws if used standalone
- ⚠️ ChainOfThoughtStep status controls styling: 'complete' (muted), 'active' (foreground), 'pending' (muted/50)
- ⚠️ Vertical connector line assumes steps are in DOM order — don't reorder dynamically
- ⚠️ ChainOfThoughtStep icon defaults to DotIcon — pass LucideIcon component reference (not JSX)

```tsx
<ChainOfThought defaultOpen>
  <ChainOfThoughtHeader>Reasoning Steps</ChainOfThoughtHeader>
  <ChainOfThoughtContent>
    <ChainOfThoughtStep icon={SearchIcon} label="Searching" status="complete" />
    <ChainOfThoughtStep label="Analyzing" status="active">
      <ChainOfThoughtSearchResults>
        <ChainOfThoughtSearchResult>Source 1</ChainOfThoughtSearchResult>
      </ChainOfThoughtSearchResults>
    </ChainOfThoughtStep>
  </ChainOfThoughtContent>
</ChainOfThought>
```

### Reasoning

`@blazz/pro/components/ai/reasoning`
Named: `Reasoning, ReasoningTrigger, ReasoningContent`

- ⚠️ Auto-opens when isStreaming=true — set defaultOpen={false} to prevent this behavior
- ⚠️ Auto-closes 1 second after streaming ends — one-time behavior, won't auto-close again
- ⚠️ ReasoningContent requires string children (markdown rendered via Streamdown) — not React nodes
- ⚠️ ReasoningTrigger shows Shimmer animation while streaming, then 'Thought for Ns' after

```tsx
<Reasoning isStreaming={isStreaming}>
  <ReasoningTrigger />
  <ReasoningContent>
    # Analysis\n\nThe data suggests...
  </ReasoningContent>
</Reasoning>
```

### InlineCitation

`@blazz/pro/components/ai/reasoning`
Named: `InlineCitation, InlineCitationText, InlineCitationCard, InlineCitationCardTrigger, InlineCitationCardBody, InlineCitationSource`

- ⚠️ sources prop on InlineCitationCardTrigger is array of URLs — parses first URL for domain display
- ⚠️ Carousel components need InlineCitationCarousel context — wrap items in the carousel
- ⚠️ Badge shows '{domain} +{N}' format — falls back to 'unknown' if URL parsing fails

```tsx
<InlineCitation>
  <InlineCitationText>Referenced text</InlineCitationText>
  <InlineCitationCard>
    <InlineCitationCardTrigger sources={["https://example.com"]} />
    <InlineCitationCardBody>
      <InlineCitationSource title="Example" url="https://example.com" description="Source details" />
    </InlineCitationCardBody>
  </InlineCitationCard>
</InlineCitation>
```

### Sources

`@blazz/pro/components/ai/reasoning`
Named: `Sources, SourcesTrigger, SourcesContent, Source`

- ⚠️ All links open in new tab by default (target='_blank')
- ⚠️ count prop on SourcesTrigger is manual — not auto-counted from children
- ⚠️ Source is an anchor element — pass href and title props

```tsx
<Sources>
  <SourcesTrigger count={2} />
  <SourcesContent>
    <Source href="https://example.com" title="Example Article" />
    <Source href="https://other.com" title="Other Source" />
  </SourcesContent>
</Sources>
```

### Confirmation

`@blazz/pro/components/ai/tools`
Named: `Confirmation, ConfirmationTitle, ConfirmationRequest, ConfirmationAccepted, ConfirmationRejected, ConfirmationActions, ConfirmationAction`

- ⚠️ Complex conditional rendering — ConfirmationRequest only shows when state='approval-requested'
- ⚠️ ConfirmationAccepted/Rejected only render when approval matches AND state is approval-responded/output-*
- ⚠️ No built-in approval state management — you must handle approve/reject externally
- ⚠️ Returns null when no approval or state is input-streaming/input-available

```tsx
<Confirmation approval={approval} state={toolState}>
  <ConfirmationTitle>Execute database query?</ConfirmationTitle>
  <ConfirmationRequest>This will run a SELECT query on the users table.</ConfirmationRequest>
  <ConfirmationAccepted>Query approved</ConfirmationAccepted>
  <ConfirmationRejected>Query rejected</ConfirmationRejected>
  <ConfirmationActions>
    <ConfirmationAction variant="default" onClick={approve}>Approve</ConfirmationAction>
    <ConfirmationAction variant="outline" onClick={reject}>Reject</ConfirmationAction>
  </ConfirmationActions>
</Confirmation>
```

### Context

`@blazz/pro/components/ai/tools`
Named: `Context, ContextTrigger, ContextContent, ContextContentHeader, ContextContentBody, ContextContentFooter, ContextInputUsage, ContextOutputUsage`

- ⚠️ Cost calculation requires modelId — without it, footer shows no cost
- ⚠️ ContextTrigger renders SVG pie chart showing usage percentage — hoverable
- ⚠️ Tokens formatted with compact notation ('1.2K') — not raw numbers
- ⚠️ Usage sub-components auto-hide when their token count is 0

```tsx
<Context usedTokens={1250} maxTokens={4096} usage={{ inputTokens: 800, outputTokens: 450 }} modelId="gpt-4">
  <ContextTrigger />
  <ContextContent>
    <ContextContentHeader />
    <ContextContentBody>
      <ContextInputUsage />
      <ContextOutputUsage />
    </ContextContentBody>
    <ContextContentFooter />
  </ContextContent>
</Context>
```

### ModelSelector

`@blazz/pro/components/ai/tools`
Named: `ModelSelector, ModelSelectorTrigger, ModelSelectorContent, ModelSelectorInput, ModelSelectorList, ModelSelectorGroup, ModelSelectorItem, ModelSelectorLogo, ModelSelectorName`

- ⚠️ ModelSelectorLogo provider prop supports 100+ providers — fetches SVG from models.dev (requires internet)
- ⚠️ provider is a TypeScript union type with autocomplete — 'openai' | 'anthropic' | 'google' | etc.
- ⚠️ Can use ModelSelectorDialog (CommandDialog) as alternative to Dialog-based selector for keyboard shortcuts
- ⚠️ Logo images use dark:invert — designed for both light and dark themes

```tsx
<ModelSelector open={open} onOpenChange={setOpen}>
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
</ModelSelector>
```

---

## AI Generative Components

> 38 ready-to-use UI cards for AI chat responses. Import directly from `@blazz/pro/components/ai/generative/{domain}/{name}`.

### Commerce

### InvoiceCard

Import: `@blazz/pro/components/ai/generative/commerce/invoice-card`
Named: `InvoiceCard`

Invoice card with number, client, amount, status badge, dates, and line items.
Use case: Display invoice details in AI chat responses.

```tsx
<InvoiceCard number="INV-001" client="Acme Corp" amount={1200} status="paid" date="2026-01-15" />
```

### PricingTable

Import: `@blazz/pro/components/ai/generative/commerce/pricing-table`
Named: `PricingTable`

Pricing tiers comparison with features, price, description, and recommended badge.
Use case: Show pricing plans or subscription options in AI responses.

```tsx
<PricingTable tiers={[{ name: "Free", price: 0, features: ["5 users"] }, { name: "Pro", price: 29, features: ["Unlimited"], recommended: true }]} />
```

### ProductCard

Import: `@blazz/pro/components/ai/generative/commerce/product-card`
Named: `ProductCard`

Product card with name, price, category, status badge, and image.
Use case: Display product information in AI commerce responses.

```tsx
<ProductCard name="Widget Pro" price={49.99} category="Electronics" status="in-stock" />
```

### QuoteSummary

Import: `@blazz/pro/components/ai/generative/commerce/quote-summary`
Named: `QuoteSummary`

Quote summary with number, client, total, status, validity date, and item count.
Use case: Show quote details in AI sales responses.

```tsx
<QuoteSummary number="Q-2026-042" client="Acme" total={5400} status="pending" validUntil="2026-04-01" items={3} />
```

### TransactionCard

Import: `@blazz/pro/components/ai/generative/commerce/transaction-card`
Named: `TransactionCard`

Transaction card with title, amount, type (incoming/outgoing), status, method, and reference.
Use case: Display financial transaction details in AI responses.

```tsx
<TransactionCard title="Payment received" amount={500} type="incoming" status="completed" method="card" />
```

### Content

### FileCard

Import: `@blazz/pro/components/ai/generative/content/file-card`
Named: `FileCard`

File card with icon, name, type, size, and download link.
Use case: Display file information with download action in AI responses.

```tsx
<FileCard name="report.pdf" type="application/pdf" size={2048000} href="/files/report.pdf" />
```

### ImageGallery

Import: `@blazz/pro/components/ai/generative/content/image-gallery`
Named: `ImageGallery`

Image carousel with navigation arrows, dots, and captions.
Use case: Display multiple images in AI responses.

```tsx
<ImageGallery images={[{ src: "/img1.jpg", alt: "Photo 1", caption: "First image" }]} />
```

### InsightCard

Import: `@blazz/pro/components/ai/generative/content/insight-card`
Named: `InsightCard`

Insight card with icon, title, description, type badge, confidence bar, and source.
Use case: Present AI-generated insights and analysis findings.

```tsx
<InsightCard title="Revenue Trend" description="Revenue increased 12% QoQ" type="positive" confidence={0.85} />
```

### LinkPreview

Import: `@blazz/pro/components/ai/generative/content/link-preview`
Named: `LinkPreview`

Link preview card with domain, thumbnail, title, and description.
Use case: Show rich link previews when AI references URLs.

```tsx
<LinkPreview url="https://example.com" title="Example Site" description="A sample website" />
```

### LocationCard

Import: `@blazz/pro/components/ai/generative/content/location-card`
Named: `LocationCard`

Location card with address, city, country, and Google Maps link.
Use case: Display location information in AI responses.

```tsx
<LocationCard address="123 Main St" city="Paris" country="France" />
```

### SummaryCard

Import: `@blazz/pro/components/ai/generative/content/summary-card`
Named: `SummaryCard`

Summary card with title, bullet points, conclusion, and source.
Use case: Present summarized content or key takeaways in AI responses.

```tsx
<SummaryCard title="Meeting Summary" points={["Discussed Q1 results", "Set Q2 goals"]} conclusion="Next review in April" />
```

### VideoCard

Import: `@blazz/pro/components/ai/generative/content/video-card`
Named: `VideoCard`

Video card with thumbnail, play button, duration, title, and channel.
Use case: Display video information in AI responses.

```tsx
<VideoCard title="Introduction" thumbnail="/thumb.jpg" duration="5:32" channel="Blazz" />
```

### Data

### ComparisonTable

Import: `@blazz/pro/components/ai/generative/data/comparison-table`
Named: `ComparisonTable`

Simple comparison table with labeled columns and rows.
Use case: Compare items side-by-side in AI responses.

```tsx
<ComparisonTable columns={["Feature", "Plan A", "Plan B"]} rows={[["Users", "5", "Unlimited"]]} />
```

### DataGrid

Import: `@blazz/pro/components/ai/generative/data/data-grid`
Named: `DataGrid`

Data grid with typed cells (text, badge, avatar, trend), sortable columns, and clickable rows.
Use case: Display structured tabular data in AI responses.

```tsx
<DataGrid columns={[{ key: "name", label: "Name" }]} rows={[{ name: "Alice" }]} />
```

### DataList

Import: `@blazz/pro/components/ai/generative/data/data-list`
Named: `DataList`

Labeled key-value list with optional status badges.
Use case: Display structured key-value data in AI responses.

```tsx
<DataList items={[{ label: "Status", value: "Active", badge: "success" }]} />
```

### MetricCard

Import: `@blazz/pro/components/ai/generative/data/metric-card`
Named: `MetricCard`

Metric card with label, value, trend indicator, icon, and percentage change.
Use case: Display single KPI metrics in AI responses.

```tsx
<MetricCard label="Revenue" value="€1.2M" trend={8.2} />
```

### MiniChart

Import: `@blazz/pro/components/ai/generative/data/mini-chart`
Named: `MiniChart`

Mini area chart with label, sparkline data, and current value.
Use case: Show trend visualization in AI responses.

```tsx
<MiniChart label="Users" value="2.4K" data={[10, 15, 12, 18, 22]} />
```

### ProgressCard

Import: `@blazz/pro/components/ai/generative/data/progress-card`
Named: `ProgressCard`

Progress bar card with label, percentage, and optional description.
Use case: Show progress toward goals in AI responses.

```tsx
<ProgressCard label="Project Alpha" progress={72} description="On track for Q2" />
```

### RatingCard

Import: `@blazz/pro/components/ai/generative/data/rating-card`
Named: `RatingCard`

Rating display in stars, numeric, or NPS format with review count.
Use case: Display ratings and reviews in AI responses.

```tsx
<RatingCard rating={4.5} format="stars" reviews={128} />
```

### ScoreCard

Import: `@blazz/pro/components/ai/generative/data/score-card`
Named: `ScoreCard`

Circular progress score with breakdown bars.
Use case: Display composite scores with breakdowns in AI responses.

```tsx
<ScoreCard score={85} breakdown={[{ label: "Speed", value: 90 }, { label: "Quality", value: 80 }]} />
```

### StatsRow

Import: `@blazz/pro/components/ai/generative/data/stats-row`
Named: `StatsRow`

Horizontal stats row with label, value, and optional trend.
Use case: Display inline statistics in AI responses.

```tsx
<StatsRow stats={[{ label: "Users", value: "2.8K" }, { label: "Revenue", value: "€45K", trend: 5.2 }]} />
```

### Entities

### CandidateCard

Import: `@blazz/pro/components/ai/generative/entities/candidate-card`
Named: `CandidateCard`

Candidate profile card with avatar, role, status badge, skills, experience, and match score.
Use case: Display candidate profiles in AI recruitment responses.

```tsx
<CandidateCard name="Alice Martin" role="Senior Developer" skills={["React", "TypeScript"]} matchScore={92} />
```

### CompanyCard

Import: `@blazz/pro/components/ai/generative/entities/company-card`
Named: `CompanyCard`

Company profile card with logo, industry, size, revenue, location, website, and status.
Use case: Display company information in AI CRM responses.

```tsx
<CompanyCard name="Acme Corp" industry="Technology" size="50-200" location="Paris" />
```

### ContactCard

Import: `@blazz/pro/components/ai/generative/entities/contact-card`
Named: `ContactCard`

Contact card with avatar, name, role, company, email, phone, last contact, and tags.
Use case: Display contact information in AI CRM responses.

```tsx
<ContactCard name="Bob Smith" role="CTO" company="Acme" email="bob@acme.com" />
```

### DealCard

Import: `@blazz/pro/components/ai/generative/entities/deal-card`
Named: `DealCard`

Deal card with title, amount, stage badge, probability, company, close date, and owner.
Use case: Display deal pipeline information in AI sales responses.

```tsx
<DealCard title="Enterprise License" amount={50000} stage="negotiation" probability={60} company="Acme" />
```

### UserCard

Import: `@blazz/pro/components/ai/generative/entities/user-card`
Named: `UserCard`

User card with avatar, name, role, department, and online status badge.
Use case: Display user profiles in AI team responses.

```tsx
<UserCard name="Alice" role="Designer" department="Product" status="online" />
```

### Planning

### AvailabilityCard

Import: `@blazz/pro/components/ai/generative/planning/availability-card`
Named: `AvailabilityCard`

Time slot availability calendar with selectable slots (available, busy, tentative).
Use case: Show scheduling availability in AI responses.

```tsx
<AvailabilityCard date="2026-03-20" slots={[{ time: "09:00", status: "available" }, { time: "10:00", status: "busy" }]} />
```

### CalendarCard

Import: `@blazz/pro/components/ai/generative/planning/calendar-card`
Named: `CalendarCard`

Mini calendar view with events per day and status indicators.
Use case: Display calendar overview in AI scheduling responses.

```tsx
<CalendarCard month={3} year={2026} events={[{ date: "2026-03-20", title: "Meeting", status: "confirmed" }]} />
```

### EventCard

Import: `@blazz/pro/components/ai/generative/planning/event-card`
Named: `EventCard`

Event card with type badge, date, time, location, and participant avatars.
Use case: Display event details in AI scheduling responses.

```tsx
<EventCard title="Team Standup" type="meeting" date="2026-03-20" time="09:00" location="Room A" />
```

### StatusUpdate

Import: `@blazz/pro/components/ai/generative/planning/status-update`
Named: `StatusUpdate`

Status change card showing before/after state with badges.
Use case: Display status transitions in AI workflow responses.

```tsx
<StatusUpdate entity="Deal #42" from="negotiation" to="won" updatedBy="Alice" />
```

### Timeline

Import: `@blazz/pro/components/ai/generative/planning/timeline`
Named: `Timeline`

Vertical timeline with items, icons, descriptions, and timestamps.
Use case: Display chronological events in AI responses.

```tsx
<Timeline items={[{ title: "Created", description: "Project started", date: "2026-01-01" }]} />
```

### Workflow

### ActionList

Import: `@blazz/pro/components/ai/generative/workflow/action-list`
Named: `ActionList`

Clickable list of actions with icons, labels, and descriptions.
Use case: Present actionable options in AI responses.

```tsx
<ActionList actions={[{ label: "Send email", description: "Draft and send", icon: "mail" }]} />
```

### ApprovalCard

Import: `@blazz/pro/components/ai/generative/workflow/approval-card`
Named: `ApprovalCard`

Approval request card with status badge, description, and detail rows.
Use case: Display approval requests in AI workflow responses.

```tsx
<ApprovalCard title="Budget Approval" status="pending" amount={5000} requestedBy="Alice" />
```

### ChecklistCard

Import: `@blazz/pro/components/ai/generative/workflow/checklist-card`
Named: `ChecklistCard`

Interactive checklist with progress bar and toggleable items.
Use case: Display task checklists in AI responses.

```tsx
<ChecklistCard title="Launch Checklist" items={[{ label: "Tests passing", checked: true }, { label: "Deploy", checked: false }]} />
```

### EmailPreview

Import: `@blazz/pro/components/ai/generative/workflow/email-preview`
Named: `EmailPreview`

Email preview with subject, from/to info, body excerpt, and attachment count.
Use case: Preview email content in AI communication responses.

```tsx
<EmailPreview subject="Q1 Report" from="alice@acme.com" to="team@acme.com" body="Please find attached..." />
```

### MessagePreview

Import: `@blazz/pro/components/ai/generative/workflow/message-preview`
Named: `MessagePreview`

Message preview for SMS, WhatsApp, Slack, or Email with platform icon.
Use case: Preview messages across platforms in AI responses.

```tsx
<MessagePreview platform="slack" from="Alice" message="Hey team, the deploy is done!" />
```

### PollCard

Import: `@blazz/pro/components/ai/generative/workflow/poll-card`
Named: `PollCard`

Poll/survey with voteable options, results percentage, and vote count.
Use case: Display polls or surveys in AI responses.

```tsx
<PollCard question="Preferred stack?" options={[{ label: "React", votes: 12 }, { label: "Vue", votes: 5 }]} />
```

### TaskCard

Import: `@blazz/pro/components/ai/generative/workflow/task-card`
Named: `TaskCard`

Task card with status icon, priority badge, due date, subtasks, and assignee avatar.
Use case: Display task information in AI project management responses.

```tsx
<TaskCard title="Fix login bug" priority="high" status="in-progress" dueDate="2026-03-25" assignee="Bob" />
```
