import chalk from "chalk"

let jsonMode = false

export function setJsonMode(enabled: boolean) {
	jsonMode = enabled
}

export function isJsonMode(): boolean {
	return jsonMode
}

export function output(data: unknown) {
	if (jsonMode) {
		console.log(JSON.stringify(data, null, 2))
		return
	}
	// For arrays, print as table-like output
	if (Array.isArray(data)) {
		for (const item of data) {
			printRecord(item)
		}
		return
	}
	printRecord(data as Record<string, unknown>)
}

function printRecord(record: Record<string, unknown>) {
	const id = record._id ?? record.id ?? ""
	const title = record.title ?? record.text ?? ""
	const status = record.status ?? ""
	const pinned = record.pinned ? chalk.yellow("★") : ""
	const locked = record.locked ? chalk.red("🔒") : ""

	const meta = [status, pinned, locked].filter(Boolean).join(" ")
	console.log(`${chalk.dim(String(id))}  ${title}  ${chalk.cyan(meta)}`)
}

export function success(msg: string) {
	if (jsonMode) return
	console.log(chalk.green(`✓ ${msg}`))
}

export function error(msg: string) {
	console.error(chalk.red(`✗ ${msg}`))
}
