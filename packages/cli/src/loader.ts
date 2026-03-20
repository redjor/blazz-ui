import composeRaw from "../../../ai/compose.md"
import componentsRaw from "../../../ai/components.md"
import designRaw from "../../../ai/design.md"
import dashboardPattern from "../../../ai/patterns/dashboard.md"
import pipelineKanbanPattern from "../../../ai/patterns/pipeline-kanban.md"
import reportingPattern from "../../../ai/patterns/reporting.md"
import resourceCreateEditPattern from "../../../ai/patterns/resource-create-edit.md"
import resourceDetailPattern from "../../../ai/patterns/resource-detail.md"
import resourceImportPattern from "../../../ai/patterns/resource-import.md"
import resourceListPattern from "../../../ai/patterns/resource-list.md"
import rulesRaw from "../../../ai/rules.md"
import tokensRaw from "../../../packages/ui/styles/tokens.css"

export function loadCompose(): string {
  return composeRaw
}

export function loadRules(): string {
  return rulesRaw
}

export function loadComponents(): string {
  return componentsRaw
}

export function loadDesignPrinciples(): string {
  return designRaw
}

export function loadTokens(): string {
  return tokensRaw
}

const patterns: Record<string, string> = {
  "resource-list": resourceListPattern,
  "resource-detail": resourceDetailPattern,
  "resource-create-edit": resourceCreateEditPattern,
  "resource-import": resourceImportPattern,
  dashboard: dashboardPattern,
  "pipeline-kanban": pipelineKanbanPattern,
  reporting: reportingPattern,
}

export function loadPattern(name: string): string | null {
  return patterns[name] ?? null
}

export function listPatterns(): string[] {
  return Object.keys(patterns)
}
