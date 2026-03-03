# LLM Documentation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dual-output LLM documentation system — `public/llms.txt` (public, llmstxt.org standard) and `packages/ui/AI.md` (internal Claude Code context) — generated from a typed registry of ~30 priority components.

**Architecture:** A central `apps/docs/src/data/` folder holds one `.ts` data file per priority component, each exporting typed metadata (props, gotchas, imports, canonical example). A `registry.ts` aggregates them. A `generate-llms.ts` script reads the registry and writes both output files. Doc pages for migrated components import `props` directly from data files.

**Tech Stack:** TypeScript, Node.js (tsx), existing `DocProp` type from `~/components/docs/doc-props-table`

---

## Task 1: Create shared types

**Files:**
- Create: `apps/docs/src/data/types.ts`

**Step 1: Create the file**

```ts
// apps/docs/src/data/types.ts
import type { DocProp } from "~/components/docs/doc-props-table"

export type ComponentCategory = "ui" | "patterns" | "blocks" | "ai"

export type ComponentImport = {
  path: string
  named: string[]
}

export type ComponentData = {
  name: string
  category: ComponentCategory
  description: string
  docPath: string
  imports: ComponentImport
  props: DocProp[]
  gotchas: string[]
  canonicalExample: string
}
```

**Step 2: Commit**

```bash
git add apps/docs/src/data/types.ts
git commit -m "feat(llm-docs): add ComponentData type"
```

---

## Task 2: Select data file + update doc page

**Files:**
- Create: `apps/docs/src/data/components/select.ts`
- Modify: `apps/docs/src/routes/_docs/docs/components/ui/select.tsx`

**Step 1: Create the data file**

```ts
// apps/docs/src/data/components/select.ts
import type { ComponentData } from "../types"

export const selectData: ComponentData = {
  name: "Select",
  category: "ui",
  description: "Dropdown pour sélectionner une valeur unique dans une liste.",
  docPath: "/docs/components/ui/select",
  imports: {
    path: "@blazz/ui/components/ui/select",
    named: ["Select", "SelectTrigger", "SelectValue", "SelectContent", "SelectItem", "SelectGroup", "SelectLabel", "SelectSeparator"],
  },
  props: [
    { name: "items", type: "Array<{ value: string; label: string }>", description: "Requis fonctionnellement — sans ce prop, SelectValue affiche la value brute au lieu du label." },
    { name: "value", type: "string", description: "Valeur contrôlée." },
    { name: "onValueChange", type: "(value: string) => void", description: "Callback à la sélection." },
    { name: "defaultValue", type: "string", description: "Valeur par défaut (usage non-contrôlé)." },
    { name: "disabled", type: "boolean", default: "false", description: "Désactive le select." },
  ],
  gotchas: [
    "ALWAYS pass `items` prop — without it SelectValue renders raw value ('apple') not label ('Apple')",
    "Use `render={<Button />}` not `asChild` on trigger components — Base UI, not Radix",
    "items format: Array<{ value: string, label: string }> — NOT a Record object",
  ],
  canonicalExample: `<Select
  items={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
  value={status}
  onValueChange={setStatus}
>
  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
  </SelectContent>
</Select>`,
}
```

**Step 2: Update the doc page to import props from data file**

In `apps/docs/src/routes/_docs/docs/components/ui/select.tsx`:
- Add import: `import { selectData } from "~/data/components/select"`
- Remove the inline `selectProps` array
- Replace `props={selectProps}` with `props={selectData.props}` in the `<DocPropsTable>` call

**Step 3: Verify the doc page still compiles**

```bash
cd apps/docs && pnpm type-check
```

Expected: no errors.

**Step 4: Commit**

```bash
git add apps/docs/src/data/components/select.ts apps/docs/src/routes/_docs/docs/components/ui/select.tsx
git commit -m "feat(llm-docs): add Select data file, migrate doc page props"
```

---

## Task 3: Overlay components data files

**Files:**
- Create: `apps/docs/src/data/components/dialog.ts`
- Create: `apps/docs/src/data/components/sheet.ts`
- Create: `apps/docs/src/data/components/dropdown-menu.ts`
- Create: `apps/docs/src/data/components/popover.ts`
- Create: `apps/docs/src/data/components/tooltip.ts`

**Step 1: Create dialog.ts**

```ts
// apps/docs/src/data/components/dialog.ts
import type { ComponentData } from "../types"

export const dialogData: ComponentData = {
  name: "Dialog",
  category: "ui",
  description: "Modal dialog avec overlay, header, body et footer.",
  docPath: "/docs/components/ui/dialog",
  imports: {
    path: "@blazz/ui/components/ui/dialog",
    named: ["Dialog", "DialogTrigger", "DialogContent", "DialogHeader", "DialogTitle", "DialogDescription", "DialogFooter", "DialogClose"],
  },
  props: [
    { name: "open", type: "boolean", description: "État d'ouverture contrôlé." },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback au changement d'état." },
    { name: "defaultOpen", type: "boolean", description: "État initial (usage non-contrôlé)." },
  ],
  gotchas: [
    "DialogTrigger uses render prop: `<DialogTrigger render={<Button />}>Open</DialogTrigger>` — never asChild",
    "DialogClose in forms: use explicit onClick to reset form state, not as button wrapper",
    "DialogContent size prop: 'sm' (default, 384px) | 'md' (512px) | 'lg' (672px) | 'xl' (896px) | 'full' (1152px)",
    "Buttons go in <DialogFooter> — never in a custom div. DialogFooter handles layout, gap, and background.",
    "Cancel button needs type='button' to prevent accidental form submit",
  ],
  canonicalExample: `<Dialog>
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
</Dialog>`,
}
```

**Step 2: Create sheet.ts**

```ts
// apps/docs/src/data/components/sheet.ts
import type { ComponentData } from "../types"

export const sheetData: ComponentData = {
  name: "Sheet",
  category: "ui",
  description: "Panneau glissant depuis un côté de l'écran (drawer/sidebar overlay).",
  docPath: "/docs/components/ui/sheet",
  imports: {
    path: "@blazz/ui/components/ui/sheet",
    named: ["Sheet", "SheetTrigger", "SheetContent", "SheetHeader", "SheetTitle", "SheetDescription", "SheetFooter", "SheetClose"],
  },
  props: [
    { name: "open", type: "boolean", description: "État d'ouverture contrôlé." },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback au changement d'état." },
    { name: "defaultOpen", type: "boolean", description: "État initial (usage non-contrôlé)." },
  ],
  gotchas: [
    "SheetTrigger uses render prop: `<SheetTrigger render={<Button />}>Open</SheetTrigger>` — never asChild",
    "SheetContent side prop: 'left' (default) | 'right' | 'top' | 'bottom'",
    "SheetTrigger is an alias for DialogPrimitive.Trigger — same Base UI pattern",
  ],
  canonicalExample: `<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>`,
}
```

**Step 3: Create dropdown-menu.ts**

```ts
// apps/docs/src/data/components/dropdown-menu.ts
import type { ComponentData } from "../types"

export const dropdownMenuData: ComponentData = {
  name: "DropdownMenu",
  category: "ui",
  description: "Menu contextuel attaché à un trigger.",
  docPath: "/docs/components/ui/dropdown-menu",
  imports: {
    path: "@blazz/ui/components/ui/dropdown-menu",
    named: ["DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent", "DropdownMenuItem", "DropdownMenuSeparator", "DropdownMenuLabel", "DropdownMenuSub", "DropdownMenuSubTrigger", "DropdownMenuSubContent"],
  },
  props: [
    { name: "open", type: "boolean", description: "État d'ouverture contrôlé." },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback au changement d'état." },
  ],
  gotchas: [
    "DropdownMenuTrigger uses render prop: `<DropdownMenuTrigger render={<Button size='icon' />}><MoreHorizontal /></DropdownMenuTrigger>`",
    "For row actions use size='icon' variant='ghost' button as trigger",
    "DropdownMenuContent align prop: 'start' | 'center' (default) | 'end'",
  ],
  canonicalExample: `<DropdownMenu>
  <DropdownMenuTrigger render={<Button size="icon" variant="ghost" />}>
    <MoreHorizontal className="size-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
}
```

**Step 4: Create popover.ts**

```ts
// apps/docs/src/data/components/popover.ts
import type { ComponentData } from "../types"

export const popoverData: ComponentData = {
  name: "Popover",
  category: "ui",
  description: "Panneau flottant ancré à un trigger, pour du contenu riche non-modal.",
  docPath: "/docs/components/ui/popover",
  imports: {
    path: "@blazz/ui/components/ui/popover",
    named: ["Popover", "PopoverTrigger", "PopoverContent"],
  },
  props: [
    { name: "open", type: "boolean", description: "État d'ouverture contrôlé." },
    { name: "onOpenChange", type: "(open: boolean) => void", description: "Callback au changement d'état." },
  ],
  gotchas: [
    "PopoverTrigger uses render prop: `<PopoverTrigger render={<Button />}>Open</PopoverTrigger>`",
    "PopoverContent align prop: 'start' | 'center' (default) | 'end'",
  ],
  canonicalExample: `<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Open</PopoverTrigger>
  <PopoverContent>
    <p>Popover content</p>
  </PopoverContent>
</Popover>`,
}
```

**Step 5: Create tooltip.ts**

```ts
// apps/docs/src/data/components/tooltip.ts
import type { ComponentData } from "../types"

export const tooltipData: ComponentData = {
  name: "Tooltip",
  category: "ui",
  description: "Infobulles affichées au survol d'un élément.",
  docPath: "/docs/components/ui/tooltip",
  imports: {
    path: "@blazz/ui/components/ui/tooltip",
    named: ["Tooltip", "TooltipTrigger", "TooltipContent"],
  },
  props: [
    { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Côté d'affichage du tooltip." },
    { name: "sideOffset", type: "number", default: "4", description: "Distance en pixels depuis le trigger." },
  ],
  gotchas: [
    "TooltipTrigger uses render prop: `<TooltipTrigger render={<Button />}>…</TooltipTrigger>`",
    "For icon-only buttons always add a Tooltip for accessibility",
  ],
  canonicalExample: `<Tooltip>
  <TooltipTrigger render={<Button size="icon" variant="ghost" />}>
    <Settings className="size-4" />
  </TooltipTrigger>
  <TooltipContent>Settings</TooltipContent>
</Tooltip>`,
}
```

**Step 6: Commit**

```bash
git add apps/docs/src/data/components/
git commit -m "feat(llm-docs): add overlay components data files (Dialog, Sheet, DropdownMenu, Popover, Tooltip)"
```

---

## Task 4: Form components data files

**Files:**
- Create: `apps/docs/src/data/components/button.ts`
- Create: `apps/docs/src/data/components/input.ts`
- Create: `apps/docs/src/data/components/textarea.ts`
- Create: `apps/docs/src/data/components/checkbox.ts`
- Create: `apps/docs/src/data/components/switch.ts`
- Create: `apps/docs/src/data/components/radio-group.ts`
- Create: `apps/docs/src/data/components/date-selector.ts`
- Create: `apps/docs/src/data/components/combobox.ts`

**Step 1: Create button.ts**

```ts
// apps/docs/src/data/components/button.ts
import type { ComponentData } from "../types"

export const buttonData: ComponentData = {
  name: "Button",
  category: "ui",
  description: "Bouton d'action principal du design system.",
  docPath: "/docs/components/ui/button",
  imports: {
    path: "@blazz/ui/components/ui/button",
    named: ["Button"],
  },
  props: [
    { name: "variant", type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"', default: '"default"', description: "Style visuel du bouton." },
    { name: "size", type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"', default: '"default"', description: "Taille du bouton." },
    { name: "disabled", type: "boolean", default: "false", description: "Désactive le bouton." },
    { name: "children", type: "React.ReactNode", required: true, description: "Contenu du bouton." },
  ],
  gotchas: [
    "Always add type='button' on non-submit buttons inside forms — prevents accidental form submission",
    "For icon-only buttons use size='icon' and add a Tooltip for accessibility",
    "Loading state: use disabled + a Spinner inside children, not a separate loading prop",
  ],
  canonicalExample: `<Button variant="default" onClick={handleAction}>Save</Button>
<Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
<Button type="button" variant="destructive" onClick={handleDelete}>Delete</Button>`,
}
```

**Step 2: Create input.ts**

```ts
// apps/docs/src/data/components/input.ts
import type { ComponentData } from "../types"

export const inputData: ComponentData = {
  name: "Input",
  category: "ui",
  description: "Champ de saisie texte standard.",
  docPath: "/docs/components/ui/input",
  imports: {
    path: "@blazz/ui/components/ui/input",
    named: ["Input"],
  },
  props: [
    { name: "type", type: "string", default: '"text"', description: "Type HTML de l'input." },
    { name: "placeholder", type: "string", description: "Texte placeholder." },
    { name: "disabled", type: "boolean", default: "false", description: "Désactive l'input." },
    { name: "aria-invalid", type: "boolean", description: "Marque l'input comme invalide (style rouge)." },
  ],
  gotchas: [
    "With react-hook-form: spread register() props — `<Input {...register('name')} />`",
    "Error state: add aria-invalid={!!errors.field} to show red border automatically",
    "NEVER use type='date' — use DateSelector instead",
    "For numbers use NumberInput, for currency use CurrencyInput — not Input type='number'",
  ],
  canonicalExample: `<Input
  placeholder="Enter name..."
  {...register("name")}
  aria-invalid={!!errors.name}
/>`,
}
```

**Step 3: Create textarea.ts**

```ts
// apps/docs/src/data/components/textarea.ts
import type { ComponentData } from "../types"

export const textareaData: ComponentData = {
  name: "Textarea",
  category: "ui",
  description: "Champ de saisie multi-lignes.",
  docPath: "/docs/components/ui/textarea",
  imports: {
    path: "@blazz/ui/components/ui/textarea",
    named: ["Textarea"],
  },
  props: [
    { name: "placeholder", type: "string", description: "Texte placeholder." },
    { name: "rows", type: "number", default: "3", description: "Nombre de lignes visibles." },
    { name: "disabled", type: "boolean", default: "false", description: "Désactive le textarea." },
  ],
  gotchas: [
    "With react-hook-form: spread register() props — `<Textarea {...register('description')} />`",
    "Error state: add aria-invalid={!!errors.field} to show red border",
  ],
  canonicalExample: `<Textarea
  placeholder="Enter description..."
  rows={4}
  {...register("description")}
  aria-invalid={!!errors.description}
/>`,
}
```

**Step 4: Create checkbox.ts**

```ts
// apps/docs/src/data/components/checkbox.ts
import type { ComponentData } from "../types"

export const checkboxData: ComponentData = {
  name: "Checkbox",
  category: "ui",
  description: "Case à cocher individuelle ou groupée.",
  docPath: "/docs/components/ui/checkbox",
  imports: {
    path: "@blazz/ui/components/ui/checkbox",
    named: ["Checkbox", "CheckboxGroup"],
  },
  props: [
    { name: "checked", type: "boolean", description: "État coché contrôlé." },
    { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Callback au changement." },
    { name: "disabled", type: "boolean", default: "false", description: "Désactive la checkbox." },
  ],
  gotchas: [
    "With react-hook-form: use Controller or watch+setValue — `onCheckedChange={(checked) => setValue('field', !!checked)}`",
    "For multiple checkboxes with labels, use CheckboxGroup with options prop",
    "onCheckedChange receives boolean | 'indeterminate' — cast with !!checked for booleans",
  ],
  canonicalExample: `<Checkbox
  id="agree"
  checked={watch("agree")}
  onCheckedChange={(checked) => setValue("agree", !!checked)}
/>
<Label htmlFor="agree">I agree to the terms</Label>`,
}
```

**Step 5: Create switch.ts**

```ts
// apps/docs/src/data/components/switch.ts
import type { ComponentData } from "../types"

export const switchData: ComponentData = {
  name: "Switch",
  category: "ui",
  description: "Interrupteur toggle on/off.",
  docPath: "/docs/components/ui/switch",
  imports: {
    path: "@blazz/ui/components/ui/switch",
    named: ["Switch"],
  },
  props: [
    { name: "checked", type: "boolean", description: "État activé contrôlé." },
    { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Callback au changement." },
    { name: "disabled", type: "boolean", default: "false", description: "Désactive le switch." },
  ],
  gotchas: [
    "With react-hook-form: use watch+setValue — `onCheckedChange={(checked) => setValue('active', checked)}`",
  ],
  canonicalExample: `<div className="flex items-center gap-2">
  <Switch
    id="active"
    checked={watch("active")}
    onCheckedChange={(checked) => setValue("active", checked)}
  />
  <Label htmlFor="active">Active</Label>
</div>`,
}
```

**Step 6: Create radio-group.ts**

```ts
// apps/docs/src/data/components/radio-group.ts
import type { ComponentData } from "../types"

export const radioGroupData: ComponentData = {
  name: "RadioGroup",
  category: "ui",
  description: "Groupe de boutons radio pour sélection exclusive.",
  docPath: "/docs/components/ui/radio-group",
  imports: {
    path: "@blazz/ui/components/ui/radio-group",
    named: ["RadioGroup"],
  },
  props: [
    { name: "value", type: "string", description: "Valeur sélectionnée contrôlée." },
    { name: "onValueChange", type: "(value: string) => void", description: "Callback à la sélection." },
    { name: "options", type: "Array<{ value: string; label: string; description?: string }>", required: true, description: "Options du groupe." },
    { name: "orientation", type: '"horizontal" | "vertical"', default: '"vertical"', description: "Orientation du groupe." },
  ],
  gotchas: [
    "Use the options prop API — not RadioGroupItem children, which is more verbose",
    "With react-hook-form: `value={watch('type')} onValueChange={(v) => setValue('type', v)}`",
  ],
  canonicalExample: `<RadioGroup
  value={watch("plan")}
  onValueChange={(v) => setValue("plan", v)}
  options={[
    { value: "free", label: "Free", description: "Up to 5 users" },
    { value: "pro", label: "Pro", description: "Unlimited users" },
  ]}
/>`,
}
```

**Step 7: Create date-selector.ts**

```ts
// apps/docs/src/data/components/date-selector.ts
import type { ComponentData } from "../types"

export const dateSelectorData: ComponentData = {
  name: "DateSelector",
  category: "ui",
  description: "Sélecteur de date avec calendrier popup. Remplace <input type='date'>.",
  docPath: "/docs/components/ui/date-selector",
  imports: {
    path: "@blazz/ui/components/ui/date-selector",
    named: ["DateSelector", "DateRangeSelector"],
  },
  props: [
    { name: "value", type: "Date | undefined", description: "Date sélectionnée." },
    { name: "onValueChange", type: "(date: Date | undefined) => void", description: "Callback au changement." },
    { name: "placeholder", type: "string", default: '"Pick a date"', description: "Texte placeholder." },
    { name: "formatStr", type: "string", default: '"PPP"', description: "Format date-fns pour l'affichage (ex: 'dd/MM/yyyy')." },
    { name: "disabled", type: "boolean", default: "false", description: "Désactive le sélecteur." },
  ],
  gotchas: [
    "NEVER use <input type='date'> — always use DateSelector",
    "Value is Date object, not string — with react-hook-form store as string and convert: `value={watch('date') ? parseISO(watch('date')) : undefined}`",
    "With react-hook-form: `onValueChange={(d) => setValue('date', d ? format(d, 'yyyy-MM-dd') : '')}`",
    "For date ranges use DateRangeSelector with from/to/onRangeChange props — not two DateSelectors",
  ],
  canonicalExample: `import { parseISO, format } from "date-fns"

<DateSelector
  value={watch("date") ? parseISO(watch("date")) : undefined}
  onValueChange={(d) => setValue("date", d ? format(d, "yyyy-MM-dd") : "")}
  placeholder="Pick a date"
  formatStr="dd/MM/yyyy"
/>`,
}
```

**Step 8: Create combobox.ts**

```ts
// apps/docs/src/data/components/combobox.ts
import type { ComponentData } from "../types"

export const comboboxData: ComponentData = {
  name: "Combobox",
  category: "ui",
  description: "Select avec recherche/filtrage. Remplace Select pour les listes longues.",
  docPath: "/docs/components/ui/combobox",
  imports: {
    path: "@blazz/ui/components/ui/combobox",
    named: ["Combobox"],
  },
  props: [
    { name: "value", type: "string", description: "Valeur sélectionnée contrôlée." },
    { name: "onValueChange", type: "(value: string) => void", description: "Callback à la sélection." },
    { name: "options", type: "Array<{ value: string; label: string; description?: string; avatar?: string; icon?: ReactNode }>", required: true, description: "Options disponibles." },
    { name: "placeholder", type: "string", default: '"Select..."', description: "Placeholder du trigger." },
    { name: "searchPlaceholder", type: "string", default: '"Search..."', description: "Placeholder de la recherche." },
    { name: "searchable", type: "boolean", default: "true", description: "Active/désactive la recherche." },
  ],
  gotchas: [
    "Use Combobox (not Select) when list > 10 items or user needs search",
    "options prop is required — different from Select which uses items",
    "options.avatar: URL string for user avatars. options.icon: ReactNode for icons",
  ],
  canonicalExample: `<Combobox
  value={assigneeId}
  onValueChange={setAssigneeId}
  options={users.map(u => ({ value: u.id, label: u.name, avatar: u.avatarUrl }))}
  placeholder="Assign to..."
  searchPlaceholder="Search users..."
/>`,
}
```

**Step 9: Commit**

```bash
git add apps/docs/src/data/components/
git commit -m "feat(llm-docs): add form components data files (Button, Input, Textarea, Checkbox, Switch, RadioGroup, DateSelector, Combobox)"
```

---

## Task 5: Primitives data files

**Files:**
- Create: `apps/docs/src/data/components/badge.ts`
- Create: `apps/docs/src/data/components/avatar.ts`
- Create: `apps/docs/src/data/components/tabs.ts`
- Create: `apps/docs/src/data/components/skeleton.ts`

**Step 1: Create badge.ts**

```ts
// apps/docs/src/data/components/badge.ts
import type { ComponentData } from "../types"

export const badgeData: ComponentData = {
  name: "Badge",
  category: "ui",
  description: "Pastille de statut ou d'étiquette.",
  docPath: "/docs/components/ui/badge",
  imports: {
    path: "@blazz/ui/components/ui/badge",
    named: ["Badge"],
  },
  props: [
    { name: "variant", type: '"default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "info"', default: '"default"', description: "Style sémantique du badge." },
    { name: "children", type: "React.ReactNode", required: true, description: "Contenu du badge." },
  ],
  gotchas: [
    "For status dots use variant='success'|'warning'|'destructive'|'info' — not custom colors",
    "Never use color alone to convey status — pair with text (e.g. '● Active' not just a colored dot)",
  ],
  canonicalExample: `<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Overdue</Badge>`,
}
```

**Step 2: Create avatar.ts**

```ts
// apps/docs/src/data/components/avatar.ts
import type { ComponentData } from "../types"

export const avatarData: ComponentData = {
  name: "Avatar",
  category: "ui",
  description: "Avatar utilisateur avec image et fallback initiales.",
  docPath: "/docs/components/ui/avatar",
  imports: {
    path: "@blazz/ui/components/ui/avatar",
    named: ["Avatar", "AvatarImage", "AvatarFallback", "AvatarGroup"],
  },
  props: [
    { name: "src", type: "string", description: "URL de l'image (passé à AvatarImage)." },
    { name: "fallback", type: "string", description: "Texte de fallback si l'image ne charge pas (ex: 'JD')." },
    { name: "size", type: '"xs" | "sm" | "default" | "lg" | "xl"', default: '"default"', description: "Taille de l'avatar." },
  ],
  gotchas: [
    "Always provide AvatarFallback with 2-letter initials — image loading can fail",
    "For stacked avatars use AvatarGroup with max prop",
  ],
  canonicalExample: `<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
</Avatar>`,
}
```

**Step 3: Create tabs.ts**

```ts
// apps/docs/src/data/components/tabs.ts
import type { ComponentData } from "../types"

export const tabsData: ComponentData = {
  name: "Tabs",
  category: "ui",
  description: "Navigation par onglets.",
  docPath: "/docs/components/ui/tabs",
  imports: {
    path: "@blazz/ui/components/ui/tabs",
    named: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"],
  },
  props: [
    { name: "defaultValue", type: "string", description: "Onglet actif par défaut." },
    { name: "value", type: "string", description: "Onglet actif contrôlé." },
    { name: "onValueChange", type: "(value: string) => void", description: "Callback au changement d'onglet." },
    { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Orientation des tabs." },
  ],
  gotchas: [
    "TabsList variant prop: 'default' (underline) | 'pills' (filled buttons)",
    "For page-level navigation use NavigationTabs (patterns) not Tabs — it persists tab in URL",
  ],
  canonicalExample: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="activity">...</TabsContent>
</Tabs>`,
}
```

**Step 4: Create skeleton.ts**

```ts
// apps/docs/src/data/components/skeleton.ts
import type { ComponentData } from "../types"

export const skeletonData: ComponentData = {
  name: "Skeleton",
  category: "ui",
  description: "Placeholder animé pour les états de chargement.",
  docPath: "/docs/components/ui/skeleton",
  imports: {
    path: "@blazz/ui/components/ui/skeleton",
    named: ["Skeleton"],
  },
  props: [
    { name: "className", type: "string", description: "Classes Tailwind pour dimensionner le skeleton (w-*, h-*, rounded-*)." },
  ],
  gotchas: [
    "Always mirror the real content structure — a skeleton row should look like a real row",
    "Use rounded-full for circular skeletons (avatars), rounded-md for rectangular",
    "Never show a single generic spinner — skeleton must match the layout of the loading content",
  ],
  canonicalExample: `{/* Loading state mirrors real content */}
<div className="flex items-center gap-3">
  <Skeleton className="size-8 rounded-full" />
  <div className="space-y-1.5">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-24" />
  </div>
</div>`,
}
```

**Step 5: Commit**

```bash
git add apps/docs/src/data/components/
git commit -m "feat(llm-docs): add primitive components data files (Badge, Avatar, Tabs, Skeleton)"
```

---

## Task 6: Patterns data files

**Files:**
- Create: `apps/docs/src/data/components/app-frame.ts`
- Create: `apps/docs/src/data/components/app-sidebar.ts`
- Create: `apps/docs/src/data/components/app-top-bar.ts`
- Create: `apps/docs/src/data/components/form-field.ts`
- Create: `apps/docs/src/data/components/field-grid.ts`
- Create: `apps/docs/src/data/components/page-header-shell.ts`

**Step 1: Create app-frame.ts**

```ts
// apps/docs/src/data/components/app-frame.ts
import type { ComponentData } from "../types"

export const appFrameData: ComponentData = {
  name: "AppFrame",
  category: "patterns",
  description: "Shell principal d'application avec sidebar, top bar et zone de contenu.",
  docPath: "/docs/components/patterns/app-frame",
  imports: {
    path: "@blazz/ui/components/patterns/app-frame",
    named: ["AppFrame"],
  },
  props: [
    { name: "sidebarConfig", type: "SidebarConfig", description: "Config complète sidebar (user, navigation). Requis si navigation n'est pas fourni." },
    { name: "navigation", type: "NavigationSection[]", description: "Shortcut pour passer uniquement la navigation." },
    { name: "children", type: "React.ReactNode", required: true, description: "Contenu principal de l'app." },
    { name: "sidebarHeader", type: "React.ReactNode", description: "Slot en haut de sidebar (ex: OrgSwitcher)." },
    { name: "topBarContent", type: "React.ReactNode", description: "Contenu additionnel dans la top bar." },
  ],
  gotchas: [
    "Import from @blazz/ui/components/patterns/app-frame — not from @blazz/ui directly",
    "AppFrame wraps the entire app layout — use in root layout file, not per-page",
    "navigation prop is shorthand — use sidebarConfig for full control (user info, avatar, etc.)",
  ],
  canonicalExample: `// In root layout (layout.tsx)
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
</AppFrame>`,
}
```

**Step 2: Create form-field.ts**

```ts
// apps/docs/src/data/components/form-field.ts
import type { ComponentData } from "../types"

export const formFieldData: ComponentData = {
  name: "FormField",
  category: "patterns",
  description: "Wrapper label + input + erreur + description pour les formulaires react-hook-form.",
  docPath: "/docs/components/patterns/form-field",
  imports: {
    path: "@blazz/ui/components/patterns/form-field",
    named: ["FormField"],
  },
  props: [
    { name: "label", type: "string", required: true, description: "Label du champ." },
    { name: "error", type: "string", description: "Message d'erreur (depuis react-hook-form errors)." },
    { name: "description", type: "string", description: "Texte d'aide affiché sous l'input." },
    { name: "required", type: "boolean", description: "Affiche un * après le label." },
    { name: "children", type: "React.ReactNode", required: true, description: "Le composant input." },
  ],
  gotchas: [
    "Always use FormField to wrap inputs in forms — never write label+input+error manually",
    "Pass error={errors.fieldName?.message} directly from react-hook-form",
  ],
  canonicalExample: `<FormField
  label="Email"
  required
  error={errors.email?.message}
  description="We'll send a confirmation to this address."
>
  <Input type="email" {...register("email")} aria-invalid={!!errors.email} />
</FormField>`,
}
```

**Step 3: Create field-grid.ts**

```ts
// apps/docs/src/data/components/field-grid.ts
import type { ComponentData } from "../types"

export const fieldGridData: ComponentData = {
  name: "FieldGrid",
  category: "patterns",
  description: "Grille responsive pour aligner des champs de formulaire ou des propriétés.",
  docPath: "/docs/components/patterns/field-grid",
  imports: {
    path: "@blazz/ui/components/patterns/field-grid",
    named: ["FieldGrid"],
  },
  props: [
    { name: "cols", type: "1 | 2 | 3", default: "2", description: "Nombre de colonnes." },
    { name: "children", type: "React.ReactNode", required: true, description: "Champs à afficher en grille." },
  ],
  gotchas: [
    "Use col-span-2 or col-span-3 on children for full-width fields (textarea, address)",
    "Use cols={3} for 8-15 fields, cols={2} for < 8 fields",
  ],
  canonicalExample: `<FieldGrid cols={2}>
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
</FieldGrid>`,
}
```

**Step 4: Create page-header-shell.ts**

```ts
// apps/docs/src/data/components/page-header-shell.ts
import type { ComponentData } from "../types"

export const pageHeaderShellData: ComponentData = {
  name: "PageHeaderShell",
  category: "patterns",
  description: "Header de page standardisé avec titre, breadcrumb, et slot d'actions.",
  docPath: "/docs/components/patterns/page-header-shell",
  imports: {
    path: "@blazz/ui/components/patterns/page-header-shell",
    named: ["PageHeaderShell"],
  },
  props: [
    { name: "title", type: "string", required: true, description: "Titre de la page." },
    { name: "description", type: "string", description: "Sous-titre ou description." },
    { name: "actions", type: "React.ReactNode", description: "Boutons d'action (top-right)." },
    { name: "breadcrumb", type: "React.ReactNode", description: "Fil d'Ariane." },
  ],
  gotchas: [
    "Primary action goes in actions prop (top-right), always a Button variant='default'",
    "Use at the top of every resource page — not inside cards",
  ],
  canonicalExample: `<PageHeaderShell
  title="Contacts"
  description="2 847 contacts"
  actions={
    <Button onClick={() => setCreateOpen(true)}>
      <Plus className="size-4" /> New Contact
    </Button>
  }
/>`,
}
```

**Step 5: Create app-sidebar.ts and app-top-bar.ts (minimal — rarely configured directly)**

```ts
// apps/docs/src/data/components/app-sidebar.ts
import type { ComponentData } from "../types"

export const appSidebarData: ComponentData = {
  name: "AppSidebar",
  category: "patterns",
  description: "Sidebar navigable — généralement configuré via AppFrame, rarement utilisé directement.",
  docPath: "/docs/components/patterns/app-sidebar",
  imports: {
    path: "@blazz/ui/components/patterns/app-sidebar",
    named: ["AppSidebar"],
  },
  props: [
    { name: "config", type: "SidebarConfig", required: true, description: "Config de la sidebar (navigation, user)." },
  ],
  gotchas: [
    "Prefer AppFrame over AppSidebar directly — AppFrame handles sidebar + top bar + layout",
  ],
  canonicalExample: `// Use AppFrame instead:
<AppFrame navigation={navigationSections}>{children}</AppFrame>`,
}
```

```ts
// apps/docs/src/data/components/app-top-bar.ts
import type { ComponentData } from "../types"

export const appTopBarData: ComponentData = {
  name: "AppTopBar",
  category: "patterns",
  description: "Barre de navigation supérieure — généralement incluse via AppFrame.",
  docPath: "/docs/components/patterns/app-top-bar",
  imports: {
    path: "@blazz/ui/components/patterns/app-top-bar",
    named: ["AppTopBar"],
  },
  props: [
    { name: "children", type: "React.ReactNode", description: "Contenu additionnel dans la top bar." },
  ],
  gotchas: [
    "Prefer AppFrame over AppTopBar directly — AppFrame includes the top bar",
  ],
  canonicalExample: `// Use AppFrame instead:
<AppFrame topBarContent={<ThemeToggle />}>{children}</AppFrame>`,
}
```

**Step 6: Commit**

```bash
git add apps/docs/src/data/components/
git commit -m "feat(llm-docs): add patterns data files (AppFrame, FormField, FieldGrid, PageHeaderShell, AppSidebar, AppTopBar)"
```

---

## Task 7: Blocks data files

**Files:**
- Create: `apps/docs/src/data/components/data-table.ts`
- Create: `apps/docs/src/data/components/stats-grid.ts`
- Create: `apps/docs/src/data/components/filter-bar.ts`
- Create: `apps/docs/src/data/components/detail-panel.ts`
- Create: `apps/docs/src/data/components/activity-timeline.ts`

**Step 1: Create data-table.ts**

```ts
// apps/docs/src/data/components/data-table.ts
import type { ComponentData } from "../types"

export const dataTableData: ComponentData = {
  name: "DataTable",
  category: "blocks",
  description: "Table de données avancée avec tri, filtrage, pagination, sélection et actions bulk.",
  docPath: "/docs/components/blocks/data-table",
  imports: {
    path: "@blazz/ui/components/blocks/data-table",
    named: ["DataTable", "col"],
  },
  props: [
    { name: "data", type: "T[]", required: true, description: "Tableau de données à afficher." },
    { name: "columns", type: "DataTableColumnDef<T>[]", required: true, description: "Définitions des colonnes (via col() factory ou DataTableColumnDef directement)." },
    { name: "onRowClick", type: "(row: T) => void", description: "Callback au clic sur une ligne." },
    { name: "getRowId", type: "(row: T) => string", description: "Fonction pour obtenir l'ID unique d'une ligne." },
    { name: "loading", type: "boolean", default: "false", description: "Affiche le skeleton de chargement." },
  ],
  gotchas: [
    "Import from @blazz/ui/components/blocks/data-table — not from @blazz/ui",
    "Use col() factory for column definitions — not raw ColumnDef from TanStack Table",
    "For preset tables (CRM, StockBase) use createCompaniesPreset/createContactsPreset etc.",
    "getRowId is required for row selection to work correctly",
  ],
  canonicalExample: `import { DataTable, col } from "@blazz/ui/components/blocks/data-table"

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
  onRowClick={(row) => navigate(\`/contacts/\${row.id}\`)}
/>`,
}
```

**Step 2: Create stats-grid.ts**

```ts
// apps/docs/src/data/components/stats-grid.ts
import type { ComponentData } from "../types"

export const statsGridData: ComponentData = {
  name: "StatsGrid",
  category: "blocks",
  description: "Grille de KPIs avec valeur principale, tendance et sparkline.",
  docPath: "/docs/components/blocks/stats-grid",
  imports: {
    path: "@blazz/ui/components/blocks/stats-grid",
    named: ["StatsGrid"],
  },
  props: [
    { name: "stats", type: "StatItem[]", required: true, description: "Tableau de stats à afficher. Chaque item: { label, value, trend?, trendLabel?, icon?, sparkline? }." },
    { name: "cols", type: "2 | 3 | 4", default: "4", description: "Nombre de colonnes." },
  ],
  gotchas: [
    "Maximum 4 stats per row — beyond that the eye doesn't know where to focus",
    "trend is a number (positive = green ▲, negative = red ▼)",
    "value should be pre-formatted string ('€1.2M', '2 847') — not a raw number",
  ],
  canonicalExample: `<StatsGrid
  stats={[
    { label: "Revenue", value: "€1.2M", trend: 8.2, trendLabel: "vs last month", icon: <DollarSign /> },
    { label: "Contacts", value: "2 847", trend: 12, trendLabel: "new this month", icon: <Users /> },
    { label: "Deals", value: "143", trend: -3.1, trendLabel: "vs last month", icon: <Briefcase /> },
    { label: "Win Rate", value: "34%", trend: 2.4, trendLabel: "vs last quarter", icon: <TrendingUp /> },
  ]}
/>`,
}
```

**Step 3: Create filter-bar.ts**

```ts
// apps/docs/src/data/components/filter-bar.ts
import type { ComponentData } from "../types"

export const filterBarData: ComponentData = {
  name: "FilterBar",
  category: "blocks",
  description: "Barre de filtres pour les pages de liste — recherche + filtres actifs + reset.",
  docPath: "/docs/components/blocks/filter-bar",
  imports: {
    path: "@blazz/ui/components/blocks/filter-bar",
    named: ["FilterBar"],
  },
  props: [
    { name: "search", type: "string", description: "Valeur de recherche contrôlée." },
    { name: "onSearchChange", type: "(value: string) => void", description: "Callback recherche." },
    { name: "filters", type: "FilterConfig[]", description: "Configuration des filtres disponibles." },
    { name: "activeFilters", type: "Record<string, string>", description: "Filtres actifs contrôlés." },
    { name: "onFilterChange", type: "(filters: Record<string, string>) => void", description: "Callback filtres." },
    { name: "onReset", type: "() => void", description: "Callback reset tous les filtres." },
  ],
  gotchas: [
    "FilterBar goes ABOVE the DataTable, outside of it — not inside",
    "Persist filters in URL searchParams for back-button support",
    "onReset should clear both search and all activeFilters",
  ],
  canonicalExample: `<FilterBar
  search={search}
  onSearchChange={setSearch}
  activeFilters={filters}
  onFilterChange={setFilters}
  onReset={() => { setSearch(""); setFilters({}) }}
  filters={[
    { key: "status", label: "Status", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
  ]}
/>`,
}
```

**Step 4: Create detail-panel.ts**

```ts
// apps/docs/src/data/components/detail-panel.ts
import type { ComponentData } from "../types"

export const detailPanelData: ComponentData = {
  name: "DetailPanel",
  category: "blocks",
  description: "Panneau de détail d'une entité avec sections, propriétés et tabs.",
  docPath: "/docs/components/blocks/detail-panel",
  imports: {
    path: "@blazz/ui/components/blocks/detail-panel",
    named: ["DetailPanel", "DetailPanelSection", "DetailPanelProperty"],
  },
  props: [
    { name: "title", type: "string", required: true, description: "Titre de l'entité." },
    { name: "subtitle", type: "string", description: "Sous-titre (statut, rôle, etc.)." },
    { name: "actions", type: "React.ReactNode", description: "Actions (Edit, Delete, etc.)." },
    { name: "children", type: "React.ReactNode", required: true, description: "Sections et contenu." },
  ],
  gotchas: [
    "Use DetailPanelSection to group properties — not raw divs",
    "Missing values display '—' (em dash), never empty string",
  ],
  canonicalExample: `<DetailPanel
  title={contact.name}
  subtitle={contact.role}
  actions={<Button size="sm" variant="outline">Edit</Button>}
>
  <DetailPanelSection title="Contact Info">
    <DetailPanelProperty label="Email" value={contact.email} />
    <DetailPanelProperty label="Phone" value={contact.phone ?? "—"} />
  </DetailPanelSection>
</DetailPanel>`,
}
```

**Step 5: Create activity-timeline.ts**

```ts
// apps/docs/src/data/components/activity-timeline.ts
import type { ComponentData } from "../types"

export const activityTimelineData: ComponentData = {
  name: "ActivityTimeline",
  category: "blocks",
  description: "Timeline d'activités et d'événements chronologiques.",
  docPath: "/docs/components/blocks/activity-timeline",
  imports: {
    path: "@blazz/ui/components/blocks/activity-timeline",
    named: ["ActivityTimeline"],
  },
  props: [
    { name: "activities", type: "Activity[]", required: true, description: "Tableau d'activités. Chaque item: { id, type, user, description, createdAt }." },
    { name: "loading", type: "boolean", default: "false", description: "Affiche un skeleton." },
  ],
  gotchas: [
    "Dates in activities are displayed as relative ('2 days ago') for < 7 days, absolute for older",
    "Always provide loading state — timeline is usually async",
  ],
  canonicalExample: `<ActivityTimeline
  activities={contact.activities}
  loading={isLoadingActivities}
/>`,
}
```

**Step 6: Commit**

```bash
git add apps/docs/src/data/components/
git commit -m "feat(llm-docs): add blocks data files (DataTable, StatsGrid, FilterBar, DetailPanel, ActivityTimeline)"
```

---

## Task 8: Build registry

**Files:**
- Create: `apps/docs/src/data/registry.ts`

**Step 1: Create registry.ts**

```ts
// apps/docs/src/data/registry.ts
import type { ComponentData } from "./types"

// UI — Forms
import { selectData } from "./components/select"
import { buttonData } from "./components/button"
import { inputData } from "./components/input"
import { textareaData } from "./components/textarea"
import { checkboxData } from "./components/checkbox"
import { switchData } from "./components/switch"
import { radioGroupData } from "./components/radio-group"
import { dateSelectorData } from "./components/date-selector"
import { comboboxData } from "./components/combobox"

// UI — Overlays
import { dialogData } from "./components/dialog"
import { sheetData } from "./components/sheet"
import { dropdownMenuData } from "./components/dropdown-menu"
import { popoverData } from "./components/popover"
import { tooltipData } from "./components/tooltip"

// UI — Primitives
import { badgeData } from "./components/badge"
import { avatarData } from "./components/avatar"
import { tabsData } from "./components/tabs"
import { skeletonData } from "./components/skeleton"

// Patterns
import { appFrameData } from "./components/app-frame"
import { appSidebarData } from "./components/app-sidebar"
import { appTopBarData } from "./components/app-top-bar"
import { formFieldData } from "./components/form-field"
import { fieldGridData } from "./components/field-grid"
import { pageHeaderShellData } from "./components/page-header-shell"

// Blocks
import { dataTableData } from "./components/data-table"
import { statsGridData } from "./components/stats-grid"
import { filterBarData } from "./components/filter-bar"
import { detailPanelData } from "./components/detail-panel"
import { activityTimelineData } from "./components/activity-timeline"

export const registry: ComponentData[] = [
  // UI — Forms
  selectData, buttonData, inputData, textareaData,
  checkboxData, switchData, radioGroupData, dateSelectorData, comboboxData,
  // UI — Overlays
  dialogData, sheetData, dropdownMenuData, popoverData, tooltipData,
  // UI — Primitives
  badgeData, avatarData, tabsData, skeletonData,
  // Patterns
  appFrameData, appSidebarData, appTopBarData, formFieldData, fieldGridData, pageHeaderShellData,
  // Blocks
  dataTableData, statsGridData, filterBarData, detailPanelData, activityTimelineData,
]
```

**Step 2: Verify TypeScript compiles**

```bash
cd apps/docs && pnpm type-check
```

Expected: no errors.

**Step 3: Commit**

```bash
git add apps/docs/src/data/registry.ts
git commit -m "feat(llm-docs): build component registry (30 components)"
```

---

## Task 9: Generator script

**Files:**
- Create: `apps/docs/scripts/generate-llms.ts`

**Step 1: Create the generator**

```ts
#!/usr/bin/env tsx
// apps/docs/scripts/generate-llms.ts

import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { registry } from "../src/data/registry"
import type { ComponentData } from "../src/data/types"

const DOCS_BASE_URL = "https://blazz.io"

// ── llms.txt renderer ──────────────────────────────────────────────────────

function renderComponent(c: ComponentData): string {
  const lines: string[] = []

  lines.push(`## ${c.name}`)
  lines.push("")
  lines.push(`Import: \`${c.imports.path}\``)
  lines.push(`Named: \`${c.imports.named.join(", ")}\``)
  lines.push(`Docs: ${DOCS_BASE_URL}${c.docPath}`)
  lines.push("")
  lines.push(c.description)
  lines.push("")

  for (const gotcha of c.gotchas) {
    lines.push(`⚠️ ${gotcha}`)
  }
  lines.push("")

  const propSummary = c.props
    .map(p => `${p.name} (${p.type}${p.required ? ", required" : ""}${p.default ? `, default: ${p.default}` : ""})`)
    .join(", ")
  lines.push(`Props: ${propSummary}`)
  lines.push("")

  lines.push("```tsx")
  lines.push(c.canonicalExample)
  lines.push("```")

  return lines.join("\n")
}

function generateLlmsTxt(): string {
  const sections: string[] = []

  sections.push("# @blazz/ui")
  sections.push("")
  sections.push("> AI-native React component kit for data-heavy pro apps. Base UI (not Radix).")
  sections.push("")
  sections.push("## Critical Rules")
  sections.push("")
  sections.push("- ALL trigger components use `render={<Component />}` NOT `asChild` (Base UI, not Radix)")
  sections.push("- DateSelector NOT `<input type=\"date\">` — import from @blazz/ui/components/ui/date-selector")
  sections.push("- Select/Combobox: `items`/`options` prop ALWAYS required to show labels instead of raw values")
  sections.push("- Import paths: `@blazz/ui/components/{category}/{name}` — not from barrel `@blazz/ui`")
  sections.push("- Forms: ALWAYS use react-hook-form + zod. Never local useState for form state.")
  sections.push("- All 4 states required: loading (Skeleton), empty (Empty component), error, success")
  sections.push("")
  sections.push("---")
  sections.push("")

  const byCategory = registry.reduce<Record<string, ComponentData[]>>((acc, c) => {
    acc[c.category] = acc[c.category] ?? []
    acc[c.category].push(c)
    return acc
  }, {})

  const categoryOrder = ["ui", "patterns", "blocks", "ai"] as const
  const categoryLabels: Record<string, string> = {
    ui: "UI Primitives",
    patterns: "Patterns",
    blocks: "Business Blocks",
    ai: "AI Components",
  }

  for (const cat of categoryOrder) {
    const components = byCategory[cat]
    if (!components?.length) continue

    sections.push(`# ${categoryLabels[cat]}`)
    sections.push("")
    for (const component of components) {
      sections.push(renderComponent(component))
      sections.push("")
      sections.push("---")
      sections.push("")
    }
  }

  return sections.join("\n")
}

// ── AI.md renderer ─────────────────────────────────────────────────────────

function generateAiMd(): string {
  const lines: string[] = []

  lines.push("# @blazz/ui — AI Context")
  lines.push("")
  lines.push("> Read before generating any @blazz/ui code.")
  lines.push("")
  lines.push("## Critical Patterns")
  lines.push("")
  lines.push("### 1. Select — ALWAYS pass items")
  lines.push("Without `items`, SelectValue shows raw value ('active'), not label ('Active').")
  lines.push("```tsx")
  lines.push('<Select items={[{ value: "active", label: "Active" }]} value={v} onValueChange={setV}>')
  lines.push("```")
  lines.push("")
  lines.push("### 2. Triggers — render={} not asChild (Base UI)")
  lines.push("```tsx")
  lines.push('<DialogTrigger render={<Button />}>Open</DialogTrigger>  // ✅')
  lines.push('<DialogTrigger asChild><Button /></DialogTrigger>         // ❌')
  lines.push("```")
  lines.push("")
  lines.push("### 3. Dates — DateSelector not input type='date'")
  lines.push("```tsx")
  lines.push('import { DateSelector } from "@blazz/ui/components/ui/date-selector"')
  lines.push('<DateSelector value={date} onValueChange={setDate} formatStr="dd/MM/yyyy" />')
  lines.push("```")
  lines.push("")
  lines.push("### 4. Forms — react-hook-form + zod always")
  lines.push("Never useState for form fields. Always useForm + zodResolver.")
  lines.push("")
  lines.push("### 5. 4 required states")
  lines.push("Every data-loading component needs: loading (Skeleton), empty (Empty), error, success.")
  lines.push("")
  lines.push("---")
  lines.push("")
  lines.push("## Component Index")
  lines.push("")
  lines.push("| Component | Import | Key Gotcha |")
  lines.push("|-----------|--------|------------|")

  for (const c of registry) {
    const mainGotcha = c.gotchas[0]?.slice(0, 80) ?? ""
    lines.push(`| ${c.name} | \`${c.imports.path}\` | ${mainGotcha} |`)
  }

  lines.push("")
  lines.push("---")
  lines.push("")
  lines.push("## Full Component Reference")
  lines.push("")

  for (const c of registry) {
    lines.push(`### ${c.name}`)
    lines.push("")
    lines.push(`\`${c.imports.path}\``)
    lines.push(`Named: \`${c.imports.named.join(", ")}\``)
    lines.push("")
    for (const gotcha of c.gotchas) {
      lines.push(`- ⚠️ ${gotcha}`)
    }
    lines.push("")
    lines.push("```tsx")
    lines.push(c.canonicalExample)
    lines.push("```")
    lines.push("")
  }

  return lines.join("\n")
}

// ── Main ───────────────────────────────────────────────────────────────────

const llmsTxt = generateLlmsTxt()
const aiMd = generateAiMd()

const docsPublicDir = join(import.meta.dirname, "..", "public")
const uiPackageDir = join(import.meta.dirname, "..", "..", "..", "packages", "ui")

writeFileSync(join(docsPublicDir, "llms.txt"), llmsTxt, "utf-8")
writeFileSync(join(uiPackageDir, "AI.md"), aiMd, "utf-8")

console.log(`✓ public/llms.txt — ${registry.length} components`)
console.log(`✓ packages/ui/AI.md — ${registry.length} components`)
```

**Step 2: Add script to package.json**

In `apps/docs/package.json`, add to scripts:
```json
"generate:llms": "tsx scripts/generate-llms.ts"
```

**Step 3: Run the generator**

```bash
cd apps/docs && pnpm generate:llms
```

Expected output:
```
✓ public/llms.txt — 30 components
✓ packages/ui/AI.md — 30 components
```

**Step 4: Verify outputs exist and are non-empty**

```bash
wc -l apps/docs/public/llms.txt packages/ui/AI.md
```

Expected: both files > 100 lines.

**Step 5: Spot-check llms.txt for Select entry**

```bash
grep -A 15 "^## Select" apps/docs/public/llms.txt
```

Expected: shows ⚠️ items gotcha and canonical example.

**Step 6: Commit**

```bash
git add apps/docs/scripts/generate-llms.ts apps/docs/package.json apps/docs/public/llms.txt packages/ui/AI.md
git commit -m "feat(llm-docs): add generator script, generate llms.txt and AI.md"
```

---

## Task 10: Add to build pipeline + update CLAUDE.md reference

**Files:**
- Modify: `apps/docs/package.json`
- Modify: `CLAUDE.md` (root)

**Step 1: Integrate generate:llms into build**

In `apps/docs/package.json`, update build script:
```json
"build": "tsx scripts/generate-llms.ts && vite build && tsc --noEmit"
```

**Step 2: Reference AI.md in project CLAUDE.md**

In root `CLAUDE.md`, add to the Conventions section:
```markdown
## AI context
- `packages/ui/AI.md` — composants @blazz/ui avec gotchas et exemples canoniques. À lire avant de générer du code UI.
```

**Step 3: Verify build still works**

```bash
cd apps/docs && pnpm build
```

Expected: builds successfully, llms.txt regenerated.

**Step 4: Commit**

```bash
git add apps/docs/package.json CLAUDE.md
git commit -m "feat(llm-docs): integrate generator into build pipeline, reference AI.md from CLAUDE.md"
```

---

## Done ✓

After completion:
- `apps/docs/public/llms.txt` — served at `https://blazz.io/llms.txt`, crawled by AI assistants
- `packages/ui/AI.md` — loaded as context for Claude Code, Cursor, etc.
- `apps/docs/src/data/` — typed registry, single source of truth for 30 components
- Select doc page migrated to import props from data file (template for future migrations)
