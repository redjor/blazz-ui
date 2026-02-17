'use client';

import * as React from 'react';
import { DataTable } from '@/components/features/data-table/data-table';
import { col } from '@/components/features/data-table/factories/col';
import { ExpandedRowGrid } from '@/components/features/data-table/cells/expanded-row-grid';
import { ExpandedRowTabs } from '@/components/features/data-table/cells/expanded-row-tabs';
import { createCompaniesPreset } from '@/components/features/data-table/presets/crm-companies';
import { createContactsPreset } from '@/components/features/data-table/presets/crm-contacts';
import { createDealsPreset } from '@/components/features/data-table/presets/crm-deals';
import { createQuotesPreset } from '@/components/features/data-table/presets/crm-quotes';
import { createProductsPreset } from '@/components/features/data-table/presets/crm-products';
import { createEditableDealsPreset } from '@/components/features/data-table/presets/crm-deals-editable';
import { createLinearIssuesPreset } from '@/components/features/data-table/presets/linear-issues';
import type { Deal } from '@/lib/sample-data';
import type { DataTableColumnDef } from '@/components/features/data-table/data-table.types';
import {
  companies,
  contacts,
  deals,
  quotes,
  products,
} from '@/lib/sample-data';
import { linearIssues } from '@/lib/linear-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocPage } from '@/components/features/docs/doc-page';
import { DocSection } from '@/components/features/docs/doc-section';
import { DocHero } from '@/components/features/docs/doc-hero';
import { DocExampleSync as DocExample } from '@/components/features/docs/doc-example-client';
import { DocPropsTable, type DocPropGroup } from '@/components/features/docs/doc-props-table';
import { DocRelated } from '@/components/features/docs/doc-related';

/* ─── TOC ─── */

const toc = [
  { id: 'col-namespace', title: 'col.* Namespace' },
  { id: 'define-preset', title: 'definePreset()' },
  { id: 'column-pinning', title: 'Column Pinning' },
  { id: 'row-expand', title: 'Row Expand' },
  { id: 'grouping', title: 'Grouping & Aggregations' },
  { id: 'inline-editing', title: 'Inline Editing' },
  { id: 'crm-presets', title: 'CRM Presets' },
  { id: 'linear-preset', title: 'Linear Issues' },
  { id: 'props', title: 'Props' },
  { id: 'available-presets', title: 'Available Presets' },
  { id: 'best-practices', title: 'Best Practices' },
  { id: 'related', title: 'Related' },
];

/* ─── Stage status map (reused across examples) ─── */

const stageStatusMap = {
  lead: { variant: 'secondary' as const, label: 'Lead' },
  qualified: { variant: 'info' as const, label: 'Qualifié' },
  proposal: { variant: 'warning' as const, label: 'Proposition' },
  negotiation: { variant: 'primary' as const, label: 'Négociation' },
  closed_won: { variant: 'success' as const, label: 'Gagné' },
  closed_lost: { variant: 'destructive' as const, label: 'Perdu' },
};

/* ─── Props definition (grouped) ─── */

const propGroups: DocPropGroup[] = [
  {
    title: 'Core',
    props: [
      { name: 'data', type: 'TData[]', description: 'Array of data objects to display.', required: true },
      { name: 'columns', type: 'DataTableColumnDef<TData>[]', description: 'Column definitions — use col.* builders.', required: true },
      { name: 'getRowId', type: '(row: TData) => string', description: 'Custom row ID accessor. Required for editing & selection persistence.' },
      { name: 'variant', type: '"default" | "lined" | "striped" | "editable" | "spreadsheet"', default: '"lined"', description: 'Visual style variant.' },
      { name: 'density', type: '"compact" | "default" | "comfortable"', default: '"default"', description: 'Row spacing density.' },
      { name: 'locale', type: '"fr" | "en"', default: '"en"', description: 'Locale for i18n (labels, formats).' },
      { name: 'className', type: 'string', description: 'Additional CSS classes on the wrapper.' },
    ],
  },
  {
    title: 'Search & Filtering',
    props: [
      { name: 'enableGlobalSearch', type: 'boolean', default: 'true', description: 'Enable global search input.' },
      { name: 'searchPlaceholder', type: 'string', description: 'Placeholder text for search input.' },
      { name: 'onSearchChange', type: '(search: string) => void', description: 'Callback when search value changes.' },
      { name: 'enableAdvancedFilters', type: 'boolean', default: 'false', description: 'Enable advanced filter builder with AND/OR logic.' },
      { name: 'defaultFilterGroup', type: 'FilterGroup', description: 'Default filter group configuration.' },
      { name: 'onFilterGroupChange', type: '(group: FilterGroup | null) => void', description: 'Callback when filter group changes.' },
      { name: 'combineSearchAndFilters', type: 'boolean', description: 'Single button toggles both search and inline filters.' },
    ],
  },
  {
    title: 'Sorting',
    props: [
      { name: 'enableSorting', type: 'boolean', default: 'true', description: 'Enable column sorting.' },
      { name: 'enableMultiSort', type: 'boolean', description: 'Enable multi-column sorting.' },
      { name: 'defaultSorting', type: 'SortingState', description: 'Default sorting configuration.' },
      { name: 'onSortingChange', type: '(sorting: SortingState) => void', description: 'Callback when sorting changes.' },
    ],
  },
  {
    title: 'Column Pinning',
    props: [
      { name: 'enableColumnPinning', type: 'boolean', description: 'Enable sticky left/right columns.' },
      { name: 'defaultColumnPinning', type: '{ left?: string[]; right?: string[] }', description: 'Columns pinned by default.' },
      { name: 'onColumnPinningChange', type: '(pinning) => void', description: 'Callback when pinning changes.' },
    ],
  },
  {
    title: 'Row Expand',
    props: [
      { name: 'enableRowExpand', type: 'boolean', description: 'Enable expandable row detail panel.' },
      { name: 'renderExpandedRow', type: '(row: Row<TData>) => ReactNode', description: 'Render function for the expanded panel.' },
      { name: 'expandMode', type: '"single" | "multiple"', description: 'Accordion (single) or multi-expand.' },
      { name: 'defaultExpanded', type: 'boolean | string[]', description: 'Default expanded state (false, true, or row IDs).' },
    ],
  },
  {
    title: 'Grouping & Aggregations',
    props: [
      { name: 'enableGrouping', type: 'boolean', description: 'Enable row grouping by column values.' },
      { name: 'defaultGrouping', type: 'string[]', description: 'Columns to group by on mount.' },
      { name: 'onGroupingChange', type: '(grouping: string[]) => void', description: 'Callback when grouping changes.' },
      { name: 'groupAggregations', type: 'Record<string, AggregationType>', description: 'Aggregation per column: "sum", "avg", "min", "max", "count".' },
    ],
  },
  {
    title: 'Cell Editing',
    props: [
      { name: 'enableCellEditing', type: 'boolean', description: 'Enable cell focus, keyboard nav, and edit mode.' },
      { name: 'onCellEdit', type: '(rowId, columnId, value, previousValue) => void', description: 'Callback on cell change (also used by undo/redo).' },
      { name: 'editHistorySize', type: 'number', default: '50', description: 'Max entries in the undo/redo stack.' },
    ],
  },
  {
    title: 'Selection & Actions',
    props: [
      { name: 'enableRowSelection', type: 'boolean', default: 'false', description: 'Enable row selection with checkboxes.' },
      { name: 'onRowSelectionChange', type: '(selection) => void', description: 'Callback when selection changes.' },
      { name: 'rowActions', type: 'RowAction<TData>[]', description: 'Per-row dropdown actions (view, edit, delete, ...).' },
      { name: 'bulkActions', type: 'BulkAction<TData>[]', description: 'Actions for multiple selected rows.' },
      { name: 'onRowClick', type: '(row: TData) => void', description: 'Callback when a row is clicked.' },
    ],
  },
  {
    title: 'Views',
    props: [
      { name: 'views', type: 'DataTableView[]', description: 'Predefined views (filters + sorting presets).' },
      { name: 'activeView', type: 'DataTableView | null', description: 'Currently active view.' },
      { name: 'onViewChange', type: '(view: DataTableView) => void', description: 'Callback when view changes.' },
      { name: 'enableCustomViews', type: 'boolean', default: 'false', description: 'Allow users to create and save custom views.' },
      { name: 'onViewSave', type: '(view: DataTableView) => void', description: 'Callback when user saves a view.' },
      { name: 'onViewUpdate', type: '(viewId, updates) => void', description: 'Callback when user updates a view.' },
      { name: 'onViewDelete', type: '(viewId: string) => void', description: 'Callback when user deletes a view.' },
    ],
  },
  {
    title: 'Pagination',
    props: [
      { name: 'enablePagination', type: 'boolean', default: 'true', description: 'Enable pagination controls.' },
      { name: 'pagination', type: 'PaginationConfig', description: 'Pagination config (pageSize, pageSizeOptions).' },
      { name: 'onPaginationChange', type: '(pagination) => void', description: 'Callback when pagination changes.' },
    ],
  },
  {
    title: 'Loading States',
    props: [
      { name: 'isLoading', type: 'boolean', description: 'Show loading skeleton state.' },
      { name: 'loadingComponent', type: 'ReactNode', description: 'Custom loading component.' },
      { name: 'emptyComponent', type: 'ReactNode', description: 'Custom empty state component.' },
      { name: 'hideToolbar', type: 'boolean', description: 'Hide the toolbar (search, filters, views).' },
      { name: 'hideHeaders', type: 'boolean', description: 'Hide column headers.' },
      { name: 'defaultColumnVisibility', type: 'Record<string, boolean>', description: 'Default column visibility.' },
    ],
  },
];

/* ─── Component ─── */

export default function DataTablePage() {
  // ── Hero columns ──
  const heroColumns: DataTableColumnDef<Deal>[] = [
    col.text<Deal>('title', { title: 'Opportunité' }),
    col.text<Deal>('companyName', { title: 'Entreprise' }),
    col.currency<Deal>('amount', { title: 'Montant', currency: 'EUR', locale: 'fr-FR' }),
    col.numeric<Deal>('probability', { title: 'Prob.', formatter: (v) => `${v}%`, align: 'right' }),
    col.status<Deal>('stage', { title: 'Étape', statusMap: stageStatusMap }),
    col.date<Deal>('expectedCloseDate', { title: 'Clôture', locale: 'fr-FR' }),
  ];

  // ── Column pinning columns (wider set) ──
  const pinningColumns: DataTableColumnDef<Deal>[] = [
    col.text<Deal>('title', { title: 'Opportunité' }),
    col.text<Deal>('companyName', { title: 'Entreprise' }),
    col.text<Deal>('contactName', { title: 'Contact' }),
    col.currency<Deal>('amount', { title: 'Montant', currency: 'EUR', locale: 'fr-FR' }),
    col.numeric<Deal>('probability', { title: 'Prob.', formatter: (v) => `${v}%`, align: 'right' }),
    col.select<Deal>('source', {
      title: 'Source',
      options: [
        { label: 'Website', value: 'Website' },
        { label: 'Referral', value: 'Referral' },
        { label: 'LinkedIn', value: 'LinkedIn' },
      ],
    }),
    col.text<Deal>('assignedTo', { title: 'Responsable' }),
    col.date<Deal>('expectedCloseDate', { title: 'Clôture', locale: 'fr-FR' }),
    col.status<Deal>('stage', { title: 'Étape', statusMap: stageStatusMap }),
  ];

  // ── CRM Presets ──
  const companiesPreset = createCompaniesPreset({
    onView: (c) => console.log('View company:', c.id),
    onEdit: (c) => console.log('Edit company:', c.id),
  });

  const contactsPreset = createContactsPreset({
    onView: (c) => console.log('View contact:', c.id),
    onEdit: (c) => console.log('Edit contact:', c.id),
  });

  const dealsPreset = createDealsPreset({
    onView: (d) => console.log('View deal:', d.id),
    onEdit: (d) => console.log('Edit deal:', d.id),
  });

  const quotesPreset = createQuotesPreset({
    onView: (q) => console.log('View quote:', q.id),
    onPrint: (q) => console.log('Print quote:', q.id),
  });

  const productsPreset = createProductsPreset({
    onEdit: (p) => console.log('Edit product:', p.id),
    onDuplicate: (p) => console.log('Duplicate product:', p.id),
  });

  // ── Linear Issues ──
  const linearPreset = createLinearIssuesPreset({
    onView: (i) => console.log('View issue:', i.id),
    onEdit: (i) => console.log('Edit issue:', i.id),
  });

  // ── Editable deals ──
  const [editableDeals, setEditableDeals] = React.useState(deals.slice(0, 8));

  const handleCellEdit = React.useCallback((rowId: string, columnId: string, value: unknown) => {
    setEditableDeals((prev) =>
      prev.map((deal) =>
        deal.id === rowId ? { ...deal, [columnId]: value } : deal
      )
    );
  }, []);

  const editablePreset = React.useMemo(
    () => createEditableDealsPreset({ onCellEdit: handleCellEdit }),
    [handleCellEdit]
  );

  return (
    <DocPage
      title="Data Table"
      subtitle="Enterprise-grade data table with col.* column builders, typed presets, column pinning, row expand, grouping with aggregations, and inline cell editing. Built on TanStack Table v8."
      toc={toc}
    >
      {/* ── Hero ── */}
      <DocHero className="p-0 overflow-hidden">
        <DataTable
          data={deals.slice(0, 8)}
          columns={heroColumns}
          getRowId={(row) => row.id}
          enableSorting
          enablePagination
          locale="fr"
          pagination={{ pageSize: 8 }}
        />
      </DocHero>

      {/* ── col.* Namespace ── */}
      <DocSection id="col-namespace" title="col.* Namespace">
        <p className="text-sm text-fg-muted">
          The <code className="text-xs bg-raised px-1.5 py-0.5 rounded">col</code> namespace
          replaces verbose <code className="text-xs bg-raised px-1.5 py-0.5 rounded">createXxxColumn()</code> calls
          with a concise, discoverable API. Titles are auto-derived from accessor keys
          (<code className="text-xs bg-raised px-1.5 py-0.5 rounded">companyName</code> {'->'} "Company Name").
        </p>

        <DocExample
          title="Before / After"
          description="Verbose factory vs concise col.* shorthand."
          code={`// Before — verbose
createTextColumn<Deal>({ accessorKey: "title", title: "Title", showInlineFilter: true })
createCurrencyColumn<Deal>({ accessorKey: "amount", title: "Amount", currency: "EUR" })
createStatusColumn<Deal>({ accessorKey: "stage", title: "Stage", statusMap: { ... } })

// After — col.*
col.text<Deal>("title", { showInlineFilter: true })
col.currency<Deal>("amount", { currency: "EUR" })
col.status<Deal>("stage", { statusMap: { ... } })`}
        >
          <DataTable
            data={deals.slice(0, 4)}
            columns={[
              col.text<Deal>('title', { title: 'Opportunité' }),
              col.currency<Deal>('amount', { title: 'Montant', currency: 'EUR', locale: 'fr-FR' }),
              col.status<Deal>('stage', { title: 'Étape', statusMap: stageStatusMap }),
            ]}
            enablePagination={false}
            enableSorting={false}
            locale="fr"
          />
        </DocExample>

        <DocExample
          title="Complete Example"
          description="A full column array mixing text, currency, numeric, status, date, and select types."
          code={`import { col } from "@/components/features/data-table/factories/col"

const columns: DataTableColumnDef<Deal>[] = [
  col.text<Deal>("title", { title: "Opportunité", showInlineFilter: true }),
  col.text<Deal>("companyName", { title: "Entreprise" }),
  col.currency<Deal>("amount", { title: "Montant", currency: "EUR", locale: "fr-FR" }),
  col.numeric<Deal>("probability", { title: "Prob.", formatter: (v) => \`\${v}%\`, align: "right" }),
  col.status<Deal>("stage", { title: "Étape", statusMap: stageStatusMap }),
  col.date<Deal>("expectedCloseDate", { title: "Clôture", locale: "fr-FR" }),
]

<DataTable data={deals} columns={columns} enableSorting enablePagination locale="fr" />`}
        >
          <DataTable
            data={deals.slice(0, 6)}
            columns={heroColumns}
            getRowId={(row) => row.id}
            enableSorting
            enablePagination={false}
            locale="fr"
          />
        </DocExample>

        {/* Method reference grid */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-fg mb-3">28 Available Methods</h3>
          <div className="grid gap-px bg-edge rounded-lg overflow-hidden md:grid-cols-2">
            {[
              { name: 'col.text()', desc: 'Plain text with optional filter' },
              { name: 'col.status()', desc: 'Status badge with statusMap' },
              { name: 'col.numeric()', desc: 'Number with optional formatter' },
              { name: 'col.currency()', desc: 'Locale-aware currency formatting' },
              { name: 'col.date()', desc: 'Locale-aware date formatting' },
              { name: 'col.relativeDate()', desc: '"3h ago" with tooltip' },
              { name: 'col.select()', desc: 'Dropdown filter with options' },
              { name: 'col.imageText()', desc: 'Image + text combo' },
              { name: 'col.tags()', desc: 'Array of inline badges' },
              { name: 'col.validation()', desc: 'Computed icon + tooltip' },
              { name: 'col.progress()', desc: 'Progress bar (0-100)' },
              { name: 'col.rating()', desc: 'Stars or dots' },
              { name: 'col.link()', desc: 'Clickable URL / email / phone' },
              { name: 'col.boolean()', desc: 'Checkbox, badge, or icon' },
              { name: 'col.avatarGroup()', desc: 'Overlapping circular avatars' },
              { name: 'col.user()', desc: 'Avatar + name + subtitle' },
              { name: 'col.duration()', desc: 'Human-readable durations' },
              { name: 'col.colorDot()', desc: 'Colored dot + label' },
              { name: 'col.image()', desc: 'Image thumbnail' },
              { name: 'col.sparkline()', desc: 'Inline SVG chart' },
              { name: 'col.twoLines()', desc: 'Primary + muted subtitle' },
              { name: 'col.keyValue()', desc: '"label: value" inline' },
              { name: 'col.editableText()', desc: 'Editable text cell' },
              { name: 'col.editableNumber()', desc: 'Editable number cell' },
              { name: 'col.editableCurrency()', desc: 'Editable currency cell' },
              { name: 'col.editableSelect()', desc: 'Editable select cell' },
              { name: 'col.editableDate()', desc: 'Editable date cell' },
              { name: 'col.selection()', desc: 'Row selection checkbox' },
            ].map((m) => (
              <div key={m.name} className="flex items-baseline gap-2 bg-surface px-3 py-2">
                <code className="text-xs font-semibold text-fg whitespace-nowrap">{m.name}</code>
                <span className="text-xs text-fg-muted">{m.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </DocSection>

      {/* ── definePreset() ── */}
      <DocSection id="define-preset" title="definePreset()">
        <p className="text-sm text-fg-muted">
          Build a typed preset object that you spread into <code className="text-xs bg-raised px-1.5 py-0.5 rounded">{'<DataTable />'}</code>.
          The preset contains everything except <code className="text-xs bg-raised px-1.5 py-0.5 rounded">data</code>.
        </p>
        <DocExample
          title="Typed Preset Builder"
          description="definePreset returns a fully typed config object you spread into DataTable."
          code={`import { definePreset } from "@/components/features/data-table/factories/preset-builder"
import { col } from "@/components/features/data-table/factories/col"

const dealsPreset = definePreset<Deal>({
  columns: [
    col.text("title", { title: "Opportunité" }),
    col.currency("amount", { currency: "EUR", locale: "fr-FR" }),
    col.status("stage", { statusMap: stageStatusMap }),
  ],
  enableSorting: true,
  enablePagination: true,
  enableRowSelection: true,
  locale: "fr",
  pagination: { pageSize: 10 },
})

// Spread into DataTable — only \`data\` is needed
<DataTable {...dealsPreset} data={deals} />`}
        >
          <DataTable
            data={deals.slice(0, 5)}
            columns={[
              col.text<Deal>('title', { title: 'Opportunité' }),
              col.currency<Deal>('amount', { title: 'Montant', currency: 'EUR', locale: 'fr-FR' }),
              col.status<Deal>('stage', { title: 'Étape', statusMap: stageStatusMap }),
            ]}
            enableSorting
            enablePagination={false}
            enableRowSelection
            locale="fr"
          />
        </DocExample>
      </DocSection>

      {/* ── Column Pinning ── */}
      <DocSection id="column-pinning" title="Column Pinning">
        <p className="text-sm text-fg-muted">
          Pin columns to the left or right edge so they stay visible during horizontal scroll.
          Useful when tables have many columns.
        </p>
        <DocExample
          title="Sticky Left & Right Columns"
          description="Title pinned left, Stage pinned right. Scroll horizontally to see them stick."
          code={`<DataTable
  data={deals}
  columns={columns} // 9 columns — forces horizontal scroll
  enableColumnPinning
  defaultColumnPinning={{ left: ["title"], right: ["stage"] }}
  enablePagination={false}
/>`}
        >
          <div className="max-w-full overflow-hidden">
            <DataTable
              data={deals.slice(0, 6)}
              columns={pinningColumns}
              getRowId={(row) => row.id}
              enableColumnPinning
              defaultColumnPinning={{ left: ['title'], right: ['stage'] }}
              enableSorting
              enablePagination={false}
              locale="fr"
            />
          </div>
        </DocExample>
      </DocSection>

      {/* ── Row Expand ── */}
      <DocSection id="row-expand" title="Row Expand">
        <p className="text-sm text-fg-muted">
          Expand rows to reveal detail panels. Use <code className="text-xs bg-raised px-1.5 py-0.5 rounded">ExpandedRowGrid</code> for
          a quick key-value layout or <code className="text-xs bg-raised px-1.5 py-0.5 rounded">ExpandedRowTabs</code> for tabbed content.
        </p>

        <DocExample
          title="Single Expand with Grid"
          description="Accordion mode — only one row open at a time. ExpandedRowGrid shows deal details in a 3-column grid."
          code={`import { ExpandedRowGrid } from "@/components/features/data-table/cells/expanded-row-grid"

<DataTable
  data={deals}
  columns={[col.expand(), ...columns]}
  enableRowExpand
  expandMode="single"
  renderExpandedRow={(row) => (
    <ExpandedRowGrid
      columns={3}
      items={[
        { label: "Entreprise", value: row.original.companyName },
        { label: "Contact", value: row.original.contactName },
        { label: "Source", value: row.original.source },
        { label: "Responsable", value: row.original.assignedTo },
        { label: "Clôture prévue", value: row.original.expectedCloseDate },
        { label: "Créé le", value: row.original.createdAt },
      ]}
    />
  )}
/>`}
        >
          <DataTable
            data={deals.slice(0, 5)}
            columns={[
              col.expand<Deal>(),
              col.text<Deal>('title', { title: 'Opportunité' }),
              col.currency<Deal>('amount', { title: 'Montant', currency: 'EUR', locale: 'fr-FR' }),
              col.status<Deal>('stage', { title: 'Étape', statusMap: stageStatusMap }),
            ]}
            getRowId={(row) => row.id}
            enableRowExpand
            expandMode="single"
            renderExpandedRow={(row) => (
              <ExpandedRowGrid
                columns={3}
                items={[
                  { label: 'Entreprise', value: row.original.companyName },
                  { label: 'Contact', value: row.original.contactName },
                  { label: 'Source', value: row.original.source },
                  { label: 'Responsable', value: row.original.assignedTo },
                  { label: 'Clôture prévue', value: row.original.expectedCloseDate },
                  { label: 'Créé le', value: row.original.createdAt },
                ]}
              />
            )}
            enableSorting={false}
            enablePagination={false}
            locale="fr"
          />
        </DocExample>

        <DocExample
          title="Multiple Expand with Tabs"
          description="Multiple rows can be expanded simultaneously. ExpandedRowTabs renders tabbed content."
          code={`import { ExpandedRowTabs } from "@/components/features/data-table/cells/expanded-row-tabs"

<DataTable
  data={deals}
  columns={[col.expand(), ...columns]}
  enableRowExpand
  expandMode="multiple"
  renderExpandedRow={(row) => (
    <ExpandedRowTabs
      tabs={[
        { label: "Détails", value: "details", content: <ExpandedRowGrid ... /> },
        { label: "Historique", value: "history", content: <p>Timeline...</p> },
      ]}
    />
  )}
/>`}
        >
          <DataTable
            data={deals.slice(0, 4)}
            columns={[
              col.expand<Deal>(),
              col.text<Deal>('title', { title: 'Opportunité' }),
              col.currency<Deal>('amount', { title: 'Montant', currency: 'EUR', locale: 'fr-FR' }),
              col.status<Deal>('stage', { title: 'Étape', statusMap: stageStatusMap }),
            ]}
            getRowId={(row) => row.id}
            enableRowExpand
            expandMode="multiple"
            renderExpandedRow={(row) => (
              <ExpandedRowTabs
                tabs={[
                  {
                    label: 'Détails',
                    value: 'details',
                    content: (
                      <ExpandedRowGrid
                        columns={3}
                        items={[
                          { label: 'Entreprise', value: row.original.companyName },
                          { label: 'Contact', value: row.original.contactName },
                          { label: 'Source', value: row.original.source },
                        ]}
                      />
                    ),
                  },
                  {
                    label: 'Historique',
                    value: 'history',
                    content: <p className="text-sm text-fg-muted py-2">Timeline des activités...</p>,
                  },
                ]}
              />
            )}
            enableSorting={false}
            enablePagination={false}
            locale="fr"
          />
        </DocExample>
      </DocSection>

      {/* ── Grouping & Aggregations ── */}
      <DocSection id="grouping" title="Grouping & Aggregations">
        <p className="text-sm text-fg-muted">
          Group rows by column values and compute aggregations (sum, avg, min, max, count)
          on grouped header rows.
        </p>
        <DocExample
          title="Group by Stage"
          description="Deals grouped by stage with sum on amount and average on probability."
          code={`<DataTable
  data={deals}
  columns={columns}
  enableGrouping
  defaultGrouping={["stage"]}
  groupAggregations={{ amount: "sum", probability: "avg" }}
  enablePagination={false}
/>`}
        >
          <DataTable
            data={deals.slice(0, 15)}
            columns={[
              col.text<Deal>('title', { title: 'Opportunité' }),
              col.text<Deal>('companyName', { title: 'Entreprise' }),
              col.currency<Deal>('amount', { title: 'Montant', currency: 'EUR', locale: 'fr-FR' }),
              col.numeric<Deal>('probability', { title: 'Prob.', formatter: (v) => `${v}%`, align: 'right' }),
              col.status<Deal>('stage', { title: 'Étape', statusMap: stageStatusMap }),
            ]}
            getRowId={(row) => row.id}
            enableGrouping
            defaultGrouping={['stage']}
            groupAggregations={{ amount: 'sum', probability: 'avg' }}
            enableSorting
            enablePagination={false}
            locale="fr"
          />
        </DocExample>
      </DocSection>

      {/* ── Inline Editing ── */}
      <DocSection id="inline-editing" title="Inline Editing">
        <p className="text-sm text-fg-muted">
          Turn any table into a spreadsheet-like editor with <code className="text-xs bg-raised px-1.5 py-0.5 rounded">col.editable*()</code> columns,
          keyboard navigation, and undo/redo history.
        </p>
        <DocExample
          title="Editable Deals"
          description="Click a cell to focus, press Enter or F2 to edit, Tab/Arrow keys to navigate. Undo with Ctrl+Z."
          code={`import { createEditableDealsPreset } from "@/components/features/data-table/presets/crm-deals-editable"

const [editableDeals, setEditableDeals] = useState(deals)

const handleCellEdit = useCallback((rowId, columnId, value) => {
  setEditableDeals((prev) => prev.map((d) => d.id === rowId ? { ...d, [columnId]: value } : d))
}, [])

const preset = useMemo(
  () => createEditableDealsPreset({ onCellEdit: handleCellEdit }),
  [handleCellEdit]
)

<DataTable
  data={editableDeals}
  columns={preset.columns}
  getRowId={(row) => row.id}
  enableCellEditing
  variant="spreadsheet"
  locale="fr"
/>`}
        >
          <DataTable
            data={editableDeals}
            columns={editablePreset.columns}
            getRowId={(row) => row.id}
            enableCellEditing
            enableSorting
            enablePagination={false}
            locale="fr"
            variant="spreadsheet"
          />
        </DocExample>

        {/* Keyboard shortcuts reference */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-fg mb-2">Keyboard Shortcuts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge">
                  <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">Key</th>
                  <th className="py-2 text-left text-xs font-semibold uppercase tracking-wider text-fg-muted">Action</th>
                </tr>
              </thead>
              <tbody className="text-fg-muted">
                {[
                  ['Arrow keys', 'Navigate between cells'],
                  ['Tab / Shift+Tab', 'Move to next / previous cell'],
                  ['Enter / F2', 'Enter edit mode on focused cell'],
                  ['Escape', 'Cancel edit, return to navigation'],
                  ['Ctrl+Z', 'Undo last edit'],
                  ['Ctrl+Shift+Z', 'Redo'],
                ].map(([key, action]) => (
                  <tr key={key} className="border-b border-edge last:border-0">
                    <td className="py-2 pr-4">
                      <kbd className="rounded bg-raised px-1.5 py-0.5 text-xs font-mono text-fg">{key}</kbd>
                    </td>
                    <td className="py-2 text-xs">{action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DocSection>

      {/* ── CRM Presets ── */}
      <DocSection id="crm-presets" title="CRM Presets">
        <p className="text-sm text-fg-muted">
          Domain-specific presets for Forge CRM. Each preset provides columns, views, row actions, and bulk actions
          tailored to the domain — all built with <code className="text-xs bg-raised px-1.5 py-0.5 rounded">col.*</code>.
        </p>
        <Tabs defaultValue="companies" className="w-full">
          <TabsList>
            <TabsTrigger value="companies">Entreprises</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="quotes">Devis</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
          </TabsList>
          <TabsContent value="companies" className="mt-4">
            <DataTable
              data={companies.slice(0, 15)}
              columns={companiesPreset.columns}
              views={companiesPreset.views}
              rowActions={companiesPreset.rowActions}
              bulkActions={companiesPreset.bulkActions}
              getRowId={(row) => row.id}
              enableSorting
              enablePagination
              enableRowSelection
              enableGlobalSearch
              enableAdvancedFilters
              enableCustomViews
              combineSearchAndFilters
              searchPlaceholder="Rechercher..."
              locale="fr"
              variant="lined"
              pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
            />
          </TabsContent>
          <TabsContent value="contacts" className="mt-4">
            <DataTable
              data={contacts.slice(0, 15)}
              columns={contactsPreset.columns}
              views={contactsPreset.views}
              rowActions={contactsPreset.rowActions}
              getRowId={(row) => row.id}
              enableSorting
              enablePagination
              enableRowSelection
              enableGlobalSearch
              enableAdvancedFilters
              enableCustomViews
              combineSearchAndFilters
              searchPlaceholder="Rechercher..."
              locale="fr"
              variant="lined"
              pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
            />
          </TabsContent>
          <TabsContent value="deals" className="mt-4">
            <DataTable
              data={deals.slice(0, 15)}
              columns={dealsPreset.columns}
              views={dealsPreset.views}
              rowActions={dealsPreset.rowActions}
              bulkActions={dealsPreset.bulkActions}
              getRowId={(row) => row.id}
              enableSorting
              enablePagination
              enableRowSelection
              enableGlobalSearch
              enableAdvancedFilters
              enableCustomViews
              combineSearchAndFilters
              searchPlaceholder="Rechercher..."
              locale="fr"
              variant="lined"
              pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
            />
          </TabsContent>
          <TabsContent value="quotes" className="mt-4">
            <DataTable
              data={quotes}
              columns={quotesPreset.columns}
              views={quotesPreset.views}
              rowActions={quotesPreset.rowActions}
              getRowId={(row) => row.id}
              enableSorting
              enablePagination
              enableGlobalSearch
              enableAdvancedFilters
              enableCustomViews
              combineSearchAndFilters
              searchPlaceholder="Rechercher..."
              locale="fr"
              variant="lined"
              pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
            />
          </TabsContent>
          <TabsContent value="products" className="mt-4">
            <DataTable
              data={products}
              columns={productsPreset.columns}
              views={productsPreset.views}
              rowActions={productsPreset.rowActions}
              getRowId={(row) => row.id}
              enableSorting
              enablePagination
              enableGlobalSearch
              enableAdvancedFilters
              enableCustomViews
              combineSearchAndFilters
              searchPlaceholder="Rechercher..."
              locale="fr"
              variant="lined"
              pagination={{ pageSize: 10, pageSizeOptions: [5, 10, 25] }}
            />
          </TabsContent>
        </Tabs>
      </DocSection>

      {/* ── Linear Issues ── */}
      <DocSection id="linear-preset" title="Linear Issues">
        <p className="text-sm text-fg-muted">
          A Linear-style issue tracker preset with compact rows, colored priority bars, status dots,
          label dot-badges, and grouping by status. Designed for a minimal, dense list view.
        </p>
        <DocExample
          title="Linear Issue Tracker"
          description="Grouped by status with collapsible headers. Compact density, hidden column headers, no pagination."
          code={`import { createLinearIssuesPreset } from "@/components/features/data-table/presets/linear-issues"
import { linearIssues } from "@/lib/linear-data"

const preset = createLinearIssuesPreset({
  onView: (issue) => console.log("View:", issue.identifier),
  onEdit: (issue) => console.log("Edit:", issue.identifier),
})

<DataTable
  data={linearIssues}
  columns={preset.columns}
  views={preset.views}
  rowActions={preset.rowActions}
  getRowId={(row) => row.id}
  variant="lined"
  density="compact"
  hideHeaders
  enableGrouping
  defaultGrouping={["status"]}
  enablePagination={false}
  enableSorting
  enableRowSelection
  enableGlobalSearch
  combineSearchAndFilters
  searchPlaceholder="Rechercher..."
  locale="fr"
/>`}
        >
          <DataTable
            data={linearIssues}
            columns={linearPreset.columns}
            views={linearPreset.views}
            rowActions={linearPreset.rowActions}
            getRowId={(row) => row.id}
            variant="lined"
            density="compact"
            hideHeaders
            enableGrouping
            defaultGrouping={['status']}
            enablePagination={false}
            enableSorting
            enableRowSelection
            enableGlobalSearch
            combineSearchAndFilters
            searchPlaceholder="Rechercher..."
            locale="fr"
          />
        </DocExample>
      </DocSection>

      {/* ── Props ── */}
      <DocSection id="props" title="Props">
        <DocPropsTable groups={propGroups} />
      </DocSection>

      {/* ── Available Presets ── */}
      <DocSection id="available-presets" title="Available Presets">
        <p className="text-sm text-fg-muted mb-4">
          15 presets provide pre-configured columns, views, and actions for common use cases:
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            { name: 'CRM Companies', fn: 'createCompaniesPreset()', desc: 'Company management with industry, revenue, and status views.' },
            { name: 'CRM Contacts', fn: 'createContactsPreset()', desc: 'Contact management with company links and primary badge.' },
            { name: 'CRM Deals', fn: 'createDealsPreset()', desc: 'Deal pipeline with stage badges, probability, and amount.' },
            { name: 'CRM Quotes', fn: 'createQuotesPreset()', desc: 'Quote management with duplicate, print, and delete actions.' },
            { name: 'CRM Products', fn: 'createProductsPreset()', desc: 'Product catalog with category filters and deactivation.' },
            { name: 'Editable Deals', fn: 'createEditableDealsPreset()', desc: 'Inline-editable deal table with text, number, and select cells.' },
            { name: 'TalentFlow Candidates', fn: 'createCandidatesPreset()', desc: 'ATS candidate tracking with skills tags and pipeline stages.' },
            { name: 'TalentFlow Jobs', fn: 'createJobsPreset()', desc: 'Job posting management with status and applicant counts.' },
            { name: 'StockBase Inventory', fn: 'createInventoryPreset()', desc: 'Inventory management with stock levels and reorder alerts.' },
            { name: 'StockBase Movements', fn: 'createMovementsPreset()', desc: 'Stock movement history with in/out tracking.' },
            { name: 'User Management', fn: 'createUserManagementPreset()', desc: 'User listing with status filtering and bulk operations.' },
            { name: 'Invitations', fn: 'createInvitationPreset()', desc: 'Invitation management with status tracking and resend.' },
            { name: 'Order Management', fn: 'createOrderManagementPreset()', desc: 'Order tracking with fulfillment and payment status.' },
            { name: 'Linear Issues', fn: 'createLinearIssuesPreset()', desc: 'Linear-style issue tracker with priority bars, status dots, and grouping.' },
            { name: 'Spreadsheet', fn: 'createSpreadsheetPreset()', desc: 'Generic Airtable-style editable table with typed columns.' },
          ].map((preset) => (
            <div key={preset.fn} className="border border-edge rounded-lg p-4">
              <h3 className="font-semibold text-sm mb-1">{preset.name}</h3>
              <code className="text-xs text-fg-muted">{preset.fn}</code>
              <p className="text-sm text-fg-muted mt-2">{preset.desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      {/* ── Best Practices ── */}
      <DocSection id="best-practices" title="Best Practices">
        <ul className="list-disc list-inside space-y-2 text-fg-muted text-sm">
          <li>Use <code className="text-xs bg-raised px-1 py-0.5 rounded">col.*</code> for all column definitions — titles auto-derive, types are enforced.</li>
          <li>Use <code className="text-xs bg-raised px-1 py-0.5 rounded">definePreset()</code> to build typed, reusable table configs.</li>
          <li>Always provide <code className="text-xs bg-raised px-1 py-0.5 rounded">getRowId</code> when using selection, editing, or expand — prevents re-render bugs.</li>
          <li>Pin identifier columns (name, title) left and status/action columns right for wide tables.</li>
          <li>Use <code className="text-xs bg-raised px-1 py-0.5 rounded">expandMode="single"</code> for detail panels to keep the page scannable.</li>
          <li>Combine grouping with aggregations to build mini-reports (sum totals, avg metrics).</li>
          <li>Use <code className="text-xs bg-raised px-1 py-0.5 rounded">variant="spreadsheet"</code> with <code className="text-xs bg-raised px-1 py-0.5 rounded">enableCellEditing</code> for the full editing experience.</li>
          <li>Enable pagination for datasets with more than 25 rows.</li>
          <li>Use views to save frequently used filter + sort combinations.</li>
          <li>Use appropriate density for your context: compact for dashboards, comfortable for detailed views.</li>
        </ul>
      </DocSection>

      {/* ── Related ── */}
      <DocSection id="related" title="Related">
        <DocRelated
          items={[
            { title: 'Cell Types', href: '/docs/components/ui/cells', description: '21 specialized cell renderers for DataTable columns.' },
            { title: 'Badge', href: '/docs/components/ui/badge', description: 'Status badges used by col.status() columns.' },
            { title: 'Avatar', href: '/docs/components/ui/avatar', description: 'User avatars used by col.user() and col.avatarGroup().' },
            { title: 'Table', href: '/docs/components/ui/table', description: 'Simple semantic HTML table for lighter use cases.' },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
