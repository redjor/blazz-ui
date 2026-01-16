'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SidebarSearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export function SidebarSearch({ placeholder = 'Search...', onSearch, className }: SidebarSearchProps) {
  const [query, setQuery] = React.useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="h-9 pl-8 bg-background"
      />
    </div>
  )
}
