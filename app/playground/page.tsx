"use client"

import * as React from "react"
import {
  PRESETS,
  tokensToInlineStyles,
  densityToInlineStyles,
  getDefaultDensity,
  type TokenKey,
  type TokenValues,
  type PresetName,
  type OklchColor,
  type DensityValues,
} from "@/components/features/docs/theme-editor/theme-presets"
import { PlaygroundSidebar } from "@/components/features/playground/playground-sidebar"
import { PlaygroundPreview } from "@/components/features/playground/playground-preview"

export default function PlaygroundPage() {
  const [presetName, setPresetName] = React.useState<PresetName>("slate")
  const [lightTokens, setLightTokens] = React.useState<TokenValues>(() =>
    structuredClone(PRESETS[0].light),
  )
  const [darkTokens, setDarkTokens] = React.useState<TokenValues>(() =>
    structuredClone(PRESETS[0].dark),
  )
  const [densityValues, setDensityValues] = React.useState<DensityValues>(getDefaultDensity)
  const [mode, setMode] = React.useState<"light" | "dark">("dark")

  const tokens = mode === "light" ? lightTokens : darkTokens
  const setTokens = mode === "light" ? setLightTokens : setDarkTokens

  const handlePresetChange = (name: PresetName) => {
    const p = PRESETS.find((x) => x.name === name)!
    setPresetName(name)
    setLightTokens(structuredClone(p.light))
    setDarkTokens(structuredClone(p.dark))
  }

  const handleTokenChange = (key: TokenKey, color: OklchColor) => {
    setTokens((prev) => ({ ...prev, [key]: color }))
  }

  const handleDensityChange = (key: string, value: number) => {
    setDensityValues((prev) => ({ ...prev, [key]: value }))
  }

  const inlineStyles: React.CSSProperties = {
    ...tokensToInlineStyles(tokens),
    ...densityToInlineStyles(densityValues),
    colorScheme: mode,
    fontSize: `${densityValues["base-font-size"]}px`,
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar — token editor */}
      <PlaygroundSidebar
        presetName={presetName}
        mode={mode}
        tokens={tokens}
        densityValues={densityValues}
        lightTokens={lightTokens}
        darkTokens={darkTokens}
        onPresetChange={handlePresetChange}
        onModeChange={setMode}
        onTokenChange={handleTokenChange}
        onDensityChange={handleDensityChange}
      />

      {/* Preview area — CSS variable overrides applied here */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden" style={inlineStyles}>
        <PlaygroundPreview />
      </div>
    </div>
  )
}
