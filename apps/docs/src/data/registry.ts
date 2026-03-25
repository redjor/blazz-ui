// apps/docs/src/data/registry.ts

import { activityTimelineData } from "./components/activity-timeline"
// Blocks
import { appFrameData } from "./components/app-frame"
import { avatarData } from "./components/avatar"
// UI — Primitives
import { badgeData } from "./components/badge"
import { buttonData } from "./components/button"
import { checkboxData } from "./components/checkbox"
import { comboboxData } from "./components/combobox"
// Blocks
import { dataTableData } from "./components/data-table"
import { dateSelectorData } from "./components/date-selector"
import { detailPanelData } from "./components/detail-panel"
// UI — Overlays
import { dialogData } from "./components/dialog"
import { dropdownMenuData } from "./components/dropdown-menu"
import { fieldGridData } from "./components/field-grid"
import { filterBarData } from "./components/filter-bar"
import { formFieldData } from "./components/form-field"
import { inputData } from "./components/input"
import { pageHeaderShellData } from "./components/page-header-shell"
import { popoverData } from "./components/popover"
import { radioGroupData } from "./components/radio-group"
// UI — Forms
import { selectData } from "./components/select"
import { sheetData } from "./components/sheet"
import { skeletonData } from "./components/skeleton"
import { statsGridData } from "./components/stats-grid"
import { switchData } from "./components/switch"
import { tabsData } from "./components/tabs"
import { textareaData } from "./components/textarea"
import { tooltipData } from "./components/tooltip"
// AI — Chat
import { messageData, conversationData, promptInputData, attachmentsData, shimmerData, suggestionsData } from "./components/ai/chat"
// AI — Reasoning
import { chainOfThoughtData, reasoningData, inlineCitationData, sourcesData } from "./components/ai/reasoning"
// AI — Tools
import { confirmationData, contextData, modelSelectorData } from "./components/ai/tools"
// AI — Generative UI
import { generativeAiData } from "./components/ai/generative"
import type { RegistryEntry } from "./types"

export const registry: RegistryEntry[] = [
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
	formFieldData,
	fieldGridData,
	pageHeaderShellData,
	// Blocks
	appFrameData,
	dataTableData,
	statsGridData,
	filterBarData,
	detailPanelData,
	activityTimelineData,
	// AI — Core
	messageData,
	conversationData,
	promptInputData,
	attachmentsData,
	shimmerData,
	suggestionsData,
	chainOfThoughtData,
	reasoningData,
	inlineCitationData,
	sourcesData,
	confirmationData,
	contextData,
	modelSelectorData,
	// AI — Generative UI
	...generativeAiData,
]
