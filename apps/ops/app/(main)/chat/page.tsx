import type { Metadata } from "next"
import ChatPageClient from "./_client"

export const metadata: Metadata = {
	title: "Chat",
}

export default function ChatPage() {
	return <ChatPageClient />
}
