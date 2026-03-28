"use client"

interface AgentAvatarProps {
	name: string
	size?: number
	className?: string
}

export function AgentAvatar({ name, size = 24, className = "" }: AgentAvatarProps) {
	return <img src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}`} alt={name} width={size} height={size} className={`rounded-full ${className}`} />
}
