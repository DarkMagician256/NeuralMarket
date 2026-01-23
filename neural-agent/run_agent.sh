#!/bin/bash
# Script to run agent with the best available Bun runtime

# 0. Try local user install first (most reliable)
LOCAL_BUN="$HOME/.bun/bin/bun"
if [ -f "$LOCAL_BUN" ]; then
    echo "🟢 Using local Bun ($LOCAL_BUN)"
    export USE_LOCAL_AI=true
    "$LOCAL_BUN" run src/agent.ts
    exit 0
fi

# 1. Try Linux native bun in PATH
if command -v bun &> /dev/null; then
    echo "🟢 Using native Bun"
    export USE_LOCAL_AI=true
    bun run src/agent.ts
    exit 0
fi

# 2. Try Windows Bun (via WSL mount)
# Adjust path based on typical install location or the one found
WIN_BUN="/mnt/c/Users/vaios/.bun/bin/bun.exe"
if [ -f "$WIN_BUN" ]; then
    echo "🟢 Using Windows Bun (WSL Bridge)"
    export USE_LOCAL_AI=true
    "$WIN_BUN" run src/agent.ts
    exit 0
fi

# 3. Fallback to common Windows paths if user name is different
WIN_BUN_GENERIC="/mnt/c/Users/$(whoami)/.bun/bin/bun.exe"
if [ -f "$WIN_BUN_GENERIC" ]; then
    echo "🟢 Using Windows Bun (Generic Path)"
    export USE_LOCAL_AI=true
    "$WIN_BUN_GENERIC" run src/agent.ts
    exit 0
fi

echo "🔴 Bun not found! Please install bun in WSL or Windows."
echo "   Linux: curl -fsSL https://bun.sh/install | bash (requires unzip)"
echo "   Windows: powershell -c 'irm bun.sh/install.ps1 | iex'"
exit 1
