'use client';

import * as React from 'react';
import { Layers, X } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface DataTableGroupMenuProps {
  groupableColumns: Array<{ id: string; label: string }>;
  grouping: string[];
  onGroupingChange: (grouping: string[]) => void;
  locale?: 'fr' | 'en';
}

export function DataTableGroupMenu({
  groupableColumns,
  grouping,
  onGroupingChange,
  locale = 'fr',
}: DataTableGroupMenuProps) {
  const label = locale === 'fr' ? 'Grouper' : 'Group by';

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="gap-1.5">
              <Layers className="h-4 w-4" />
              {label}
              {grouping.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 text-xs">
                  {grouping.length}
                </Badge>
              )}
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          {groupableColumns.map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              checked={grouping.includes(col.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onGroupingChange([...grouping, col.id]);
                } else {
                  onGroupingChange(grouping.filter((g) => g !== col.id));
                }
              }}
            >
              {col.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Active grouping chips */}
      {grouping.map((colId) => {
        const col = groupableColumns.find((c) => c.id === colId);
        return (
          <Badge key={colId} variant="secondary" className="gap-1">
            {col?.label ?? colId}
            <button
              type="button"
              onClick={() => onGroupingChange(grouping.filter((g) => g !== colId))}
              className="ml-0.5 hover:text-fg"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}
    </div>
  );
}
