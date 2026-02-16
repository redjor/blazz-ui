import { cva } from 'class-variance-authority';

/**
 * Shared CSS class string for editable/spreadsheet-style tables.
 *
 * Can be used standalone with raw `<Table>` (outside of DataTable) by applying
 * this to the `<Table className>`. Wrap the table in a
 * `<div className="overflow-hidden rounded-lg border border-edge">` for the
 * outer frame.
 *
 * @example
 * ```tsx
 * import { editableTableStyles } from '@/components/features/data-table';
 *
 * <div className="overflow-hidden rounded-lg border border-edge">
 *   <Table className={editableTableStyles}>
 *     ...
 *   </Table>
 * </div>
 * ```
 */
export const editableTableStyles = [
  // Vertical borders between columns
  '[&_th]:border-r [&_th:last-child]:border-r-0',
  '[&_td]:border-r [&_td:last-child]:border-r-0',
  // Cells: zero padding — inputs fill the entire cell
  '[&_td]:!p-0',
  // Inputs: borderless, square corners, flush with cell
  '[&_[data-slot=input]]:border-0 [&_[data-slot=input]]:rounded-none [&_[data-slot=input]]:shadow-none [&_[data-slot=input]]:h-8',
  '[&_[data-slot=input]]:focus-visible:ring-0 [&_[data-slot=input]]:focus-visible:bg-raised/60',
  '[&_[data-slot=input][aria-invalid=true]]:bg-negative/10',
  // Select triggers: borderless, square corners, flush with cell
  '[&_[data-slot=select-trigger]]:border-0 [&_[data-slot=select-trigger]]:rounded-none [&_[data-slot=select-trigger]]:shadow-none',
  '[&_[data-slot=select-trigger]]:h-8 [&_[data-slot=select-trigger]]:w-full',
  '[&_[data-slot=select-trigger]]:focus-visible:ring-0 [&_[data-slot=select-trigger]]:hover:bg-raised/60',
].join(' ');

export const dataTableVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'border-collapse',
      lined: '[&_tr]:border-b [&_tr]:border-edge',
      striped: '[&_tbody_tr:nth-child(even)]:bg-raised/50',
      editable: `[&_tr]:border-b [&_tr]:border-edge ${editableTableStyles}`,
      spreadsheet: [
        'table-fixed',
        '[&_tr]:border-b [&_tr]:border-edge',
        '[&_th]:border-r [&_th:last-child]:border-r-0',
        '[&_td]:border-r [&_td:last-child]:border-r-0',
        // tbody_td = higher specificity than density's [&_td] — forces zero padding
        // Padding is on the cell content (button/input/span) so the ring is flush
        '[&_tbody_td]:!px-0 [&_tbody_td]:!py-0',
        '[&_th]:bg-raised/50',
      ].join(' '),
    },
    density: {
      compact: '[&_td]:!py-1.5 [&_th]:!py-1.5 [&_td]:!px-3 [&_th]:!px-3',
      default: '[&_td]:!py-3 [&_th]:!py-2 [&_td]:!px-3 [&_th]:!px-3',
      comfortable: '[&_td]:!py-4 [&_th]:!py-4 [&_td]:!px-4 [&_th]:!px-4',
    },
  },
  defaultVariants: {
    variant: 'lined',
    density: 'default',
  },
});
