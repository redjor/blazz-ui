"use client";

import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DataTableColumnDef } from "./data-table.types";
import type { DataTableLocale } from "./data-table.i18n";
import { useDataTableTranslations } from "./data-table.i18n";
import { getFilterLabel } from "./data-table.utils";

export interface FilterDropdownProps<TData> {
  column: DataTableColumnDef<TData, any>;
  value: any;
  onChange: (value: any) => void;
  onClear: () => void;
  locale?: DataTableLocale;
}

/**
 * Dropdown filter component for a single column
 *
 * Renders different UI based on filter type:
 * - Select: Multi-select with checkboxes
 * - Text: Input with debounce
 * - Number/Date: Typed input
 */
export function FilterDropdown<TData>({
  column,
  value,
  onChange,
  onClear,
  locale = "fr",
}: FilterDropdownProps<TData>) {
  const filterType = column.filterConfig?.type;

  if (!filterType) return null;

  switch (filterType) {
    case "select":
      return (
        <SelectFilterDropdown
          column={column}
          value={value}
          onChange={onChange}
          onClear={onClear}
          locale={locale}
        />
      );
    case "text":
      return (
        <TextFilterDropdown
          column={column}
          value={value}
          onChange={onChange}
          onClear={onClear}
          locale={locale}
        />
      );
    case "number":
      return (
        <NumberFilterDropdown
          column={column}
          value={value}
          onChange={onChange}
          onClear={onClear}
          locale={locale}
        />
      );
    case "date":
      return (
        <DateFilterDropdown
          column={column}
          value={value}
          onChange={onChange}
          onClear={onClear}
          locale={locale}
        />
      );
    default:
      return null;
  }
}

/**
 * Select filter with multi-select checkboxes
 */
function SelectFilterDropdown<TData>({
  column,
  value,
  onChange,
  onClear,
  locale,
}: FilterDropdownProps<TData>) {
  const t = useDataTableTranslations(locale);
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    Array.isArray(value) ? value : value ? [String(value)] : [],
  );

  // Sync with external value changes
  React.useEffect(() => {
    const newValues = Array.isArray(value)
      ? value
      : value
        ? [String(value)]
        : [];
    setSelectedValues(newValues);
  }, [value]);

  const handleToggle = (optionValue: string) => {
    const newValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];

    setSelectedValues(newValues);

    // Update filter immediately
    if (newValues.length > 0) {
      // Use array for multi-select (will create "in" operator)
      onChange(newValues.length === 1 ? newValues[0] : newValues);
    } else {
      onClear();
    }
  };

  const handleClear = () => {
    setSelectedValues([]);
    onClear();
    setOpen(false);
  };

  const options = column.filterConfig?.options || [];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 gap-1 rounded-full",
            selectedValues.length === 0 && "border-dashed",
          )}
        >
          <span>{getFilterLabel(column)}</span>
          {selectedValues.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 rounded px-1 text-xs font-normal"
            >
              {selectedValues.length}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        {options.length > 0 ? (
          <>
            {options.map((option) => (
              <DropdownMenuCheckboxItem
                key={String(option.value)}
                checked={selectedValues.includes(String(option.value))}
                onCheckedChange={() => handleToggle(String(option.value))}
                onSelect={(e) => e.preventDefault()}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
            {selectedValues.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleClear}>
                  <X className="mr-2 h-4 w-4" />
                  {t.clearFilter}
                </DropdownMenuItem>
              </>
            )}
          </>
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No options
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Text filter with debounced input
 */
function TextFilterDropdown<TData>({
  column,
  value,
  onChange,
  onClear,
  locale,
}: FilterDropdownProps<TData>) {
  const t = useDataTableTranslations(locale);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");

  // Sync with external value changes
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Debounce the onChange call
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        onChange(inputValue);
      } else {
        onClear();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onChange, onClear]);

  const handleClear = () => {
    setInputValue("");
    onClear();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 gap-1",
            !inputValue && "border-dashed"
          )}
        >
          <span>{getFilterLabel(column)}</span>
          {inputValue && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 rounded px-1 text-xs font-normal"
            >
              1
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]" align="start">
        <div className="p-2">
          <Input
            type="text"
            placeholder={column.filterConfig?.placeholder || "Rechercher..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            className="h-8"
          />
        </div>
        {inputValue && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              {t.clearFilter}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Number filter with typed input
 */
function NumberFilterDropdown<TData>({
  column,
  value,
  onChange,
  onClear,
  locale,
}: FilterDropdownProps<TData>) {
  const t = useDataTableTranslations(locale);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    value !== undefined ? String(value) : "",
  );

  // Sync with external value changes
  React.useEffect(() => {
    setInputValue(value !== undefined ? String(value) : "");
  }, [value]);

  const handleApply = () => {
    if (inputValue !== "") {
      const numValue = Number(inputValue);
      if (!Number.isNaN(numValue)) {
        onChange(numValue);
      }
    } else {
      onClear();
    }
  };

  const handleClear = () => {
    setInputValue("");
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApply();
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 gap-1",
            !inputValue && "border-dashed"
          )}
        >
          <span>{getFilterLabel(column)}</span>
          {inputValue && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 rounded px-1 text-xs font-normal"
            >
              1
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        <div className="p-2">
          <Input
            type="number"
            min={column.filterConfig?.min}
            max={column.filterConfig?.max}
            step={column.filterConfig?.step}
            placeholder={column.filterConfig?.placeholder || "Nombre..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleApply}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-8"
          />
        </div>
        {inputValue && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              {t.clearFilter}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Date filter with date input
 */
function DateFilterDropdown<TData>({
  column,
  value,
  onChange,
  onClear,
  locale,
}: FilterDropdownProps<TData>) {
  const t = useDataTableTranslations(locale);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");

  // Sync with external value changes
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleApply = () => {
    if (inputValue) {
      onChange(inputValue);
    } else {
      onClear();
    }
  };

  const handleClear = () => {
    setInputValue("");
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApply();
      setOpen(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 gap-1",
            !inputValue && "border-dashed"
          )}
        >
          <span>{getFilterLabel(column)}</span>
          {inputValue && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 rounded px-1 text-xs font-normal"
            >
              1
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        <div className="p-2">
          <Input
            type="date"
            placeholder={column.filterConfig?.placeholder || "Date..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleApply}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-8"
          />
        </div>
        {inputValue && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClear}>
              <X className="mr-2 h-4 w-4" />
              {t.clearFilter}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
