// apps/docs/src/data/registry.ts
import type { ComponentData } from "./types"

// UI — Forms
import { selectData } from "./components/select"
import { buttonData } from "./components/button"
import { inputData } from "./components/input"
import { textareaData } from "./components/textarea"
import { checkboxData } from "./components/checkbox"
import { switchData } from "./components/switch"
import { radioGroupData } from "./components/radio-group"
import { dateSelectorData } from "./components/date-selector"
import { comboboxData } from "./components/combobox"

// UI — Overlays
import { dialogData } from "./components/dialog"
import { sheetData } from "./components/sheet"
import { dropdownMenuData } from "./components/dropdown-menu"
import { popoverData } from "./components/popover"
import { tooltipData } from "./components/tooltip"

// UI — Primitives
import { badgeData } from "./components/badge"
import { avatarData } from "./components/avatar"
import { tabsData } from "./components/tabs"
import { skeletonData } from "./components/skeleton"

// Patterns
import { appFrameData } from "./components/app-frame"
import { appSidebarData } from "./components/app-sidebar"
import { appTopBarData } from "./components/app-top-bar"
import { formFieldData } from "./components/form-field"
import { fieldGridData } from "./components/field-grid"
import { pageHeaderShellData } from "./components/page-header-shell"

// Blocks
import { dataTableData } from "./components/data-table"
import { statsGridData } from "./components/stats-grid"
import { filterBarData } from "./components/filter-bar"
import { detailPanelData } from "./components/detail-panel"
import { activityTimelineData } from "./components/activity-timeline"

export const registry: ComponentData[] = [
	// UI — Forms
	selectData,
	buttonData,
	inputData,
	textareaData,
	checkboxData,
	switchData,
	radioGroupData,
	dateSelectorData,
	comboboxData,
	// UI — Overlays
	dialogData,
	sheetData,
	dropdownMenuData,
	popoverData,
	tooltipData,
	// UI — Primitives
	badgeData,
	avatarData,
	tabsData,
	skeletonData,
	// Patterns
	appFrameData,
	appSidebarData,
	appTopBarData,
	formFieldData,
	fieldGridData,
	pageHeaderShellData,
	// Blocks
	dataTableData,
	statsGridData,
	filterBarData,
	detailPanelData,
	activityTimelineData,
]
