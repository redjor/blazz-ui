export interface TestAccount {
  label: string;
  username: string;
  password: string;
  avatarUrl?: string;
  group?: string;
  subgroup?: string;
  description?: string;
}

export interface QuickAccountSelectorProps {
  onAccountSelect: (username: string, password: string) => void;
  accounts: TestAccount[];
  forceShow?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  sheetSide?: 'left' | 'right';
  /** Override the trigger wrapper className. Defaults to `fixed z-50 {corner}`. Pass `absolute z-10 {corner}` to embed in a relative container (e.g. docs demos). */
  triggerClassName?: string;
}

export interface ParsedAccountMetadata {
  scope: string;
  role: string;
  initials: string;
}
