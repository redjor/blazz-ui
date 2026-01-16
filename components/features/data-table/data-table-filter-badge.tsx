"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { FilterCondition, FilterGroup } from "./data-table.types"

interface DataTableFilterBadgesProps {
  filterGroup: FilterGroup | null
  onRemoveCondition: (conditionId: string) => void
  onClearAll: () => void
}

export function DataTableFilterBadges({
  filterGroup,
  onRemoveCondition,
  onClearAll,
}: DataTableFilterBadgesProps) {
  if (!filterGroup || filterGroup.conditions.length === 0) {
    return null
  }

  const formatConditionLabel = (condition: FilterCondition): string => {
    const { column, operator, value, value2 } = condition

    // Format column name (capitalize first letter)
    const formattedColumn = column.charAt(0).toUpperCase() + column.slice(1)

    // Format operator
    const operatorLabels: Record<string, string> = {
      equals: "is",
      notEquals: "is not",
      contains: "contains",
      notContains: "does not contain",
      startsWith: "starts with",
      endsWith: "ends with",
      greaterThan: ">",
      greaterThanOrEqual: "≥",
      lessThan: "<",
      lessThanOrEqual: "≤",
      between: "between",
      in: "in",
      notIn: "not in",
      isEmpty: "is empty",
      isNotEmpty: "is not empty",
    }

    const operatorLabel = operatorLabels[operator] || operator

    // Format value
    if (operator === "isEmpty" || operator === "isNotEmpty") {
      return `${formattedColumn} ${operatorLabel}`
    }

    if (operator === "between" && value2 !== undefined) {
      return `${formattedColumn} ${operatorLabel} ${value} and ${value2}`
    }

    if (Array.isArray(value)) {
      return `${formattedColumn} ${operatorLabel} ${value.join(", ")}`
    }

    return `${formattedColumn} ${operatorLabel} ${value}`
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 py-2"
      data-slot="data-table-filter-badges"
    >
      <span className="text-sm text-muted-foreground">Filters:</span>

      {/* Display filter conditions as badges */}
      {filterGroup.conditions.map((condition) => (
        <Badge
          key={condition.id}
          variant="secondary"
          className="gap-1 pr-1 font-normal"
        >
          <span>{formatConditionLabel(condition)}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            className="h-4 w-4 hover:bg-transparent"
            onClick={() => onRemoveCondition(condition.id)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove filter</span>
          </Button>
        </Badge>
      ))}

      {/* Show operator between groups */}
      {filterGroup.conditions.length > 1 && (
        <span className="text-xs text-muted-foreground">
          ({filterGroup.operator})
        </span>
      )}

      {/* Clear all button */}
      {filterGroup.conditions.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-6 px-2 text-xs"
        >
          Clear all
        </Button>
      )}
    </div>
  )
}
