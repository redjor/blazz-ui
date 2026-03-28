"use client"

import { createContext, type ReactNode, useContext, useReducer } from "react"

export interface UnsavedChangesState {
	formId: string | null
	isDirty: boolean
	message: string
	onSave: (() => void | Promise<void>) | null
	onDiscard: (() => void) | null
	saveLabel: string
	discardLabel: string
	isSaving: boolean
	isShaking: boolean
	/** Internal flag: bypass navigation guard after a successful save + redirect */
	_navigationBypass: boolean
}

type Action =
	| {
			type: "REGISTER"
			payload: {
				formId: string
				isDirty: boolean
				message: string
				onSave: () => void | Promise<void>
				onDiscard: () => void
				saveLabel: string
				discardLabel: string
				isSaving: boolean
			}
	  }
	| { type: "CLEAR"; payload: { formId: string } }
	| { type: "SHAKE" }
	| { type: "CLEAR_SHAKE" }
	| { type: "ALLOW_NAVIGATION" }
	| { type: "RESET_NAVIGATION_BYPASS" }

const defaultState: UnsavedChangesState = {
	formId: null,
	isDirty: false,
	message: "Unsaved changes",
	onSave: null,
	onDiscard: null,
	saveLabel: "Save",
	discardLabel: "Discard",
	isSaving: false,
	isShaking: false,
	_navigationBypass: false,
}

function reducer(state: UnsavedChangesState, action: Action): UnsavedChangesState {
	switch (action.type) {
		case "REGISTER":
			return {
				...state,
				...action.payload,
				isShaking: state.isShaking,
				_navigationBypass: state._navigationBypass,
			}
		case "CLEAR": {
			if (state.formId !== action.payload.formId) return state
			return {
				...defaultState,
				// Preserve bypass so the navigation guard doesn't call history.back()
				// after a successful submit that triggers a redirect
				_navigationBypass: state._navigationBypass,
			}
		}
		case "SHAKE":
			return { ...state, isShaking: true }
		case "CLEAR_SHAKE":
			return { ...state, isShaking: false }
		case "ALLOW_NAVIGATION":
			return { ...state, _navigationBypass: true }
		case "RESET_NAVIGATION_BYPASS":
			return { ...state, _navigationBypass: false }
		default:
			return state
	}
}

interface UnsavedChangesContextValue {
	state: UnsavedChangesState
	dispatch: React.Dispatch<Action>
}

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null)

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, defaultState)

	return <UnsavedChangesContext.Provider value={{ state, dispatch }}>{children}</UnsavedChangesContext.Provider>
}

export function useUnsavedChangesContext(): UnsavedChangesContextValue {
	const ctx = useContext(UnsavedChangesContext)
	if (!ctx) {
		throw new Error("useUnsavedChangesContext must be used within <UnsavedChangesProvider>")
	}
	return ctx
}
