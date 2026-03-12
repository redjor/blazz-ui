"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Placeholder from "@tiptap/extension-placeholder"
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Heading2,
	Code,
	CheckSquare,
	Undo,
	Redo,
} from "lucide-react"
import { useCallback, useEffect } from "react"

function ToolbarButton({
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
			className={`p-1.5 rounded-md transition-colors ${
				active ? "bg-raised text-fg" : "text-fg-muted hover:text-fg hover:bg-raised"
			}`}
		>
			{children}
		</button>
	)
}

export function TiptapEditor({
	content,
	onUpdate,
	placeholder = "Ajoutez une description…",
}: {
	content: string
	onUpdate: (html: string) => void
	placeholder?: string
}) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [2, 3] },
			}),
			TaskList,
			TaskItem.configure({ nested: true }),
			Placeholder.configure({ placeholder }),
		],
		content,
		editorProps: {
			attributes: {
				class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3",
			},
		},
		onUpdate: ({ editor }) => {
			onUpdate(editor.getHTML())
		},
	})

	// Sync content when it changes externally (e.g., initial load)
	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content)
		}
	}, [content]) // eslint-disable-line react-hooks/exhaustive-deps

	if (!editor) return null

	return (
		<div className="border border-edge rounded-lg overflow-hidden bg-surface">
			<div className="flex items-center gap-0.5 px-3 py-2 border-b border-edge bg-raised/50">
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					active={editor.isActive("heading", { level: 2 })}
					title="Titre"
				>
					<Heading2 className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					active={editor.isActive("bold")}
					title="Gras"
				>
					<Bold className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					active={editor.isActive("italic")}
					title="Italique"
				>
					<Italic className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleCode().run()}
					active={editor.isActive("code")}
					title="Code"
				>
					<Code className="size-4" />
				</ToolbarButton>
				<div className="w-px h-4 bg-edge mx-1" />
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					active={editor.isActive("bulletList")}
					title="Liste"
				>
					<List className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					active={editor.isActive("orderedList")}
					title="Liste numérotée"
				>
					<ListOrdered className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleTaskList().run()}
					active={editor.isActive("taskList")}
					title="Checklist"
				>
					<CheckSquare className="size-4" />
				</ToolbarButton>
				<div className="w-px h-4 bg-edge mx-1" />
				<ToolbarButton
					onClick={() => editor.chain().focus().undo().run()}
					title="Annuler"
				>
					<Undo className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().redo().run()}
					title="Refaire"
				>
					<Redo className="size-4" />
				</ToolbarButton>
			</div>
			<EditorContent editor={editor} />
		</div>
	)
}
