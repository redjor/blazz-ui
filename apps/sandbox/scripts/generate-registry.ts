/**
 * Auto-generate registry data from @blazz/ui TypeScript types.
 *
 * Usage: pnpm --filter sandbox generate
 *        (or: npx tsx apps/sandbox/scripts/generate-registry.ts)
 *
 * Reads packages/ui/src/index.ts, introspects every PascalCase export that
 * looks like a React component, extracts its first-level props, and writes
 * apps/sandbox/src/lib/registry-data.generated.ts
 */

import * as fs from "node:fs"
import * as path from "node:path"
import ts from "typescript"

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

const ROOT = path.resolve(import.meta.dirname, "../../..")
const UI_INDEX = path.join(ROOT, "packages/ui/src/index.ts")
const UI_TSCONFIG = path.join(ROOT, "packages/ui/tsconfig.json")
const OUTPUT = path.join(ROOT, "apps/sandbox/src/lib/registry-data.generated.ts")

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** PascalCase → kebab-case */
function toSlug(name: string): string {
	return name
		.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
		.toLowerCase()
}

function isPascalCase(name: string): boolean {
	return /^[A-Z][a-zA-Z0-9]*$/.test(name)
}

type PropType =
	| "boolean"
	| "string"
	| "number"
	| "union"
	| "enum"
	| "slot"
	| "function"
	| "object"
	| "array"
type PropGroup = "main" | "style" | "slots" | "callbacks"

interface PropDescriptor {
	name: string
	type: PropType
	options?: string[]
	default?: unknown
	group: PropGroup
	description?: string
}

interface ComponentEntry {
	name: string
	slug: string
	category: "ui" | "patterns" | "blocks" | "ai"
	importPath: string
	props: PropDescriptor[]
	defaultCode: string
}

// Props to always skip
const SKIP_PROPS = new Set([
	"className",
	"style",
	"ref",
	"key",
	// Base UI internal
	"render",
])

// Standard HTML attribute names (common ones) — used as a heuristic filter
const HTML_ATTRS = new Set([
	"id",
	"tabIndex",
	"role",
	"title",
	"lang",
	"dir",
	"hidden",
	"draggable",
	"contentEditable",
	"spellCheck",
	"autoFocus",
	"slot",
	"is",
	"accessKey",
	"inputMode",
	"nonce",
	"translate",
	// Common event handlers
	"onClick",
	"onDoubleClick",
	"onContextMenu",
	"onMouseDown",
	"onMouseUp",
	"onMouseEnter",
	"onMouseLeave",
	"onMouseMove",
	"onMouseOver",
	"onMouseOut",
	"onKeyDown",
	"onKeyUp",
	"onKeyPress",
	"onFocus",
	"onBlur",
	"onChange",
	"onInput",
	"onSubmit",
	"onReset",
	"onScroll",
	"onWheel",
	"onDrag",
	"onDragEnd",
	"onDragEnter",
	"onDragLeave",
	"onDragOver",
	"onDragStart",
	"onDrop",
	"onCopy",
	"onCut",
	"onPaste",
	"onTouchStart",
	"onTouchMove",
	"onTouchEnd",
	"onTouchCancel",
	"onPointerDown",
	"onPointerUp",
	"onPointerEnter",
	"onPointerLeave",
	"onPointerMove",
	"onPointerOver",
	"onPointerOut",
	"onPointerCancel",
	"onGotPointerCapture",
	"onLostPointerCapture",
	"onAnimationStart",
	"onAnimationEnd",
	"onAnimationIteration",
	"onTransitionEnd",
	// ARIA
	"aria-label",
	"aria-labelledby",
	"aria-describedby",
	"aria-hidden",
	"aria-live",
	"aria-atomic",
	"aria-busy",
	"aria-current",
	"aria-disabled",
	"aria-expanded",
	"aria-haspopup",
	"aria-invalid",
	"aria-pressed",
	"aria-readonly",
	"aria-required",
	"aria-selected",
	"aria-checked",
	"aria-controls",
	"aria-owns",
	"aria-activedescendant",
	"aria-colcount",
	"aria-colindex",
	"aria-colspan",
	"aria-rowcount",
	"aria-rowindex",
	"aria-rowspan",
	"aria-sort",
	"aria-valuemax",
	"aria-valuemin",
	"aria-valuenow",
	"aria-valuetext",
])

// ---------------------------------------------------------------------------
// Type mapping
// ---------------------------------------------------------------------------

function mapType(
	type: ts.Type,
	checker: ts.TypeChecker
): { propType: PropType; options?: string[] } {
	// boolean
	if (type.flags & ts.TypeFlags.Boolean || type.flags & ts.TypeFlags.BooleanLiteral) {
		return { propType: "boolean" }
	}

	// string (non-literal)
	if (type.flags & ts.TypeFlags.String) {
		return { propType: "string" }
	}

	// number
	if (type.flags & ts.TypeFlags.Number) {
		return { propType: "number" }
	}

	// Union types
	if (type.isUnion()) {
		// Filter out undefined/null from optional unions
		const realTypes = type.types.filter(
			(t) => !(t.flags & ts.TypeFlags.Undefined) && !(t.flags & ts.TypeFlags.Null)
		)

		// Check for boolean (union of true|false)
		const hasBoolLiterals = realTypes.every((t) => t.flags & ts.TypeFlags.BooleanLiteral)
		if (hasBoolLiterals && realTypes.length === 2) {
			return { propType: "boolean" }
		}

		// Union of string literals → "enum"
		const stringLiterals = realTypes
			.filter((t) => t.isStringLiteral())
			.map((t) => (t as ts.StringLiteralType).value)
		if (stringLiterals.length > 0) {
			return { propType: "enum", options: stringLiterals }
		}

		// If any sub-type is boolean
		if (
			realTypes.some((t) => t.flags & ts.TypeFlags.Boolean || t.flags & ts.TypeFlags.BooleanLiteral)
		) {
			return { propType: "boolean" }
		}

		// If any sub-type is number
		if (realTypes.some((t) => t.flags & ts.TypeFlags.Number)) {
			return { propType: "number" }
		}

		// If any sub-type is string
		if (realTypes.some((t) => t.flags & ts.TypeFlags.String)) {
			return { propType: "string" }
		}
	}

	// ReactNode / ReactElement → "slot"
	const typeName = checker.typeToString(type)
	if (typeName.includes("ReactNode") || typeName.includes("ReactElement")) {
		return { propType: "slot" }
	}

	// Function signatures → "function"
	if (type.getCallSignatures().length > 0) {
		return { propType: "function" }
	}

	// Array
	if (checker.isArrayType(type)) {
		return { propType: "array" }
	}

	// Object
	if (type.flags & ts.TypeFlags.Object) {
		return { propType: "object" }
	}

	// Default to string for anything else
	return { propType: "string" }
}

function propGroup(name: string, propType: PropType): PropGroup {
	if (propType === "slot") return "slots"
	if (propType === "function" || name.startsWith("on")) return "callbacks"
	if (name === "className" || name === "style") return "style"
	return "main"
}

// ---------------------------------------------------------------------------
// Category & import path detection
// ---------------------------------------------------------------------------

function detectCategory(filePath: string): ComponentEntry["category"] {
	if (filePath.includes("/components/patterns/")) return "patterns"
	if (filePath.includes("/components/blocks/")) return "blocks"
	if (filePath.includes("/components/ai/")) return "ai"
	return "ui"
}

function buildImportPath(filePath: string): string {
	// Convert absolute path to package import path
	// packages/ui/src/components/ui/button.tsx → @blazz/ui/components/ui/button
	const uiSrcIndex = filePath.indexOf("packages/ui/src/")
	if (uiSrcIndex === -1) return filePath

	const relative = filePath.slice(uiSrcIndex + "packages/ui/src/".length)
	// Remove extension
	const withoutExt = relative.replace(/\.(tsx?|jsx?)$/, "")
	// Remove /index suffix
	const clean = withoutExt.replace(/\/index$/, "")
	return `@blazz/ui/${clean}`
}

// ---------------------------------------------------------------------------
// Source file of a declaration
// ---------------------------------------------------------------------------

function getSourceFilePath(symbol: ts.Symbol): string | undefined {
	const decl = symbol.getDeclarations()?.[0]
	if (!decl) return undefined
	return decl.getSourceFile().fileName
}

// ---------------------------------------------------------------------------
// Check if a prop is declared in the component's own source (not inherited)
// ---------------------------------------------------------------------------

function isDeclaredInUserSource(prop: ts.Symbol, _checker: ts.TypeChecker): boolean {
	const decl = prop.getDeclarations()?.[0]
	if (!decl) return false
	const filePath = decl.getSourceFile().fileName
	// If it comes from node_modules, it's inherited
	if (filePath.includes("node_modules")) return false
	return true
}

// ---------------------------------------------------------------------------
// Extract props from a component type
// ---------------------------------------------------------------------------

function extractProps(type: ts.Type, checker: ts.TypeChecker): PropDescriptor[] {
	const allProps = type.getProperties()

	// Heuristic: if > 25 props, many are likely inherited HTML attrs
	const manyProps = allProps.length > 25

	const result: PropDescriptor[] = []

	for (const prop of allProps) {
		const name = prop.getName()

		// Skip known uninteresting props
		if (SKIP_PROPS.has(name)) continue

		// Skip props starting with aria- or data-
		if (name.startsWith("aria-") || name.startsWith("data-")) continue

		// If too many props, filter out standard HTML attrs
		if (manyProps && HTML_ATTRS.has(name)) continue

		// If too many props, only include props declared in user source
		if (manyProps && !isDeclaredInUserSource(prop, checker)) continue

		const propType = checker.getTypeOfSymbol(prop)
		const mapped = mapType(propType, checker)
		const group = propGroup(name, mapped.propType)

		// Skip inherited HTML event handlers even with few props
		if (!manyProps && HTML_ATTRS.has(name) && group === "callbacks") continue

		const descriptor: PropDescriptor = {
			name,
			type: mapped.propType,
			group,
		}

		if (mapped.options) {
			descriptor.options = mapped.options
		}

		result.push(descriptor)
	}

	return result
}

// ---------------------------------------------------------------------------
// Resolve a symbol through aliases
// ---------------------------------------------------------------------------

function resolveSymbol(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Symbol {
	if (symbol.flags & ts.SymbolFlags.Alias) {
		return checker.getAliasedSymbol(symbol)
	}
	return symbol
}

// ---------------------------------------------------------------------------
// Check if a symbol is a React component
// ---------------------------------------------------------------------------

function isReactComponent(symbol: ts.Symbol, checker: ts.TypeChecker): boolean {
	const resolved = resolveSymbol(symbol, checker)
	const decl = resolved.getDeclarations()?.[0]
	if (!decl) return false

	// Must be a function or variable declaration
	if (
		!ts.isFunctionDeclaration(decl) &&
		!ts.isVariableDeclaration(decl) &&
		!ts.isFunctionExpression(decl) &&
		!ts.isArrowFunction(decl)
	) {
		return false
	}

	// Get its type
	const type = checker.getTypeOfSymbol(resolved)

	// Must have call signatures (it's callable)
	const signatures = type.getCallSignatures()
	if (signatures.length === 0) return false

	// Check if return type looks like JSX/ReactElement
	const sig = signatures[0]
	const returnType = checker.getReturnTypeOfSignature(sig)
	const returnTypeName = checker.typeToString(returnType)

	return (
		returnTypeName.includes("Element") ||
		returnTypeName.includes("JSX") ||
		returnTypeName.includes("ReactNode") ||
		returnTypeName === "React.JSX.Element"
	)
}

// ---------------------------------------------------------------------------
// Get the first parameter type of a component function (= its props)
// ---------------------------------------------------------------------------

function getPropsType(symbol: ts.Symbol, checker: ts.TypeChecker): ts.Type | undefined {
	const resolved = resolveSymbol(symbol, checker)
	const type = checker.getTypeOfSymbol(resolved)
	const signatures = type.getCallSignatures()
	if (signatures.length === 0) return undefined

	const sig = signatures[0]
	const params = sig.getParameters()
	if (params.length === 0) return undefined

	return checker.getTypeOfSymbol(params[0])
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
	console.log("Generating registry from @blazz/ui types...")
	console.log(`Entry: ${UI_INDEX}`)

	// Parse tsconfig
	const configFile = ts.readConfigFile(UI_TSCONFIG, ts.sys.readFile)
	const parsedConfig = ts.parseJsonConfigFileContent(
		configFile.config,
		ts.sys,
		path.dirname(UI_TSCONFIG)
	)

	// Create program from the UI index
	const program = ts.createProgram([UI_INDEX], {
		...parsedConfig.options,
		noEmit: true,
	})

	const checker = program.getTypeChecker()
	const sourceFile = program.getSourceFile(UI_INDEX)

	if (!sourceFile) {
		console.error("Could not find source file:", UI_INDEX)
		process.exit(1)
	}

	const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
	if (!moduleSymbol) {
		console.error("Could not get module symbol")
		process.exit(1)
	}

	const exports = checker.getExportsOfModule(moduleSymbol)
	console.log(`Found ${exports.length} exports`)

	const entries: ComponentEntry[] = []
	let skipped = 0

	for (const sym of exports) {
		const name = sym.getName()

		// Only PascalCase names
		if (!isPascalCase(name)) continue

		try {
			// Resolve through re-exports
			const resolved = resolveSymbol(sym, checker)

			// Check if it's a React component
			if (!isReactComponent(sym, checker)) {
				continue
			}

			// Get source file for category detection
			const srcPath = getSourceFilePath(resolved)
			if (!srcPath) continue

			const category = detectCategory(srcPath)
			const importPath = buildImportPath(srcPath)

			// Extract props
			const propsType = getPropsType(sym, checker)
			const props = propsType ? extractProps(propsType, checker) : []

			const slug = toSlug(name)

			entries.push({
				name,
				slug,
				category,
				importPath,
				props,
				defaultCode: `<${name} />`,
			})
		} catch (err) {
			console.warn(`  SKIP ${name}: ${(err as Error).message}`)
			skipped++
		}
	}

	// Sort by category then name
	entries.sort((a, b) => {
		if (a.category !== b.category) return a.category.localeCompare(b.category)
		return a.name.localeCompare(b.name)
	})

	console.log(`\nGenerated ${entries.length} components (${skipped} skipped)`)

	// Build output
	const lines: string[] = [
		"// AUTO-GENERATED — do not edit manually",
		"// Run: pnpm --filter sandbox generate",
		"",
		'import type { ComponentEntry } from "./registry"',
		"",
		"export const generatedRegistry: ComponentEntry[] = [",
	]

	for (const entry of entries) {
		lines.push("\t{")
		lines.push(`\t\tname: ${JSON.stringify(entry.name)},`)
		lines.push(`\t\tslug: ${JSON.stringify(entry.slug)},`)
		lines.push(`\t\tcategory: ${JSON.stringify(entry.category)},`)
		lines.push(`\t\timportPath: ${JSON.stringify(entry.importPath)},`)

		// Props
		lines.push("\t\tprops: [")
		for (const prop of entry.props) {
			const parts = [`name: ${JSON.stringify(prop.name)}`, `type: ${JSON.stringify(prop.type)}`]
			if (prop.options) {
				parts.push(`options: ${JSON.stringify(prop.options)}`)
			}
			if (prop.group) {
				parts.push(`group: ${JSON.stringify(prop.group)}`)
			}
			lines.push(`\t\t\t{ ${parts.join(", ")} },`)
		}
		lines.push("\t\t],")

		lines.push(`\t\tdefaultCode: ${JSON.stringify(entry.defaultCode)},`)
		lines.push("\t},")
	}

	lines.push("]")
	lines.push("")

	const output = lines.join("\n")

	// Write output
	try {
		fs.writeFileSync(OUTPUT, output, "utf-8")
		console.log(`Written to: ${OUTPUT}`)
	} catch (err) {
		console.error(`Failed to write output: ${(err as Error).message}`)
		process.exit(1)
	}

	// Summary by category
	const byCategory = entries.reduce(
		(acc, e) => {
			acc[e.category] = (acc[e.category] || 0) + 1
			return acc
		},
		{} as Record<string, number>
	)
	console.log("\nBy category:")
	for (const [cat, count] of Object.entries(byCategory)) {
		console.log(`  ${cat}: ${count}`)
	}
}

main()
