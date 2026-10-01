#!/usr/bin/env bash
# Validates the Node.js Museum Exhibit Studio workshop.
# Usage: bash scripts/validate-workshop.sh [all|content|nodejs]
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"
target="${1:-all}"

validate_content() {
    python3 scripts/validate_workshop.py
    node docs/tests/navigation.test.js
}

build_node_project() {
    local directory="$1"
    echo "Building $directory"
    (
        cd "$directory"
        npm ci --ignore-scripts --no-audit --fund=false
        npm run build
    )
}

validate_nodejs() {
    build_node_project start-museum/nodejs
    build_node_project finished/nodejs/museum-exhibit-studio
}

case "$target" in
    content) validate_content ;;
    nodejs) validate_nodejs ;;
    all)
        validate_content
        validate_nodejs
        ;;
    *)
        echo "Unknown target '$target'. Use all, content, or nodejs." >&2
        exit 2
        ;;
esac
