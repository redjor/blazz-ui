import type { ConvexHttpClient } from "convex/browser"
import type OpenAI from "openai"
import { financeTools } from "./finance"
import { timeTools } from "./time"
import { productTools } from "./product"
import { sharedTools } from "./shared"

export interface Tool {
  name: string
  category: "read" | "write"
  definition: OpenAI.ChatCompletionTool
  execute: (args: Record<string, unknown>, convex: ConvexHttpClient) => Promise<unknown>
}

export function createToolRegistry(convex: ConvexHttpClient): Tool[] {
  return [
    ...financeTools(convex),
    ...timeTools(convex),
    ...productTools(),
    ...sharedTools(convex),
  ]
}
