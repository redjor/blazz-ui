import * as BlazzUI from "@blazz/ui"
import * as LucideIcons from "lucide-react"
import * as React from "react"

export const scope: Record<string, unknown> = {
	React,
	useState: React.useState,
	useEffect: React.useEffect,
	useRef: React.useRef,
	useMemo: React.useMemo,
	useCallback: React.useCallback,
	Fragment: React.Fragment,
	...BlazzUI,
	...LucideIcons,
}
