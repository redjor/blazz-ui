"use client"

import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuTrigger } from "@blazz/ui/components/ui/context-menu"
import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

export function CheckboxItemsDemo() {
	const [showGrid, setShowGrid] = React.useState(true)
	const [showRulers, setShowRulers] = React.useState(false)
	return (
		<ContextMenu>
			<ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">Right click here</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuGroup>
					<ContextMenuLabel>Display</ContextMenuLabel>
					<ContextMenuSeparator />
					<ContextMenuCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}><Eye className="mr-2 h-4 w-4" />Show Grid</ContextMenuCheckboxItem>
					<ContextMenuCheckboxItem checked={showRulers} onCheckedChange={setShowRulers}><EyeOff className="mr-2 h-4 w-4" />Show Rulers</ContextMenuCheckboxItem>
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	)
}

export function RadioItemsDemo() {
	const [alignment, setAlignment] = React.useState("left")
	return (
		<ContextMenu>
			<ContextMenuTrigger className="flex h-36 w-64 items-center justify-center rounded-lg border border-dashed text-sm text-fg-muted">Right click here</ContextMenuTrigger>
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
