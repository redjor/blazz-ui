export interface Tab {
  id: string
  url: string
  title: string
  icon?: string
}

export interface TabsStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface TabsConfig {
  storageKey: string
  storage?: TabsStorage
  defaultTab?: { url: string; title: string; icon?: string }
}
