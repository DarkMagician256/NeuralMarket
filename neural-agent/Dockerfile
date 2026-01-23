# --- STAGE 1: Builder ---
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies (Bun installs npm packages natively and fast)
RUN bun install

# Copy source code
COPY . .

# Explicitly apply Zod patch for Langchain compatibility
RUN bun scripts/patch-zod.js

# --- STAGE 2: Runtime ---
FROM oven/bun:1 AS runtime

WORKDIR /app

# Copy deps and source from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Environment Defaults
ENV NODE_ENV=production

# Command to run the agent
CMD ["bun", "run", "src/agent.ts"]
