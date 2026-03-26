import { Extension } from "@tiptap/core"
import { NodeSelection, Plugin, PluginKey } from "@tiptap/pm/state"

const dragHandlePluginKey = new PluginKey("dragHandle")

function createHandleElement() {
	const wrapper = document.createElement("div")
	wrapper.className = "tiptap-drag-handle"

	const plusBtn = document.createElement("button")
	plusBtn.type = "button"
	plusBtn.className = "tiptap-drag-handle-btn tiptap-drag-handle-plus"
	plusBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`

	const dragBtn = document.createElement("button")
	dragBtn.type = "button"
	dragBtn.className = "tiptap-drag-handle-btn tiptap-drag-handle-grip"
	dragBtn.draggable = true
	dragBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>`

	wrapper.appendChild(plusBtn)
	wrapper.appendChild(dragBtn)

	return { wrapper, plusBtn, dragBtn }
}

export const DragHandle = Extension.create({
	name: "dragHandle",

	addProseMirrorPlugins() {
		let currentNodePos: number | null = null
		const { wrapper, plusBtn, dragBtn } = createHandleElement()
		let hideTimeout: ReturnType<typeof setTimeout> | null = null
		let draggedNodePos: number | null = null

		function showHandle() {
			if (hideTimeout) {
				clearTimeout(hideTimeout)
				hideTimeout = null
			}
			wrapper.style.display = "flex"
		}

		function scheduleHide() {
			if (hideTimeout) clearTimeout(hideTimeout)
			hideTimeout = setTimeout(() => {
				if (!wrapper.matches(":hover")) {
					wrapper.style.display = "none"
				}
			}, 200)
		}

		return [
			new Plugin({
				key: dragHandlePluginKey,

				view(editorView) {
					const parent = editorView.dom.parentElement
					if (parent) {
						parent.style.position = "relative"
						parent.appendChild(wrapper)
					}

					wrapper.addEventListener("mouseenter", showHandle)
					wrapper.addEventListener("mouseleave", scheduleHide)

					// Plus button: insert "/" at block start to open slash menu
					plusBtn.addEventListener("mousedown", (e) => {
						e.preventDefault()
						e.stopPropagation()
						if (currentNodePos === null) return

						const resolvedPos = editorView.state.doc.resolve(currentNodePos + 1)
						const sel = editorView.state.selection.constructor.near(resolvedPos)
						editorView.dispatch(editorView.state.tr.setSelection(sel))
						editorView.focus()

						setTimeout(() => {
							const insertTr = editorView.state.tr.insertText("/", editorView.state.selection.from)
							editorView.dispatch(insertTr)
						}, 10)
					})

					// Drag: select node, then create a drag image from the node DOM element
					dragBtn.addEventListener("dragstart", (e) => {
						if (currentNodePos === null || !e.dataTransfer) return

						const node = editorView.state.doc.nodeAt(currentNodePos)
						if (!node) return

						draggedNodePos = currentNodePos

						// Select the node so ProseMirror knows what's being dragged
						const sel = NodeSelection.create(editorView.state.doc, currentNodePos)
						editorView.dispatch(editorView.state.tr.setSelection(sel))

						// Serialize content for the drag data
						const slice = sel.content()

						// Use ProseMirror serializeForClipboard if available
						if (typeof editorView.serializeForClipboard === "function") {
							const { dom, text } = editorView.serializeForClipboard(slice)
							e.dataTransfer.clearData()
							e.dataTransfer.setData("text/html", dom.innerHTML)
							e.dataTransfer.setData("text/plain", text)
						} else {
							// Fallback: serialize as plain text
							const text = node.textContent
							e.dataTransfer.clearData()
							e.dataTransfer.setData("text/plain", text)
						}

						e.dataTransfer.effectAllowed = "move"

						// Set drag image from the actual block DOM element
						const nodeEl = editorView.nodeDOM(currentNodePos) as HTMLElement | null
						if (nodeEl) {
							e.dataTransfer.setDragImage(nodeEl, 0, 0)
						}

						wrapper.classList.add("dragging")
					})

					dragBtn.addEventListener("dragend", () => {
						wrapper.classList.remove("dragging")
						draggedNodePos = null
					})

					return {
						update() {},
						destroy() {
							wrapper.remove()
						},
					}
				},

				props: {
					handleDOMEvents: {
						mousemove(view, event) {
							// Don't update handle while dragging
							if (draggedNodePos !== null) return false

							const editorRect = view.dom.getBoundingClientRect()
							const pos = view.posAtCoords({
								left: editorRect.left + 10,
								top: event.clientY,
							})
							if (!pos) {
								scheduleHide()
								return false
							}

							// Resolve to top-level block
							let resolved: ReturnType<typeof view.state.doc.resolve>
							try {
								resolved = view.state.doc.resolve(pos.pos)
							} catch {
								scheduleHide()
								return false
							}

							// depth 0 = doc, depth 1 = top-level blocks
							if (resolved.depth < 1) {
								scheduleHide()
								return false
							}

							const topLevelPos = resolved.start(1) - 1

							if (topLevelPos < 0) {
								scheduleHide()
								return false
							}

							const node = view.state.doc.nodeAt(topLevelPos)
							if (!node) {
								scheduleHide()
								return false
							}

							currentNodePos = topLevelPos

							const nodeEl = view.nodeDOM(topLevelPos) as HTMLElement | null
							if (!nodeEl?.getBoundingClientRect) {
								scheduleHide()
								return false
							}

							const nodeRect = nodeEl.getBoundingClientRect()
							const parentRect = view.dom.parentElement!.getBoundingClientRect()

							showHandle()
							wrapper.style.top = `${nodeRect.top - parentRect.top}px`
							wrapper.style.left = "-52px"

							return false
						},

						mouseleave() {
							scheduleHide()
							return false
						},
					},

					// Handle drop to move the block
					handleDrop(view, event, _slice, _moved) {
						if (draggedNodePos === null) return false

						const coords = view.posAtCoords({
							left: event.clientX,
							top: event.clientY,
						})
						if (!coords) {
							draggedNodePos = null
							return false
						}

						const dragNode = view.state.doc.nodeAt(draggedNodePos)
						if (!dragNode) {
							draggedNodePos = null
							return false
						}

						// Find target top-level block
						const $drop = view.state.doc.resolve(coords.pos)
						if ($drop.depth < 1) {
							draggedNodePos = null
							return false
						}

						const targetBlockPos = $drop.before(1)
						const targetBlockNode = view.state.doc.nodeAt(targetBlockPos)
						if (!targetBlockNode) {
							draggedNodePos = null
							return false
						}

						// Insert before or after target block based on cursor position
						const targetMid = targetBlockPos + targetBlockNode.nodeSize / 2
						const insertAt = coords.pos < targetMid ? targetBlockPos : targetBlockPos + targetBlockNode.nodeSize

						// Skip if dropping at same position
						const dragEnd = draggedNodePos + dragNode.nodeSize
						if (insertAt === draggedNodePos || insertAt === dragEnd) {
							draggedNodePos = null
							return true
						}

						// Delete source, map target, insert
						const tr = view.state.tr
						tr.delete(draggedNodePos, dragEnd)
						const mappedInsert = tr.mapping.map(insertAt)
						tr.insert(Math.min(mappedInsert, tr.doc.content.size), dragNode)

						view.dispatch(tr)
						draggedNodePos = null
						event.preventDefault()
						return true
					},
				},
			}),
		]
	},
})
