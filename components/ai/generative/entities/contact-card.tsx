"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Phone, Mail, Building2, Clock } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ContactCardProps {
	name: string
	avatar?: string
	role?: string
	company?: string
	email?: string
	phone?: string
	lastContact?: string
	tags?: string[]
	href?: string
	actions?: ReactNode
	className?: string
}

function getInitials(name: string) {
	return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export function ContactCard({
	name,
	avatar,
	role,
	company,
	email,
	phone,
	lastContact,
	tags,
	href,
	actions,
	className,
}: ContactCardProps) {
	const Wrapper = href ? Link : "div"
	const wrapperProps = href ? { href } : {}

	return (
		<Wrapper
			{...(wrapperProps as Record<string, string>)}
			className={cn(
				"block rounded-lg border border-edge bg-surface p-4",
				href && "transition-colors hover:bg-raised cursor-pointer",
				className,
			)}
		>
			<div className="flex items-start gap-3">
				<Avatar size="lg">
					{avatar && <AvatarImage src={avatar} alt={name} />}
					<AvatarFallback>{getInitials(name)}</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<span className="block truncate text-sm font-semibold text-fg">{name}</span>
					{role && <p className="truncate text-sm text-fg-muted">{role}</p>}
				</div>
			</div>

			{(company || email || phone || lastContact) && (
				<div className="mt-3 flex flex-col gap-1.5">
					{company && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Building2 className="size-3 shrink-0" />
							{company}
						</span>
					)}
					{email && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Mail className="size-3 shrink-0" />
							{email}
						</span>
					)}
					{phone && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Phone className="size-3 shrink-0" />
							{phone}
						</span>
					)}
					{lastContact && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Clock className="size-3 shrink-0" />
							Last contact: {lastContact}
						</span>
					)}
				</div>
			)}

			{tags && tags.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-1.5">
					{tags.map((tag) => (
						<Badge key={tag} variant="secondary" size="xs" fill="subtle">{tag}</Badge>
					))}
				</div>
			)}

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</Wrapper>
	)
}
