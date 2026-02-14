/**
 * Adapter for converting between DataTable's FilterGroup and ReUI's Filter[] format
 *
 * This adapter provides bidirectional conversion to allow the ReUI Filters component
 * to work with the existing FilterGroup-based filtering logic.
 */

import type { Filter } from '@/components/ui/filters';
import type {
  FilterCondition,
  FilterGroup,
  FilterOperator,
  FilterType,
} from '../data-table-filter.types';

/**
 * Map FilterOperator (current system) to ReUI operator string
 * @param operator The operator to map
 * @param type Optional filter type for context-specific mapping
 */
export function mapOperatorToReui(operator: FilterOperator, type?: FilterType): string {
  // For number and date types, use "equals" instead of "is"
  const useEquals = type === 'number' || type === 'date';

  const mapping: Record<FilterOperator, string> = {
    equals: useEquals ? 'equals' : 'is',
    notEquals: useEquals ? 'not_equals' : 'is_not',
    contains: 'contains',
    notContains: 'not_contains',
    startsWith: 'starts_with',
    endsWith: 'ends_with',
    greaterThan: 'greater_than',
    greaterThanOrEqual: 'greater_than',
    lessThan: 'less_than',
    lessThanOrEqual: 'less_than',
    between: 'between',
    in: 'is_any_of',
    notIn: 'is_not_any_of',
    isEmpty: 'empty',
    isNotEmpty: 'not_empty',
  };

  return mapping[operator] || (useEquals ? 'equals' : 'is');
}

/**
 * Map ReUI operator string to FilterOperator (current system)
 */
export function mapOperatorFromReui(operator: string, _type: FilterType): FilterOperator {
  const mapping: Record<string, FilterOperator> = {
    is: 'equals',
    is_not: 'notEquals',
    contains: 'contains',
    not_contains: 'notContains',
    starts_with: 'startsWith',
    ends_with: 'endsWith',
    greater_than: 'greaterThan',
    less_than: 'lessThan',
    between: 'between',
    not_between: 'between', // Map to between, but negate in evaluation
    is_any_of: 'in',
    is_not_any_of: 'notIn',
    includes_all: 'in',
    excludes_all: 'notIn',
    empty: 'isEmpty',
    not_empty: 'isNotEmpty',
    // Date-specific
    before: 'lessThan',
    after: 'greaterThan',
    // Number-specific
    equals: 'equals',
    not_equals: 'notEquals',
    greater_than_or_equal: 'greaterThanOrEqual',
    less_than_or_equal: 'lessThanOrEqual',
  };

  return mapping[operator] || 'equals';
}

/**
 * Normalize filter values from ReUI format (values[]) to FilterCondition format (value, value2)
 */
export function normalizeFilterValues(
  values: any[],
  operator: string
): { value: any; value2?: any } {
  // Empty operators don't need values
  if (operator === 'empty' || operator === 'not_empty') {
    return { value: null };
  }

  // No values provided
  if (!values || values.length === 0) {
    return { value: null };
  }

  // Between operator needs two values
  if (operator === 'between' || operator === 'not_between') {
    return {
      value: values[0] ?? null,
      value2: values[1] ?? null,
    };
  }

  // Multi-select operators keep the array
  if (
    operator === 'is_any_of' ||
    operator === 'is_not_any_of' ||
    operator === 'includes_all' ||
    operator === 'excludes_all'
  ) {
    return { value: values };
  }

  // Single value
  return { value: values[0] ?? null };
}

/**
 * Convert FilterGroup to ReUI Filter[]
 */
export function filterGroupToReuiFilters(filterGroup: FilterGroup | null): Filter[] {
  if (!filterGroup || !filterGroup.conditions || filterGroup.conditions.length === 0) {
    return [];
  }

  // Convert each condition to a ReUI Filter
  return filterGroup.conditions.map((condition) => {
    // Determine values array based on operator
    let values: any[] = [];

    if (condition.operator === 'isEmpty' || condition.operator === 'isNotEmpty') {
      // Empty operators have no values
      values = [];
    } else if (condition.operator === 'between') {
      // Between has two values
      values = [condition.value, condition.value2].filter((v) => v !== undefined);
    } else if (Array.isArray(condition.value)) {
      // Already an array (for in/notIn operators)
      values = condition.value;
    } else if (condition.value !== null && condition.value !== undefined) {
      // Single value
      values = [condition.value];
    }

    return {
      id: condition.id,
      field: condition.column,
      operator: mapOperatorToReui(condition.operator, condition.type),
      values,
    };
  });
}

/**
 * Convert ReUI Filter[] to FilterGroup
 * @param filters ReUI filters array
 * @param columns Optional columns for type detection (if not available, types must be inferred)
 */
export function reuiFiltersToFilterGroup(
  filters: Filter[],
  columns?: Array<{ id?: string; accessorKey?: string; filterConfig?: { type: FilterType } }>
): FilterGroup | null {
  if (!filters || filters.length === 0) {
    return null;
  }

  // Helper to detect filter type from column config
  const getFilterType = (field: string): FilterType => {
    if (columns) {
      const column = columns.find((col) => col.accessorKey === field || col.id === field);
      if (column?.filterConfig?.type) {
        return column.filterConfig.type;
      }
    }

    // Fallback: infer from operator (not perfect but works for basic cases)
    return 'text';
  };

  // Convert each ReUI Filter to a FilterCondition
  const conditions: FilterCondition[] = filters
    .map((filter) => {
      const type = getFilterType(filter.field);
      const operator = mapOperatorFromReui(filter.operator, type);
      const normalized = normalizeFilterValues(filter.values, filter.operator);

      return {
        id: filter.id,
        column: filter.field,
        operator,
        value: normalized.value,
        value2: normalized.value2,
        type,
      };
    })
    .filter((condition) => {
      // Filter out invalid conditions
      const hasValue =
        condition.operator === 'isEmpty' ||
        condition.operator === 'isNotEmpty' ||
        condition.value !== null;

      return hasValue;
    });

  if (conditions.length === 0) {
    return null;
  }

  return {
    id: 'root',
    operator: 'AND', // Inline filters always use AND logic
    conditions,
  };
}

/**
 * Check if a filter is considered "active" (has meaningful values)
 */
export function isFilterActive(filter: Filter): boolean {
  // Empty operators are always active
  if (filter.operator === 'empty' || filter.operator === 'not_empty') {
    return true;
  }

  // Check if values array has meaningful content
  if (!filter.values || filter.values.length === 0) {
    return false;
  }

  // Check for empty string values
  if (filter.values.every((value) => typeof value === 'string' && value.trim() === '')) {
    return false;
  }

  // Check for null/undefined values
  if (filter.values.every((value) => value === null || value === undefined)) {
    return false;
  }

  return true;
}

/**
 * Filter out inactive filters from a Filter[] array
 */
export function filterActiveFilters(filters: Filter[]): Filter[] {
  return filters.filter(isFilterActive);
}
