# --- STAGE 1: Builder ---
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy only package.json (let Bun resolve fresh, ignore pnpm lockfile)
COPY package.json ./

# Install dependencies fresh (Bun will get latest matching versions)
RUN bun install --no-save

# Copy source code
COPY . .

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
