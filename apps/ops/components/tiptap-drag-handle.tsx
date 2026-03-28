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
	dragBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>`

	// Drop indicator line
	const dropIndicator = document.createElement("div")
	dropIndicator.className = "tiptap-drop-indicator"

	wrapper.appendChild(plusBtn)
	wrapper.appendChild(dragBtn)

	return { wrapper, plusBtn, dragBtn, dropIndicator }
}

/** Find all top-level block positions and their DOM rects */
// biome-ignore lint/suspicious/noExplicitAny: ProseMirror types
function getBlockRects(view: { state: { doc: any }; nodeDOM: (pos: number) => Node | null | undefined }) {
	const blocks: { pos: number; rect: DOMRect; size: number }[] = []
	const doc = view.state.doc

	// biome-ignore lint/suspicious/noExplicitAny: ProseMirror node type
	doc.forEach((node: any, offset: number) => {
		const dom = view.nodeDOM(offset) as HTMLElement | null
		if (dom?.getBoundingClientRect) {
			blocks.push({
				pos: offset,
				rect: dom.getBoundingClientRect(),
				size: node.nodeSize,
			})
		}
	})

	return blocks
}

/** Find the best insert position given a Y coordinate */
function findDropIndex(blocks: { pos: number; rect: DOMRect; size: number }[], clientY: number) {
	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i]
		const mid = block.rect.top + block.rect.height / 2
		if (clientY < mid) return i
	}
	return blocks.length // After last block
}

export const DragHandle = Extension.create({
	name: "dragHandle",

	addProseMirrorPlugins() {
		let currentNodePos: number | null = null
		const { wrapper, plusBtn, dragBtn, dropIndicator } = createHandleElement()
		let hideTimeout: ReturnType<typeof setTimeout> | null = null

		// Drag state
		let isDragging = false
		let dragSourcePos: number | null = null
		let dragSourceSize: number | null = null

		function showHandle() {
			if (hideTimeout) {
				clearTimeout(hideTimeout)
				hideTimeout = null
			}
			if (!isDragging) {
				wrapper.style.display = "flex"
			}
		}

		function scheduleHide() {
			if (hideTimeout) clearTimeout(hideTimeout)
			hideTimeout = setTimeout(() => {
				if (!wrapper.matches(":hover") && !isDragging) {
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
						parent.appendChild(dropIndicator)
					}

					wrapper.addEventListener("mouseenter", showHandle)
					wrapper.addEventListener("mouseleave", () => {
						if (!isDragging) scheduleHide()
					})

					// Plus button: insert "/" at block start
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

					// Grip: manual drag via mousedown/mousemove/mouseup
					dragBtn.addEventListener("mousedown", (e) => {
						e.preventDefault()
						e.stopPropagation()
						if (currentNodePos === null) return

						const node = editorView.state.doc.nodeAt(currentNodePos)
						if (!node) return

						// Select the node visually
						const sel = NodeSelection.create(editorView.state.doc, currentNodePos)
						editorView.dispatch(editorView.state.tr.setSelection(sel))

						isDragging = true
						dragSourcePos = currentNodePos
						dragSourceSize = node.nodeSize

						wrapper.classList.add("dragging")
						document.body.style.cursor = "grabbing"
						document.body.style.userSelect = "none"

						const onMouseMove = (moveEvent: MouseEvent) => {
							const blocks = getBlockRects(editorView)
							const dropIdx = findDropIndex(blocks, moveEvent.clientY)
							const editorParent = editorView.dom.parentElement!
							const parentRect = editorParent.getBoundingClientRect()

							// Position the drop indicator
							let indicatorY: number
							if (dropIdx < blocks.length) {
								indicatorY = blocks[dropIdx].rect.top - parentRect.top - 1
							} else if (blocks.length > 0) {
								const lastBlock = blocks[blocks.length - 1]
								indicatorY = lastBlock.rect.bottom - parentRect.top - 1
							} else {
								return
							}

							dropIndicator.style.display = "block"
							dropIndicator.style.top = `${indicatorY}px`
							dropIndicator.dataset.dropIndex = String(dropIdx)
						}

						const onMouseUp = (upEvent: MouseEvent) => {
							document.removeEventListener("mousemove", onMouseMove)
							document.removeEventListener("mouseup", onMouseUp)

							isDragging = false
							wrapper.classList.remove("dragging")
							document.body.style.cursor = ""
							document.body.style.userSelect = ""
							dropIndicator.style.display = "none"

							if (dragSourcePos === null) return

							const blocks = getBlockRects(editorView)
							const dropIdx = findDropIndex(blocks, upEvent.clientY)

							// Find the source block index
							const sourceIdx = blocks.findIndex((b) => b.pos === dragSourcePos)
							if (sourceIdx === -1) {
								dragSourcePos = null
								return
							}

							// No move needed if dropping at same position or adjacent
							if (dropIdx === sourceIdx || dropIdx === sourceIdx + 1) {
								dragSourcePos = null
								return
							}

							const sourceNode = editorView.state.doc.nodeAt(dragSourcePos)
							if (!sourceNode) {
								dragSourcePos = null
								return
							}

							const tr = editorView.state.tr

							if (dropIdx > sourceIdx) {
								// Moving down: insert after target, then delete source
								const targetBlock = blocks[dropIdx - 1]
								const insertPos = targetBlock.pos + targetBlock.size
								tr.insert(insertPos, sourceNode)
								tr.delete(dragSourcePos, dragSourcePos + sourceNode.nodeSize)
							} else {
								// Moving up: delete source, then insert at mapped target
								const targetBlock = blocks[dropIdx]
								const insertPos = targetBlock.pos
								tr.delete(dragSourcePos, dragSourcePos + sourceNode.nodeSize)
								const mapped = tr.mapping.map(insertPos)
								tr.insert(mapped, sourceNode)
							}

							editorView.dispatch(tr)
							dragSourcePos = null
						}

						document.addEventListener("mousemove", onMouseMove)
						document.addEventListener("mouseup", onMouseUp)
					})

					return {
						update() {},
						destroy() {
							wrapper.remove()
							dropIndicator.remove()
						},
					}
				},

				props: {
					handleDOMEvents: {
						mousemove(view, event) {
							if (isDragging) return false

							const editorRect = view.dom.getBoundingClientRect()
							const pos = view.posAtCoords({
								left: editorRect.left + 10,
								top: event.clientY,
							})
							if (!pos) {
								scheduleHide()
								return false
							}

							let resolved: ReturnType<typeof view.state.doc.resolve>
							try {
								resolved = view.state.doc.resolve(pos.pos)
							} catch {
								scheduleHide()
								return false
							}

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
							if (!isDragging) scheduleHide()
							return false
						},
					},
				},
			}),
		]
	},
})
