import { highlight } from "~/lib/shiki"

export type Example = { key: string; code: string }

export async function highlightExamples(examples: readonly Example[] | Example[]) {
	return Promise.all(
		examples.map(async (ex) => ({
			key: ex.key,
			html: await highlight(ex.code),
		}))
	)
}
