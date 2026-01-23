# --- STAGE 1: Builder ---
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies (Bun installs npm packages natively and fast)
RUN bun install

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
COPY --from=builder /app/start.sh ./start.sh

# Make start script executable
RUN chmod +x ./start.sh

# Environment Defaults
ENV NODE_ENV=production

# Command to run the agent via the startup script
CMD ["./start.sh"]
