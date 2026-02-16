'use client';

export interface CellKeyValueProps {
  /** The label/key displayed in muted text */
  label: string;
  /** The value displayed in normal text */
  value: string;
}

/**
 * Renders an inline key: value pair.
 */
export function CellKeyValue({ label, value }: CellKeyValueProps) {
  if (!label && !value) {
    return <span className="text-fg-muted">&mdash;</span>;
  }

  return (
    <span className="text-body-md">
      <span className="text-fg-muted">{label}:</span>{' '}
      <span className="text-fg">{value}</span>
    </span>
  );
}
