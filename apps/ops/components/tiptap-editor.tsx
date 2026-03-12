"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Placeholder from "@tiptap/extension-placeholder"
import {
	Bold,
	Italic,
	Strikethrough,
	Code,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	CheckSquare,
	Quote,
	Minus,
	CornerDownLeft,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

// ── Bubble Menu Button ──────────────────────────────────────────────

function BubbleButton({
	onClick,
	active,
	children,
	title,
}: {
	onClick: () => void
	active?: boolean
	children: React.ReactNode
	title: string
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			title={title}
			className={`p-1.5 rounded transition-colors ${
				active
					? "bg-white/20 text-white"
					: "text-white/70 hover:text-white hover:bg-white/10"
			}`}
		>
			{children}
		</button>
	)
}

// ── Slash Command Menu ──────────────────────────────────────────────

interface SlashCommand {
	label: string
	description: string
	icon: React.ReactNode
	action: () => void
}

function SlashMenu({
	commands,
	selectedIndex,
	onSelect,
}: {
	commands: SlashCommand[]
	selectedIndex: number
	onSelect: (index: number) => void
}) {
	return (
		<div className="bg-surface border border-edge rounded-lg shadow-lg overflow-hidden py-1 w-64">
			{commands.map((cmd, index) => (
				<button
					key={cmd.label}
					type="button"
					className={`flex items-center gap-3 w-full px-3 py-2 text-left transition-colors ${
						index === selectedIndex
							? "bg-raised text-fg"
							: "text-fg-muted hover:bg-raised hover:text-fg"
					}`}
					onClick={() => onSelect(index)}
					onMouseEnter={() => onSelect(index)}
				>
					<span className="flex items-center justify-center size-8 rounded-md border border-edge bg-surface text-fg-muted">
						{cmd.icon}
					</span>
					<div>
						<p className="text-sm font-medium">{cmd.label}</p>
						<p className="text-xs text-fg-muted">{cmd.description}</p>
					</div>
				</button>
			))}
		</div>
	)
}

// ── Main Editor ─────────────────────────────────────────────────────

export function TiptapEditor({
	content,
	onUpdate,
	placeholder = "Tapez '/' pour les commandes…",
}: {
	content: string
	onUpdate: (html: string) => void
	placeholder?: string
}) {
	const [slashMenuOpen, setSlashMenuOpen] = useState(false)
	const [slashMenuPos, setSlashMenuPos] = useState<{ top: number; left: number } | null>(null)
	const [slashFilter, setSlashFilter] = useState("")
	const [selectedIndex, setSelectedIndex] = useState(0)
	const menuRef = useRef<HTMLDivElement>(null)

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: { levels: [2, 3] },
			}),
			TaskList,
			TaskItem.configure({ nested: true }),
			Placeholder.configure({
				placeholder: ({ node }) => {
					if (node.type.name === "heading") {
						return `Titre ${node.attrs.level === 2 ? "2" : "3"}`
					}
					return placeholder
				},
			}),
		],
		content,
		editorProps: {
			attributes: {
				class: "tiptap-notion prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px]",
			},
			handleKeyDown: (_view, event) => {
				if (!slashMenuOpen) return false

				if (event.key === "ArrowDown") {
					event.preventDefault()
					setSelectedIndex((i) => (i + 1) % filteredCommands.length)
					return true
				}
				if (event.key === "ArrowUp") {
					event.preventDefault()
					setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length)
					return true
				}
				if (event.key === "Enter") {
					event.preventDefault()
					const cmd = filteredCommands[selectedIndex]
					if (cmd) {
						cmd.action()
						closeSlashMenu()
					}
					return true
				}
				if (event.key === "Escape") {
					event.preventDefault()
					closeSlashMenu()
					return true
				}

				return false
			},
		},
		onUpdate: ({ editor: e }) => {
			onUpdate(e.getHTML())

			// Detect slash command
			const { from } = e.state.selection
			const textBefore = e.state.doc.textBetween(
				Math.max(0, from - 20),
				from,
				"\n"
			)
			const slashMatch = textBefore.match(/\/([a-zA-Zéèà]*)$/)

			if (slashMatch) {
				setSlashFilter(slashMatch[1])
				setSelectedIndex(0)

				// Position the menu
				const coords = e.view.coordsAtPos(from - slashMatch[0].length)
				const editorRect = e.view.dom.getBoundingClientRect()
				setSlashMenuPos({
					top: coords.bottom - editorRect.top + 4,
					left: coords.left - editorRect.left,
				})
				setSlashMenuOpen(true)
			} else if (slashMenuOpen) {
				closeSlashMenu()
			}
		},
	})

	function closeSlashMenu() {
		setSlashMenuOpen(false)
		setSlashFilter("")
		setSelectedIndex(0)
	}

	function deleteSlashText() {
		if (!editor) return
		const { from } = editor.state.selection
		const textBefore = editor.state.doc.textBetween(
			Math.max(0, from - 20),
			from,
			"\n"
		)
		const slashMatch = textBefore.match(/\/([a-zA-Zéèà]*)$/)
		if (slashMatch) {
			editor
				.chain()
				.focus()
				.deleteRange({ from: from - slashMatch[0].length, to: from })
				.run()
		}
	}

	const slashCommands: SlashCommand[] = editor
		? [
				{
					label: "Titre",
					description: "Grande section",
					icon: <Heading2 className="size-4" />,
					action: () => {
						deleteSlashText()
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					},
				},
				{
					label: "Sous-titre",
					description: "Petite section",
					icon: <Heading3 className="size-4" />,
					action: () => {
						deleteSlashText()
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					},
				},
				{
					label: "Liste",
					description: "Liste à puces",
					icon: <List className="size-4" />,
					action: () => {
						deleteSlashText()
						editor.chain().focus().toggleBulletList().run()
					},
				},
				{
					label: "Liste numérotée",
					description: "Liste ordonnée",
					icon: <ListOrdered className="size-4" />,
					action: () => {
						deleteSlashText()
						editor.chain().focus().toggleOrderedList().run()
					},
				},
				{
					label: "Checklist",
					description: "Cases à cocher",
					icon: <CheckSquare className="size-4" />,
					action: () => {
						deleteSlashText()
						editor.chain().focus().toggleTaskList().run()
					},
				},
				{
					label: "Citation",
					description: "Bloc citation",
					icon: <Quote className="size-4" />,
					action: () => {
						deleteSlashText()
						editor.chain().focus().toggleBlockquote().run()
					},
				},
				{
					label: "Code",
					description: "Bloc de code",
					icon: <Code className="size-4" />,
					action: () => {
						deleteSlashText()
						editor.chain().focus().toggleCodeBlock().run()
					},
				},
				{
					label: "Séparateur",
					description: "Ligne horizontale",
					icon: <Minus className="size-4" />,
					action: () => {
						deleteSlashText()
						editor.chain().focus().setHorizontalRule().run()
					},
				},
			]
		: []

	const filteredCommands = slashCommands.filter((cmd) =>
		cmd.label.toLowerCase().includes(slashFilter.toLowerCase())
	)

	// Sync content when it changes externally
	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content)
		}
	}, [content]) // eslint-disable-line react-hooks/exhaustive-deps

	// Close slash menu on click outside
	useEffect(() => {
		if (!slashMenuOpen) return
		function handleClick(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				closeSlashMenu()
			}
		}
		document.addEventListener("mousedown", handleClick)
		return () => document.removeEventListener("mousedown", handleClick)
	}, [slashMenuOpen])

	if (!editor) return null

	return (
		<div className="relative">
			{/* Bubble menu on text selection */}
			<BubbleMenu
				editor={editor}
				tippyOptions={{ duration: 150 }}
				className="flex items-center gap-0.5 bg-[oklch(0.2_0.005_285)] border border-white/10 rounded-lg px-1 py-0.5 shadow-xl"
			>
				<BubbleButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					active={editor.isActive("bold")}
					title="Gras"
				>
					<Bold className="size-3.5" />
				</BubbleButton>
				<BubbleButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					active={editor.isActive("italic")}
					title="Italique"
				>
					<Italic className="size-3.5" />
				</BubbleButton>
				<BubbleButton
					onClick={() => editor.chain().focus().toggleStrike().run()}
					active={editor.isActive("strike")}
					title="Barré"
				>
					<Strikethrough className="size-3.5" />
				</BubbleButton>
				<BubbleButton
					onClick={() => editor.chain().focus().toggleCode().run()}
					active={editor.isActive("code")}
					title="Code inline"
				>
					<Code className="size-3.5" />
				</BubbleButton>
				<div className="w-px h-4 bg-white/20 mx-0.5" />
				<BubbleButton
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					active={editor.isActive("heading", { level: 2 })}
					title="Titre"
				>
					<Heading2 className="size-3.5" />
				</BubbleButton>
				<BubbleButton
					onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					active={editor.isActive("heading", { level: 3 })}
					title="Sous-titre"
				>
					<Heading3 className="size-3.5" />
				</BubbleButton>
			</BubbleMenu>

			{/* Slash command menu */}
			{slashMenuOpen && slashMenuPos && filteredCommands.length > 0 && (
				<div
					ref={menuRef}
					className="absolute z-50"
					style={{ top: slashMenuPos.top, left: slashMenuPos.left }}
				>
					<SlashMenu
						commands={filteredCommands}
						selectedIndex={selectedIndex >= filteredCommands.length ? 0 : selectedIndex}
						onSelect={(index) => {
							filteredCommands[index]?.action()
							closeSlashMenu()
						}}
					/>
				</div>
			)}

			{/* Editor */}
			<EditorContent editor={editor} />
		</div>
	)
}
