import type { ConvexHttpClient } from "convex/browser"
import type OpenAI from "openai"
import { agentTools } from "./agents"
import { financeTools } from "./finance"
import { productTools } from "./product"
import { sharedTools } from "./shared"
import { timeTools } from "./time"

export interface Tool {
	name: string
	category: "read" | "write"
	definition: OpenAI.ChatCompletionTool
	execute: (args: Record<string, unknown>, convex: ConvexHttpClient) => Promise<unknown>
}

export function createToolRegistry(convex: ConvexHttpClient): Tool[] {
	return [...financeTools(convex), ...timeTools(convex), ...productTools(), ...sharedTools(convex), ...agentTools(convex)]
}
