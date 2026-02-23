import type { PreviewEntry } from "../preview-registry"
import { ButtonPreview } from "./button-preview"
import { BadgePreview } from "./badge-preview"
import { CardPreview } from "./card-preview"
import { InputPreview } from "./input-preview"
import { TablePreview } from "./table-preview"
import { AlertPreview } from "./alert-preview"

export const PREVIEW_REGISTRY: PreviewEntry[] = [
  { id: "button", label: "Button", component: ButtonPreview, defaultActive: true },
  { id: "badge", label: "Badge", component: BadgePreview, defaultActive: true },
  { id: "card", label: "Card", component: CardPreview, defaultActive: true },
  { id: "input", label: "Input", component: InputPreview, defaultActive: true },
  { id: "table", label: "Table", component: TablePreview, defaultActive: true },
  { id: "alert", label: "Alert", component: AlertPreview, defaultActive: false },
]
