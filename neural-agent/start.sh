#!/bin/sh
echo "🔍 [STARTUP] Applying Zod compatibility patch..."

# Find all 'zod' directories in node_modules and create v3.js pointing to index.js
find node_modules -type d -name "zod" 2>/dev/null | while read zod_dir; do
  if [ ! -f "$zod_dir/v3.js" ]; then
    echo "🩹 Patching: $zod_dir"
    echo "module.exports = require('./index.js');" > "$zod_dir/v3.js"
    echo "export * from './index';" > "$zod_dir/v3.d.ts"
  else
    echo "✅ Already patched: $zod_dir"
  fi
done

echo "🚀 [STARTUP] Starting Agent with Bun..."
bun run src/agent.ts
