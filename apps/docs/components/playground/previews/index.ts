import type { PreviewEntry } from "../preview-registry"
import { ButtonPreview } from "./button-preview"
import { BadgePreview } from "./badge-preview"
import { CardPreview } from "./card-preview"
import { InputPreview } from "./input-preview"
import { TablePreview } from "./table-preview"
import { AlertPreview } from "./alert-preview"
import { AvatarPreview } from "./avatar-preview"
import { SwitchPreview } from "./switch-preview"
import { CheckboxPreview } from "./checkbox-preview"
import { SelectPreview } from "./select-preview"
import { TabsPreview } from "./tabs-preview"
import { SkeletonPreview } from "./skeleton-preview"
import { BannerPreview } from "./banner-preview"
import { TextPreview } from "./text-preview"
import { DividerPreview } from "./divider-preview"
import { BreadcrumbPreview } from "./breadcrumb-preview"
import { ProgressPreview } from "./progress-preview"
import { EmptyPreview } from "./empty-preview"

export const PREVIEW_REGISTRY: PreviewEntry[] = [
  { id: "button", label: "Button", component: ButtonPreview, defaultActive: true },
  { id: "badge", label: "Badge", component: BadgePreview, defaultActive: true },
  { id: "card", label: "Card", component: CardPreview, defaultActive: true },
  { id: "input", label: "Input", component: InputPreview, defaultActive: true },
  { id: "table", label: "Table", component: TablePreview, defaultActive: true },
  { id: "alert", label: "Alert", component: AlertPreview, defaultActive: false },
  { id: "avatar", label: "Avatar", component: AvatarPreview, defaultActive: false },
  { id: "switch", label: "Switch", component: SwitchPreview, defaultActive: false },
  { id: "checkbox", label: "Checkbox", component: CheckboxPreview, defaultActive: false },
  { id: "select", label: "Select", component: SelectPreview, defaultActive: false },
  { id: "tabs", label: "Tabs", component: TabsPreview, defaultActive: false },
  { id: "skeleton", label: "Skeleton", component: SkeletonPreview, defaultActive: false },
  { id: "banner", label: "Banner", component: BannerPreview, defaultActive: false },
  { id: "text", label: "Text", component: TextPreview, defaultActive: false },
  { id: "divider", label: "Divider", component: DividerPreview, defaultActive: false },
  { id: "breadcrumb", label: "Breadcrumb", component: BreadcrumbPreview, defaultActive: false },
  { id: "progress", label: "Progress", component: ProgressPreview, defaultActive: false },
  { id: "empty", label: "Empty", component: EmptyPreview, defaultActive: false },
]
