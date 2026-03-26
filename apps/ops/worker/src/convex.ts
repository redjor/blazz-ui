/**
 * Convex API reference for the worker.
 * Uses anyApi instead of generated types since the worker runs outside
 * the Next.js context where codegen is available.
 */
import { anyApi } from "convex/server"

export const api = anyApi
export const internal = anyApi
