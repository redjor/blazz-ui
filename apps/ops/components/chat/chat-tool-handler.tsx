"use client"

import type { ToolUIPart } from "ai"
import {
	Confirmation,
	ConfirmationAccepted,
	ConfirmationAction,
	ConfirmationActions,
	ConfirmationRejected,
	ConfirmationRequest,
	ConfirmationTitle,
} from "@blazz/pro/components/ai/tools/confirmation"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useMutation, useQuery } from "convex/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { writeDangerousToolNames, writeSafeToolNames } from "@/lib/chat/tools"
import { CategoryBadge } from "../manage-categories-sheet"

type ToolStatus = "pending" | "executing" | "done" | "error" | "rejected"

interface ChatToolHandlerProps {
	toolName: string
	args: Record<string, unknown>
	toolCallId: string
	addToolResult: (params: any) => void
}

const toolLabels: Record<string, string> = {
	"create-todo": "Créer un todo",
	"create-client": "Créer un client",
	"create-project": "Créer un projet",
	"log-time": "Logger du temps",
	"update-todo": "Modifier un todo",
	"delete-todo": "Supprimer un todo",
	"update-client": "Modifier un client",
	"delete-client": "Supprimer un client",
	"update-project": "Modifier un projet",
	"delete-time-entry": "Supprimer une entrée",
}

/** Map our custom status to ToolUIPart state for the Confirmation component */
function toToolState(status: ToolStatus): ToolUIPart["state"] {
	switch (status) {
		case "pending":
			return "approval-requested"
		case "executing":
			return "approval-responded"
		case "done":
			return "output-available"
		case "error":
			return "output-available"
		case "rejected":
			return "output-denied"
	}
}

function toApproval(status: ToolStatus, toolCallId: string) {
	switch (status) {
		case "pending":
			return { id: toolCallId }
		case "executing":
		case "done":
		case "error":
			return { id: toolCallId, approved: true as const }
		case "rejected":
			return { id: toolCallId, approved: false as const }
	}
}

export function ChatToolHandler({
	toolName,
	args,
	toolCallId,
	addToolResult,
}: ChatToolHandlerProps) {
	const [status, setStatus] = useState<ToolStatus>("pending")
	const [editableArgs, setEditableArgs] = useState<Record<string, unknown>>(args)
	const executed = useRef(false)
	const categories = useQuery(api.categories.list, {}) ?? []

	const createTodo = useMutation(api.todos.create)
	const updateTodo = useMutation(api.todos.update)
	const updateTodoStatus = useMutation(api.todos.updateStatus)
	const removeTodo = useMutation(api.todos.remove)
	const createClient = useMutation(api.clients.create)
	const updateClient = useMutation(api.clients.update)
	const removeClient = useMutation(api.clients.remove)
	const createProject = useMutation(api.projects.create)
	const updateProject = useMutation(api.projects.update)
	const createTimeEntry = useMutation(api.timeEntries.create)
	const removeTimeEntry = useMutation(api.timeEntries.remove)

	useEffect(() => {
		setEditableArgs(args)
	}, [args])

	const getMutation = useCallback(() => {
		const map: Record<string, (args: any) => Promise<any>> = {
			"create-todo": createTodo,
			"create-client": createClient,
			"create-project": createProject,
			"log-time": (a: any) => createTimeEntry({ billable: true, ...a }),
			"update-todo": (a: any) => {
				if (a.status && Object.keys(a).filter((k) => k !== "id" && k !== "status").length === 0) {
					return updateTodoStatus({ id: a.id, status: a.status })
				}
				return updateTodo(a)
			},
			"delete-todo": (a: any) => removeTodo({ id: a.id }),
			"update-client": updateClient,
			"delete-client": (a: any) => removeClient({ id: a.id }),
			"update-project": updateProject,
			"delete-time-entry": (a: any) => removeTimeEntry({ id: a.id }),
		}
		return map[toolName]
	}, [
		toolName,
		createTodo,
		updateTodo,
		updateTodoStatus,
		removeTodo,
		createClient,
		updateClient,
		removeClient,
		createProject,
		updateProject,
		createTimeEntry,
		removeTimeEntry,
	])

	const execute = useCallback(async () => {
		if (executed.current) return
		executed.current = true
		setStatus("executing")
		try {
			const fn = getMutation()
			if (!fn) throw new Error(`Unknown mutation: ${toolName}`)
			const result = await fn(editableArgs as any)
			setStatus("done")
			toast.success(toolLabels[toolName] ?? toolName)
			addToolResult({
				state: "output-available",
				tool: toolName,
				toolCallId,
				output: { success: true, id: result },
			})
		} catch (err) {
			setStatus("error")
			const message = err instanceof Error ? err.message : "Erreur inconnue"
			toast.error(message)
			addToolResult({
				state: "output-error",
				tool: toolName,
				toolCallId,
				errorText: message,
			})
		}
	}, [getMutation, toolName, editableArgs, toolCallId, addToolResult])

	const reject = useCallback(() => {
		setStatus("rejected")
		addToolResult({
			state: "output-error",
			tool: toolName,
			toolCallId,
			errorText: "Refusé par l'utilisateur",
		})
	}, [toolName, toolCallId, addToolResult])

	// Auto-execute safe tools
	useEffect(() => {
		if (writeSafeToolNames.has(toolName) && status === "pending") {
			execute()
		}
	}, [toolName, status, execute])

	if (writeSafeToolNames.has(toolName)) {
		return (
			<InlineStack gap="100" blockAlign="center" className="text-sm text-fg-subtle py-1">
				{status === "executing" && <span className="animate-pulse">Exécution...</span>}
				{status === "done" && <span className="text-fg-success">&#10003; {toolLabels[toolName]}</span>}
				{status === "error" && <span className="text-fg-critical">&#10007; Erreur</span>}
			</InlineStack>
		)
	}

	if (writeDangerousToolNames.has(toolName)) {
		const toolState = toToolState(status)
		const approval = toApproval(status, toolCallId)
		const selectedCategoryId =
			typeof editableArgs.categoryId === "string" ? (editableArgs.categoryId as string) : ""

		return (
			<Confirmation state={toolState} approval={approval} className="my-2">
				<ConfirmationTitle>{toolLabels[toolName]}</ConfirmationTitle>

				<ConfirmationRequest>
					{toolName === "create-todo" && (
						<div className="my-2 space-y-2">
							<p className="text-xs text-fg-subtle">
								Catégorie suggérée ou à choisir avant création
							</p>
							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									className={`rounded-md border px-2 py-1 text-xs transition-colors ${
										!selectedCategoryId
											? "border-brand bg-brand/10 text-fg"
											: "border-edge bg-card text-fg-muted hover:text-fg"
									}`}
									onClick={() =>
										setEditableArgs((current) => ({ ...current, categoryId: undefined }))
									}
								>
									Aucune
								</button>
								{categories.map((category) => (
									<button
										key={category._id}
										type="button"
										className={`rounded-md border px-2 py-1 transition-colors ${
											selectedCategoryId === category._id
												? "border-brand bg-brand/10"
												: "border-edge bg-card hover:bg-popover"
										}`}
										onClick={() =>
											setEditableArgs((current) => ({
												...current,
												categoryId: category._id,
											}))
										}
									>
										<CategoryBadge
											name={category.name}
											color={category.color}
											icon={category.icon}
										/>
									</button>
								))}
							</div>
						</div>
					)}
					<pre className="text-xs text-fg-subtle bg-card rounded p-2 my-2 overflow-auto">
						{JSON.stringify(editableArgs, null, 2)}
					</pre>
					<ConfirmationActions>
						<ConfirmationAction variant="outline" onClick={reject}>
							Annuler
						</ConfirmationAction>
						<ConfirmationAction onClick={execute}>
							Confirmer
						</ConfirmationAction>
					</ConfirmationActions>
				</ConfirmationRequest>

				<ConfirmationAccepted>
					{status === "executing" ? (
						<span className="text-sm animate-pulse">Exécution...</span>
					) : status === "error" ? (
						<span className="text-sm text-fg-critical">&#10007; Erreur</span>
					) : (
						<span className="text-sm text-fg-success">&#10003; Fait</span>
					)}
				</ConfirmationAccepted>

				<ConfirmationRejected>
					<span className="text-sm text-fg-subtle">Annulé</span>
				</ConfirmationRejected>
			</Confirmation>
		)
	}

	return null
}
