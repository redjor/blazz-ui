#!/bin/bash

# =============================================================================
# Blazz UI Project Setup Wizard
# =============================================================================
# Script interactif pour configurer un nouveau projet Blazz UI
# Usage: ./scripts/init-project.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
CHECK="✓"
CROSS="✗"
ARROW="→"
STAR="★"

# =============================================================================
# Helper Functions
# =============================================================================

print_header() {
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║                                                            ║${NC}"
    echo -e "${MAGENTA}║${NC}  ${CYAN}⚡ Blazz UI - Project Setup Wizard${NC}                   ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}║                                                            ║${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}${ARROW} $1${NC}"
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ  $1${NC}"
}

prompt_input() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"

    if [ -n "$default" ]; then
        echo -en "${YELLOW}? ${NC}$prompt ${CYAN}(default: $default)${NC}: "
    else
        echo -en "${YELLOW}? ${NC}$prompt: "
    fi

    read input

    if [ -z "$input" ] && [ -n "$default" ]; then
        eval "$var_name='$default'"
    else
        eval "$var_name='$input'"
    fi
}

prompt_confirm() {
    local prompt="$1"
    local default="$2"

    if [ "$default" = "y" ]; then
        echo -en "${YELLOW}? ${NC}$prompt ${CYAN}(Y/n)${NC}: "
    else
        echo -en "${YELLOW}? ${NC}$prompt ${CYAN}(y/N)${NC}: "
    fi

    read answer

    if [ -z "$answer" ]; then
        answer="$default"
    fi

    case "$answer" in
        [Yy]* ) return 0;;
        * ) return 1;;
    esac
}

# =============================================================================
# Check Prerequisites
# =============================================================================

check_prerequisites() {
    print_step "Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    print_success "Prerequisites OK"
    echo ""
}

# =============================================================================
# Collect Project Information
# =============================================================================

collect_project_info() {
    print_step "Project Configuration"
    echo ""

    # Project Name
    prompt_input "Project name" "My Blazz App" PROJECT_NAME

    # Project Description
    prompt_input "Project description" "Built with Blazz UI" PROJECT_DESCRIPTION

    # Project URL
    prompt_input "Project URL" "http://localhost:3100" PROJECT_URL

    echo ""
}

# =============================================================================
# Configure Features
# =============================================================================

configure_features() {
    print_step "Feature Configuration"
    echo ""

    # Command Palette
    if prompt_confirm "Enable Command Palette (⌘K)?" "y"; then
        ENABLE_COMMAND_PALETTE="true"
    else
        ENABLE_COMMAND_PALETTE="false"
    fi

    # Dark Mode
    if prompt_confirm "Enable Dark Mode toggle?" "y"; then
        ENABLE_DARK_MODE="true"
    else
        ENABLE_DARK_MODE="false"
    fi

    # Analytics
    if prompt_confirm "Enable Analytics tracking?" "n"; then
        ENABLE_ANALYTICS="true"
    else
        ENABLE_ANALYTICS="false"
    fi

    echo ""
}

# =============================================================================
# Configure Navigation
# =============================================================================

configure_navigation() {
    print_step "Navigation Configuration"
    echo ""

    print_info "Default navigation includes: Dashboard, Users, Settings"

    if prompt_confirm "Keep default navigation?" "y"; then
        USE_DEFAULT_NAV="true"
    else
        USE_DEFAULT_NAV="false"
        print_info "You can customize navigation later in config/navigation.ts"
    fi

    echo ""
}

# =============================================================================
# Configure Theme
# =============================================================================

configure_theme() {
    print_step "Theme Configuration"
    echo ""

    print_info "Theme uses OKLCh color space (modern, perceptually uniform)"

    echo "Select default theme mode:"
    echo "  1) Light"
    echo "  2) Dark"
    echo "  3) System (follows OS preference)"

    prompt_input "Choice" "3" THEME_CHOICE

    case "$THEME_CHOICE" in
        1) DEFAULT_THEME_MODE="light";;
        2) DEFAULT_THEME_MODE="dark";;
        *) DEFAULT_THEME_MODE="system";;
    esac

    echo ""
}

# =============================================================================
# Update Configuration Files
# =============================================================================

update_env_file() {
    print_step "Updating .env file..."

    # Create .env from .env.example if not exists
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
        fi
    fi

    # Update .env values
    if [ -f .env ]; then
        sed -i.bak "s|^NEXT_PUBLIC_APP_NAME=.*|NEXT_PUBLIC_APP_NAME=\"$PROJECT_NAME\"|g" .env
        sed -i.bak "s|^NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=\"$PROJECT_URL\"|g" .env
        sed -i.bak "s|^NEXT_PUBLIC_ENABLE_COMMAND_PALETTE=.*|NEXT_PUBLIC_ENABLE_COMMAND_PALETTE=$ENABLE_COMMAND_PALETTE|g" .env
        sed -i.bak "s|^NEXT_PUBLIC_ENABLE_DARK_MODE=.*|NEXT_PUBLIC_ENABLE_DARK_MODE=$ENABLE_DARK_MODE|g" .env
        sed -i.bak "s|^NEXT_PUBLIC_ENABLE_ANALYTICS=.*|NEXT_PUBLIC_ENABLE_ANALYTICS=$ENABLE_ANALYTICS|g" .env
        rm .env.bak 2>/dev/null || true
        print_success "Updated .env file"
    fi
}

update_package_json() {
    print_step "Updating package.json..."

    if [ -f package.json ]; then
        # Use Node to update package.json
        node -e "
            const fs = require('fs');
            const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
            pkg.name = '$PROJECT_NAME'.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            pkg.description = '$PROJECT_DESCRIPTION';
            fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
        "
        print_success "Updated package.json"
    fi
}

update_app_config() {
    print_step "Updating app.config.ts..."

    if [ -f config/app.config.ts ]; then
        # Backup original
        cp config/app.config.ts config/app.config.ts.bak

        # Update using sed
        sed -i.tmp "s|name: process.env.NEXT_PUBLIC_APP_NAME.*|name: process.env.NEXT_PUBLIC_APP_NAME || \"$PROJECT_NAME\",|g" config/app.config.ts
        sed -i.tmp "s|description: \".*\"|description: \"$PROJECT_DESCRIPTION\"|g" config/app.config.ts
        sed -i.tmp "s|url: process.env.NEXT_PUBLIC_APP_URL.*|url: process.env.NEXT_PUBLIC_APP_URL || \"$PROJECT_URL\",|g" config/app.config.ts
        sed -i.tmp "s|defaultMode: \".*\"|defaultMode: \"$DEFAULT_THEME_MODE\"|g" config/app.config.ts

        rm config/app.config.ts.tmp 2>/dev/null || true
        print_success "Updated config/app.config.ts"
    fi
}

# =============================================================================
# Install Dependencies
# =============================================================================

install_dependencies() {
    echo ""
    print_step "Checking dependencies..."

    if [ ! -d node_modules ]; then
        print_info "Installing dependencies (this may take a few minutes)..."
        npm install
        print_success "Dependencies installed"
    else
        if prompt_confirm "Dependencies already installed. Reinstall?" "n"; then
            rm -rf node_modules package-lock.json
            npm install
            print_success "Dependencies reinstalled"
        else
            print_info "Skipping dependency installation"
        fi
    fi
}

# =============================================================================
# Create Initial Files
# =============================================================================

create_initial_files() {
    print_step "Creating initial files..."

    # Create .gitignore if not exists
    if [ ! -f .gitignore ]; then
        cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Next.js
.next
out
build
dist

# Production
.vercel
.turbo

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Editor
.vscode
.idea
*.swp
*.swo
*~

# Storybook
storybook-static

# Claude
.claude
EOF
        print_success "Created .gitignore"
    fi
}

# =============================================================================
# Print Summary
# =============================================================================

print_summary() {
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║${NC}  ${GREEN}${CHECK} Setup Complete!${NC}                                       ${MAGENTA}║${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""

    echo -e "${CYAN}Project Configuration:${NC}"
    echo -e "  Name:        ${GREEN}$PROJECT_NAME${NC}"
    echo -e "  Description: ${GREEN}$PROJECT_DESCRIPTION${NC}"
    echo -e "  URL:         ${GREEN}$PROJECT_URL${NC}"
    echo -e "  Theme:       ${GREEN}$DEFAULT_THEME_MODE${NC}"
    echo ""

    echo -e "${CYAN}Features Enabled:${NC}"
    [ "$ENABLE_COMMAND_PALETTE" = "true" ] && echo -e "  ${GREEN}${CHECK}${NC} Command Palette (⌘K)" || echo -e "  ${RED}${CROSS}${NC} Command Palette"
    [ "$ENABLE_DARK_MODE" = "true" ] && echo -e "  ${GREEN}${CHECK}${NC} Dark Mode Toggle" || echo -e "  ${RED}${CROSS}${NC} Dark Mode Toggle"
    [ "$ENABLE_ANALYTICS" = "true" ] && echo -e "  ${GREEN}${CHECK}${NC} Analytics Tracking" || echo -e "  ${RED}${CROSS}${NC} Analytics Tracking"
    echo ""

    echo -e "${CYAN}Next Steps:${NC}"
    echo -e "  1. ${YELLOW}npm run dev${NC}        - Start development server"
    echo -e "  2. ${YELLOW}npm run build${NC}      - Build for production"
    echo -e "  3. ${YELLOW}npm run storybook${NC}  - View component library"
    echo ""

    echo -e "${CYAN}Useful Commands:${NC}"
    echo -e "  ${YELLOW}npm run lint${NC}        - Run linter (Biome)"
    echo -e "  ${YELLOW}npm run format${NC}      - Format code (Biome)"
    echo -e "  ${YELLOW}npm test${NC}            - Run tests (Vitest)"
    echo ""

    echo -e "${CYAN}Documentation:${NC}"
    echo -e "  ${BLUE}README.md${NC}           - Quick start guide"
    echo -e "  ${BLUE}docs/ARCHITECTURE.md${NC} - Project architecture"
    echo -e "  ${BLUE}docs/LLM_GUIDE.md${NC}    - Using with Claude Code"
    echo -e "  ${BLUE}docs/COMPONENTS.md${NC}   - Component reference"
    echo ""

    echo -e "${GREEN}${STAR} Happy coding with Blazz UI! ${STAR}${NC}"
    echo ""
}

# =============================================================================
# Main Execution
# =============================================================================

main() {
    print_header

    # Check if already in project directory
    if [ ! -f "package.json" ]; then
        print_error "Not in a Blazz UI project directory"
        print_info "Please run this script from the project root"
        exit 1
    fi

    # Run setup steps
    check_prerequisites
    collect_project_info
    configure_features
    configure_navigation
    configure_theme

    echo ""
    print_step "Applying configuration..."
    echo ""

    update_env_file
    update_package_json
    update_app_config
    create_initial_files
    install_dependencies

    print_summary
}

# Run main function
main
