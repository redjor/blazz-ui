"use client"

import { Card, CardFooter } from "@blazz/ui/components/ui/card"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import { Markdown } from "tiptap-markdown"
import { TextSelection } from "@tiptap/pm/state"
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import { useMutation } from "convex/react"
import {
	Bold,
	CheckSquare,
	Code,
	Heading1,
	Heading2,
	Heading3,
	ImagePlus,
	Italic,
	List,
	ListOrdered,
	Minus,
	Quote,
	Strikethrough,
	Type,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"

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
				active ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
			}`}
		>
			{children}
		</button>
	)
}

// ── Image Upload Constants ───────────────────────────────────────────

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB
const SLASH_LOOKBACK = 80
type EditorValue = JSONContent | string

export interface TiptapUpdatePayload {
	html: string
	json: JSONContent
	text: string
	isEmpty: boolean
}

function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function getSlashMatch(text: string) {
	const slashIndex = text.lastIndexOf("/")
	if (slashIndex < 0) return null

	const beforeSlash = text[slashIndex - 1]
	if (beforeSlash && !/\s/.test(beforeSlash)) return null

	const query = text.slice(slashIndex + 1)
	if (!/^[\p{L}\p{N}_-]*$/u.test(query)) return null

	return {
		fromOffset: slashIndex,
		query,
	}
}

function findSlashCommandRange(editor: NonNullable<ReturnType<typeof useEditor>>) {
	const { from } = editor.state.selection
	const textBefore = editor.state.doc.textBetween(Math.max(0, from - SLASH_LOOKBACK), from, "\n")
	const match = getSlashMatch(textBefore)
	if (!match) return null

	return {
		from: from - (textBefore.length - match.fromOffset),
		to: from,
		query: match.query,
	}
}

function findImageNodeBySrc(
	editor: NonNullable<ReturnType<typeof useEditor>>,
	src: string
): { from: number; to: number } | null {
	let match: { from: number; to: number } | null = null

	editor.state.doc.descendants((node, pos) => {
		if (node.type.name === "image" && node.attrs.src === src) {
			match = { from: pos, to: pos + node.nodeSize }
			return false
		}
		return true
	})

	return match
}

function stripPendingUploadMarkup(html: string, pendingPreviewUrls: Iterable<string>) {
	let sanitized = html

	for (const previewUrl of pendingPreviewUrls) {
		const escapedUrl = escapeRegExp(previewUrl)
		sanitized = sanitized.replace(
			new RegExp(`<p[^>]*>\\s*<img[^>]*src="${escapedUrl}"[^>]*>\\s*</p>`, "g"),
			""
		)
		sanitized = sanitized.replace(new RegExp(`<img[^>]*src="${escapedUrl}"[^>]*>`, "g"), "")
	}

	return sanitized
}

function stripPendingUploadJson(
	content: JSONContent,
	pendingPreviewUrls: ReadonlySet<string>
): JSONContent {
	const sanitizedChildren =
		content.content
			?.map((node) => stripPendingUploadJson(node, pendingPreviewUrls))
			.filter(
				(node) => !(node.type === "image" && pendingPreviewUrls.has(String(node.attrs?.src ?? "")))
			) ?? undefined

	return sanitizedChildren
		? { ...content, content: sanitizedChildren }
		: { ...content, content: undefined }
}

function hasMeaningfulContent(content: JSONContent | undefined): boolean {
	if (!content) return false
	if (content.type === "image" || content.type === "horizontalRule") return true
	if (typeof content.text === "string" && content.text.trim().length > 0) return true
	return content.content?.some((node) => hasMeaningfulContent(node)) ?? false
}

function areEditorContentsEqual(
	editor: NonNullable<ReturnType<typeof useEditor>>,
	content: EditorValue
) {
	if (typeof content === "string") {
		return content === editor.getHTML()
	}
	return JSON.stringify(editor.getJSON()) === JSON.stringify(content)
}

function getImageFileFromClipboard(event: ClipboardEvent) {
	const items = event.clipboardData?.items
	if (!items) return null

	for (const item of items) {
		if (!ACCEPTED_IMAGE_TYPES.includes(item.type)) continue
		const file = item.getAsFile()
		if (file) return file
	}

	return null
}

// ── Slash Command Menu ──────────────────────────────────────────────

interface SlashCommand {
	label: string
	icon: React.ReactNode
	hint: string
	command: string // editor chain command name
}

const SLASH_COMMANDS: SlashCommand[] = [
	{
		label: "Texte",
		hint: "T",
		icon: <Type className="size-4" />,
		command: "paragraph",
	},
	{
		label: "Titre 1",
		hint: "#",
		icon: <Heading1 className="size-4" />,
		command: "heading1",
	},
	{
		label: "Titre 2",
		hint: "##",
		icon: <Heading2 className="size-4" />,
		command: "heading2",
	},
	{
		label: "Titre 3",
		hint: "###",
		icon: <Heading3 className="size-4" />,
		command: "heading3",
	},
	{
		label: "Liste a puces",
		hint: "-",
		icon: <List className="size-4" />,
		command: "bulletList",
	},
	{
		label: "Liste numérotée",
		hint: "1.",
		icon: <ListOrdered className="size-4" />,
		command: "orderedList",
	},
	{
		label: "Liste de taches",
		hint: "[]",
		icon: <CheckSquare className="size-4" />,
		command: "taskList",
	},
	{
		label: "Citation",
		hint: '"',
		icon: <Quote className="size-4" />,
		command: "blockquote",
	},
	{
		label: "Code",
		hint: "</>",
		icon: <Code className="size-4" />,
		command: "codeBlock",
	},
	{
		label: "Séparateur",
		hint: "---",
		icon: <Minus className="size-4" />,
		command: "horizontalRule",
	},
	{
		label: "Image",
		hint: "img",
		icon: <ImagePlus className="size-4" />,
		command: "image",
	},
]

function SlashMenu({
	commands,
	selectedIndex,
	onSelect,
	onHover,
}: {
	commands: SlashCommand[]
	selectedIndex: number
	onSelect: (index: number) => void
	onHover: (index: number) => void
}) {
	const listRef = useRef<HTMLDivElement>(null)

	// Scroll selected item into view
	useEffect(() => {
		const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined
		el?.scrollIntoView({ block: "nearest" })
	}, [selectedIndex])

	return (
		<Card
			size="sm"
			className="w-[280px] border-container bg-surface p-0 data-[size=sm]:p-0 shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
		>
			<div ref={listRef} className="max-h-[360px] overflow-y-auto px-1 py-1">
				{commands.map((cmd, index) => (
					<button
						key={cmd.command}
						type="button"
						className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[15px] transition-colors ${
							index === selectedIndex
								? "bg-surface-3 text-fg"
								: "text-fg-muted hover:bg-surface-2 hover:text-fg"
						}`}
						onClick={() => onSelect(index)}
						onMouseEnter={() => onHover(index)}
					>
						<span className="flex size-5 shrink-0 items-center justify-center text-fg">
							{cmd.icon}
						</span>
						<span className="min-w-0 flex-1 text-left leading-none">{cmd.label}</span>
						<span className="ml-auto text-[11px] font-medium tracking-normal text-fg-muted">
							{cmd.hint}
						</span>
					</button>
				))}
			</div>
			<CardFooter className="justify-between border-t border-separator bg-surface px-3 py-2 text-xs text-fg-muted">
				<span>Fermer le menu</span>
				<span className="rounded-md border border-container bg-surface-2 px-1.5 py-0.5 font-medium text-fg-muted">
					esc
				</span>
			</CardFooter>
		</Card>
	)
}

// ── Main Editor ─────────────────────────────────────────────────────

export function TiptapEditor({
	content,
	onUpdate,
	onEditorReady,
	placeholder = "Tapez '/' pour les commandes…",
	editable = true,
}: {
	content: EditorValue
	onUpdate: (payload: TiptapUpdatePayload) => void
	onEditorReady?: (editor: ReturnType<typeof useEditor>) => void
	placeholder?: string
	editable?: boolean
}) {
	// ── Image upload ────────────────────────────────────────────────
	const generateUploadUrl = useMutation(api.todos.generateUploadUrl)
	const getStorageUrl = useMutation(api.todos.getStorageUrl)
	const pendingPreviewUrlsRef = useRef(new Set<string>())

	const uploadImage = useCallback(
		async (file: File, editor: NonNullable<ReturnType<typeof useEditor>>) => {
			if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
				toast.error("Format non supporté. Utilisez PNG, JPEG, WebP ou GIF.")
				return
			}
			if (file.size > MAX_IMAGE_SIZE) {
				toast.error("Image trop lourde (max 5 Mo).")
				return
			}

			const previewUrl = URL.createObjectURL(file)
			pendingPreviewUrlsRef.current.add(previewUrl)
			editor.chain().focus().setImage({ src: previewUrl, alt: "Upload en cours" }).run()

			try {
				const uploadUrl = await generateUploadUrl()
				const result = await fetch(uploadUrl, {
					method: "POST",
					headers: { "Content-Type": file.type },
					body: file,
				})
				if (!result.ok) throw new Error(`Upload failed: ${result.status}`)
				const { storageId } = await result.json()
				const storageUrl = await getStorageUrl({ storageId })

				if (!storageUrl) throw new Error("URL de stockage introuvable")

				const pendingImageRange = findImageNodeBySrc(editor, previewUrl)
				if (pendingImageRange) {
					editor.chain().focus().deleteRange(pendingImageRange).setImage({ src: storageUrl }).run()
				} else {
					editor.chain().focus().setImage({ src: storageUrl }).run()
				}
			} catch (error) {
				toast.error("Erreur lors de l'upload de l'image.")
				console.error("Image upload failed", error)
				const pendingImageRange = findImageNodeBySrc(editor, previewUrl)
				if (pendingImageRange) {
					editor.chain().focus().deleteRange(pendingImageRange).run()
				}
			} finally {
				pendingPreviewUrlsRef.current.delete(previewUrl)
				URL.revokeObjectURL(previewUrl)
			}
		},
		[generateUploadUrl, getStorageUrl]
	)

	// Slash menu state — use refs for handleKeyDown closure + state for rendering
	const [slashOpen, setSlashOpen] = useState(false)
	const [slashPos, setSlashPos] = useState<{ top: number; left: number } | null>(null)
	const [slashFilter, setSlashFilter] = useState("")
	const [selectedIdx, setSelectedIdx] = useState(0)
	const menuContainerRef = useRef<HTMLDivElement>(null)

	// Refs that mirror state so handleKeyDown always reads fresh values
	const slashOpenRef = useRef(false)
	const slashFilterRef = useRef("")
	const selectedIdxRef = useRef(0)

	const openSlash = useCallback((filter: string, pos: { top: number; left: number }) => {
		slashOpenRef.current = true
		slashFilterRef.current = filter
		selectedIdxRef.current = 0
		setSlashOpen(true)
		setSlashFilter(filter)
		setSelectedIdx(0)
		setSlashPos(pos)
	}, [])

	const closeSlash = useCallback(() => {
		slashOpenRef.current = false
		slashFilterRef.current = ""
		selectedIdxRef.current = 0
		setSlashOpen(false)
		setSlashFilter("")
		setSelectedIdx(0)
		setSlashPos(null)
	}, [])

	const updateFilter = useCallback((filter: string) => {
		slashFilterRef.current = filter
		selectedIdxRef.current = 0
		setSlashFilter(filter)
		setSelectedIdx(0)
	}, [])

	const updateSelectedIdx = useCallback((idx: number) => {
		selectedIdxRef.current = idx
		setSelectedIdx(idx)
	}, [])

	const getFilteredCommands = useCallback((filter: string) => {
		if (!filter) return SLASH_COMMANDS
		return SLASH_COMMANDS.filter((cmd) => cmd.label.toLowerCase().includes(filter.toLowerCase()))
	}, [])

	// Stable ref to editor for use inside commands
	const editorRef = useRef<ReturnType<typeof useEditor>>(null)

	const executeCommand = useCallback(
		(cmd: SlashCommand) => {
			const e = editorRef.current
			if (!e) return

			const slashRange = findSlashCommandRange(e)
			if (slashRange) {
				e.chain().focus().deleteRange({ from: slashRange.from, to: slashRange.to }).run()
			}

			switch (cmd.command) {
				case "paragraph":
					e.chain().focus().setParagraph().run()
					break
				case "heading1":
					e.chain().focus().toggleHeading({ level: 1 }).run()
					break
				case "heading2":
					e.chain().focus().toggleHeading({ level: 2 }).run()
					break
				case "heading3":
					e.chain().focus().toggleHeading({ level: 3 }).run()
					break
				case "bulletList":
					e.chain().focus().toggleBulletList().run()
					break
				case "orderedList":
					e.chain().focus().toggleOrderedList().run()
					break
				case "taskList":
					e.chain().focus().toggleTaskList().run()
					break
				case "blockquote":
					e.chain().focus().toggleBlockquote().run()
					break
				case "codeBlock":
					e.chain().focus().toggleCodeBlock().run()
					break
				case "horizontalRule":
					e.chain().focus().setHorizontalRule().run()
					break
				case "image": {
					const input = document.createElement("input")
					input.type = "file"
					input.accept = "image/png,image/jpeg,image/webp,image/gif"
					input.onchange = () => {
						const file = input.files?.[0]
						if (file) uploadImage(file, e)
					}
					input.click()
					break
				}
			}
		},
		[uploadImage]
	)

	const editor = useEditor({
		immediatelyRender: false,
		shouldRerenderOnTransaction: false,
		editable,
		extensions: [
			StarterKit.configure({
				heading: { levels: [1, 2, 3] },
			}),
			Markdown.configure({
				transformPastedText: true,
				transformCopiedText: false,
			}),
			TaskList,
			TaskItem.configure({ nested: true }),
			Image.configure({
				inline: false,
				allowBase64: false,
			}),
			Placeholder.configure({
				placeholder: ({ node }) => {
					if (node.type.name === "heading") {
						return `Titre ${node.attrs.level}`
					}
					return placeholder
				},
			}),
		],
		content,
		editorProps: {
			attributes: {
				class:
					"tiptap-notion prose prose-zinc sm:prose-lg max-w-none focus:outline-none min-h-[200px] text-base",
			},
			handleKeyDown: (_view, event) => {
				if (!slashOpenRef.current) return false

				const cmds = getFilteredCommands(slashFilterRef.current)
				if (cmds.length === 0) return false

				if (event.key === "ArrowDown") {
					event.preventDefault()
					const next = (selectedIdxRef.current + 1) % cmds.length
					updateSelectedIdx(next)
					return true
				}
				if (event.key === "ArrowUp") {
					event.preventDefault()
					const prev = (selectedIdxRef.current - 1 + cmds.length) % cmds.length
					updateSelectedIdx(prev)
					return true
				}
				if (event.key === "Enter") {
					event.preventDefault()
					const cmd = cmds[selectedIdxRef.current]
					if (cmd) executeCommand(cmd)
					closeSlash()
					return true
				}
				if (event.key === "Escape") {
					event.preventDefault()
					closeSlash()
					return true
				}

				return false
			},
			handleDrop: (_view, event, _slice, moved) => {
				if (moved || !event.dataTransfer?.files.length) return false
				const file = event.dataTransfer.files[0]
				if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
					event.preventDefault()
					const e = editorRef.current
					const position = _view.posAtCoords({ left: event.clientX, top: event.clientY })
					if (position) {
						_view.dispatch(
							_view.state.tr.setSelection(TextSelection.create(_view.state.doc, position.pos))
						)
					}
					if (e) uploadImage(file, e)
					return true
				}
				return false
			},
			handlePaste: (_view, event) => {
				const file = getImageFileFromClipboard(event)
				if (!file) return false
				event.preventDefault()
				const e = editorRef.current
				if (e) uploadImage(file, e)
				return true
			},
		},
		onUpdate: ({ editor: e }) => {
			const html = stripPendingUploadMarkup(e.getHTML(), pendingPreviewUrlsRef.current)
			const json = stripPendingUploadJson(e.getJSON(), pendingPreviewUrlsRef.current)
			const text = e.getText().trim()
			onUpdate({
				html,
				json,
				text,
				isEmpty: !hasMeaningfulContent(json),
			})

			const slashRange = findSlashCommandRange(e)

			if (slashRange) {
				const coords = e.view.coordsAtPos(slashRange.from)
				const editorRect = e.view.dom.getBoundingClientRect()

				if (slashOpenRef.current) {
					updateFilter(slashRange.query)
					setSlashPos({
						top: coords.bottom - editorRect.top + 4,
						left: coords.left - editorRect.left,
					})
				} else {
					openSlash(slashRange.query, {
						top: coords.bottom - editorRect.top + 4,
						left: coords.left - editorRect.left,
					})
				}
			} else if (slashOpenRef.current) {
				closeSlash()
			}
		},
	})

	// Keep editorRef in sync
	editorRef.current = editor

	useEffect(() => {
		if (editor) onEditorReady?.(editor)
	}, [editor]) // eslint-disable-line react-hooks/exhaustive-deps

	const filteredCommands = getFilteredCommands(slashFilter)

	// Sync content when it changes externally
	useEffect(() => {
		if (editor && !areEditorContentsEqual(editor, content)) {
			editor.commands.setContent(content, { emitUpdate: false })
		}
	}, [content, editor]) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (editor) editor.setEditable(editable)
	}, [editable, editor])

	useEffect(() => {
		return () => {
			for (const previewUrl of pendingPreviewUrlsRef.current) {
				URL.revokeObjectURL(previewUrl)
			}
			pendingPreviewUrlsRef.current.clear()
		}
	}, [])

	// Close slash menu on click outside
	useEffect(() => {
		if (!slashOpen) return
		function handleClick(e: MouseEvent) {
			if (menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
				closeSlash()
			}
		}
		document.addEventListener("mousedown", handleClick)
		return () => document.removeEventListener("mousedown", handleClick)
	}, [slashOpen, closeSlash])

	if (!editor) return null

	return (
		<div className="relative">
			{/* Bubble menu on text selection */}
			<BubbleMenu
				editor={editor}
				options={{ placement: "top", offset: 8 }}
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
			{slashOpen && slashPos && filteredCommands.length > 0 && (
				<div
					ref={menuContainerRef}
					className="absolute z-50"
					style={{ top: slashPos.top, left: slashPos.left }}
				>
					<SlashMenu
						commands={filteredCommands}
						selectedIndex={selectedIdx >= filteredCommands.length ? 0 : selectedIdx}
						onSelect={(index) => {
							executeCommand(filteredCommands[index])
							closeSlash()
						}}
						onHover={(index) => updateSelectedIdx(index)}
					/>
				</div>
			)}

			{/* Editor */}
			<EditorContent editor={editor} />
		</div>
	)
}
