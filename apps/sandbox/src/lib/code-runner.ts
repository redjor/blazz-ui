import React from "react"
import { transform } from "sucrase"
import { scope } from "./scope"

export interface RunResult {
	element: React.ReactElement | null
	error: string | null
}

export function runCode(
	code: string,
	extraScope?: Record<string, unknown>,
): RunResult {
	try {
		const wrappedCode = `return (${code})`
		const transformed = transform(wrappedCode, {
			transforms: ["jsx", "typescript"],
			jsxRuntime: "classic",
			production: true,
		}).code

		const allScope = { ...scope, ...extraScope }
		const keys = Object.keys(allScope)
		const values = Object.values(allScope)

		// biome-ignore lint/security/noGlobalEval: required for live code execution
		const fn = new Function("React", ...keys, transformed)
		const element = fn(React, ...values)

		return { element, error: null }
	} catch (err) {
		return { element: null, error: (err as Error).message }
	}
}
