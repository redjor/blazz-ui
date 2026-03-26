import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, NodeSelection } from "@tiptap/pm/state"

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
		const { editor } = this

		let currentNodePos: number | null = null
		const { wrapper, plusBtn, dragBtn } = createHandleElement()
		let hideTimeout: ReturnType<typeof setTimeout> | null = null

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

					// Keep handle visible when hovering over it
					wrapper.addEventListener("mouseenter", showHandle)
					wrapper.addEventListener("mouseleave", scheduleHide)

					plusBtn.addEventListener("mousedown", (e) => {
						e.preventDefault()
						e.stopPropagation()
						if (currentNodePos === null) return

						// Focus editor and set cursor to start of the hovered block
						const resolvedPos = editorView.state.doc.resolve(currentNodePos + 1)
						const sel = editorView.state.selection.constructor.near(resolvedPos)
						editorView.dispatch(editorView.state.tr.setSelection(sel))
						editorView.focus()

						// Insert "/" to trigger slash menu
						setTimeout(() => {
							const insertTr = editorView.state.tr.insertText("/", editorView.state.selection.from)
							editorView.dispatch(insertTr)
						}, 10)
					})

					dragBtn.addEventListener("dragstart", (e) => {
						if (currentNodePos === null) return
						const node = editorView.state.doc.nodeAt(currentNodePos)
						if (!node) return

						const sel = NodeSelection.create(editorView.state.doc, currentNodePos)
						editorView.dispatch(editorView.state.tr.setSelection(sel))

						const slice = editorView.state.selection.content()
						const { dom, text } = editorView.serializeForClipboard(slice)
						e.dataTransfer?.clearData()
						e.dataTransfer?.setData("text/html", dom.innerHTML)
						e.dataTransfer?.setData("text/plain", text)
						e.dataTransfer!.effectAllowed = "move"

						const nodeEl = editorView.nodeDOM(currentNodePos) as HTMLElement | null
						if (nodeEl) {
							e.dataTransfer?.setDragImage(nodeEl, 0, 0)
						}

						wrapper.classList.add("dragging")
					})

					dragBtn.addEventListener("dragend", () => {
						wrapper.classList.remove("dragging")
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
							const editorRect = view.dom.getBoundingClientRect()

							const pos = view.posAtCoords({ left: editorRect.left + 10, top: event.clientY })
							if (!pos) {
								scheduleHide()
								return false
							}

							const resolved = view.state.doc.resolve(pos.pos)
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
							wrapper.style.left = `-52px`

							return false
						},

						mouseleave() {
							scheduleHide()
							return false
						},
					},
				},
			}),
		]
	},
})
