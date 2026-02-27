import { Skeleton } from '../../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { cn } from '../../../lib/utils';
import { dataTableVariants } from './data-table.styles';

export interface DataTableSkeletonProps {
  /** Number of rows to display. Default: 6 */
  rows?: number;
  /** Number of columns to display. Default: 3 */
  columns?: number;
  /** Visual variant. Default: 'lined' */
  variant?: 'default' | 'lined' | 'striped' | 'editable' | 'spreadsheet';
  /** Row density. Default: 'default' */
  density?: 'compact' | 'default' | 'comfortable';
  /** Show table header. Default: true */
  showHeader?: boolean;
  /** Show selection checkbox column. Default: false */
  showSelection?: boolean;
  /** Show actions column. Default: false */
  showActions?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * DataTableSkeleton - Loading skeleton for DataTable component
 *
 * Displays a skeleton loader with configurable rows, columns, and styling
 * that matches the DataTable component's variants and density options.
 *
 * @example
 * ```tsx
 * // Auto-configured by DataTable
 * <DataTable data={users} isLoading={isLoading} />
 *
 * // Standalone usage
 * <DataTableSkeleton
 *   rows={10}
 *   columns={5}
 *   variant="striped"
 *   showSelection
 * />
 * ```
 */
export function DataTableSkeleton({
  rows = 6,
  columns = 3,
  variant = 'lined',
  density = 'default',
  showHeader = true,
  showSelection = false,
  showActions = false,
  className,
}: DataTableSkeletonProps) {
  // Column widths for visual variety (more realistic)
  const getColumnWidth = (index: number, total: number): string => {
    if (total === 1) return 'w-full';
    if (index === 0) return 'w-[35%]';
    if (index === 1) return 'w-[30%]';
    if (index === 2) return 'w-[25%]';
    return 'w-[20%]';
  };

  return (
    <output
      aria-busy="true"
      aria-label="Loading table data"
      className={cn('rounded-md border', className)}
    >
      <Table className={cn(dataTableVariants({ variant, density }))}>
        {showHeader && (
          <TableHeader>
            <TableRow>
              {showSelection && (
                <TableHead className="w-[40px]">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                </TableHead>
              )}
              {Array.from({ length: columns }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows, no reordering
                <TableHead key={`header-${i}`} className={getColumnWidth(i, columns)}>
                  <Skeleton className="h-4 w-3/4" />
                </TableHead>
              ))}
              {showActions && (
                <TableHead className="w-[60px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }, (_, rowIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows, no reordering
            <TableRow key={`row-${rowIndex}`}>
              {showSelection && (
                <TableCell>
                  <Skeleton className="h-4 w-4 rounded-sm" />
                </TableCell>
              )}
              {Array.from({ length: columns }, (_, colIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cells, no reordering
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton
                    className={cn('h-4', getColumnWidth(colIndex, columns))}
                    style={{
                      width: `${Math.random() * 20 + 60}%`, // 60-80% variable width
                    }}
                  />
                </TableCell>
              ))}
              {showActions && (
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </output>
  );
}
