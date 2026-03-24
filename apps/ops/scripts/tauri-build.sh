#!/bin/bash
# Build script for Tauri: builds Next.js standalone and assembles the server bundle.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
BUNDLE_DIR="$APP_DIR/server-bundle"

cd "$APP_DIR"

# 1. Generate Convex types
echo "→ Generating Convex types..."
npx convex codegen

# 2. Build Next.js (standalone output)
echo "→ Building Next.js (standalone)..."
npx next build --webpack

# 3. Assemble server bundle
echo "→ Assembling server bundle..."
rm -rf "$BUNDLE_DIR"
mkdir -p "$BUNDLE_DIR"

# Copy standalone output (monorepo structure: .next/standalone/apps/ops/)
# Use -L to dereference symlinks (pnpm uses symlinks that Tauri can't bundle)
cp -RL .next/standalone/apps/ops/* "$BUNDLE_DIR/"
# Copy root node_modules (monorepo shared deps)
cp -RL .next/standalone/node_modules "$BUNDLE_DIR/node_modules_root"
# Copy static assets (not included in standalone)
mkdir -p "$BUNDLE_DIR/.next/static"
cp -R .next/static/* "$BUNDLE_DIR/.next/static/"
# Copy public assets
if [ -d "public" ]; then
  cp -R public "$BUNDLE_DIR/public"
fi

# 4. Create a wrapper script that sets up node_modules resolution
cat > "$BUNDLE_DIR/start.sh" << 'STARTEOF'
#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
# Merge monorepo root node_modules with app node_modules
export NODE_PATH="$DIR/node_modules_root:$DIR/node_modules"
exec node "$DIR/server.js"
STARTEOF
chmod +x "$BUNDLE_DIR/start.sh"

echo "→ Server bundle ready at $BUNDLE_DIR"
