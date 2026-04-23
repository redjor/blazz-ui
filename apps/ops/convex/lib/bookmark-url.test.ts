import { describe, expect, it } from "vitest"
import { classifyUrl, extractHost } from "./bookmark-url"

describe("classifyUrl", () => {
	it("classifies twitter/x posts as tweet", () => {
		expect(classifyUrl("https://twitter.com/user/status/123")).toBe("tweet")
		expect(classifyUrl("https://x.com/user/status/123")).toBe("tweet")
		expect(classifyUrl("https://mobile.twitter.com/user/status/123")).toBe("tweet")
	})

	it("classifies youtube as youtube", () => {
		expect(classifyUrl("https://www.youtube.com/watch?v=abc")).toBe("youtube")
		expect(classifyUrl("https://youtu.be/abc")).toBe("youtube")
		expect(classifyUrl("https://youtube.com/shorts/xyz")).toBe("youtube")
	})

	it("classifies instagram reels/posts as video", () => {
		expect(classifyUrl("https://www.instagram.com/reel/abc/")).toBe("video")
		expect(classifyUrl("https://www.instagram.com/p/xyz/")).toBe("video")
	})

	it("classifies tiktok as video", () => {
		expect(classifyUrl("https://www.tiktok.com/@user/video/123")).toBe("video")
	})

	it("classifies direct image URLs as image", () => {
		expect(classifyUrl("https://example.com/pic.jpg")).toBe("image")
		expect(classifyUrl("https://example.com/pic.PNG")).toBe("image")
		expect(classifyUrl("https://example.com/pic.webp?size=large")).toBe("image")
	})

	it("classifies direct video files as video", () => {
		expect(classifyUrl("https://example.com/clip.mp4")).toBe("video")
		expect(classifyUrl("https://example.com/clip.MOV")).toBe("video")
	})

	it("falls back to link for anything else", () => {
		expect(classifyUrl("https://news.ycombinator.com/item?id=1")).toBe("link")
		expect(classifyUrl("https://github.com/anthropic")).toBe("link")
	})

	it("returns link for malformed URLs instead of throwing", () => {
		expect(classifyUrl("not a url")).toBe("link")
		expect(classifyUrl("")).toBe("link")
	})
})

describe("extractHost", () => {
	it("returns the host without www", () => {
		expect(extractHost("https://www.example.com/path")).toBe("example.com")
		expect(extractHost("https://sub.example.com/path")).toBe("sub.example.com")
	})

	it("returns null for malformed URLs", () => {
		expect(extractHost("not a url")).toBeNull()
		expect(extractHost("")).toBeNull()
	})
})
