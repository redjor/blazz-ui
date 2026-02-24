import { TreeView } from "@/components/ui/tree-view"
import type { TreeNode } from "@/components/ui/tree-view"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import { DocPropsTable, type DocProp } from "@/components/features/docs/doc-props-table"
import { ControlledTreeDemo } from "./_demos"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "tree-node", title: "TreeNode" },
	{ id: "guidelines", title: "Guidelines" },
]

const treeViewProps: DocProp[] = [
	{
		name: "data",
		type: "TreeNode[]",
		description: "The tree data structure to render.",
	},
	{
		name: "selected",
		type: "string[]",
		description: "Controlled selected node IDs.",
	},
	{
		name: "onSelect",
		type: "(ids: string[]) => void",
		description: "Callback fired when the selection changes.",
	},
	{
		name: "expanded",
		type: "string[]",
		description: "Controlled expanded node IDs.",
	},
	{
		name: "onExpandChange",
		type: "(ids: string[]) => void",
		description: "Callback fired when expanded nodes change.",
	},
	{
		name: "multiSelect",
		type: "boolean",
		default: "false",
		description: "Whether multiple nodes can be selected at once.",
	},
]

const treeNodeProps: DocProp[] = [
	{
		name: "id",
		type: "string",
		description: "Unique identifier for the node.",
	},
	{
		name: "label",
		type: "string",
		description: "Display text for the node.",
	},
	{
		name: "icon",
		type: "ReactNode",
		description: "Optional custom icon. Defaults to FolderIcon (with children) or FileIcon (leaf).",
	},
	{
		name: "children",
		type: "TreeNode[]",
		description: "Child nodes. Presence of children makes this a branch node.",
	},
]

const basicTree: TreeNode[] = [
	{
		id: "documents",
		label: "Documents",
		children: [
			{ id: "resume.pdf", label: "resume.pdf" },
			{ id: "cover-letter.pdf", label: "cover-letter.pdf" },
		],
	},
	{
		id: "images",
		label: "Images",
		children: [
			{ id: "photo.jpg", label: "photo.jpg" },
			{ id: "logo.png", label: "logo.png" },
		],
	},
	{ id: "readme.md", label: "readme.md" },
]

const deepTree: TreeNode[] = [
	{
		id: "root",
		label: "project",
		children: [
			{
				id: "src",
				label: "src",
				children: [
					{
						id: "components",
						label: "components",
						children: [
							{
								id: "ui",
								label: "ui",
								children: [
									{ id: "button.tsx", label: "button.tsx" },
									{ id: "input.tsx", label: "input.tsx" },
									{ id: "select.tsx", label: "select.tsx" },
								],
							},
							{
								id: "layout",
								label: "layout",
								children: [
									{ id: "header.tsx", label: "header.tsx" },
									{ id: "footer.tsx", label: "footer.tsx" },
								],
							},
						],
					},
					{
						id: "lib",
						label: "lib",
						children: [
							{ id: "utils.ts", label: "utils.ts" },
						],
					},
					{ id: "app.tsx", label: "app.tsx" },
				],
			},
			{ id: "package.json", label: "package.json" },
		],
	},
]

export default function TreeViewPage() {
	return (
		<DocPage
			title="TreeView"
			subtitle="A hierarchical tree component for displaying nested data structures like file systems or category trees. Supports selection, expansion, and keyboard navigation."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<TreeView data={basicTree} className="max-w-xs" />
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic"
					description="A simple tree view with folders and files."
					code={`const data: TreeNode[] = [
  {
    id: "documents",
    label: "Documents",
    children: [
      { id: "resume.pdf", label: "resume.pdf" },
      { id: "cover-letter.pdf", label: "cover-letter.pdf" },
    ],
  },
  {
    id: "images",
    label: "Images",
    children: [
      { id: "photo.jpg", label: "photo.jpg" },
      { id: "logo.png", label: "logo.png" },
    ],
  },
  { id: "readme.md", label: "readme.md" },
]

<TreeView data={data} />`}
				>
					<TreeView data={basicTree} className="max-w-xs" />
				</DocExample>

				<DocExample
					title="Multi Select"
					description="Allow selecting multiple nodes simultaneously."
					code={`<TreeView data={data} multiSelect />`}
				>
					<TreeView data={basicTree} multiSelect className="max-w-xs" />
				</DocExample>

				<DocExample
					title="Controlled"
					description="Manage selected nodes with state and display selected IDs."
					code={`const [selected, setSelected] = React.useState<string[]>([])

<TreeView
  data={data}
  selected={selected}
  onSelect={setSelected}
/>
<p>Selected: {selected.join(", ") || "none"}</p>`}
				>
					<ControlledTreeDemo />
				</DocExample>

				<DocExample
					title="Deep Nesting"
					description="TreeView handles deeply nested data structures."
					code={`const deepTree: TreeNode[] = [
  {
    id: "root",
    label: "project",
    children: [
      {
        id: "src",
        label: "src",
        children: [
          {
            id: "components",
            label: "components",
            children: [
              {
                id: "ui",
                label: "ui",
                children: [
                  { id: "button.tsx", label: "button.tsx" },
                  { id: "input.tsx", label: "input.tsx" },
                ],
              },
            ],
          },
        ],
      },
      { id: "package.json", label: "package.json" },
    ],
  },
]

<TreeView data={deepTree} />`}
				>
					<TreeView data={deepTree} className="max-w-sm" />
				</DocExample>
			</DocSection>

			{/* Props */}
			<DocSection id="props" title="TreeView Props">
				<DocPropsTable props={treeViewProps} />
			</DocSection>

			<DocSection id="tree-node" title="TreeNode">
				<DocPropsTable props={treeNodeProps} />
			</DocSection>

			{/* Guidelines */}
			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Use unique IDs for each node to ensure correct selection and expansion</li>
					<li>Keep nesting depth reasonable (3-4 levels) for usability</li>
					<li>Use multiSelect when users need to operate on multiple items</li>
					<li>Keyboard navigation is supported: Arrow keys for expansion, Enter/Space for selection</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
