#!/bin/bash

# ORACULO SENTIENT STARTUP SCRIPT
echo "=================================================="
echo "   ORACULO SENTIENT - AUTONOMOUS MARKET AGENT   "
echo "=================================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Configuration file (.env) not found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env created."
    echo ""
    echo "CRITICAL: Please edit .env and insert your:"
    echo "1. SOLANA_PRIVATE_KEY (New wallet recommended)"
    echo "2. OPENAI_API_KEY"
    echo "3. KALSHI_BUILDER_CODE (Default: ORACULO_V2)"
    echo ""
    read -p "Press Enter when ready to continue..."
fi

# Load .env variables for pre-flight check
export $(grep -v '^#' .env | xargs)

# Pre-flight check: Builder Code Monetization
if [ -z "$KALSHI_BUILDER_CODE" ] || [ "$KALSHI_BUILDER_CODE" == "ORACULO_TEST" ]; then
  echo "❌ CRITICAL ERROR: KALSHI_BUILDER_CODE is missing or set to placeholder in .env"
  echo "You will not earn fees without this. Please set it at kalshi.com/builders."
  exit 1
fi
echo "✅ Builder Code Detected: $KALSHI_BUILDER_CODE"

# Build project if needed
if [ ! -d "dist" ]; then
    echo "🔨 Building TypeScript..."
    npm install
    npm run build
fi

# Start Agent
echo "🚀 Launching Agent Core..."
npm start
