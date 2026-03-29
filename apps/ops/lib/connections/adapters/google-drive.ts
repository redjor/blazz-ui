import { z } from "zod"
import { tool } from "@/lib/chat/tools"
import { ensureFreshToken } from "../ensure-fresh-token"

type Connection = {
	_id: string
	provider: string
	accessToken?: string
	refreshToken?: string
	tokenExpiresAt?: number
	status: string
}

export function buildGoogleDriveTools(connection: Connection) {
	return {
		google_drive_search: {
			...tool({
				description: "Search files in Google Drive by name or content. Returns file names, IDs, and MIME types.",
				parameters: z.object({
					query: z.string().describe("Search query (file name or content keywords)"),
					maxResults: z.number().optional().describe("Max results to return (default: 10)"),
				}),
			}),
			execute: async ({ query, maxResults }: { query: string; maxResults?: number }) => {
				const token = await ensureFreshToken(connection)
				const limit = maxResults ?? 10
				const res = await fetch(
					`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(`name contains '${query}' or fullText contains '${query}'`)}&fields=files(id,name,mimeType,modifiedTime,size)&pageSize=${limit}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				)
				if (!res.ok) throw new Error(`Google Drive search failed: ${res.status}`)
				const data = await res.json()
				return data.files ?? []
			},
		},

		google_drive_read: {
			...tool({
				description: "Read the text content of a Google Drive file by ID. Works with Google Docs, Sheets (as CSV), and plain text files.",
				parameters: z.object({
					fileId: z.string().describe("The file ID from Google Drive"),
				}),
			}),
			execute: async ({ fileId }: { fileId: string }) => {
				const token = await ensureFreshToken(connection)
				// Get file metadata to determine type
				const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,name`, { headers: { Authorization: `Bearer ${token}` } })
				if (!metaRes.ok) throw new Error(`File not found: ${metaRes.status}`)
				const meta = await metaRes.json()

				let contentUrl: string
				if (meta.mimeType === "application/vnd.google-apps.document") {
					contentUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`
				} else if (meta.mimeType === "application/vnd.google-apps.spreadsheet") {
					contentUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/csv`
				} else {
					contentUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`
				}

				const contentRes = await fetch(contentUrl, {
					headers: { Authorization: `Bearer ${token}` },
				})
				if (!contentRes.ok) throw new Error(`Failed to read file: ${contentRes.status}`)
				const text = await contentRes.text()
				return { name: meta.name, mimeType: meta.mimeType, content: text.slice(0, 10000) }
			},
		},

		google_drive_list: {
			...tool({
				description: "List recent files in Google Drive. Returns the most recently modified files.",
				parameters: z.object({
					maxResults: z.number().optional().describe("Max results (default: 20)"),
					folderId: z.string().optional().describe("Folder ID to list (default: root)"),
				}),
			}),
			execute: async ({ maxResults, folderId }: { maxResults?: number; folderId?: string }) => {
				const token = await ensureFreshToken(connection)
				const limit = maxResults ?? 20
				const q = folderId ? `'${folderId}' in parents` : ""
				const url = `https://www.googleapis.com/drive/v3/files?orderBy=modifiedTime desc&pageSize=${limit}&fields=files(id,name,mimeType,modifiedTime,size)${q ? `&q=${encodeURIComponent(q)}` : ""}`
				const res = await fetch(url, {
					headers: { Authorization: `Bearer ${token}` },
				})
				if (!res.ok) throw new Error(`Google Drive list failed: ${res.status}`)
				const data = await res.json()
				return data.files ?? []
			},
		},
	}
}
