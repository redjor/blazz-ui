#!/bin/bash
# Build script for Tauri: builds Next.js standalone and assembles the server bundle.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
BUNDLE_DIR="$APP_DIR/server-bundle"

cd "$APP_DIR"

# 0. Move .env.local aside so .env.production takes priority
if [ -f ".env.local" ]; then
  mv .env.local .env.local.bak
fi
restore_env() {
  if [ -f ".env.local.bak" ]; then
    mv .env.local.bak .env.local
  fi
}
trap restore_env EXIT

# Load .env.production into shell (needed for convex codegen)
if [ -f ".env.production" ]; then
  while IFS= read -r line; do
    [[ -z "$line" || "$line" == \#* ]] && continue
    key="${line%%=*}"
    value="${line#*=}"
    export "$key=$value"
  done < .env.production
fi

# 1. Generate Convex types
echo "→ Generating Convex types..."
npx convex codegen

# 2. Build Next.js (standalone output)
echo "→ Building Next.js (standalone with .env.production)..."
npx next build --webpack

# 3. Assemble server bundle
echo "→ Assembling server bundle..."
rm -rf "$BUNDLE_DIR"
mkdir -p "$BUNDLE_DIR"

# Copy standalone output (monorepo structure: .next/standalone/apps/ops/)
# Use -L to dereference symlinks (pnpm uses symlinks that Tauri can't bundle)
# Note: must copy .next separately since glob * excludes dotfiles
cp -RL .next/standalone/apps/ops/* "$BUNDLE_DIR/"
cp -RL .next/standalone/apps/ops/.next "$BUNDLE_DIR/.next"
# Merge root node_modules into app node_modules (Next.js uses relative requires)
cp -RLn .next/standalone/node_modules/* "$BUNDLE_DIR/node_modules/" 2>/dev/null || true
# Copy static assets (not included in standalone)
mkdir -p "$BUNDLE_DIR/.next/static"
cp -R .next/static/* "$BUNDLE_DIR/.next/static/"
# Copy public assets
if [ -d "public" ]; then
  cp -R public "$BUNDLE_DIR/public"
fi

# Copy .env.production for runtime server env vars
if [ -f ".env.production" ]; then
  cp .env.production "$BUNDLE_DIR/.env.production"
fi

echo "→ Server bundle ready at $BUNDLE_DIR"
