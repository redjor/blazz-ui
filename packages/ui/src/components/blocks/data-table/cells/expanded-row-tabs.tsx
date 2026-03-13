"use client"

import { cn } from "../../../../lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs"

interface ExpandedRowTabsProps {
	tabs: Array<{ label: string; value: string; content: React.ReactNode }>
	defaultTab?: string
	className?: string
}

export function ExpandedRowTabs({ tabs, defaultTab, className }: ExpandedRowTabsProps) {
	if (tabs.length === 0) return null
	return (
		<Tabs defaultValue={defaultTab ?? tabs[0].value} className={cn(className)}>
			<TabsList>
				{tabs.map((tab) => (
					<TabsTrigger key={tab.value} value={tab.value}>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	)
}
