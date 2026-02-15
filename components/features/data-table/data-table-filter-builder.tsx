'use client';

import { Plus, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type DataTableLocale, useDataTableTranslations } from './data-table.i18n';
import type {
  DataTableColumnDef,
  FilterCondition,
  FilterGroup,
  FilterOperator,
} from './data-table.types';
import {
  booleanOperators,
  dateOperators,
  numberOperators,
  selectOperators,
  textOperators,
} from './data-table.types';

interface DataTableFilterBuilderProps<TData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: DataTableColumnDef<TData, any>[];
  filterGroup: FilterGroup | null;
  onApply: (filterGroup: FilterGroup) => void;
  locale?: DataTableLocale;
}

export function DataTableFilterBuilder<TData>({
  open,
  onOpenChange,
  columns,
  filterGroup,
  onApply,
  locale = 'fr',
}: DataTableFilterBuilderProps<TData>) {
  const t = useDataTableTranslations(locale);
  const [localFilterGroup, setLocalFilterGroup] = React.useState<FilterGroup>(
    filterGroup || {
      id: 'root',
      operator: 'AND',
      conditions: [],
    }
  );

  // Update local state when filterGroup prop changes
  React.useEffect(() => {
    if (filterGroup) {
      setLocalFilterGroup(filterGroup);
    }
  }, [filterGroup]);

  // Get filterable columns
  const filterableColumns = columns.filter(
    (col): col is DataTableColumnDef<TData, any> & { accessorKey: string } =>
      'accessorKey' in col && typeof col.accessorKey === 'string' && !!col.filterConfig
  );

  const addCondition = () => {
    const newCondition: FilterCondition = {
      id: `condition-${Date.now()}`,
      column: (filterableColumns[0]?.accessorKey as string) || '',
      operator: 'equals',
      value: '',
      type: filterableColumns[0]?.filterConfig?.type || 'text',
    };

    setLocalFilterGroup({
      ...localFilterGroup,
      conditions: [...localFilterGroup.conditions, newCondition],
    });
  };

  const removeCondition = (conditionId: string) => {
    setLocalFilterGroup({
      ...localFilterGroup,
      conditions: localFilterGroup.conditions.filter((c) => c.id !== conditionId),
    });
  };

  const updateCondition = (conditionId: string, updates: Partial<FilterCondition>) => {
    setLocalFilterGroup({
      ...localFilterGroup,
      conditions: localFilterGroup.conditions.map((c) =>
        c.id === conditionId ? { ...c, ...updates } : c
      ),
    });
  };

  const toggleOperator = () => {
    setLocalFilterGroup({
      ...localFilterGroup,
      operator: localFilterGroup.operator === 'AND' ? 'OR' : 'AND',
    });
  };

  const handleApply = () => {
    onApply(localFilterGroup);
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalFilterGroup({
      id: 'root',
      operator: 'AND',
      conditions: [],
    });
  };

  const getOperatorsForType = (type: string) => {
    switch (type) {
      case 'text':
        return textOperators;
      case 'number':
        return numberOperators;
      case 'select':
        return selectOperators;
      case 'date':
        return dateOperators;
      case 'boolean':
        return booleanOperators;
      default:
        return textOperators;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" showCloseButton={false}>
        <div className="flex items-start justify-between">
          <div>
            <DialogTitle>{t.advancedFilters}</DialogTitle>
            <DialogDescription>{t.advancedFiltersDesc}</DialogDescription>
          </div>
          <DialogClose />
        </div>

        <div className="mt-6 space-y-4">
          {/* Operator Toggle */}
          {localFilterGroup.conditions.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t.matchRows}</span>
              <Button variant="outline" size="sm" onClick={toggleOperator} className="font-mono">
                {localFilterGroup.operator === 'AND' ? t.allConditions : t.anyCondition}
              </Button>
              <span className="text-sm text-muted-foreground">{t.followingConditions}</span>
            </div>
          )}

          {/* Conditions */}
          <div className="space-y-3">
            {localFilterGroup.conditions.map((condition) => {
              const column = filterableColumns.find((col) => col.accessorKey === condition.column);
              const operators = getOperatorsForType(condition.type);

              return (
                <div key={condition.id} className="flex items-start gap-2 border border-border p-3">
                  <div className="flex-1 space-y-2">
                    {/* Column Selection */}
                    <Select
                      value={condition.column}
                      onValueChange={(value) => {
                        if (!value) return;
                        const newColumn = filterableColumns.find(
                          (col) => col.accessorKey === value
                        );
                        updateCondition(condition.id, {
                          column: value,
                          type: newColumn?.filterConfig?.type || 'text',
                          operator: 'equals',
                          value: '',
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filterableColumns.map((col) => (
                          <SelectItem
                            key={col.accessorKey as string}
                            value={col.accessorKey as string}
                          >
                            {typeof col.header === 'string'
                              ? col.header
                              : (col.accessorKey as string)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      {/* Operator Selection */}
                      <Select
                        value={condition.operator}
                        onValueChange={(value) =>
                          updateCondition(condition.id, {
                            operator: value as FilterOperator,
                          })
                        }
                      >
                        <SelectTrigger className="w-45">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Value Input */}
                      {operators.find((op) => op.value === condition.operator)?.requiresValue &&
                        (condition.type === 'select' && column?.filterConfig?.options ? (
                          <Select
                            value={String(condition.value)}
                            onValueChange={(value) => updateCondition(condition.id, { value })}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {column.filterConfig.options.map((opt) => (
                                <SelectItem key={opt.value} value={String(opt.value)}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            type={
                              condition.type === 'number'
                                ? 'number'
                                : condition.type === 'date'
                                  ? 'date'
                                  : 'text'
                            }
                            value={condition.value}
                            onChange={(e) =>
                              updateCondition(condition.id, {
                                value: e.target.value,
                              })
                            }
                            placeholder={t.enterValue}
                            className="flex-1"
                          />
                        ))}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeCondition(condition.id)}
                    className="mt-1"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">{t.removeCondition}</span>
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Add Condition Button */}
          {filterableColumns.length > 0 && (
            <Button variant="outline" size="sm" onClick={addCondition} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              {t.addCondition}
            </Button>
          )}

          {filterableColumns.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t.noFilterableColumns}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" size="sm" onClick={handleClear}>
            {t.clearAll}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleApply}>{t.applyFilters}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
