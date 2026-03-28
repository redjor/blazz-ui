"use client"

import {
	FilterPanel,
	FilterPanelAction,
	FilterPanelActions,
	FilterPanelCheckboxItem,
	FilterPanelHeader,
	FilterPanelSection,
	FilterPanelTabs,
	FilterPanelTreeItem,
} from "@blazz/ui/components/ui/filter-panel"
import { Activity, BarChart3, CircleDot, CircleOff, Layers, Percent, Repeat, Search, Settings2 } from "lucide-react"
import { useState } from "react"

export function DefaultExample() {
	const [tab, setTab] = useState("Market")
	const [checked, setChecked] = useState<Record<string, boolean>>({ "Open Interest": true })
	const toggle = (key: string) => (value: boolean) => setChecked((prev) => ({ ...prev, [key]: value }))
	return (
		<FilterPanel>
			<FilterPanelHeader>
				<FilterPanelTabs tabs={["Market", "Insights", "Watchlist"]} value={tab} onValueChange={setTab} />
				<FilterPanelActions>
					<FilterPanelAction aria-label="Search">
						<Search className="size-4" />
					</FilterPanelAction>
					<FilterPanelAction aria-label="Settings">
						<Settings2 className="size-4" />
					</FilterPanelAction>
				</FilterPanelActions>
			</FilterPanelHeader>
			<FilterPanelSection label="Market type">
				<FilterPanelTreeItem icon={<Repeat className="size-3.5" />} label="Perpetuals" count={45}>
					<FilterPanelCheckboxItem
						icon={<BarChart3 className="size-3.5" />}
						label="Open Interest"
						count={12}
						depth={1}
						checked={checked["Open Interest"] ?? false}
						onCheckedChange={toggle("Open Interest")}
					/>
					<FilterPanelCheckboxItem
						icon={<Percent className="size-3.5" />}
						label="Funding Rates"
						count={8}
						depth={1}
						checked={checked["Funding Rates"] ?? false}
						onCheckedChange={toggle("Funding Rates")}
					/>
				</FilterPanelTreeItem>
				<FilterPanelCheckboxItem
					icon={<Activity className="size-3.5" />}
					label="High Volatility"
					count={10}
					checked={checked["High Volatility"] ?? false}
					onCheckedChange={toggle("High Volatility")}
				/>
				<FilterPanelCheckboxItem icon={<Layers className="size-3.5" />} label="Options" count={3} checked={checked.Options ?? false} onCheckedChange={toggle("Options")} />
				<FilterPanelCheckboxItem icon={<CircleDot className="size-3.5" />} label="Spot Only" count={42} checked={checked["Spot Only"] ?? false} onCheckedChange={toggle("Spot Only")} />
				<FilterPanelCheckboxItem
					icon={<CircleOff className="size-3.5" />}
					label="No Active Market"
					count={8}
					checked={checked["No Active Market"] ?? false}
					onCheckedChange={toggle("No Active Market")}
				/>
			</FilterPanelSection>
		</FilterPanel>
	)
}

export function MinimalExample() {
	return (
		<FilterPanel width={240}>
			<FilterPanelSection label="Status">
				<FilterPanelCheckboxItem label="Active" count={24} defaultChecked />
				<FilterPanelCheckboxItem label="Pending" count={7} />
				<FilterPanelCheckboxItem label="Archived" count={156} />
			</FilterPanelSection>
		</FilterPanel>
	)
}

export function MultiSectionExample() {
	return (
		<FilterPanel>
			<FilterPanelSection label="Category">
				<FilterPanelCheckboxItem label="Technology" count={89} defaultChecked />
				<FilterPanelCheckboxItem label="Finance" count={34} />
				<FilterPanelCheckboxItem label="Healthcare" count={21} />
			</FilterPanelSection>
			<FilterPanelSection label="Region">
				<FilterPanelCheckboxItem label="North America" count={56} />
				<FilterPanelCheckboxItem label="Europe" count={43} defaultChecked />
				<FilterPanelCheckboxItem label="Asia Pacific" count={28} />
			</FilterPanelSection>
		</FilterPanel>
	)
}
