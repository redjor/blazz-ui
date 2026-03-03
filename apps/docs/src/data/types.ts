// apps/docs/src/data/types.ts
import type { DocProp } from "~/components/docs/doc-props-table"

export type ComponentCategory = "ui" | "patterns" | "blocks" | "ai"

export type ComponentImport = {
  path: string
  named: string[]
}

export type ComponentData = {
  name: string
  category: ComponentCategory
  description: string
  docPath: string
  imports: ComponentImport
  props: DocProp[]
  gotchas: string[]
  canonicalExample: string
}
