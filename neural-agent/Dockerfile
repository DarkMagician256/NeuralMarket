# --- STAGE 1: Builder ---
FROM node:20-slim AS builder

# Install system dependencies for native modules and cryptography
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    libpq-dev \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and config
COPY . .

# Build TypeScript to JS
RUN pnpm run build

# --- STAGE 2: Runtime ---
FROM node:20-slim AS runtime

WORKDIR /app

# Install pnpm for script execution
RUN npm install -g pnpm

# Only install system runtime libs
RUN apt-get update && apt-get install -y libpq5 && rm -rf /var/lib/apt/lists/*

# Copy built artifacts and production node_modules from builder
# Alternatively, install only prod dependencies here
# Copy source code and production node_modules from builder
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Environment Defaults
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1
ENV WS_KEEP_ALIVE=true
ENV KALSHI_API_TIMEOUT=3600

# Command to run the agent
CMD ["pnpm", "start"]
