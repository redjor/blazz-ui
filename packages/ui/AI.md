# @blazz/ui — AI Context

> Read before generating any @blazz/ui code.

> **Package split:** Blocks (data-table, charts, kanban...) and AI components have moved to `@blazz/pro`.
> Import: `import { DataTable } from "@blazz/pro/components/blocks/data-table"`
> Import: `import { ChatMessage } from "@blazz/pro/components/ai/chat"`

## Critical Patterns

### 1. Select — ALWAYS pass items
Without `items`, SelectValue shows raw value ('active'), not label ('Active').
```tsx
<Select items={[{ value: "active", label: "Active" }]} value={v} onValueChange={setV}>
```

### 2. Triggers — render={} not asChild (Base UI)
```tsx
<DialogTrigger render={<Button />}>Open</DialogTrigger>  // ✅
<DialogTrigger asChild><Button /></DialogTrigger>         // ❌
```

### 3. Dates — DateSelector not input type='date'
```tsx
import { DateSelector } from "@blazz/ui/components/ui/date-selector"
<DateSelector value={date} onValueChange={setDate} formatStr="dd/MM/yyyy" />
```

### 4. Forms — react-hook-form + zod always
Never useState for form fields. Always useForm + zodResolver.

### 5. 4 required states
Every data-loading component needs: loading (Skeleton), empty (Empty), error, success.

---

## Component Index

| Component | Import | Key Gotcha |
|-----------|--------|------------|
| Select | `@blazz/ui/components/ui/select` | ALWAYS pass `items` prop — without it SelectValue renders raw value ('apple') no |
| Button | `@blazz/ui/components/ui/button` | Always add type='button' on non-submit buttons inside forms — prevents accidenta |
| Input | `@blazz/ui/components/ui/input` | With react-hook-form: spread register() props — `<Input {...register('name')} /> |
| Textarea | `@blazz/ui/components/ui/textarea` | With react-hook-form: spread register() props — `<Textarea {...register('descrip |
| Checkbox | `@blazz/ui/components/ui/checkbox` | With react-hook-form: use Controller or watch+setValue — `onCheckedChange={(chec |
| Switch | `@blazz/ui/components/ui/switch` | With react-hook-form: use watch+setValue — `onCheckedChange={(checked) => setVal |
| RadioGroup | `@blazz/ui/components/ui/radio-group` | Use the options prop API — not RadioGroupItem children, which is more verbose |
| DateSelector | `@blazz/ui/components/ui/date-selector` | NEVER use <input type='date'> — always use DateSelector |
| Combobox | `@blazz/ui/components/ui/combobox` | Use Combobox (not Select) when list > 10 items or user needs search |
| Dialog | `@blazz/ui/components/ui/dialog` | DialogTrigger uses render prop: `<DialogTrigger render={<Button />}>Open</Dialog |
| Sheet | `@blazz/ui/components/ui/sheet` | SheetTrigger uses render prop: `<SheetTrigger render={<Button />}>Open</SheetTri |
| DropdownMenu | `@blazz/ui/components/ui/dropdown-menu` | DropdownMenuTrigger uses render prop: `<DropdownMenuTrigger render={<Button size |
| Popover | `@blazz/ui/components/ui/popover` | PopoverTrigger uses render prop: `<PopoverTrigger render={<Button />}>Open</Popo |
| Tooltip | `@blazz/ui/components/ui/tooltip` | TooltipTrigger uses render prop: `<TooltipTrigger render={<Button />}>…</Tooltip |
| Badge | `@blazz/ui/components/ui/badge` | For status dots use variant='success'|'warning'|'destructive'|'info' — not custo |
| Avatar | `@blazz/ui/components/ui/avatar` | Always provide AvatarFallback with 2-letter initials — image loading can fail |
| Tabs | `@blazz/ui/components/ui/tabs` | TabsList variant prop: 'default' (underline) | 'pills' (filled buttons) |
| Skeleton | `@blazz/ui/components/ui/skeleton` | Always mirror the real content structure — a skeleton row should look like a rea |
| AppFrame | `@blazz/ui/components/patterns/app-frame` | Import from @blazz/ui/components/patterns/app-frame — not from @blazz/ui directl |
| AppSidebar | `@blazz/ui/components/patterns/app-sidebar` | Prefer AppFrame over AppSidebar directly — AppFrame handles sidebar + top bar +  |
| AppTopBar | `@blazz/ui/components/patterns/app-top-bar` | Prefer AppFrame over AppTopBar directly — AppFrame includes the top bar |
| FormField | `@blazz/ui/components/patterns/form-field` | Always use FormField to wrap inputs in forms — never write label+input+error man |
| FieldGrid | `@blazz/ui/components/patterns/field-grid` | Use col-span-2 or col-span-3 on children for full-width fields (textarea, addres |
| PageHeaderShell | `@blazz/ui/components/patterns/page-header-shell` | Primary action goes in actions prop (top-right), always a Button variant='defaul |
| DataTable | `@blazz/pro/components/blocks/data-table` | Import from @blazz/pro/components/blocks/data-table — not from @blazz/ui |
| StatsGrid | `@blazz/pro/components/blocks/stats-grid` | Maximum 4 stats per row — beyond that the eye doesn't know where to focus |
| FilterBar | `@blazz/pro/components/blocks/filter-bar` | FilterBar goes ABOVE the DataTable, outside of it — not inside |
| DetailPanel | `@blazz/pro/components/blocks/detail-panel` | DetailPanel is a compound component — always use DetailPanel.Header and DetailPa |
| ActivityTimeline | `@blazz/pro/components/blocks/activity-timeline` | The prop is 'events', not 'activities' — the component uses TimelineEvent, not A |

---

## Full Component Reference

### Select

`@blazz/ui/components/ui/select`
Named: `Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator`

- ⚠️ ALWAYS pass `items` prop — without it SelectValue renders raw value ('apple') not label ('Apple')
- ⚠️ Use `render={<Button />}` not `asChild` on trigger components — Base UI, not Radix
- ⚠️ items: prefer Array<{value,label}> format in this codebase (Base UI also accepts Record<string,string> but array is the @blazz/ui convention)

```tsx
<Select
  items={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
  value={status}
  onValueChange={setStatus}
>
  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
  </SelectContent>
</Select>
```

### Button

`@blazz/ui/components/ui/button`
Named: `Button`

- ⚠️ Always add type='button' on non-submit buttons inside forms — prevents accidental form submission
- ⚠️ For icon-only buttons use size='icon' and add a Tooltip for accessibility
- ⚠️ Loading state: use disabled + a Spinner inside children, not a separate loading prop

```tsx
<Button variant="default" onClick={handleAction}>Save</Button>
<Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
<Button type="button" variant="destructive" onClick={handleDelete}>Delete</Button>
```

### Input

`@blazz/ui/components/ui/input`
Named: `Input`

- ⚠️ With react-hook-form: spread register() props — `<Input {...register('name')} />`
- ⚠️ Error state: add aria-invalid={!!errors.field} to show red border automatically
- ⚠️ NEVER use type='date' — use DateSelector instead
- ⚠️ For numbers use NumberInput, for currency use CurrencyInput — not Input type='number'

```tsx
<Input
  placeholder="Enter name..."
  {...register("name")}
  aria-invalid={!!errors.name}
/>
```

### Textarea

`@blazz/ui/components/ui/textarea`
Named: `Textarea`

- ⚠️ With react-hook-form: spread register() props — `<Textarea {...register('description')} />`
- ⚠️ Error state: add aria-invalid={!!errors.field} to show red border

```tsx
<Textarea
  placeholder="Enter description..."
  rows={4}
  {...register("description")}
  aria-invalid={!!errors.description}
/>
```

### Checkbox

`@blazz/ui/components/ui/checkbox`
Named: `Checkbox, CheckboxGroup`

- ⚠️ With react-hook-form: use Controller or watch+setValue — `onCheckedChange={(checked) => setValue('field', !!checked)}`
- ⚠️ For multiple checkboxes with labels, use CheckboxGroup with options prop
- ⚠️ onCheckedChange receives boolean | 'indeterminate' — cast with !!checked for booleans
- ⚠️ Label is a separate import — `import { Label } from '@blazz/ui/components/ui/label'`

```tsx
<Checkbox
  id="agree"
  checked={watch("agree")}
  onCheckedChange={(checked) => setValue("agree", !!checked)}
/>
<Label htmlFor="agree">I agree to the terms</Label>
```

### Switch

`@blazz/ui/components/ui/switch`
Named: `Switch`

- ⚠️ With react-hook-form: use watch+setValue — `onCheckedChange={(checked) => setValue('active', checked)}`
- ⚠️ Label is a separate import — `import { Label } from '@blazz/ui/components/ui/label'`

```tsx
<div className="flex items-center gap-2">
  <Switch
    id="active"
    checked={watch("active")}
    onCheckedChange={(checked) => setValue("active", checked)}
  />
  <Label htmlFor="active">Active</Label>
</div>
```

### RadioGroup

`@blazz/ui/components/ui/radio-group`
Named: `RadioGroup`

- ⚠️ Use the options prop API — not RadioGroupItem children, which is more verbose
- ⚠️ With react-hook-form: `value={watch('type')} onValueChange={(v) => setValue('type', v)}`

```tsx
<RadioGroup
  value={watch("plan")}
  onValueChange={(v) => setValue("plan", v)}
  options={[
    { value: "free", label: "Free", description: "Up to 5 users" },
    { value: "pro", label: "Pro", description: "Unlimited users" },
  ]}
/>
```

### DateSelector

`@blazz/ui/components/ui/date-selector`
Named: `DateSelector, DateRangeSelector`

- ⚠️ NEVER use <input type='date'> — always use DateSelector
- ⚠️ Value is Date object, not string — with react-hook-form store as string and convert: `value={watch('date') ? parseISO(watch('date')) : undefined}`
- ⚠️ With react-hook-form: `onValueChange={(d) => setValue('date', d ? format(d, 'yyyy-MM-dd') : '')}`
- ⚠️ For date ranges use DateRangeSelector with from/to/onRangeChange props — not two DateSelectors

```tsx
import { parseISO, format } from "date-fns"

<DateSelector
  value={watch("date") ? parseISO(watch("date")) : undefined}
  onValueChange={(d) => setValue("date", d ? format(d, "yyyy-MM-dd") : "")}
  placeholder="Pick a date"
  formatStr="dd/MM/yyyy"
/>
```

### Combobox

`@blazz/ui/components/ui/combobox`
Named: `Combobox`

- ⚠️ Use Combobox (not Select) when list > 10 items or user needs search
- ⚠️ options prop is required — different from Select which uses items
- ⚠️ options.avatar: URL string for user avatars. options.icon: ReactNode for icons

```tsx
<Combobox
  value={assigneeId}
  onValueChange={setAssigneeId}
  options={users.map(u => ({ value: u.id, label: u.name, avatar: u.avatarUrl }))}
  placeholder="Assign to..."
  searchPlaceholder="Search users..."
/>
```

### Dialog

`@blazz/ui/components/ui/dialog`
Named: `Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose`

- ⚠️ DialogTrigger uses render prop: `<DialogTrigger render={<Button />}>Open</DialogTrigger>` — never asChild
- ⚠️ DialogClose in forms: use explicit onClick to reset form state, not as button wrapper
- ⚠️ DialogContent size prop: 'sm' (default, 384px) | 'md' (512px) | 'lg' (672px) | 'xl' (896px) | 'full' (1152px)
- ⚠️ Buttons go in <DialogFooter> — never in a custom div. DialogFooter handles layout, gap, and background.
- ⚠️ Cancel button needs type='button' to prevent accidental form submit

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Sheet

`@blazz/ui/components/ui/sheet`
Named: `Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose`

- ⚠️ SheetTrigger uses render prop: `<SheetTrigger render={<Button />}>Open</SheetTrigger>` — never asChild
- ⚠️ SheetContent side prop: 'left' (default) | 'right' | 'top' | 'bottom'
- ⚠️ SheetTrigger is an alias for DialogPrimitive.Trigger — same Base UI pattern

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>
```

### DropdownMenu

`@blazz/ui/components/ui/dropdown-menu`
Named: `DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent`

- ⚠️ DropdownMenuTrigger uses render prop: `<DropdownMenuTrigger render={<Button size='icon' />}><MoreHorizontal /></DropdownMenuTrigger>`
- ⚠️ For row actions use size='icon' variant='ghost' button as trigger
- ⚠️ DropdownMenuContent align prop: 'start' | 'center' (default) | 'end'

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button size="icon" variant="ghost" />}>
    <MoreHorizontal className="size-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Popover

`@blazz/ui/components/ui/popover`
Named: `Popover, PopoverTrigger, PopoverContent`

- ⚠️ PopoverTrigger uses render prop: `<PopoverTrigger render={<Button />}>Open</PopoverTrigger>`
- ⚠️ PopoverContent align prop: 'start' | 'center' (default) | 'end'

```tsx
<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Open</PopoverTrigger>
  <PopoverContent>
    <p>Popover content</p>
  </PopoverContent>
</Popover>
```

### Tooltip

`@blazz/ui/components/ui/tooltip`
Named: `Tooltip, TooltipTrigger, TooltipContent`

- ⚠️ TooltipTrigger uses render prop: `<TooltipTrigger render={<Button />}>…</TooltipTrigger>`
- ⚠️ For icon-only buttons always add a Tooltip for accessibility

```tsx
<Tooltip>
  <TooltipTrigger render={<Button size="icon" variant="ghost" />}>
    <Settings className="size-4" />
  </TooltipTrigger>
  <TooltipContent>Settings</TooltipContent>
</Tooltip>
```

### Badge

`@blazz/ui/components/ui/badge`
Named: `Badge`

- ⚠️ For status dots use variant='success'|'warning'|'destructive'|'info' — not custom colors
- ⚠️ Never use color alone to convey status — pair with text (e.g. '● Active' not just a colored dot)

```tsx
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Overdue</Badge>
```

### Avatar

`@blazz/ui/components/ui/avatar`
Named: `Avatar, AvatarImage, AvatarFallback, AvatarGroup`

- ⚠️ Always provide AvatarFallback with 2-letter initials — image loading can fail
- ⚠️ For stacked avatars use AvatarGroup with max prop
- ⚠️ src and alt go on AvatarImage, fallback text goes as children of AvatarFallback — no props on Avatar root

```tsx
<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
</Avatar>
```

### Tabs

`@blazz/ui/components/ui/tabs`
Named: `Tabs, TabsList, TabsTrigger, TabsContent`

- ⚠️ TabsList variant prop: 'default' (underline) | 'pills' (filled buttons)
- ⚠️ For page-level navigation use NavigationTabs (patterns) not Tabs — it persists tab in URL

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="activity">...</TabsContent>
</Tabs>
```

### Skeleton

`@blazz/ui/components/ui/skeleton`
Named: `Skeleton`

- ⚠️ Always mirror the real content structure — a skeleton row should look like a real row
- ⚠️ Use rounded-full for circular skeletons (avatars), rounded-md for rectangular
- ⚠️ Never show a single generic spinner — skeleton must match the layout of the loading content

```tsx
{/* Loading state mirrors real content */}
<div className="flex items-center gap-3">
  <Skeleton className="size-8 rounded-full" />
  <div className="space-y-1.5">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-24" />
  </div>
</div>
```

### AppFrame

`@blazz/ui/components/patterns/app-frame`
Named: `AppFrame`

- ⚠️ Import from @blazz/ui/components/patterns/app-frame — not from @blazz/ui directly
- ⚠️ AppFrame wraps the entire app layout — use in root layout file, not per-page
- ⚠️ navigation prop is shorthand — use sidebarConfig for full control (user info, avatar, etc.)

```tsx
// In root layout (layout.tsx)
<AppFrame
  navigation={[
    {
      title: "Main",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
        { label: "Contacts", href: "/contacts", icon: <Users /> },
      ]
    }
  ]}
>
  {children}
</AppFrame>
```

### AppSidebar

`@blazz/ui/components/patterns/app-sidebar`
Named: `AppSidebar`

- ⚠️ Prefer AppFrame over AppSidebar directly — AppFrame handles sidebar + top bar + layout
- ⚠️ SidebarConfig.navigation is an array of NavigationSection, each with items: NavigationItem[]. Each item needs `title` + `url` or `onClick`.
- ⚠️ NavigationItem.icon expects a LucideIcon component reference (not JSX) — `icon: HomeIcon`, NOT `icon: <HomeIcon />`

```tsx
// Use AppFrame instead:
<AppFrame navigation={navigationSections}>{children}</AppFrame>
```

### AppTopBar

`@blazz/ui/components/patterns/app-top-bar`
Named: `AppTopBar`

- ⚠️ Prefer AppFrame over AppTopBar directly — AppFrame includes the top bar
- ⚠️ `sections` prop controls top-bar navigation pills: `[{ id: 'app', label: 'App', href: '/app' }]` — each section needs id, label, href
- ⚠️ `minimal` prop hides notifications + UserMenu (use for docs/public pages without auth context)

```tsx
// Use AppFrame instead:
<AppFrame topBarContent={<ThemeToggle />}>{children}</AppFrame>
```

### FormField

`@blazz/ui/components/patterns/form-field`
Named: `FormField`

- ⚠️ Always use FormField to wrap inputs in forms — never write label+input+error manually
- ⚠️ Pass error={errors.fieldName?.message} directly from react-hook-form

```tsx
<FormField
  label="Email"
  required
  error={errors.email?.message}
  description="We'll send a confirmation to this address."
>
  <Input type="email" {...register("email")} aria-invalid={!!errors.email} />
</FormField>
```

### FieldGrid

`@blazz/ui/components/patterns/field-grid`
Named: `FieldGrid`

- ⚠️ Use col-span-2 or col-span-3 on children for full-width fields (textarea, address)
- ⚠️ Use cols={3} for 8-15 fields, cols={2} for < 8 fields

```tsx
<FieldGrid cols={2}>
  <FormField label="First Name" required error={errors.firstName?.message}>
    <Input {...register("firstName")} />
  </FormField>
  <FormField label="Last Name" required error={errors.lastName?.message}>
    <Input {...register("lastName")} />
  </FormField>
  <div className="col-span-2">
    <FormField label="Bio" error={errors.bio?.message}>
      <Textarea {...register("bio")} rows={3} />
    </FormField>
  </div>
</FieldGrid>
```

### PageHeaderShell

`@blazz/ui/components/patterns/page-header-shell`
Named: `PageHeaderShell`

- ⚠️ Primary action goes in actions prop (top-right), always a Button variant='default'
- ⚠️ Use at the top of every resource page — not inside cards

```tsx
<PageHeaderShell
  title="Contacts"
  description="2 847 contacts"
  actions={
    <Button onClick={() => setCreateOpen(true)}>
      <Plus className="size-4" /> New Contact
    </Button>
  }
/>
```

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
