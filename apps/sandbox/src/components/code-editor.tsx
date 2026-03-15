"use client"

import Editor, { type OnMount } from "@monaco-editor/react"

interface CodeEditorProps {
	value: string
	onChange: (value: string) => void
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
	const handleMount: OnMount = (_editor, monaco) => {
		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			jsx: monaco.languages.typescript.JsxEmit.React,
			jsxFactory: "React.createElement",
			esModuleInterop: true,
			allowJs: true,
			allowNonTsExtensions: true,
		})

		monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
			noSemanticValidation: true,
			noSyntaxValidation: false,
		})
	}

	return (
		<div className="h-full w-full overflow-hidden">
			<Editor
				height="100%"
				width="100%"
				language="typescript"
				theme="vs-dark"
				path="sandbox.tsx"
				value={value}
				onChange={(val) => val !== undefined && onChange(val)}
				onMount={handleMount}
				loading={
					<div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
						Loading editor...
					</div>
				}
				options={{
					minimap: { enabled: false },
					lineNumbers: "on",
					fontSize: 13,
					tabSize: 2,
					wordWrap: "on",
					scrollBeyondLastLine: false,
					automaticLayout: true,
					padding: { top: 12 },
					renderLineHighlight: "none",
					overviewRulerLanes: 0,
					hideCursorInOverviewRuler: true,
					scrollbar: { vertical: "hidden", horizontal: "hidden" },
				}}
			/>
		</div>
	)
}
