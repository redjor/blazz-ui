import type { ComponentType } from "react"

export interface PreviewEntry {
  id: string
  label: string
  component: ComponentType
  defaultActive: boolean
}

export { PREVIEW_REGISTRY } from "./previews"
