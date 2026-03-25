"use client"

import { Building2, Check, ChevronsUpDown, Plus, Settings } from "lucide-react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { Avatar, AvatarFallback, AvatarImage } from "@blazz/ui"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@blazz/ui"

export interface Organization {
	id: string
	name: string
	slug: string
	avatar?: string
	plan?: string
}

export interface OrgMenuProps {
	/** List of organizations the user belongs to */
	organizations: Organization[]
	/** Currently active organization */
	activeOrganization: Organization
	/** Called when the user selects a different organization */
	onSelect: (org: Organization) => void
	/** Called when "Create organization" is clicked */
	onCreate?: () => void
	/** Called when "Manage organizations" is clicked */
	onManage?: () => void
	className?: string
}

function getOrgInitials(name: string): string {
	return name
		.split(/[\s-_]+/)
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)
}

function OrgMenuBase({
	organizations,
	activeOrganization,
	onSelect,
	onCreate,
	onManage,
	className,
}: OrgMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					"flex w-full items-center gap-2 rounded-lg px-2 py-2 transition-colors duration-150 ease-out hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
					className
				)}
			>
				<Avatar className="size-8 rounded-lg after:rounded-lg">
					<AvatarImage
						src={activeOrganization.avatar}
						alt={activeOrganization.name}
						className="rounded-lg"
					/>
					<AvatarFallback className="rounded-lg text-xs font-semibold">
						{getOrgInitials(activeOrganization.name)}
					</AvatarFallback>
				</Avatar>
				<div className="flex min-w-0 flex-1 flex-col text-left">
					<span
						className="truncate text-[13px] font-semibold leading-tight text-fg"
						title={activeOrganization.name}
					>
						{activeOrganization.name}
					</span>
					{activeOrganization.plan && (
						<span
							className="truncate text-xs leading-tight text-fg-muted"
							title={activeOrganization.plan}
						>
							{activeOrganization.plan}
						</span>
					)}
				</div>
				<ChevronsUpDown className="size-3.5 shrink-0 text-fg-muted" />
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-[--anchor-width] min-w-56" align="start" sideOffset={4}>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Organisations</DropdownMenuLabel>
					{organizations.length === 0 ? (
						<div className="flex flex-col items-center gap-1 px-2 py-4 text-center">
							<Building2 className="size-8 text-fg-muted" />
							<span className="text-[13px] font-medium text-fg">Aucune organisation</span>
							<span className="text-xs text-fg-muted">Créez votre première organisation</span>
						</div>
					) : (
						organizations.map((org) => {
							const isActive = org.id === activeOrganization.id
							return (
								<DropdownMenuItem key={org.id} onClick={() => onSelect(org)} className="gap-2">
									<Avatar className="size-6 rounded-md after:rounded-md">
										<AvatarImage src={org.avatar} alt={org.name} className="rounded-md" />
										<AvatarFallback className="rounded-md text-[10px] font-semibold">
											{getOrgInitials(org.name)}
										</AvatarFallback>
									</Avatar>
									<span className="min-w-0 flex-1 truncate" title={org.name}>
										{org.name}
									</span>
									{isActive && <Check className="ml-auto size-4 text-fg-muted" />}
								</DropdownMenuItem>
							)
						})
					)}
				</DropdownMenuGroup>

				{(onCreate || onManage) && <DropdownMenuSeparator />}

				{onCreate && (
					<DropdownMenuItem onClick={onCreate} className="gap-2">
						<Plus className="size-4 text-fg-muted" />
						Créer une organisation
					</DropdownMenuItem>
				)}
				{onManage && (
					<DropdownMenuItem onClick={onManage} className="gap-2">
						<Settings className="size-4 text-fg-muted" />
						Gérer les organisations
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export const OrgMenu = withProGuard(OrgMenuBase, "OrgMenu")
