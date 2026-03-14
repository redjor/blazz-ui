"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { useMutation } from "convex/react"
import { Check, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import { writeDangerousToolNames, writeSafeToolNames } from "@/lib/chat/tools"

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

export function ChatToolHandler({
	toolName,
	args,
	toolCallId,
	addToolResult,
}: ChatToolHandlerProps) {
	const [status, setStatus] = useState<ToolStatus>("pending")
	const executed = useRef(false)

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

	const getMutation = useCallback(() => {
		const map: Record<string, (args: any) => Promise<any>> = {
			"create-todo": createTodo,
			"create-client": createClient,
			"create-project": createProject,
			"log-time": createTimeEntry,
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
			const result = await fn(args as any)
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
	}, [getMutation, toolName, args, toolCallId, addToolResult])

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
			<div className="flex items-center gap-2 text-sm text-fg-subtle py-1">
				{status === "executing" && <span className="animate-pulse">Exécution...</span>}
				{status === "done" && <span className="text-fg-success">✓ {toolLabels[toolName]}</span>}
				{status === "error" && <span className="text-fg-critical">✗ Erreur</span>}
			</div>
		)
	}

	if (writeDangerousToolNames.has(toolName)) {
		return (
			<div className="rounded-lg border border-edge bg-surface-3 p-3 my-2">
				<p className="text-sm font-medium mb-1">{toolLabels[toolName]}</p>
				<pre className="text-xs text-fg-subtle bg-surface rounded p-2 mb-2 overflow-auto">
					{JSON.stringify(args, null, 2)}
				</pre>
				{status === "pending" && (
					<div className="flex gap-2">
						<Button size="sm" onClick={execute}>
							<Check className="size-3.5" />
							Confirmer
						</Button>
						<Button size="sm" variant="outline" onClick={reject}>
							<X className="size-3.5" />
							Annuler
						</Button>
					</div>
				)}
				{status === "executing" && <span className="text-sm animate-pulse">Exécution...</span>}
				{status === "done" && <span className="text-sm text-fg-success">✓ Fait</span>}
				{status === "error" && <span className="text-sm text-fg-critical">✗ Erreur</span>}
				{status === "rejected" && <span className="text-sm text-fg-subtle">Annulé</span>}
			</div>
		)
	}

	return null
}
