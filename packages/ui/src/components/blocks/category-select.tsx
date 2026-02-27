"use client"

import type { Control, FieldPath, FieldValues } from "react-hook-form"
import { Controller } from "react-hook-form"
import { Label } from "../ui/label"
import { cn } from "../../lib/utils"
import {
  CascadingSelect,
  type CascadingSelectNode,
} from "../ui/cascading-select"

export interface CategorySelectProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: FieldPath<TFieldValues>
  label: string
  control: Control<TFieldValues>
  nodes: CascadingSelectNode[]
  placeholder?: string
  description?: string
  required?: boolean
  className?: string
}

export function CategorySelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  control,
  nodes,
  placeholder,
  description,
  required,
  className,
}: CategorySelectProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className={cn("space-y-1.5", className)}>
          <Label htmlFor={name}>
            {label}
            {required && <span className="ml-0.5 text-negative">*</span>}
          </Label>
          <CascadingSelect
            nodes={nodes}
            value={field.value ?? ""}
            onValueChange={field.onChange}
            placeholder={placeholder}
          />
          {description && !fieldState.error && (
            <p className="text-xs text-fg-muted">{description}</p>
          )}
          {fieldState.error && (
            <p className="text-xs text-negative">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  )
}
