"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { MapPin, Briefcase, Mail } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../../../ui/avatar"
import { Badge } from "../../../ui/badge"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { cn } from "../../../../lib/utils"

const statusVariantMap = {
	available: { variant: "success" as const, label: "Available" },
	"in-process": { variant: "info" as const, label: "In Process" },
	hired: { variant: "default" as const, label: "Hired" },
	rejected: { variant: "critical" as const, label: "Rejected" },
	"on-hold": { variant: "warning" as const, label: "On Hold" },
} as const

export type CandidateStatus = keyof typeof statusVariantMap

export interface CandidateCardProps {
	name: string
	avatar?: string
	role: string
	company?: string
	location?: string
	email?: string
	status?: CandidateStatus
	skills?: string[]
	experience?: string
	matchScore?: number
	href?: string
	actions?: ReactNode
	className?: string
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2)
}

function CandidateCardBase({
	name,
	avatar,
	role,
	company,
	location,
	email,
	status,
	skills,
	experience,
	matchScore,
	href,
	actions,
	className,
}: CandidateCardProps) {
	const statusConfig = status ? statusVariantMap[status] : null

	const Wrapper = href ? Link : "div"
	const wrapperProps = href ? { href } : {}

	return (
		<Wrapper
			{...(wrapperProps as Record<string, string>)}
			className={cn(
				"block rounded-lg border border-container bg-surface p-4",
				href && "transition-colors hover:bg-raised cursor-pointer",
				className,
			)}
		>
			{/* Header: avatar + name + status */}
			<div className="flex items-start gap-3">
				<Avatar size="lg">
					{avatar && <AvatarImage src={avatar} alt={name} />}
					<AvatarFallback>{getInitials(name)}</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="truncate text-sm font-semibold text-fg">
							{name}
						</span>
						{statusConfig && (
							<Badge
								variant={statusConfig.variant}
								size="xs"
								fill="subtle"
							>
								{statusConfig.label}
							</Badge>
						)}
					</div>
					<p className="truncate text-sm text-fg-muted">{role}</p>
				</div>
				{matchScore !== undefined && (
					<div className="flex flex-col items-center">
						<span className="text-lg font-semibold text-brand">
							{matchScore}%
						</span>
						<span className="text-[10px] uppercase tracking-wide text-fg-muted">
							Match
						</span>
					</div>
				)}
			</div>

			{/* Details */}
			{(company || location || email) && (
				<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
					{company && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Briefcase className="size-3" />
							{company}
						</span>
					)}
					{location && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<MapPin className="size-3" />
							{location}
						</span>
					)}
					{email && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Mail className="size-3" />
							{email}
						</span>
					)}
				</div>
			)}

			{/* Experience */}
			{experience && (
				<p className="mt-2 text-xs text-fg-muted">{experience}</p>
			)}

			{/* Skills */}
			{skills && skills.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-1.5">
					{skills.map((skill) => (
						<Badge
							key={skill}
							variant="secondary"
							size="xs"
							fill="subtle"
						>
							{skill}
						</Badge>
					))}
				</div>
			)}

			{/* Actions slot */}
			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</Wrapper>
	)
}

export const CandidateCard = withProGuard(CandidateCardBase, "CandidateCard")
