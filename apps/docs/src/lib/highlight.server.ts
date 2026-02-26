import { createServerFn } from "@tanstack/react-start"
import { highlight } from "./shiki"

export const highlightCode = createServerFn({ method: "GET" })
	.inputValidator((d: { code: string; lang?: string }) => d)
	.handler(async ({ data }) => {
		return highlight(data.code, data.lang ?? "tsx")
	})
