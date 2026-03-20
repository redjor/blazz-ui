"use client"

import { FileUpload } from "@blazz/ui/components/ui/file-upload"
import * as React from "react"

export function ControlledFileUploadDemo() {
	const [files, setFiles] = React.useState<File[]>([])
	return (
		<div className="max-w-md space-y-3">
			<FileUpload value={files} onValueChange={setFiles} multiple description="Drag and drop or click to upload" />
			<p className="text-xs text-fg-muted">
				{files.length} file(s) selected
				{files.length > 0 && `: ${files.map((f) => f.name).join(", ")}`}
			</p>
		</div>
	)
}
