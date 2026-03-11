import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuGroup,
	ContextMenuCheckboxItem,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSub,
	ContextMenuSubTrigger,
	ContextMenuSubContent,
	ContextMenuShortcut,
} from "@blazz/ui/components/ui/context-menu"
import {
	Copy,
	Scissors,
	ClipboardPaste,
	RotateCcw,
	RotateCw,
	Trash2,
	Eye,
	EyeOff,
	Type,
	AlignLeft,
	AlignCenter,
	AlignRight,
} from "lucide-react"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "basic",
		code: `<ContextMenu>
  <ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>
      <RotateCcw className="mr-2 h-4 w-4" />
      Undo
      <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem>
      <RotateCw className="mr-2 h-4 w-4" />
      Redo
      <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>
      <Scissors className="mr-2 h-4 w-4" />
      Cut
      <ContextMenuShortcut>⌘X</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem>
      <Copy className="mr-2 h-4 w-4" />
      Copy
      <ContextMenuShortcut>⌘C</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuItem>
      <ClipboardPaste className="mr-2 h-4 w-4" />
      Paste
      <ContextMenuShortcut>⌘V</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
	},
	{
		key: "with-labels",
		code: `<ContextMenu>
  <ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuGroup>
      <ContextMenuLabel>Edit</ContextMenuLabel>
      <ContextMenuItem>
        Cut
        <ContextMenuShortcut>⌘X</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>
        Copy
        <ContextMenuShortcut>⌘C</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem>
        Paste
        <ContextMenuShortcut>⌘V</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuGroup>
    <ContextMenuSeparator />
    <ContextMenuGroup>
      <ContextMenuLabel>View</ContextMenuLabel>
      <ContextMenuItem>Zoom In</ContextMenuItem>
      <ContextMenuItem>Zoom Out</ContextMenuItem>
      <ContextMenuItem>Reset Zoom</ContextMenuItem>
    </ContextMenuGroup>
  </ContextMenuContent>
</ContextMenu>`,
	},
	{
		key: "checkbox",
		code: `const [showGrid, setShowGrid] = React.useState(true)
const [showRulers, setShowRulers] = React.useState(false)

<ContextMenu>
  <ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuGroup>
      <ContextMenuLabel>Display</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem
        checked={showGrid}
        onCheckedChange={setShowGrid}
      >
        <Eye className="mr-2 h-4 w-4" />
        Show Grid
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem
        checked={showRulers}
        onCheckedChange={setShowRulers}
      >
        <EyeOff className="mr-2 h-4 w-4" />
        Show Rulers
      </ContextMenuCheckboxItem>
    </ContextMenuGroup>
  </ContextMenuContent>
</ContextMenu>`,
	},
	{
		key: "radio",
		code: `const [alignment, setAlignment] = React.useState("left")

<ContextMenu>
  <ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuGroup>
      <ContextMenuLabel>Text Alignment</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuRadioGroup value={alignment} onValueChange={setAlignment}>
        <ContextMenuRadioItem value="left">Left</ContextMenuRadioItem>
        <ContextMenuRadioItem value="center">Center</ContextMenuRadioItem>
        <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </ContextMenuGroup>
  </ContextMenuContent>
</ContextMenu>`,
	},
	{
		key: "submenu",
		code: `<ContextMenu>
  <ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>
      <Copy className="mr-2 h-4 w-4" />
      Copy
    </ContextMenuItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>
        <Type className="mr-2 h-4 w-4" />
        Text Alignment
      </ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem>
          <AlignLeft className="mr-2 h-4 w-4" />
          Left
        </ContextMenuItem>
        <ContextMenuItem>
          <AlignCenter className="mr-2 h-4 w-4" />
          Center
        </ContextMenuItem>
        <ContextMenuItem>
          <AlignRight className="mr-2 h-4 w-4" />
          Right
        </ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
    <ContextMenuSeparator />
    <ContextMenuItem variant="destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/context-menu")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ContextMenuPage,
})

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "context-menu-props", title: "ContextMenu Props" },
	{ id: "context-menu-content-props", title: "ContextMenuContent Props" },
	{ id: "context-menu-item-props", title: "ContextMenuItem Props" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const contextMenuProps: DocProp[] = [
	{
		name: "children",
		type: "React.ReactNode",
		required: true,
		description: "The context menu trigger and content.",
	},
	{
		name: "open",
		type: "boolean",
		description: "Controlled open state.",
	},
	{
		name: "onOpenChange",
		type: "(open: boolean) => void",
		description: "Callback when open state changes.",
	},
]

const contextMenuContentProps: DocProp[] = [
	{
		name: "align",
		type: "'start' | 'center' | 'end'",
		default: "'start'",
		description: "Alignment relative to the cursor position.",
	},
	{
		name: "side",
		type: "'top' | 'right' | 'bottom' | 'left'",
		default: "'right'",
		description: "Side to render the context menu.",
	},
	{
		name: "sideOffset",
		type: "number",
		default: "0",
		description: "Distance from the cursor.",
	},
	{
		name: "alignOffset",
		type: "number",
		default: "4",
		description: "Offset along the alignment axis.",
	},
]

const contextMenuItemProps: DocProp[] = [
	{
		name: "inset",
		type: "boolean",
		description: "Adds left padding for alignment with checkbox/radio items.",
	},
	{
		name: "variant",
		type: "'default' | 'destructive'",
		default: "'default'",
		description: "Visual variant of the item.",
	},
	{
		name: "disabled",
		type: "boolean",
		description: "Disables the menu item.",
	},
]

/* ── Inlined demo components ── */

function CheckboxItemsDemo() {
	const [showGrid, setShowGrid] = React.useState(true)
	const [showRulers, setShowRulers] = React.useState(false)

	return (
		<ContextMenu>
			<ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
				Right click here
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuGroup>
					<ContextMenuLabel>Display</ContextMenuLabel>
					<ContextMenuSeparator />
					<ContextMenuCheckboxItem
						checked={showGrid}
						onCheckedChange={setShowGrid}
					>
						<Eye className="mr-2 h-4 w-4" />
						Show Grid
					</ContextMenuCheckboxItem>
					<ContextMenuCheckboxItem
						checked={showRulers}
						onCheckedChange={setShowRulers}
					>
						<EyeOff className="mr-2 h-4 w-4" />
						Show Rulers
					</ContextMenuCheckboxItem>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}

function RadioItemsDemo() {
	const [alignment, setAlignment] = React.useState("left")

	return (
		<ContextMenu>
			<ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
				Right click here
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuGroup>
					<ContextMenuLabel>Text Alignment</ContextMenuLabel>
					<ContextMenuSeparator />
					<ContextMenuRadioGroup value={alignment} onValueChange={setAlignment}>
						<ContextMenuRadioItem value="left">Left</ContextMenuRadioItem>
						<ContextMenuRadioItem value="center">Center</ContextMenuRadioItem>
						<ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
					</ContextMenuRadioGroup>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}

function ContextMenuPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Context Menu"
			subtitle="Displays a menu triggered by right-clicking an element."
			toc={toc}
		>
			<DocHero>
				<ContextMenu>
					<ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
						Right click here
					</ContextMenuTrigger>
					<ContextMenuContent>
						<ContextMenuItem>
							<Copy className="mr-2 h-4 w-4" />
							Copy
							<ContextMenuShortcut>⌘C</ContextMenuShortcut>
						</ContextMenuItem>
						<ContextMenuItem>
							<ClipboardPaste className="mr-2 h-4 w-4" />
							Paste
							<ContextMenuShortcut>⌘V</ContextMenuShortcut>
						</ContextMenuItem>
						<ContextMenuSeparator />
						<ContextMenuItem variant="destructive">
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic Context Menu"
					description="A context menu with common edit actions and keyboard shortcuts."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<ContextMenu>
						<ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
							Right click here
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem>
								<RotateCcw className="mr-2 h-4 w-4" />
								Undo
								<ContextMenuShortcut>⌘Z</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuItem>
								<RotateCw className="mr-2 h-4 w-4" />
								Redo
								<ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuSeparator />
							<ContextMenuItem>
								<Scissors className="mr-2 h-4 w-4" />
								Cut
								<ContextMenuShortcut>⌘X</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuItem>
								<Copy className="mr-2 h-4 w-4" />
								Copy
								<ContextMenuShortcut>⌘C</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuItem>
								<ClipboardPaste className="mr-2 h-4 w-4" />
								Paste
								<ContextMenuShortcut>⌘V</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuSeparator />
							<ContextMenuItem variant="destructive">
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				</DocExampleClient>

				<DocExampleClient
					title="With Labels and Groups"
					description="Organize items into labeled groups."
					code={examples[1].code}
					highlightedCode={html("with-labels")}
				>
					<ContextMenu>
						<ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
							Right click here
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuGroup>
								<ContextMenuLabel>Edit</ContextMenuLabel>
								<ContextMenuItem>
									Cut
									<ContextMenuShortcut>⌘X</ContextMenuShortcut>
								</ContextMenuItem>
								<ContextMenuItem>
									Copy
									<ContextMenuShortcut>⌘C</ContextMenuShortcut>
								</ContextMenuItem>
								<ContextMenuItem>
									Paste
									<ContextMenuShortcut>⌘V</ContextMenuShortcut>
								</ContextMenuItem>
							</ContextMenuGroup>
							<ContextMenuSeparator />
							<ContextMenuGroup>
								<ContextMenuLabel>View</ContextMenuLabel>
								<ContextMenuItem>Zoom In</ContextMenuItem>
								<ContextMenuItem>Zoom Out</ContextMenuItem>
								<ContextMenuItem>Reset Zoom</ContextMenuItem>
							</ContextMenuGroup>
						</ContextMenuContent>
					</ContextMenu>
				</DocExampleClient>

				<DocExampleClient
					title="With Checkbox Items"
					description="Menu items with toggleable checkbox state."
					code={examples[2].code}
					highlightedCode={html("checkbox")}
				>
					<CheckboxItemsDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Radio Items"
					description="Menu items with single-choice radio selection."
					code={examples[3].code}
					highlightedCode={html("radio")}
				>
					<RadioItemsDemo />
				</DocExampleClient>

				<DocExampleClient
					title="With Submenu"
					description="Nested submenus for hierarchical options."
					code={examples[4].code}
					highlightedCode={html("submenu")}
				>
					<ContextMenu>
						<ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">
							Right click here
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem>
								<Copy className="mr-2 h-4 w-4" />
								Copy
							</ContextMenuItem>
							<ContextMenuSub>
								<ContextMenuSubTrigger>
									<Type className="mr-2 h-4 w-4" />
									Text Alignment
								</ContextMenuSubTrigger>
								<ContextMenuSubContent>
									<ContextMenuItem>
										<AlignLeft className="mr-2 h-4 w-4" />
										Left
									</ContextMenuItem>
									<ContextMenuItem>
										<AlignCenter className="mr-2 h-4 w-4" />
										Center
									</ContextMenuItem>
									<ContextMenuItem>
										<AlignRight className="mr-2 h-4 w-4" />
										Right
									</ContextMenuItem>
								</ContextMenuSubContent>
							</ContextMenuSub>
							<ContextMenuSeparator />
							<ContextMenuItem variant="destructive">
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				</DocExampleClient>
			</DocSection>

			<DocSection id="context-menu-props" title="ContextMenu Props">
				<DocPropsTable props={contextMenuProps} />
			</DocSection>

			<DocSection id="context-menu-content-props" title="ContextMenuContent Props">
				<DocPropsTable props={contextMenuContentProps} />
			</DocSection>

			<DocSection id="context-menu-item-props" title="ContextMenuItem Props">
				<DocPropsTable props={contextMenuItemProps} />
			</DocSection>

			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use context menus for secondary actions — primary actions should be visible in the UI</li>
					<li>Keep the trigger area large enough to be easily right-clicked</li>
					<li>Show keyboard shortcuts to help users discover faster alternatives</li>
					<li>Use labels and separators to organize related items into groups</li>
					<li>Use the destructive variant for dangerous actions like delete</li>
					<li>Avoid deeply nested submenus — one level is usually sufficient</li>
				</ul>
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Dropdown Menu",
							href: "/docs/components/ui/dropdown-menu",
							description: "Menu triggered by clicking a button, for primary action menus.",
						},
						{
							title: "Menu",
							href: "/docs/components/ui/menu",
							description: "Unstyled dropdown with full keyboard navigation and accessibility.",
						},
						{
							title: "Popover",
							href: "/docs/components/ui/popover",
							description: "Floating container for rich content anchored to a trigger.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
