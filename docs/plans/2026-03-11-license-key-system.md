# License Key System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add offline license key validation to @blazz/ui so blocks/ and ai/ components show a watermark when unlicensed.

**Architecture:** BlazzProvider (React Context) holds license state. A `withProGuard` HOC wraps Pro components, overlaying a watermark when no valid key is found. Validation is HMAC-SHA256 based, zero network calls.

**Tech Stack:** React Context, Web Crypto (SubtleCrypto for HMAC), tsup env define

---

### Task 1: Create license validation module

**Files:**
- Create: `packages/ui/src/lib/license.ts`

Pure functions, no React. Parses key format `BLAZZ-<plan>-<orgId>-<expiry>-<signature>`, validates HMAC, checks expiry.

**Step 1: Create `packages/ui/src/lib/license.ts`**

```ts
export type LicensePlan = "PRO" | "TEAM" | "ENTERPRISE"

export interface LicenseInfo {
  plan: LicensePlan
  orgId: string
  expiry: Date
  valid: boolean
}

const VALID_PLANS: Set<string> = new Set(["PRO", "TEAM", "ENTERPRISE"])

// Secret injected at build time via tsup define
const HMAC_SECRET = process.env.BLAZZ_LICENSE_SECRET || "__BLAZZ_DEV__"

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("")
}

async function computeHmac(payload: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(HMAC_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload))
  return bytesToHex(new Uint8Array(sig)).slice(0, 16)
}

export function parseLicenseKey(key: string): { plan: string; orgId: string; expiry: string; signature: string } | null {
  const parts = key.split("-")
  if (parts.length !== 5 || parts[0] !== "BLAZZ") return null
  const [, plan, orgId, expiry, signature] = parts
  if (!VALID_PLANS.has(plan)) return null
  if (!/^\d{8}$/.test(expiry)) return null
  return { plan, orgId, expiry, signature }
}

export async function validateLicense(key: string): Promise<LicenseInfo | null> {
  const parsed = parseLicenseKey(key)
  if (!parsed) return null

  const payload = `${parsed.plan}-${parsed.orgId}-${parsed.expiry}`
  const expected = await computeHmac(payload)

  if (parsed.signature !== expected) return null

  const y = parseInt(parsed.expiry.slice(0, 4))
  const m = parseInt(parsed.expiry.slice(4, 6)) - 1
  const d = parseInt(parsed.expiry.slice(6, 8))
  const expiry = new Date(y, m, d)

  return {
    plan: parsed.plan as LicensePlan,
    orgId: parsed.orgId,
    expiry,
    valid: expiry > new Date(),
  }
}
```

**Step 2: Commit**

```bash
git add packages/ui/src/lib/license.ts
git commit -m "feat(ui): add license key validation module"
```

---

### Task 2: Create BlazzProvider + useLicense hook

**Files:**
- Create: `packages/ui/src/lib/license-context.tsx`

React Context that validates the key once on mount and exposes license state.

**Step 1: Create `packages/ui/src/lib/license-context.tsx`**

```tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { type LicenseInfo, validateLicense } from "./license"

interface LicenseContextValue {
  license: LicenseInfo | null
  isLoading: boolean
}

const LicenseContext = createContext<LicenseContextValue>({
  license: null,
  isLoading: false,
})

export function BlazzProvider({
  licenseKey,
  children,
}: {
  licenseKey?: string
  children: React.ReactNode
}) {
  const [license, setLicense] = useState<LicenseInfo | null>(null)
  const [isLoading, setIsLoading] = useState(!!licenseKey)

  useEffect(() => {
    if (!licenseKey) {
      setLicense(null)
      setIsLoading(false)
      return
    }
    let cancelled = false
    validateLicense(licenseKey).then((result) => {
      if (!cancelled) {
        setLicense(result)
        setIsLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [licenseKey])

  return (
    <LicenseContext value={{ license, isLoading }}>
      {children}
    </LicenseContext>
  )
}

export function useLicense(): LicenseContextValue {
  return useContext(LicenseContext)
}
```

**Step 2: Commit**

```bash
git add packages/ui/src/lib/license-context.tsx
git commit -m "feat(ui): add BlazzProvider and useLicense hook"
```

---

### Task 3: Create LicenseBanner watermark component

**Files:**
- Create: `packages/ui/src/components/ui/license-banner.tsx`

Small overlay rendered inside Pro components when unlicensed.

**Step 1: Create `packages/ui/src/components/ui/license-banner.tsx`**

```tsx
export function LicenseBanner() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 4,
        right: 4,
        padding: "2px 8px",
        fontSize: 10,
        lineHeight: "16px",
        fontFamily: "system-ui, sans-serif",
        color: "rgba(255,255,255,0.8)",
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 4,
        pointerEvents: "none",
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      Unlicensed — blazz.dev
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add packages/ui/src/components/ui/license-banner.tsx
git commit -m "feat(ui): add LicenseBanner watermark component"
```

---

### Task 4: Create withProGuard HOC

**Files:**
- Create: `packages/ui/src/lib/with-pro-guard.tsx`

HOC that wraps a component with relative positioning + LicenseBanner overlay when unlicensed.

**Step 1: Create `packages/ui/src/lib/with-pro-guard.tsx`**

```tsx
"use client"

import { type ComponentType, useEffect, useRef } from "react"
import { LicenseBanner } from "../components/ui/license-banner"
import { useLicense } from "./license-context"

const warnedComponents = new Set<string>()

export function withProGuard<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
): ComponentType<P> {
  const name = displayName || Component.displayName || Component.name || "ProComponent"

  function Guarded(props: P) {
    const { license, isLoading } = useLicense()
    const isLicensed = license?.valid === true

    useEffect(() => {
      if (!isLoading && !isLicensed && process.env.NODE_ENV === "development" && !warnedComponents.has(name)) {
        warnedComponents.add(name)
        console.warn(
          `[blazz] <${name}> is a Pro component. Add a valid license key to <BlazzProvider> to remove the watermark. Learn more: https://blazz.dev/pricing`
        )
      }
    }, [isLicensed, isLoading])

    if (isLoading) {
      return <Component {...props} />
    }

    if (isLicensed) {
      return <Component {...props} />
    }

    return (
      <div style={{ position: "relative" }}>
        <Component {...props} />
        <LicenseBanner />
      </div>
    )
  }

  Guarded.displayName = `withProGuard(${name})`
  return Guarded
}
```

**Step 2: Commit**

```bash
git add packages/ui/src/lib/with-pro-guard.tsx
git commit -m "feat(ui): add withProGuard HOC for Pro components"
```

---

### Task 5: Apply withProGuard to all block components

**Files:**
- Modify: all 29 files in `packages/ui/src/components/blocks/*.tsx`

For each block, wrap the default/named export with withProGuard. Example for `stats-grid.tsx`:

Add at top: `import { withProGuard } from "../../lib/with-pro-guard"`
Rename component: `function StatsGridBase(...)`
Add at bottom: `export const StatsGrid = withProGuard(StatsGridBase, "StatsGrid")`

Repeat for all 29 block components + data-table.

**Step 1: Apply to all blocks**
**Step 2: Verify build:** `pnpm build --filter=@blazz/ui`
**Step 3: Commit**

```bash
git add packages/ui/src/components/blocks/
git commit -m "feat(ui): apply withProGuard to all block components"
```

---

### Task 6: Apply withProGuard to AI components

**Files:**
- Modify: AI component barrel exports in `packages/ui/src/components/ai/`

Same pattern as blocks — wrap each exported component.

**Step 1: Apply to all AI components**
**Step 2: Verify build:** `pnpm build --filter=@blazz/ui`
**Step 3: Commit**

```bash
git add packages/ui/src/components/ai/
git commit -m "feat(ui): apply withProGuard to all AI components"
```

---

### Task 7: Export license system from barrel

**Files:**
- Modify: `packages/ui/src/index.ts`

**Step 1: Add exports**

```ts
// ── License ──────────────────────────────────
export { BlazzProvider, useLicense } from "./lib/license-context"
export { type LicenseInfo, type LicensePlan } from "./lib/license"
```

**Step 2: Verify build:** `pnpm build --filter=@blazz/ui`
**Step 3: Commit**

```bash
git add packages/ui/src/index.ts
git commit -m "feat(ui): export BlazzProvider and license types from barrel"
```

---

### Task 8: Add BLAZZ_LICENSE_SECRET to tsup config

**Files:**
- Modify: `packages/ui/tsup.config.ts`

**Step 1: Add env define**

```ts
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss"],
  treeshake: true,
  define: {
    "process.env.BLAZZ_LICENSE_SECRET": JSON.stringify(process.env.BLAZZ_LICENSE_SECRET || "__BLAZZ_DEV__"),
  },
})
```

**Step 2: Add to CI secrets** (GitHub Actions — `BLAZZ_LICENSE_SECRET`)
**Step 3: Commit**

```bash
git add packages/ui/tsup.config.ts
git commit -m "feat(ui): inject BLAZZ_LICENSE_SECRET at build time via tsup"
```

---

### Task 9: Create key generation CLI script

**Files:**
- Create: `packages/ui/scripts/generate-license.ts`

Script to generate valid license keys for customers.

```bash
npx tsx packages/ui/scripts/generate-license.ts PRO acme42 20270311
# → BLAZZ-PRO-acme42-20270311-a1b2c3d4e5f6g7h8
```

**Step 1: Create script**
**Step 2: Test locally**
**Step 3: Commit**

```bash
git add packages/ui/scripts/generate-license.ts
git commit -m "feat(ui): add license key generation script"
```
