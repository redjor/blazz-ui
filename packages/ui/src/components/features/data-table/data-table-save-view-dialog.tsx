'use client';

import type { ColumnPinningState, SortingState, VisibilityState } from '@tanstack/react-table';
import * as React from 'react';
import { Button } from '../../ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import type { DataTableView, FilterGroup } from './data-table.types';

interface SaveViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentState: {
    filters: FilterGroup | null;
    sorting: SortingState;
    columnVisibility: VisibilityState;
    columnPinning?: ColumnPinningState;
    grouping?: string[];
  };
  existingViews: DataTableView[];
  onSave: (view: Omit<DataTableView, 'id' | 'createdAt' | 'updatedAt'>) => void;
  locale?: 'fr' | 'en';
}

/**
 * Generate a unique ID for a custom view based on its name
 */
const _generateViewId = (name: string): string => {
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `custom-${slug}-${Date.now()}`;
};

const translations = {
  fr: {
    title: 'Enregistrer la vue',
    nameLabel: 'Nom de la vue',
    namePlaceholder: 'Ma vue personnalisée',
    cancel: 'Annuler',
    save: 'Enregistrer',
    errors: {
      nameRequired: 'Le nom est requis',
      nameTooLong: 'Le nom ne peut pas dépasser 50 caractères',
      nameExists: 'Ce nom de vue existe déjà',
    },
  },
  en: {
    title: 'Save View',
    nameLabel: 'View Name',
    namePlaceholder: 'My custom view',
    cancel: 'Cancel',
    save: 'Save',
    errors: {
      nameRequired: 'Name is required',
      nameTooLong: 'Name cannot exceed 50 characters',
      nameExists: 'This view name already exists',
    },
  },
};

export function DataTableSaveViewDialog({
  open,
  onOpenChange,
  currentState,
  existingViews,
  onSave,
  locale = 'en',
}: SaveViewDialogProps) {
  const t = translations[locale];
  const [viewName, setViewName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setViewName('');
      setError(null);
    }
  }, [open]);

  // Validate name
  const validateName = (name: string): string | null => {
    if (!name.trim()) {
      return t.errors.nameRequired;
    }
    if (name.length > 50) {
      return t.errors.nameTooLong;
    }
    // Check for duplicate names (case-insensitive)
    const existingNames = existingViews.map((v) => v.name.toLowerCase());
    if (existingNames.includes(name.toLowerCase())) {
      return t.errors.nameExists;
    }
    return null;
  };

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setViewName(newName);
    setError(validateName(newName));
  };

  // Handle save
  const handleSave = () => {
    const validationError = validateName(viewName);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newView: Omit<DataTableView, 'id' | 'createdAt' | 'updatedAt'> = {
      name: viewName.trim(),
      description: undefined,
      icon: undefined,
      isSystem: false,
      isDefault: false,
      filters: currentState.filters || { id: 'root', operator: 'AND', conditions: [] },
      sorting: currentState.sorting.length > 0 ? currentState.sorting : undefined,
      columnVisibility:
        Object.keys(currentState.columnVisibility).length > 0
          ? currentState.columnVisibility
          : undefined,
      pinnedColumns: currentState.columnPinning &&
        ((currentState.columnPinning.left?.length ?? 0) > 0 ||
          (currentState.columnPinning.right?.length ?? 0) > 0)
        ? {
            left: currentState.columnPinning.left ?? [],
            right: currentState.columnPinning.right ?? [],
          }
        : undefined,
      grouping:
        currentState.grouping && currentState.grouping.length > 0
          ? currentState.grouping
          : undefined,
    };

    onSave(newView);
    onOpenChange(false);
  };

  const isValid = !error && viewName.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <div className="flex items-start justify-between">
          <div>
            <DialogTitle>{t.title}</DialogTitle>
          </div>
          <DialogClose />
        </div>

        <div className="mt-6 space-y-4">
          {/* Form */}
          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="view-name">{t.nameLabel}</Label>
              <Input
                id="view-name"
                value={viewName}
                onChange={handleNameChange}
                placeholder={t.namePlaceholder}
                autoFocus
                maxLength={50}
                className={error ? 'border-negative' : ''}
              />
              {error && <p className="text-sm text-negative">{error}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {t.save}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
